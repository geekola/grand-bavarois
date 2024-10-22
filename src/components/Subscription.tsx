// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Subscription = () => {
  const [user] = useAuthState(auth);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        const subscriptionDoc = await getDoc(doc(db, 'subscriptions', user.uid));
        if (subscriptionDoc.exists()) {
          setSubscription(subscriptionDoc.data());
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast.error('Failed to load subscription information');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading) {
    return <div>Loading subscription information...</div>;
  }

  if (!subscription) {
    return <div>No active subscription found.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Subscription</h2>
      <p><strong>Plan:</strong> {subscription.plan}</p>
      <p><strong>Status:</strong> {subscription.status}</p>
      <p><strong>Start Date:</strong> {new Date(subscription.startDate.seconds * 1000).toLocaleDateString()}</p>
      {subscription.endDate && (
        <p><strong>End Date:</strong> {new Date(subscription.endDate.seconds * 1000).toLocaleDateString()}</p>
      )}
      <button
        className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
        onClick={() => {/* Add logic to manage subscription */}}
      >
        Manage Subscription
      </button>
    </div>
  );
};

export default Subscription;