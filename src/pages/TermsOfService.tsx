import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="bg-[#0D0D0D] text-white pt-28 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <ShieldCheck className="mx-auto h-16 w-16 text-teal-400 mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">Last Updated: October 26, 2023</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 max-w-4xl mx-auto prose prose-invert prose-lg prose-p:text-gray-300 prose-headings:text-teal-400"
        >
          <h2 className="text-2xl font-bold">1. Introduction</h2>
          <p>Welcome to Alpha Ultimate. These Terms of Service govern your use of our website and services. By accessing our site, you agree to these terms.</p>
          
          <h2 className="text-2xl font-bold mt-8">2. Use of Our Services</h2>
          <p>You may use our services only for lawful purposes. You may not use our services to engage in any illegal or fraudulent activity.</p>

          <h2 className="text-2xl font-bold mt-8">3. Intellectual Property</h2>
          <p>All content on this site, including text, graphics, logos, and images, is the property of Alpha Ultimate and is protected by copyright laws.</p>

          <h2 className="text-2xl font-bold mt-8">4. Limitation of Liability</h2>
          <p>Alpha Ultimate will not be liable for any damages that arise from the use of our services. This includes direct, indirect, incidental, and consequential damages.</p>

          <h2 className="text-2xl font-bold mt-8">5. Changes to These Terms</h2>
          <p>We may update these Terms of Service from time to time. We will notify you of any changes by posting the new terms on this page.</p>
        </motion.div>
      </div>
    </div>
  );
}
