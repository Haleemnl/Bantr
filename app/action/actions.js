'use server'
import { configureLemonSqueezy } from '@/config/lemonsqueezy'
import { createClient } from '@/utils/supabase/server'
import { listProducts, listPrices, getProduct, createCheckout, getSubscription, getPrice, cancelSubscription, updateSubscription } from '@lemonsqueezy/lemonsqueezy.js'






export async function syncPlans() {
    configureLemonSqueezy()

    const supabase = await createClient()
    // Fetch all the variants from the database.
    const { data: productVariants, error } = await supabase
        .from('plan')
        .select('*')

    if (error) {
        throw new Error(`Error fetching plans: ${error.message}`)
    }

    let syncedVariants = productVariants || []

    // Helper function to add a variant to the productVariants array and sync it with the database.
    async function _addVariant(variant) {
        // eslint-disable-next-line no-console -- allow
        console.log(`Syncing variant ${variant.name} with the database...`)

        // Sync the variant with the plan in the database using upsert
        const { error } = await supabase
            .from('plan')
            .upsert(variant, {
                onConflict: 'variantId',
                ignoreDuplicates: false
            })

        if (error) {
            throw new Error(`Error upserting plan: ${error.message}`)
        }

        /* eslint-disable no-console -- allow */
        console.log(`${variant.name} synced with the database...`)
        syncedVariants.push(variant)
    }

    // Fetch products from the Lemon Squeezy store.
    const products = await listProducts({
        filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
        include: ['variants'],
    })

    // Loop through all the variants.
    const allVariants = products.data?.included

    // for...of supports asynchronous operations, unlike forEach.
    if (allVariants) {
        /* eslint-disable no-await-in-loop -- allow */
        for (const v of allVariants) {
            const variant = v.attributes
            // Skip draft variants or if there's more than one variant, skip the default
            // variant. See https://docs.lemonsqueezy.com/api/variants
            if (
                variant.status === 'draft' ||
                (allVariants.length !== 1 && variant.status === 'pending')
            ) {
                // `return` exits the function entirely, not just the current iteration.
                // so use `continue` instead.
                continue
            }

            // Fetch the Product name.
            const productName =
                (await getProduct(variant.product_id)).data?.data.attributes.name ?? ''

            // Fetch the Price object.
            const variantPriceObject = await listPrices({
                filter: {
                    variantId: v.id,
                },
            })

            const currentPriceObj = variantPriceObject.data?.data.at(0)
            const isUsageBased =
                currentPriceObj?.attributes.usage_aggregation !== null
            const interval = currentPriceObj?.attributes.renewal_interval_unit
            const intervalCount =
                currentPriceObj?.attributes.renewal_interval_quantity
            const trialInterval = currentPriceObj?.attributes.trial_interval_unit
            const trialIntervalCount =
                currentPriceObj?.attributes.trial_interval_quantity
            const price = isUsageBased
                ? currentPriceObj?.attributes.unit_price_decimal
                : currentPriceObj.attributes.unit_price
            const priceString = price !== null ? price?.toString() ?? '' : ''
            const isSubscription =
                currentPriceObj?.attributes.category === 'subscription'

            // If not a subscription, skip it.
            if (!isSubscription) {
                continue
            }

            await _addVariant({
                name: variant.name,
                description: variant.description,
                price: priceString,
                interval,
                intervalCount,
                isUsageBased,
                productId: variant.product_id,
                productName,
                variantId: parseInt(v.id),
                trialInterval,
                trialIntervalCount,
                sort: variant.sort,
            })
        }
    }
    return syncedVariants
}




