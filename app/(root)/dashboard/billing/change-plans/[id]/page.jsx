

import { Button } from "@lemonsqueezy/wedges";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isValidSubscription } from "@/lib/utils";
import { getUserSubscriptions } from "@/app/action/actions";
import { createClient } from "@/utils/supabase/server";
import { DashboardContent } from "@/components/saas-dashboard/Content";
import { PageTitleAction } from "@/components/saas-dashboard/Page-title-action";
import { ChangePlans } from "@/components/saas-dashboard/billing/plans/Change-plans";

export const dynamic = "force-dynamic";

export default async function ChangePlansPage({ params }) {

    const supabase = await createClient()
    const { id } = await params

    if (!id) {
        notFound();
    }

    const currentPlanId = parseInt(id);
    if (isNaN(currentPlanId)) {
        notFound();
    }

    // Get user subscriptions to check the current plan.
    const userSubscriptions = await getUserSubscriptions();
    if (!userSubscriptions.length) {
        notFound();
    }

    const isCurrentPlan = userSubscriptions.find(
        (s) =>
            s.planId === currentPlanId &&
            isValidSubscription(s.status),
    );

    if (!isCurrentPlan) {
        redirect("/dashboard/billing");
    }

    const { data: currentPlan, error } = await supabase
        .from('plan')
        .select('*')
        .eq('id', currentPlanId);

    if (error) {
        console.error('Error fetching plan:', error);
        notFound();
    }

    if (!currentPlan.length) {
        notFound();
    }

    return (
        <DashboardContent
            title="Change Plans"
            subtitle="Choose a plan that works for you."
            action={
                <div className="flex items-center gap-4">
                    <Button asChild variant="tertiary">
                        <Link href="/dashboard/billing">Back to Billing</Link>
                    </Button>
                    <PageTitleAction />
                </div>
            }
        >
            <ChangePlans currentPlan={currentPlan[0]} />
        </DashboardContent>
    );
}
