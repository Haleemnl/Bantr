
import { createClient } from '@/utils/supabase/client'
import { Plan } from './Plan'
import { syncPlans } from '@/app/action/actions'

// Note: In a real Next.js application, you might want to use a singleton pattern or a hook like useSupabaseClient

const supabase = createClient()

export async function Plans() {
    // Fetch plans from Supabase
    const { data: allPlans, error } = await supabase
        .from('plan')
        .select('*')

    // NOTE👉🏽: syncs plan from lemon squeezy only If there are no plans yet in the database.
    let plans = allPlans || []
    if (!plans.length) {
        plans = await syncPlans()
    }

    if (!plans.length) {
        return <p>No plans available.</p>
    }

    return (
        <div>
            <h2>Plans</h2>
            <div className="mb-5 mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                {plans.map((plan, index) => {
                    return <Plan key={`plan-${index}`} plan={plan} />
                })}
            </div>
        </div>
    )
}