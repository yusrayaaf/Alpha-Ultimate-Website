import { motion } from 'framer-motion';
import { Shield, FileText, RefreshCw } from 'lucide-react';

const sections = [
  {
    icon: Shield, title: 'Privacy Policy', color: '#14f195',
    content: `ELEVATE BUILDERS LTD Ltd ("we", "us", or "our") is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.

We collect information you provide when booking services, contacting us, or using our website. This includes your name, phone number, email address, and location details.

Your information is used to provide cleaning services, communicate with you, and improve our offerings. We never sell your personal data to third parties.

By using our services, you consent to this privacy policy.`
  },
  {
    icon: FileText, title: 'Terms of Service', color: '#9945ff',
    content: `By booking or using ELEVATE BUILDERS LTD services, you agree to these terms.

Services are provided as described at the time of booking. Prices are subject to change but confirmed bookings will honor the agreed price.

Cancellations must be made at least 24 hours in advance for a full refund. Late cancellations may incur a fee.

We reserve the right to refuse service if conditions are unsafe for our staff.`
  },
  {
    icon: RefreshCw, title: 'Refund Policy', color: '#ff6b35',
    content: `Customer satisfaction is our priority. If you are not satisfied with our service, please contact us within 24 hours and we will return to re-clean the affected areas at no charge.

Refunds are considered on a case-by-case basis and must be requested within 48 hours of service completion.

Deposits are non-refundable for cancellations within 12 hours of the scheduled service.`
  },
];

export default function Legal() {
  return (
    <div className="bg-[#04050f] text-white pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="section-badge mb-4">Legal</div>
          <h1 className="text-5xl font-black mb-4" style={{fontFamily:"var(--font-display)"}}>
            Legal <span className="gradient-text">Documents</span>
          </h1>
          <p className="text-gray-500">Last updated: {new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</p>
        </motion.div>
        <div className="space-y-6">
          {sections.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="spark-border p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${sec.color}15`, border: `1px solid ${sec.color}25` }}>
                    <Icon size={22} style={{ color: sec.color }} />
                  </div>
                  <h2 className="text-2xl font-black text-white" style={{fontFamily:"var(--font-display)"}}>{sec.title}</h2>
                </div>
                <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{sec.content}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
