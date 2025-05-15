
import { redirect } from "next/navigation";
import { getUserSubscriptions } from "@/app/action/actions";
import { createClient } from "@/utils/supabase/server";
import { InfoMessage, NoPlans, Plan } from "./Plan";


export async function ChangePlans({ currentPlan }) {

    const supabase = await createClient()

    // Fetch all plans using Supabase
    const { data: allPlans, error: plansError } = await supabase
        .from('plan')
        .select('*');

    if (plansError) {
        console.error('Error fetching plans:', plansError);
        redirect("/dashboard/billing");
    }

    const userSubscriptions = await getUserSubscriptions();

    // If user does not have a valid subscription, redirect to the billing page, or
    // if there are no plans in the database, redirect to the billing page to fetch.
    if (!userSubscriptions.length || !allPlans || !allPlans.length) {
        redirect("/dashboard/billing");
    }

    const isCurrentPlanUsageBased = currentPlan?.isUsageBased;

    const filteredPlans = allPlans
        .filter((plan) => {
            return isCurrentPlanUsageBased
                ? Boolean(plan.isUsageBased)
                : Boolean(!plan.isUsageBased);
        })
        .sort((a, b) => {
            if (
                a.sort === undefined ||
                a.sort === null ||
                b.sort === undefined ||
                b.sort === null
            ) {
                return 0;
            }
            return a.sort - b.sort;
        });

    if (filteredPlans.length < 2) {
        return <NoPlans />;
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                {filteredPlans.map((plan, index) => {
                    return (
                        <Plan
                            isChangingPlans={true}
                            key={`plan-${index}`}
                            plan={plan}
                            currentPlan={currentPlan}
                        />
                    );
                })}
            </div>
            <InfoMessage />
        </div>
    );
}
