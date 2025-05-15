'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@lemonsqueezy/wedges'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { changePlan, getCheckoutURL } from '@/app/action/actions'


export function SignupButton({ plan, currentPlan, isChangingPlans = false, embed = true, }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [sdkReady, setSdkReady] = useState(false)


    const isCurrent = currentPlan && plan.id === currentPlan.id;

    const label = isCurrent ? "Your plan" : isChangingPlans ? "Switch to this plan" : "Sign up";

    // Load Lemon.js if not already loaded
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Check if script already exists
        if (!document.querySelector('script[src*="lemon.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://app.lemonsqueezy.com/js/lemon.js';
            script.async = true;
            script.onload = () => {
                if (window.createLemonSqueezy) {
                    window.createLemonSqueezy();
                    setSdkReady(true);
                }
            };
            document.body.appendChild(script);
        } else if (window.LemonSqueezy) {
            // Script already exists and LemonSqueezy is defined
            setSdkReady(true);
        }

        // Check repeatedly if needed
        const interval = setInterval(() => {
            if (window.LemonSqueezy) {
                setSdkReady(true);
                clearInterval(interval);
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const handleSignup = async () => {




        // If changing plans, call server action.
        if (isChangingPlans) {
            if (!currentPlan?.id) {
                throw new Error("Current plan not found.");
            }

            if (!plan.id) {
                throw new Error("New plan not found.");
            }

            setLoading(true);
            await changePlan(currentPlan.id, plan.id);
            setLoading(false);

            return;
        }


        try {

            setLoading(true);
            console.log("Starting checkout for variant:", plan.variantId);

            const checkoutUrl = await getCheckoutURL(plan.variantId, embed);
            console.log("Checkout URL received:", checkoutUrl);

            if (!checkoutUrl) {
                throw new Error('No checkout URL returned');
            }

            if (embed && window.LemonSqueezy && window.LemonSqueezy.Url) {
                console.log("Opening embedded checkout");
                window.LemonSqueezy.Url.Open(checkoutUrl);
            } else if (!embed) {
                console.log("Redirecting to checkout");
                router.push(checkoutUrl);
            } else {
                console.log("Fallback: redirecting to checkout URL");
                window.location.href = checkoutUrl;
            }

            //if theres an error
        } catch (error) {
            console.error('Checkout error:', error);

            toast.error('Error creating checkout', {
                description: error.message || 'Please try again later',
                position: "top-right",
                richColors: true,
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            before={loading ? <LoaderCircle className='animate-spin' /> : null}
            disabled={loading || isCurrent}
            onClick={handleSignup}
            className='w-full cursor-pointer bg-black'
        >
            {loading ? 'Processing...' : label}
        </Button>
    );
}