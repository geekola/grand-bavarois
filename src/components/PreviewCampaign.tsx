// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

interface Campaign {
  id: string;
  campaignName: string;
  imageUrl: string;
  videoUrl: string;
  videoPosition?: { x: number; y: number };
  videoScale?: number;
}

function PreviewCampaign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) {
        setError("No campaign ID provided");
        return;
      }
      try {
        const campaignDoc = await getDoc(doc(db, 'campaigns', id));
        if (campaignDoc.exists()) {
          setCampaign({ id: campaignDoc.id, ...campaignDoc.data() } as Campaign);
        } else {
          setError("Campaign not found");
        }
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError("Failed to load campaign");
      }
    };

    fetchCampaign();
  }, [id]);

  useEffect(() => {
    if (campaign) {
      initOverlay();
    }
  }, [campaign]);

  const initOverlay = () => {
    if (!campaign || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    video.src = campaign.videoUrl;
    video.crossOrigin = "anonymous";
    video.load();

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Create background plane with image
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    loader.load(campaign.imageUrl, (texture) => {
      const bgGeometry = new THREE.PlaneGeometry(2, 2);
      const bgMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
      bgPlane.position.z = -1;
      scene.add(bgPlane);
    });

    // Create video plane
    const videoTexture = new THREE.VideoTexture(video);
    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true, opacity: 0.8 });
    const videoScale = campaign.videoScale || 1;
    const videoGeometry = new THREE.PlaneGeometry(1.6 * videoScale, 0.9 * videoScale);
    const videoPlane = new THREE.Mesh(videoGeometry, videoMaterial);
    const videoPosition = campaign.videoPosition || { x: 0, y: 0 };
    videoPlane.position.set(videoPosition.x, videoPosition.y, 0);
    scene.add(videoPlane);

    camera.position.z = 1;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    video.onloadedmetadata = () => {
      video.play();
      animate();
    };

    // Handle window resize
    const handleResize = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight);
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <video ref={videoRef} className="hidden" playsInline muted loop crossOrigin="anonymous" />
      <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-75 p-2 rounded">
        <h2 className="text-xl font-bold">{campaign.campaignName}</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-2 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default PreviewCampaign;