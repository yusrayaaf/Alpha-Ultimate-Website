import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/pagination';

const ITEMS = [
  { name:'Rania Al-Harbi',   role:'Villa Owner, Riyadh',       rating:5, text:"Alpha Ultimate exceeded every expectation. My villa was transformed overnight — walls, floors, fixtures, everything gleaming. Worth every riyal." },
  { name:'Omar Ababneh',     role:'Office Manager',             rating:5, text:"We book them monthly for our office. Punctual, professional, and thorough. Our staff genuinely notice the difference. Highly recommended." },
  { name:'Hessa Al-Shaalan', role:'Apartment Resident',        rating:5, text:"Booked a deep clean before my parents visit. The apartment looks better than when I first moved in. Fast booking, flawless result." },
  { name:'Fahad Al-Mutairi', role:'Construction Developer',    rating:5, text:"Their post-construction clean saved us two weeks of headaches. Site was pristine and move-in ready. Our go-to for every project." },
  { name:'Layla Mahmoud',    role:'Working Mother',             rating:5, text:"With two kids and a full-time job, Alpha Ultimate is a lifesaver. They show up, deliver, disappear. No fuss, just a beautifully clean home." },
  { name:'Khaled Al-Rashid', role:'Restaurant Owner',          rating:5, text:"Commercial cleaning done right. Kitchen and dining area spotless after one session. Safe products, polite staff, fast service." },
];
const COLORS = ['#FFD166','#06D6A0','#9B59FF','#FF6B6B','#C8F4FF','#FFB703'];

export default function Testimonials() {
  const { t } = useTranslation();
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-amber-400/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}} className="text-center mb-16">
          <div className="badge mb-6">Client Stories</div>
          <h2 className="font-black mb-5" style={{fontFamily:'Urbanist, sans-serif',fontSize:'clamp(2rem,5.5vw,4rem)',lineHeight:0.95}}>
            <span style={{background:'linear-gradient(135deg,#FFD166,#FF9A3C)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>2,500+</span> Happy Clients
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto" style={{fontFamily:'Space Grotesk, sans-serif'}}>{t('testimonials.subtitle')}</p>
        </motion.div>
        <Swiper modules={[Autoplay,Pagination]} spaceBetween={20} slidesPerView={1} loop
          autoplay={{delay:3800,disableOnInteraction:false}} pagination={{clickable:true}}
          breakpoints={{640:{slidesPerView:2},1024:{slidesPerView:3}}} className="pb-14">
          {ITEMS.map((item,i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <SwiperSlide key={i}>
                <div className="card p-7 flex flex-col h-full group cursor-default">
                  <div className="flex items-start justify-between mb-5">
                    <Quote size={30} style={{color:`${color}40`}} />
                    <div className="flex gap-0.5">
                      {[...Array(item.rating)].map((_,j)=><Star key={j} size={13} className="fill-current" style={{color:'#FFD166'}} />)}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-6 italic" style={{fontFamily:'Space Grotesk, sans-serif'}}>"{item.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-[#050508] flex-shrink-0"
                      style={{background:`linear-gradient(135deg,${color},${color}aa)`,fontFamily:'Urbanist, sans-serif'}}>
                      {item.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm" style={{fontFamily:'Urbanist, sans-serif'}}>{item.name}</p>
                      <p className="text-gray-600 text-xs" style={{fontFamily:'Space Grotesk, sans-serif'}}>{item.role}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{background:`linear-gradient(90deg,transparent,${color},transparent)`}} />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
