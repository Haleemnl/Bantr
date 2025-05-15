
"use client";
import { DropdownMenu } from "@lemonsqueezy/wedges";
import { useEffect } from "react";

export function LemonSqueezyModalLink({ href, children }) {
    useEffect(() => {
        // Check if the script is already loaded
        const existingScript = document.getElementById('lemon-squeezy-script');

        if (!existingScript) {
            // Create and load the Lemon Squeezy script
            const script = document.createElement('script');
            script.id = 'lemon-squeezy-script';
            script.src = 'https://app.lemonsqueezy.com/js/lemon.js';
            script.async = true;
            script.defer = true;

            document.body.appendChild(script);
        }
    }, []);

    return (
        <DropdownMenu.Item
            onClick={() => {
                if (href) {
                    // Check if LemonSqueezy is initialized before using it
                    if (window.LemonSqueezy) {
                        window.LemonSqueezy.Url.Open(href);
                    } else {
                        console.error("Lemon Squeezy SDK not loaded yet");
                    }
                } else {
                    throw new Error(
                        "href provided for the Lemon Squeezy modal is not valid."
                    );
                }
            }}
        >
            {children}
        </DropdownMenu.Item>
    );
}