export async function getCheckoutURL(variantId, embed = false) {
    configureLemonSqueezy()

    const supabase = await createClient()


    const { data: { user }, error } = await supabase.auth.getUser()


    // const user = await currentUser()
    console.log("Current user:", user ? user.id : "No user");


    if (!user) {
        throw new Error('User is not authenticated!')
    }

    try {
        console.log(`Creating checkout for variant ${variantId} with embed=${embed}`);
        const checkout = await createCheckout(
            process.env.LEMONSQUEEZY_STORE_ID,
            variantId,
            {
                checkoutOptions: {
                    embed,
                    media: false,
                    logo: !embed,
                },
                checkoutData: {
                    email: user?.email ?? undefined,
                    custom: {
                        user_id: user?.id,
                    },
                },
                productOptions: {
                    enabledVariants: [variantId],
                    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/`,
                    receiptButtonText: 'Go to Dashboard',
                    receiptThankYouNote: 'Thank you for signing up to Lemon Stand!',
                },
            }
        )

        const url = checkout.data?.data.attributes.url;
        console.log("Checkout URL created👉🏽", url);
        return url;
    } catch (error) {
        console.error("Error creating checkout:", error.message);
        throw error;
    }
}



function webhookHasMeta(data) {
    return data && typeof data === 'object' && 'meta' in data && 'event_name' in data.meta;
}

function webhookHasData(data) {
    return data && typeof data === 'object' && 'data' in data;
}

export async function processWebhookEvent(webhookEventId) {
    configureLemonSqueezy(); // Assuming this function exists in your codebase
    const supabase = await createClient()

    try {
        // Get the webhook event data
        const { data: webhookEvent, error: fetchError } = await supabase
            .from('webhookEvent')
            .select('*')
            .eq('id', webhookEventId)
            .single();

        if (fetchError || !webhookEvent) {
            throw new Error(`Webhook event #${webhookEventId} not found in the database: ${fetchError?.message}`);
        }

        if (!process.env.WEBHOOK_URL) {
            throw new Error(
                "Missing required WEBHOOK_URL env variable. Please, set it in your .env file."
            );
        }

        let processingError = "";
        const eventBody = webhookEvent.body;

        if (!webhookHasMeta(eventBody)) {
            processingError = "Event body is missing the 'meta' property.";
        } else if (webhookHasData(eventBody)) {
            if (webhookEvent.eventName.startsWith("subscription_payment_")) {
                // Save subscription invoices; eventBody is a SubscriptionInvoice
                // Not implemented.
            } else if (webhookEvent.eventName.startsWith("subscription_")) {
                // Save subscription events; obj is a Subscription
                const attributes = eventBody.data.attributes;
                const variantId = attributes.variant_id;

                // Get the plan from the database
                const { data: plans, error: planError } = await supabase
                    .from('plan')
                    .select('*')
                    .eq('variantId', parseInt(variantId, 10));

                if (planError || plans.length < 1) {
                    processingError = `Plan with variantId ${variantId} not found: ${planError?.message}`;
                } else {
                    // Update the subscription in the database
                    const priceId = attributes.first_subscription_item.price_id;
                    // Get the price data from Lemon Squeezy
                    const priceData = await getPrice(priceId);

                    if (priceData.error) {
                        processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
                    }

                    const isUsageBased = attributes.first_subscription_item.is_usage_based;
                    const price = isUsageBased
                        ? priceData.data?.data.attributes.unit_price_decimal
                        : priceData.data?.data.attributes.unit_price;

                    const updateData = {
                        lemonSqueezyId: eventBody.data.id,
                        orderId: attributes.order_id,
                        name: attributes.user_name,
                        email: attributes.user_email,
                        status: attributes.status,
                        statusFormatted: attributes.status_formatted,
                        renewsAt: attributes.renews_at,
                        endsAt: attributes.ends_at,
                        trialEndsAt: attributes.trial_ends_at,
                        price: price?.toString() ?? "",
                        isPaused: false,
                        subscriptionItemId: attributes.first_subscription_item.id,
                        isUsageBased: attributes.first_subscription_item.is_usage_based,
                        userId: eventBody.meta.custom_data.user_id,
                        planId: plans[0].id,
                    };

                    // Create/update subscription in the database using upsert
                    const { error: upsertError } = await supabase
                        .from('subscription')
                        .upsert(updateData, {
                            onConflict: 'lemonSqueezyId',
                            returning: 'minimal'
                        });

                    if (upsertError) {
                        processingError = `Failed to upsert Subscription #${updateData.lemonSqueezyId} to the database: ${upsertError.message}`;
                        console.error(upsertError);
                    }
                }
            } else if (webhookEvent.eventName.startsWith("order_")) {
                // Save orders; eventBody is a "Order"
                /* Not implemented */
            } else if (webhookEvent.eventName.startsWith("license_")) {
                // Save license keys; eventBody is a "License key"
                /* Not implemented */
            }
        }

        // Update the webhook event in the database
        const { error: updateError } = await supabase
            .from('webhookEvent')
            .update({
                processed: true,
                processingError,
            })
            .eq('id', webhookEventId);

        if (updateError) {
            throw new Error(`Failed to mark webhook event as processed: ${updateError.message}`);
        }

    } catch (error) {
        // Update the webhook event with processing error
        await supabase
            .from('webhookEvent')
            .update({
                processingError: error instanceof Error ? error.message : String(error)
            })
            .eq('id', webhookEventId);

        throw error;
    }
}








export async function getUserSubscriptions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return [];
    }

    const { data: userSubscriptions, error } = await supabase
        .from('subscription')
        .select('*')
        .eq('userId', user.id); // Assuming you have a function to get current user ID

    if (error) {
        throw new Error(`Failed to fetch user subscriptions: ${error.message}`);
    }

    return userSubscriptions || [];
}





export async function getSubscriptionURLs(id) {
    configureLemonSqueezy();
    const subscription = await getSubscription(id);
    if (subscription.error) {
        throw new Error(subscription.error.message);
    }
    // No revalidatePath here
    return subscription.data.data.attributes.urls;
}

// Add Separate function for revalidation
export async function refreshSubscriptionData() {
    revalidatePath("/");
}















