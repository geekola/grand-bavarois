// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { toast } from 'react-toastify';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

function FAQ() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const faqCollection = collection(db, 'FAQ');
        const faqSnapshot = await getDocs(faqCollection);
        const faqList = faqSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as FAQItem));
        setFaqItems(faqList);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to load FAQ items. Please try again later.');
        toast.error('An issue occurred while loading FAQs. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500" role="alert">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      {faqItems.length === 0 ? (
        <p className="text-center py-4">No FAQ items are available at the moment. Please check back later.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

export default FAQ;