
import { getSubscriptionURLs } from "@/app/action/actions";
import { SubscriptionActionsDropdown } from "./Actions-dropdown";

export async function SubscriptionActions({ subscription }) {
    if (
        subscription.status === "expired" ||
        subscription.status === "cancelled" ||
        subscription.status === "unpaid"
    ) {
        return null;
    }

    const urls = await getSubscriptionURLs(subscription.lemonSqueezyId);

    return (
        <SubscriptionActionsDropdown subscription={subscription} urls={urls} />
    );
}