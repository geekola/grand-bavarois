import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ArrowLeft } from 'lucide-react';

interface CampaignAnalytics {
  id: string;
  campaignName: string;
  views: number;
  interactions: number;
  averageViewDuration: number;
  userId: string;
}

function CampaignAnalytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!id || !user) return;
      setFetchLoading(true);
      try {
        // First, fetch the campaign document to check ownership
        const campaignDoc = await getDoc(doc(db, 'campaigns', id));
        if (!campaignDoc.exists()) {
          throw new Error('Campaign not found');
        }
        const campaignData = campaignDoc.data();
        if (campaignData.userId !== user.uid) {
          throw new Error('permission-denied');
        }

        // If the user owns the campaign, fetch the analytics
        const analyticsDoc = await getDoc(doc(db, 'campaignAnalytics', id));
        if (analyticsDoc.exists()) {
          const data = analyticsDoc.data() as CampaignAnalytics;
          setAnalytics({ id: analyticsDoc.id, ...data });
        } else {
          setError('Analytics not found for this campaign');
        }
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        if (err.message === 'permission-denied' || err.code === 'permission-denied') {
          setError('You do not have permission to view these analytics');
          toast.error('Access denied. You do not have permission to view these analytics.');
        } else if (err.message === 'Campaign not found') {
          setError('Campaign not found');
          toast.error('The requested campaign does not exist.');
        } else {
          setError('Failed to load analytics');
          toast.error('Failed to load analytics. Please try again.');
        }
      } finally {
        setFetchLoading(false);
      }
    };

    if (!loading) {
      fetchAnalytics();
    }
  }, [id, user, loading]);

  if (loading || fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors flex items-center"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-4">No analytics data available for this campaign.</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="block mx-auto bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Campaign Analytics: {analytics.campaignName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Views</h2>
          <p className="text-3xl font-bold">{analytics.views}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Interactions</h2>
          <p className="text-3xl font-bold">{analytics.interactions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Average View Duration</h2>
          <p className="text-3xl font-bold">{analytics.averageViewDuration.toFixed(2)}s</p>
        </div>
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors flex items-center"
      >
        <ArrowLeft className="mr-2" size={16} />
        Back to Dashboard
      </button>
    </div>
  );
}

export default CampaignAnalytics;