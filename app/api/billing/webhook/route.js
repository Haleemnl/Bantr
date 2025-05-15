
import crypto from "node:crypto";
import { createClient } from '@supabase/supabase-js';
import { processWebhookEvent } from "@/app/action/actions";
// import { createClient } from "@/utils/supabase/server";

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);


// Function to store webhook event in Supabase
async function storeWebhookEvent(eventName, body) {

    // const supabase = await createClient()


    const { data, error } = await supabase
        .from('webhookEvent')
        .insert({
            eventName,
            body,
            processed: false
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error storing webhook event:', error);
        throw new Error(`Failed to store webhook event: ${error.message}`);
    }

    return data.id;
}

// Handler functions (implement as needed)
async function handleSubscriptionCreated(data) {
    // Implementation here
}

async function handleSubscriptionUpdated(data) {
    // Implementation here
}

async function handleSubscriptionCancelled(data) {
    // Implementation here
}

// Helper function to mimic webhookHasMeta type guard in JS
function webhookHasMeta(data) {
    return data && typeof data === 'object' && 'meta' in data && 'event_name' in data.meta;
}

export async function POST(request) {
    if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
        return new Response("Lemon Squeezy Webhook Secret not set in .env", {
            status: 500,
        });
    }

    // Verify the request is from Lemon Squeezy
    const rawBody = await request.text();
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const signature = Buffer.from(
        request.headers.get("X-Signature") ?? "",
        "hex"
    );
    const hmac = Buffer.from(
        crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
        "hex"
    );
    if (!crypto.timingSafeEqual(hmac, signature)) {
        return new Response("Invalid signature", { status: 400 });
    }

    // Process the valid request
    try {
        const data = JSON.parse(rawBody);
        if (webhookHasMeta(data)) {
            const webhookEventId = await storeWebhookEvent(data.meta.event_name, data);
            await processWebhookEvent(webhookEventId);
            return new Response("OK", { status: 200 });
        }
        return new Response("Data invalid", { status: 400 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response(`Error processing webhook: ${error instanceof Error ? error.message : String(error)}`, {
            status: 500
        });
    }
}
