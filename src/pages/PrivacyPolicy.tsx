import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#0D0D0D] text-white pt-28 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <Eye className="mx-auto h-16 w-16 text-teal-400 mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">Last Updated: October 26, 2023</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 max-w-4xl mx-auto prose prose-invert prose-lg prose-p:text-gray-300 prose-headings:text-teal-400"
        >
          <h2 className="text-2xl font-bold">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, fill out a form, or communicate with us. This may include your name, email address, phone number, and other personal details.</p>
          
          <h2 className="text-2xl font-bold mt-8">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services. This includes using your information to process transactions, send you promotional communications, and respond to your comments and questions.</p>

          <h2 className="text-2xl font-bold mt-8">3. Sharing Your Information</h2>
          <p>We do not share your personal information with third parties except as described in this Privacy Policy. We may share your information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>

          <h2 className="text-2xl font-bold mt-8">4. Security</h2>
          <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. However, no security system is impenetrable, and we cannot guarantee the security of our systems.</p>

          <h2 className="text-2xl font-bold mt-8">5. Your Choices</h2>
          <p>You may update, correct, or delete your account information at any time by logging into your account. You may also opt out of receiving promotional emails from us by following the instructions in those emails.</p>
        </motion.div>
      </div>
    </div>
  );
}
