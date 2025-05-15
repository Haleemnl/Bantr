
import { formatPrice } from "@/lib/utils";

export function SubscriptionPrice({ endsAt, price, interval, intervalCount, isUsageBased, }) {
    if (endsAt) return null;

    let formattedPrice = formatPrice(price);

    if (isUsageBased) {
        formattedPrice += "/unit";
    }

    const formattedIntervalCount =
        intervalCount && intervalCount !== 1 ? `every ${intervalCount} ` : "every";

    return <p>{`${formattedPrice} ${formattedIntervalCount} ${interval}`}</p>;
} 