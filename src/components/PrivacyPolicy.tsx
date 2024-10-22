// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================
import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose max-w-none text-sm">
        <p>At SpatialMods, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share your personal information when you use our service.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, use our AR building tools, or contact us for support. This may include:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Name and email address</li>
          <li>Payment information</li>
          <li>Content you create using our AR tools</li>
          <li>Communications you have with us</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices, updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and customer service requests</li>
          <li>Communicate with you about products, services, offers, and events</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">3. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">4. Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. Please contact us to exercise these rights.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">5. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">6. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@spatialmods.com.</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;