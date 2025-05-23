
import { cn, isValidSubscription } from "@/lib/utils";
import { SubscriptionActions } from "./Actions";
import { SubscriptionDate } from "./Date";
import { SubscriptionPrice } from "./Price";
import { SubscriptionStatus } from "./Status.jsx";
import { ChangePlan } from "../plans/Change-plan-button";
import { getUserSubscriptions } from "@/app/action/actions";
import { createClient } from "@/utils/supabase/server";


export async function Subscriptions() {
    // Initialize Supabase client

    const supabase = await createClient()

    const userSubscriptions = await getUserSubscriptions();

    // Fetch all plans
    const { data: allPlans, error } = await supabase
        .from('plan')
        .select('*');

    if (error) {
        console.error('Error fetching plans:', error);
        return <p>Error loading subscription information</p>;
    }

    if (userSubscriptions.length === 0) {
        return (
            <p className="not-prose mb-2">
                It appears that you do not have any subscriptions. Please sign up for a
                plan below.
            </p>
        );
    }

    // Show active subscriptions first, then paused, then canceled
    const sortedSubscriptions = userSubscriptions.sort((a, b) => {
        if (a.status === "active" && b.status !== "active") {
            return -1;
        }

        if (a.status === "paused" && b.status === "cancelled") {
            return -1;
        }

        return 0;
    });

    return (
        <div className="not-prose relative">
            {sortedSubscriptions.map(
                (subscription, index) => {
                    const plan = allPlans.find((p) => p.id === subscription.planId);
                    const status = subscription.status;

                    if (!plan) {
                        throw new Error("Plan not found");
                    }

                    return (
                        <div
                            key={index}
                            className="flex-col items-stretch justify-center gap-2"
                        >
                            <header className="flex items-center justify-between gap-3">
                                <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1">
                                    <h2
                                        className={cn(
                                            "font-bold text-sm md:text-lg text-surface-900",
                                            !isValidSubscription(status) && "text-inherit",
                                        )}
                                    >
                                        {plan.productName} ({plan.name})
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2">
                                    {isValidSubscription(status) && (
                                        <ChangePlan planId={subscription.planId} />
                                    )}

                                    <SubscriptionActions subscription={subscription} />
                                </div>
                            </header>

                            <div className="flex flex-wrap items-center gap-2 mt-5 border p-3 w-fit shadow-lg">
                                <SubscriptionPrice
                                    endsAt={subscription.endsAt}
                                    interval={plan.interval}
                                    intervalCount={plan.intervalCount}
                                    price={subscription.price}
                                    isUsageBased={plan.isUsageBased || false}
                                />

                                <SubscriptionStatus
                                    status={status}
                                    statusFormatted={subscription.statusFormatted}
                                    isPaused={Boolean(subscription.isPaused)}
                                />

                                <SubscriptionDate
                                    endsAt={subscription.endsAt}
                                    renewsAt={subscription.renewsAt}
                                    status={status}
                                    trialEndsAt={subscription.trialEndsAt}
                                />
                            </div>
                        </div>
                    );
                },
            )}
        </div>
    );
}


