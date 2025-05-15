
import { getUserSubscriptions } from '@/app/action/actions'
import { Plans } from '@/components/saas-dashboard/billing/plans/Plans'
import { Subscriptions } from '@/components/saas-dashboard/billing/subscription/subscriptions'
import { DashboardContent } from '@/components/saas-dashboard/Content'
import { PageTitleAction } from '@/components/saas-dashboard/Page-title-action'
import { Suspense } from 'react'

// Prevent caching
export const dynamic = 'force-dynamic'

export default async function BillingPage() {

    const userSubscriptions = await getUserSubscriptions()

    // Check if all subscriptions are expired
    const expiredSubscription = userSubscriptions.length > 0 &&
        userSubscriptions.every(subscription => subscription.status === "expired");

    // Show Plans if there are no subscriptions OR  subscriptions are expired
    const showPlans = userSubscriptions.length === 0 || expiredSubscription;


    return (
        <DashboardContent
            title="Billing"
            subtitle="View and manage your billing information..."
            action={<PageTitleAction />}
        >

            <div>
                {showPlans ? (
                    <Suspense fallback={<p>Loading subscription plans...</p>}>
                        <Plans />
                    </Suspense>
                ) : (
                    <Suspense fallback={<p>Loading available details ...</p>}>
                        <Subscriptions />

                    </Suspense>
                )}
            </div>


        </DashboardContent>
    )
}