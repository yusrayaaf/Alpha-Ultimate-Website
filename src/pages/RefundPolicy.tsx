import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="bg-[#0D0D0D] text-white pt-28 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <RefreshCw className="mx-auto h-16 w-16 text-teal-400 mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Refund Policy</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">Last Updated: October 26, 2023</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 max-w-4xl mx-auto prose prose-invert prose-lg prose-p:text-gray-300 prose-headings:text-teal-400"
        >
          <h2 className="text-2xl font-bold">1. General Policy</h2>
          <p>We offer refunds for our services under certain conditions. Please read this policy carefully to understand your rights and our obligations.</p>
          
          <h2 className="text-2xl font-bold mt-8">2. Eligibility for a Refund</h2>
          <p>To be eligible for a refund, you must request it within 14 days of your purchase. Services that have already been rendered are not eligible for a refund.</p>

          <h2 className="text-2xl font-bold mt-8">3. How to Request a Refund</h2>
          <p>To request a refund, please contact our support team with your order details. We will process your request within 7-10 business days.</p>

          <h2 className="text-2xl font-bold mt-8">4. Non-Refundable Items</h2>
          <p>Certain items are not eligible for a refund, including promotional items and services that have been fully delivered.</p>

          <h2 className="text-2xl font-bold mt-8">5. Contact Us</h2>
          <p>If you have any questions about our Refund Policy, please contact us at our support email address.</p>
        </motion.div>
      </div>
    </div>
  );
}
