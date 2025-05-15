


'use client'

import { Verified } from 'lucide-react'
import React from 'react'

const SubscriberBadge = ({ userId, subscriptions }) => {

    if (!userId || !subscriptions || !subscriptions.length) {
        return null;
    }

    // Find subscriptions that belong to this user
    const userSubscriptions = subscriptions.filter(sub => sub.userId === userId &&
        (sub.status === "active" || sub.status === "on_trial") &&
        !sub.isPaused
    );

    if (!userSubscriptions.length) {
        return null;
    }

    // Check for different subscription tiers
    const proSubscription = userSubscriptions.find(sub => sub.price === '100000');
    const premiumSubscription = userSubscriptions.find(sub => sub.price === '200000');

    if (premiumSubscription) {
        return <Verified className="text-white bg-amber-400 rounded-full size-4" />;
    } else if (proSubscription) {
        return <Verified className="text-white bg-blue-400 rounded-full size-4" />;
    } else {
        return null;
    }
};

export default SubscriberBadge;