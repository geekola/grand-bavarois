// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================

import React, { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Play, 
  Save, 
  X,
  FileText,
  Upload as UploadIcon,
  Eye as PreviewIcon,
  CheckCircle2
} from 'lucide-react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

interface FormData {
  step: number;
  campaignName: string;
  startDate: string;
  endDate: string;
  tags: string[];
  imageFile: File | null;
  videoFile: File | null;
  imagePreview: string | null;
  videoPreview: string | null;
}

function ARBuilder() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    step: 1,
    campaignName: '',
    startDate: '',
    endDate: '',
    tags: [],
    imageFile: null,
    videoFile: null,
    imagePreview: null,
    videoPreview: null
  });
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        toast.error(`${type === 'image' ? 'Image' : 'Video'} file size should be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      const filePreviewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        [`${type}File`]: file,
        [`${type}Preview`]: filePreviewUrl
      }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const nextStep = () => {
    if (formData.step < 4) {
      setFormData(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const prevStep = () => {
    if (formData.step > 1) {
      setFormData(prev => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save a campaign');
      return;
    }

    if (!formData.campaignName || !formData.startDate || !formData.endDate || !formData.imageFile || !formData.videoFile) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const imageRef = ref(storage, `campaigns/${user.uid}/${Date.now()}_${formData.imageFile.name}`);
      const videoRef = ref(storage, `campaigns/${user.uid}/${Date.now()}_${formData.videoFile.name}`);

      const [imageSnapshot, videoSnapshot] = await Promise.all([
        uploadBytes(imageRef, formData.imageFile),
        uploadBytes(videoRef, formData.videoFile)
      ]);

      const [imageUrl, videoUrl] = await Promise.all([
        getDownloadURL(imageSnapshot.ref),
        getDownloadURL(videoSnapshot.ref)
      ]);

      await addDoc(collection(db, 'campaigns'), {
        userId: user.uid,
        campaignName: formData.campaignName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        tags: formData.tags,
        imageUrl,
        videoUrl,
        createdAt: new Date()
      });

      toast.success('Campaign saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast.error('Failed to save campaign. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (formData.step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                id="campaignName"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleAddTag}
                placeholder="Type and press Enter to add tags"
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Upload Media</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image (Max 5MB)
                  </label>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={(e) => handleFileChange(e, 'image')}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed rounded-lg text-center hover:border-primary transition-colors"
                  >
                    <UploadIcon className="mx-auto mb-2" size={24} />
                    <span className="text-sm">Click to upload image</span>
                  </button>
                  {formData.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="max-h-40 rounded-lg mx-auto"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Overlay (Max 50MB)
                  </label>
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={(e) => handleFileChange(e, 'video')}
                    accept="video/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed rounded-lg text-center hover:border-primary transition-colors"
                  >
                    <UploadIcon className="mx-auto mb-2" size={24} />
                    <span className="text-sm">Click to upload video</span>
                  </button>
                  {formData.videoPreview && (
                    <div className="mt-2">
                      <video
                        src={formData.videoPreview}
                        controls
                        className="max-h-40 rounded-lg mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {formData.videoPreview && (
                <video
                  src={formData.videoPreview}
                  autoPlay
                  loop
                  muted
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2"
                />
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">Confirm Campaign Details</h3>
            <div className="space-y-2">
              <p><strong>Campaign Name:</strong> {formData.campaignName}</p>
              <p><strong>Start Date:</strong> {formData.startDate}</p>
              <p><strong>End Date:</strong> {formData.endDate}</p>
              <p><strong>Tags:</strong> {formData.tags.join(', ') || 'None'}</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={20} />
                  Save Campaign
                </>
              )}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return <FileText size={20} />;
      case 2:
        return <UploadIcon size={20} />;
      case 3:
        return <PreviewIcon size={20} />;
      case 4:
        return <CheckCircle2 size={20} />;
      default:
        return null;
    }
  };

  const getStepTitle = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return 'Details';
      case 2:
        return 'Media';
      case 3:
        return 'Preview';
      case 4:
        return 'Confirm';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Create AR Campaign</h1>
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((formData.step - 1) / 3) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {[1, 2, 3, 4].map((stepNumber) => {
                const isActive = formData.step === stepNumber;
                const isCompleted = formData.step > stepNumber;
                const isClickable = stepNumber < formData.step;

                return (
                  <button
                    key={stepNumber}
                    onClick={() => isClickable && setFormData(prev => ({ ...prev, step: stepNumber }))}
                    disabled={!isClickable}
                    className={`
                      flex flex-col items-center relative z-10 transition-all duration-300
                      ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    {/* Step Circle */}
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 mb-2
                        ${isActive || isCompleted 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                        }
                        ${isClickable && !isActive 
                          ? 'hover:border-primary hover:text-primary' 
                          : ''
                        }
                      `}
                    >
                      {getStepIcon(stepNumber)}
                    </div>
                    
                    {/* Step Title */}
                    <span
                      className={`
                        text-xs font-medium transition-all duration-300
                        ${isActive ? 'text-primary' : 'text-gray-500'}
                        ${isClickable && !isActive ? 'hover:text-primary' : ''}
                      `}
                    >
                      {getStepTitle(stepNumber)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {renderStep()}
          
          <div className="mt-8 flex justify-between">
            {formData.step > 1 && (
              <button
                onClick={prevStep}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center"
              >
                <ArrowLeft className="mr-2" size={20} />
                Previous
              </button>
            )}
            {formData.step < 4 && (
              <button
                onClick={nextStep}
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center ml-auto"
              >
                Next
                <ArrowRight className="ml-2" size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ARBuilder;