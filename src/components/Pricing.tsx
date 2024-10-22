// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Pricing() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      features: [
        '5 AR campaigns per month',
        'Basic analytics',
        'Email support',
        '1GB storage',
      ],
      stripeProductId: 'prod_R4d6BoqljjkRVm'
    },
    {
      name: 'Pro',
      price: '$29.99',
      features: [
        'Unlimited AR campaigns',
        'Advanced analytics',
        'Priority email support',
        '10GB storage',
        'Custom branding',
      ],
      stripeProductId: 'prod_Qyz2utQQpq948a'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'All Pro features',
        'Dedicated account manager',
        'API access',
        'Unlimited storage',
        'On-premise deployment option',
      ],
    },
  ];

  const handleSubscribe = async (planName: string, productId?: string) => {
    if (planName === 'Enterprise') {
      toast.info('Please contact our sales team for Enterprise plan');
      return;
    }

    if (!user) {
      // Redirect to registration page with plan information
      navigate('/register', { state: { planName, productId } });
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Here you would typically make a call to your backend to create a Checkout Session
      // For this example, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate redirect to Stripe Checkout
      toast.success(`Redirecting to Stripe Checkout for ${planName} plan`);
      // In a real implementation, you would redirect to the Stripe Checkout session URL
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to initiate subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-header text-center">Pricing Plans</h1>
      <p className="text-center mb-8 text-sm">Choose the plan that's right for you</p>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="border rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">{plan.name}</h2>
            <p className="text-2xl font-bold mb-6">{plan.price}</p>
            <ul className="mb-6 flex-grow text-sm">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center mb-2">
                  <Check className="text-green-500 mr-2" size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors text-sm"
              onClick={() => handleSubscribe(plan.name, plan.stripeProductId)}
              disabled={loading}
            >
              {loading ? 'Processing...' : (plan.name === 'Enterprise' ? 'Contact Sales' : 'Subscribe')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;