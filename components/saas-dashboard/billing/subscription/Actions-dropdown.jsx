
"use client";

import { Button, DropdownMenu, Loading } from "@lemonsqueezy/wedges";
import { MoreVerticalIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { cancelSub, pauseUserSubscription, unpauseUserSubscription, refreshSubscriptionData, } from "@/app/action/actions";
import { LemonSqueezyModalLink } from "./Modal-link";

export function SubscriptionActionsDropdown({ subscription, urls }) {
    const [loading, setLoading] = useState(false);

    if (
        subscription.status === "expired" ||
        subscription.status === "cancelled" ||
        subscription.status === "unpaid"
    ) {
        return null;
    }


    //  refresh handler function
    const handleRefresh = async () => {
        setLoading(true);
        await refreshSubscriptionData();
        setLoading(false);
    };

    return (
        <>
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-surface-50/50">
                    <Loading size="sm" />
                </div>
            )}

            <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                    <Button
                        size="sm"
                        variant="transparent"
                        className="size-8 data-[state=open]:bg-surface-50"
                        before={<MoreVerticalIcon className="size-4" />}
                    />
                </DropdownMenu.Trigger>

                <DropdownMenu.Content side="bottom" className="z-10 dark:text-black " align="end">
                    <DropdownMenu.Group>
                        {!subscription.isPaused && (
                            <DropdownMenu.Item
                                onClick={async () => {
                                    setLoading(true);
                                    await pauseUserSubscription(subscription.lemonSqueezyId).then(
                                        () => {
                                            setLoading(false);
                                        },
                                    );
                                }}
                                className="hover:bg-gray-200"
                            >
                                Pause payments
                            </DropdownMenu.Item>
                        )}

                        {subscription.isPaused && (
                            <DropdownMenu.Item
                                onClick={async () => {
                                    setLoading(true);
                                    await unpauseUserSubscription(
                                        subscription.lemonSqueezyId,
                                    ).then(() => {
                                        setLoading(false);
                                    });
                                }}
                                className="hover:bg-gray-200"
                            >
                                Unpause payments
                            </DropdownMenu.Item>
                        )}

                        {/* Refresh btn */}
                        <DropdownMenu.Item onClick={handleRefresh} className="hover:bg-gray-200">
                            <span className="flex items-center gap-1 ">
                                <RefreshCwIcon className="size-3" />
                                Refresh data
                            </span>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item asChild className="hover:bg-gray-200">
                            <a href={urls.customer_portal}>Customer portal ↗</a>
                        </DropdownMenu.Item>


                        <div className="hover:bg-gray-200">
                            <LemonSqueezyModalLink href={urls.update_payment_method} className="hover:bg-gray-200">
                                Update payment method
                            </LemonSqueezyModalLink>

                        </div>

                    </DropdownMenu.Group>

                    {/* seperator */}
                    <DropdownMenu.Separator />

                    <DropdownMenu.Group>
                        <DropdownMenu.Item
                            onClick={async () => {
                                if (
                                    // eslint-disable-next-line no-alert -- allow
                                    confirm(
                                        `Please confirm if you want to cancel your subscription.`,
                                    )
                                ) {
                                    setLoading(true);
                                    await cancelSub(subscription.lemonSqueezyId).then(() => {
                                        setLoading(false);
                                    });
                                }
                            }}
                            destructive
                            className="hover:bg-gray-200"
                        >
                            Cancel subscription
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu>
        </>
    );
}
