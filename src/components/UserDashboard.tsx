// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp, limit, orderBy } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Eye, BarChart2, Calendar, Tag, Share2, Search, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

interface Campaign {
  id: string;
  campaignName: string;
  startDate: Timestamp | string;
  endDate: Timestamp | string;
  tags?: string[];
  createdAt: Timestamp | string;
  imageUrl?: string;
  videoUrl?: string;
  userId: string;
}

function UserDashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    } else if (!loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const filtered = campaigns.filter(campaign =>
      campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCampaigns(filtered);
  }, [searchTerm, campaigns]);

  const fetchCampaigns = async () => {
    if (!user) return;
    setFetchLoading(true);
    try {
      const q = query(
        collection(db, 'campaigns'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const fetchedCampaigns: Campaign[] = [];
      querySnapshot.forEach((doc) => {
        fetchedCampaigns.push({ id: doc.id, ...doc.data() } as Campaign);
      });
      setCampaigns(fetchedCampaigns);
      setFilteredCampaigns(fetchedCampaigns);
      setFetchError(null);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setFetchError('Failed to fetch campaigns. Please try again.');
      toast.error('Failed to load campaigns. Please try refreshing the page.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        const campaignRef = doc(db, 'campaigns', id);
        await deleteDoc(campaignRef);
        setCampaigns(campaigns.filter(campaign => campaign.id !== id));
        setFilteredCampaigns(filteredCampaigns.filter(campaign => campaign.id !== id));
        toast.success('Campaign deleted successfully');
      } catch (err: any) {
        console.error('Error deleting campaign:', err);
        toast.error('Failed to delete campaign. Please try again.');
      }
    }
  };

  const formatDate = (date: Timestamp | string) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString();
    } else if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return 'Invalid Date';
  };

  const copyShareLink = (campaignId: string) => {
    const shareLink = `${window.location.origin}/public-preview/${campaignId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success('Share link copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy share link. Please try again.');
    });
  };

  if (loading || fetchLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (fetchError) {
    return <div className="text-red-500 text-center">{fetchError}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.displayName || user?.email}</h1>
        <Link to="/ar-builder" className="bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 flex items-center text-sm">
          <Plus size={16} className="mr-2" />
          Create New Campaign
        </Link>
      </div>

      <div className="mb-4 flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 pr-4 border rounded-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button
          onClick={fetchCampaigns}
          className="ml-2 p-2 bg-gray-200 rounded-md hover:bg-gray-300"
          aria-label="Refresh campaigns"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {filteredCampaigns.length === 0 ? (
        <p className="text-center py-4">No campaigns found. Create your first campaign!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="border rounded-lg p-4 flex flex-col">
              <div 
                className="mb-2 h-40 bg-gray-200 rounded-md overflow-hidden cursor-pointer"
                onClick={() => navigate(`/edit-campaign/${campaign.id}`)}
              >
                {campaign.imageUrl ? (
                  <img src={campaign.imageUrl} alt={campaign.campaignName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">{campaign.campaignName}</h2>
              <div className="flex items-center mb-2 text-sm text-gray-600">
                <Calendar size={16} className="mr-1" />
                <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
              </div>
              <div className="flex flex-wrap mb-2">
                {campaign.tags?.map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs mr-1 mb-1">
                    <Tag size={12} className="inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex justify-between">
                <button
                  onClick={() => navigate(`/edit-campaign/${campaign.id}`)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit Campaign"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => navigate(`/preview-campaign/${campaign.id}`)}
                  className="text-green-500 hover:text-green-700"
                  title="Preview Campaign"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => navigate(`/campaign-analytics/${campaign.id}`)}
                  className="text-purple-500 hover:text-purple-700"
                  title="View Analytics"
                >
                  <BarChart2 size={20} />
                </button>
                <button
                  onClick={() => copyShareLink(campaign.id)}
                  className="text-indigo-500 hover:text-indigo-700"
                  title="Copy Share Link"
                >
                  <Share2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Campaign"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;