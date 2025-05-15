
import { Button } from '@/components/ui/button';
import { Check, TicketIcon } from 'lucide-react';
import Link from 'next/link';
import { SignupButton } from './SignupButton';
import { Alert } from '@lemonsqueezy/wedges';


export function Plan({ plan, currentPlan = null, isChangingPlans = false }) {

    const { description, productName, name, price, variantId } = plan;

    // Tier-specific styling
    const isPremium = name.toLowerCase().includes('premium');
    const cardStyles = isPremium
        ? 'border-blue-600 bg-blue-50'
        : 'border-gray-200 bg-white';
    const textStyles = isPremium ? 'text-blue-700' : 'text-gray-900';


    return (
        <div className={`border p-6 rounded-lg shadow-md ${cardStyles} transition-shadow duration-200 hover:shadow-lg`}>

            {/* productname */}
            <h2 className={`text-xl font-semibold ${textStyles} mb-2`}>
                {productName} {isPremium && <span className="text-blue-500">★</span>}
            </h2>

            {/* varient name */}
            <h3 className={`text-xl font-semibold ${textStyles} mb-2`}> {name}</h3>

            {/* price */}
            <p className="text-2xl font-bold text-gray-900 mb-4">
                {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN'
                }).format(price / 100)}
                <span className="text-sm font-normal text-gray-600">/month</span>
            </p>

            {/* description */}
            {description ? (
                <div className='flex gap-1 items-center mb-4'>
                    <Check className='text-blue-500' />
                    <div
                        className="text-gray-600 text-sm "
                        dangerouslySetInnerHTML={{ __html: description }} // Sanitize in production
                    />
                </div>
            ) : null}


            {/* subscription btn */}
            <SignupButton
                plan={plan}
                isChangingPlans={isChangingPlans}
                currentPlan={currentPlan}
            />
        </div>
    );
}




export function NoPlans() {
    return (
        <section className="prose mt-[10vw] flex flex-col items-center justify-center">
            <span className="flex size-24 items-center justify-center rounded-full bg-wg-red-50/70">
                <SearchXIcon
                    className="text-wg-red"
                    aria-hidden="true"
                    size={48}
                    strokeWidth={0.75}
                />
            </span>

            <p className="max-w-prose text-balance text-center leading-6 text-gray-500">
                There are no plans available at the moment.
            </p>
        </section>
    );
}

export function InfoMessage() {
    return (
        <Alert className="not-prose mt-2">
            Follow{" "}
            <a
                href="https://docs.lemonsqueezy.com/guides/developer-guide/testing-going-live#testing-the-checkout"
                target="_blank"
                className="text-blue-500 underline hover:text-primary"
            >
                these instructions
            </a>{" "}
            on how to do test payments with Lemon Squeezy.
        </Alert>
    );
}