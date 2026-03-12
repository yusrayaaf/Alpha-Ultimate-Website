import { Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function ContactInfo() {
  return (
    <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg text-white max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-teal-400">Contact Information</h2>
      <div className="space-y-4">
        <div className="flex items-start">
          <MapPin className="w-6 h-6 mr-4 text-teal-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Address</h3>
            <p className="text-gray-400">Riyadh, Kingdom of Saudi Arabia</p>
          </div>
        </div>
        <div className="flex items-start">
          <Phone className="w-6 h-6 mr-4 text-teal-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Phone</h3>
            <a href="tel:+966578695494" className="text-gray-400 hover:text-teal-400">+966 57 869 5494</a>
          </div>
        </div>
        <div className="flex items-start">
          <Mail className="w-6 h-6 mr-4 text-teal-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Email</h3>
            <a href="mailto:info@alpha-ultimate.com" className="text-gray-400 hover:text-teal-400">info@alpha-ultimate.com</a>
          </div>
        </div>
        <div className="flex items-start">
          <Clock className="w-6 h-6 mr-4 text-teal-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Business Hours</h3>
            <p className="text-gray-400">24/7 — We never close</p>
          </div>
        </div>
      </div>
    </div>
  );
}