export async function cancelSub(id) {
    configureLemonSqueezy();
    const supabase = await createClient()

    // Get user subscriptions
    const userSubscriptions = await getUserSubscriptions();

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.lemonSqueezyId === id
    );

    if (!subscription) {
        throw new Error(`Subscription #${id} not found.`);
    }

    const cancelledSub = await cancelSubscription(id);

    if (cancelledSub.error) {
        throw new Error(cancelledSub.error.message);
    }

    // Update the database using Supabase
    const { error: updateError } = await supabase
        .from('subscription')
        .update({
            status: cancelledSub.data?.data.attributes.status,
            statusFormatted: cancelledSub.data?.data.attributes.status_formatted,
            endsAt: cancelledSub.data?.data.attributes.ends_at,
        })
        .eq('lemonSqueezyId', id);

    if (updateError) {
        throw new Error(`Failed to cancel Subscription #${id} in the database: ${updateError.message}`);
    }

    revalidatePath('/');
    return cancelledSub;
}




/**
* This action will pause a subscription on Lemon Squeezy.
*/
//action/actions.js
export async function pauseUserSubscription(id) {
    const supabase = await createClient()
    configureLemonSqueezy();

    // Get user subscriptions
    const userSubscriptions = await getUserSubscriptions();

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.lemonSqueezyId === id
    );

    if (!subscription) {
        throw new Error(`Subscription #${id} not found.`);
    }

    const returnedSub = await updateSubscription(id, {
        pause: {
            mode: 'void'
        }
    });

    console.log('Subscription paused successfully:', returnedSub);

    // Update the database using Supabase
    const { error: updateError } = await supabase
        .from('subscription')
        .update({
            status: returnedSub.data?.data?.attributes?.status,
            statusFormatted: returnedSub.data?.data?.attributes?.status_formatted,
            endsAt: returnedSub.data?.data?.attributes?.ends_at,
            isPaused: returnedSub.data?.data?.attributes?.pause !== null,
        })
        .eq('lemonSqueezyId', id);
    console.log('Paused status:', returnedSub.data?.data?.attributes);


    if (updateError) {
        throw new Error(`Failed to pause Subscription #${id} in the database: ${updateError.message}`);
    }

    revalidatePath('/');
    return returnedSub;
}








/**
* This action will unpause a subscription on Lemon Squeezy.
*/
//action/actions.js
export async function unpauseUserSubscription(id) {
    const supabase = await createClient()
    configureLemonSqueezy();

    // Get user subscriptions
    const userSubscriptions = await getUserSubscriptions();

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.lemonSqueezyId === id
    );

    if (!subscription) {
        throw new Error(`Subscription #${id} not found.`);
    }

    const returnedSub = await updateSubscription(id, {
        // null is a valid value for pause
        pause: null,

    });

    // Update the database using Supabase
    const { error: updateError } = await supabase
        .from('subscription')
        .update({
            status: returnedSub.data?.attributes?.status,
            statusFormatted: returnedSub.data?.attributes?.status_formatted,
            endsAt: returnedSub.data?.attributes?.ends_at,
            isPaused: false,

        })
        .eq('lemonSqueezyId', id);
    console.log('unpaused status:', returnedSub.data?.data?.attributes);

    if (updateError) {
        throw new Error(`Failed to unpause Subscription #${id} in the database: ${updateError.message}`);
    }

    revalidatePath('/');
    return returnedSub;
}





export async function changePlan(currentPlanId, newPlanId) {
    configureLemonSqueezy();


    const user = await currentUser()


    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: userSubscriptions, error: subError } = await supabase
        .from('subscription')
        .select('*')
        .eq('userId', user.id);

    if (subError) {
        throw new Error(`Error fetching subscriptions: ${subError.message}`);
    }

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.planId === currentPlanId,
    );

    if (!subscription) {
        throw new Error(
            `No subscription with plan id #${currentPlanId} was found.`,
        );
    }

    // Get the new plan details from the database using Supabase
    const { data: newPlanData, error: planError } = await supabase
        .from('plan')
        .select('*')
        .eq('id', newPlanId)
        .single();

    if (planError || !newPlanData) {
        throw new Error(`Error fetching plan #${newPlanId}: ${planError?.message || 'Plan not found'}`);
    }

    const newPlan = newPlanData;

    // Send request to Lemon Squeezy to change the subscription.
    const updatedSub = await updateSubscription(subscription.lemonSqueezyId, {
        variantId: newPlan.variantId,
    });

    // Save in db using Supabase
    const { error: updateError } = await supabase
        .from('subscription')
        .update({
            planId: newPlanId,
            price: newPlan.price,
            endsAt: updatedSub.data?.data.attributes.ends_at,
        })
        .eq('lemonSqueezyId', subscription.lemonSqueezyId);

    if (updateError) {
        throw new Error(
            `Failed to update Subscription #${subscription.lemonSqueezyId} in the database: ${updateError.message}`,
        );
    }

    // Next.js revalidation path remains the same
    revalidatePath("/");

    return updatedSub;
}
