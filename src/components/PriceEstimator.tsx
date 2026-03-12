import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calculator, Zap } from 'lucide-react';

const options = {
  homeType: ['Studio','1BHK Apartment','2BHK Apartment','3BHK Apartment','2-Story Villa','3-Story Villa','Mansion','Small Office','Medium Office','Large Office','Commercial Space','Post-Construction','Others'],
  serviceType: ['Standard Clean','Deep Clean','Move-In/Out Clean'],
  city: ['Riyadh','Diriyah','Al-Kharj','Ad-Dilam'],
  condition: ['Light','Moderate','Heavy'],
};
const basePrices: Record<string, number> = { 'Studio':80,'1BHK Apartment':120,'2BHK Apartment':150,'3BHK Apartment':180,'2-Story Villa':250,'3-Story Villa':320,'Mansion':500,'Small Office':130,'Medium Office':200,'Large Office':350,'Commercial Space':450,'Post-Construction':300,'Others':100 };
const serviceMult: Record<string, number> = { 'Standard Clean':1,'Deep Clean':1.5,'Move-In/Out Clean':1.8 };
const condMult: Record<string, number> = { 'Light':1,'Moderate':1.2,'Heavy':1.5 };

const Select = ({ label, value, setFn, opts, color = '#14f195' }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full input-field flex justify-between items-center text-left text-sm">
        <span>{value}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} style={{ color }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute z-20 w-full glass rounded-xl mt-1 overflow-hidden shadow-xl max-h-48 overflow-y-auto"
            style={{ border: `1px solid ${color}20` }}>
            {opts.map((opt: string) => (
              <li key={opt} onClick={() => { setFn(opt); setOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[#14f195]/08 transition-colors ${value === opt ? 'text-[#14f195] font-semibold' : 'text-gray-400'}`}>
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PriceEstimator() {
  const [homeType, setHomeType] = useState('2BHK Apartment');
  const [serviceType, setServiceType] = useState('Standard Clean');
  const [city, setCity] = useState('Riyadh');
  const [condition, setCondition] = useState('Moderate');
  const [estimate, setEstimate] = useState<[number, number] | null>(null);

  const calculate = () => {
    const base = basePrices[homeType] || 100;
    const sm = serviceMult[serviceType] || 1;
    const cm = condMult[condition] || 1;
    const low = Math.round(base * sm * cm);
    setEstimate([low, Math.round(low * 1.2)]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}>
      <div className="spark-border p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#14f195]/10 border border-[#14f195]/20 flex items-center justify-center">
            <Calculator size={20} className="text-[#14f195]" />
          </div>
          <div>
            <h3 className="font-black text-white text-lg" style={{fontFamily:'Syne,sans-serif'}}>Price Estimator</h3>
            <p className="text-gray-600 text-xs">Get an instant price estimate</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <Select label="Home Type" value={homeType} setFn={setHomeType} opts={options.homeType} />
          <Select label="Service" value={serviceType} setFn={setServiceType} opts={options.serviceType} color="#9945ff" />
          <Select label="City" value={city} setFn={setCity} opts={options.city} color="#ff6b35" />
          <Select label="Condition" value={condition} setFn={setCondition} opts={options.condition} color="#00d2ff" />
          <button onClick={calculate} type="button"
            className="btn-primary flex items-center justify-center gap-2 text-sm h-[46px]">
            <Zap size={14} />
            Estimate
          </button>
        </div>

        <AnimatePresence>
          {estimate && (
            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="rounded-2xl p-6 text-center" style={{ background: 'rgba(20,241,149,0.04)', border: '1px solid rgba(20,241,149,0.15)' }}>
              <p className="text-gray-500 text-sm mb-1">Estimated Price Range</p>
              <p className="text-4xl font-black gradient-text" style={{fontFamily:'Syne,sans-serif'}}>
                SAR {estimate[0]} – SAR {estimate[1]}
              </p>
              <p className="text-gray-600 text-xs mt-2">This is an estimate. Final quote provided upon confirmation.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
