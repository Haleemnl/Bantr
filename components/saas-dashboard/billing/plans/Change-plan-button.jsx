
import { Button } from "@lemonsqueezy/wedges";
import Link from "next/link";

export function ChangePlan({ planId }) {
    return (
        <Button size="sm" variant="outline" asChild className="p-2 bg-blue-400  ">
            <Link href={`/dashboard/billing/change-plans/${planId}`}>
                Change plann
            </Link>
        </Button>
    );
}