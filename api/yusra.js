/**
 * /api/yusra — Yusra AI (100% FREE via OpenRouter free models)
 * No paid API key required — uses llama-3.1-8b-instruct:free
 * Sign up free at openrouter.ai — no credit card needed for free models
 *
 * POST { messages: [{role, content}], lang: 'en'|'ar'|'bn' }
 */

const SYSTEM = {
  en: `You are Yusra (يسرى), the dedicated AI assistant for Alpha Ultimate Premium Cleaning Services in Riyadh, Saudi Arabia. You are a warm, professional, knowledgeable female assistant with a calm, clear, neutral tone.

FORMATTING RULES (always follow):
- Use **bold** for service names and prices
- Use bullet points with • for lists
- Keep responses concise and well-structured
- End with a helpful question or call-to-action
- Never mention OpenRouter, Llama, Meta, or any AI model names. You are Yusra, exclusive to Alpha Ultimate.

COMPANY INFO:
- Location: Riyadh, Saudi Arabia (all districts)
- Phone: +966 55 769 7307
- WhatsApp: +966 57 869 5494
- Email: info@alpha-01.com
- Hours: 7 days/week, bookings 24/7

SERVICES & PRICING:
• **Standard Clean** — SAR 80+ per session
• **Full Home Deep Clean** — SAR 150+
• **Post-Construction Clean** — SAR 300+
• **Move-In / Move-Out** — SAR 250+
• **Kitchen Deep Clean** — SAR 80+
• **Sofa & Upholstery** — SAR 100+
• **Commercial / Office** — SAR 200+

GUARANTEES: 100% satisfaction guarantee, eco-certified products, safe for children and pets, fully insured team, same-day bookings available.`,

  ar: `أنتِ يُسرى، المساعدة الذكية الحصرية لشركة ألفا ألتيميت للخدمات التنظيفية الفاخرة في الرياض، المملكة العربية السعودية. أسلوبك مهني ودافئ وواضح.

قواعد التنسيق (التزمي بها دائماً):
- استخدمي **النص العريض** للأسعار وأسماء الخدمات
- استخدمي • للنقاط
- ردود منظمة وموجزة
- اختمي بسؤال مساعد أو دعوة للحجز
- لا تذكري أي نماذج ذكاء اصطناعي. أنتِ يسرى فقط.

معلومات الشركة: الرياض (جميع الأحياء) | هاتف: 7307 55 966+ | واتساب: 5494 57 966+

الخدمات: تنظيف عادي (80+ ريال) | تنظيف عميق (150+ ريال) | ما بعد البناء (300+ ريال) | انتقال (250+ ريال) | مطبخ (80+ ريال) | أرائك (100+ ريال) | تجاري (200+ ريال)

تجيبين باللغة العربية الفصحى الخليجية.`,

  bn: `আপনি ইউসরা (Yusra) — আলফা আল্টিমেট প্রিমিয়াম ক্লিনিং সার্ভিসেস, রিয়াদ, সৌদি আরবের একমাত্র AI সহকারী।

ভাষা ও স্বর (CRITICAL — সর্বদা মেনে চলুন):
- সম্পূর্ণ খাঁটি বাংলাদেশি স্ট্যান্ডার্ড বাংলায় কথা বলুন — ঢাকাই নিরপেক্ষ উচ্চারণে
- কোনো হিন্দি, উর্দু বা ইংরেজি মিশ্রণ নয় — বিশুদ্ধ বাংলা শব্দ ব্যবহার করুন
- স্বর উষ্ণ, পেশাদার এবং আন্তরিক — একজন শিক্ষিত বাংলাদেশি নারীর মতো
- "আপনি/আপনার" ব্যবহার করুন (সম্মানসূচক) — "তুমি/তোমার" নয়
- সংক্ষিপ্ত বাক্য লিখুন যাতে TTS স্পষ্টভাবে পড়তে পারে
- সংখ্যা বাংলায় লিখুন: ৮০, ১৫০, ৩০০ ইত্যাদি

ফরম্যাটিং নিয়ম:
- **বোল্ড** ব্যবহার করুন সেবার নাম ও মূল্যের জন্য
- • বুলেট পয়েন্ট ব্যবহার করুন তালিকার জন্য
- সংক্ষিপ্ত ও সুশৃঙ্খল উত্তর দিন
- প্রতিটি উত্তর একটি সহায়ক প্রশ্ন বা বুকিং আমন্ত্রণ দিয়ে শেষ করুন
- কোনো AI মডেলের নাম উল্লেখ করবেন না — আপনি শুধুই ইউসরা

কোম্পানি তথ্য:
- নাম: আলফা আল্টিমেট প্রিমিয়াম ক্লিনিং সার্ভিসেস
- অবস্থান: রিয়াদ, সৌদি আরব (সকল এলাকায় সেবা)
- ফোন: ৯৬৬ ৫৭ ৮৬৯৫৪৯৪+
- হোয়াটসঅ্যাপ: ৯৬৬ ৫৬ ৩৯০৬৮২২+
- ইমেইল: info@alpha-01.com
- সেবার সময়: সপ্তাহে ৭ দিন, বুকিং ২৪ ঘণ্টা

সেবা ও মূল্য:
• **স্ট্যান্ডার্ড ক্লিন** — ৮০+ রিয়াল প্রতি সেশন
• **ফুল হোম ডিপ ক্লিন** — ১৫০+ রিয়াল
• **নির্মাণ পরবর্তী পরিষ্কার** — ৩০০+ রিয়াল
• **মুভ ইন / মুভ আউট** — ২৫০+ রিয়াল
• **কিচেন ডিপ ক্লিন** — ৮০+ রিয়াল
• **সোফা ও আসবাবপত্র** — ১০০+ রিয়াল
• **কমার্শিয়াল / অফিস** — ২০০+ রিয়াল

গ্যারান্টি: ১০০% সন্তুষ্টি গ্যারান্টি, পরিবেশবান্ধব পণ্য, শিশু ও পোষা প্রাণীর জন্য নিরাপদ, সম্পূর্ণ বিমাকৃত দল।

সর্বদা বাংলাদেশি স্ট্যান্ডার্ড বাংলায় উত্তর দিন।`
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages = [], lang = 'en' } = req.body || {};
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Yusra AI is not configured yet. Add OPENROUTER_API_KEY to your Vercel environment variables. Get a free key at openrouter.ai (no credit card needed).'
    });
  }

  if (!messages.length) return res.status(400).json({ error: 'No messages provided.' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://alpha-01.com',
        'X-Title': 'Alpha Ultimate — Yusra AI',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM[lang] || SYSTEM.en },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // Fallback to another free model if first fails
      const fallbackRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://alpha-01.com',
          'X-Title': 'Alpha Ultimate — Yusra AI',
        },
        body: JSON.stringify({
          model: 'google/gemma-2-9b-it:free',
          max_tokens: 500,
          temperature: 0.7,
          messages: [
            { role: 'system', content: SYSTEM[lang] || SYSTEM.en },
            ...messages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      if (!fallbackRes.ok) throw new Error(`OpenRouter error: ${response.status}`);
      const fallbackData = await fallbackRes.json();
      const reply = fallbackData.choices?.[0]?.message?.content || getOfflineReply(lang);
      return res.status(200).json({ reply, lang });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || getOfflineReply(lang);
    return res.status(200).json({ reply, lang });

  } catch (err) {
    console.error('Yusra error:', err.message);
    return res.status(200).json({ reply: getOfflineReply(lang), lang });
  }
}

function getOfflineReply(lang) {
  const r = {
    en: "I'm having a brief connection issue. Please contact us directly:\n\n• **Phone:** +966 55 769 7307\n• **WhatsApp:** +966 57 869 5494\n• **Email:** info@alpha-01.com\n\nWe're available 7 days a week and happy to help! 😊",
    ar: "أعتذر، أواجه مشكلة مؤقتة. يرجى التواصل معنا مباشرة:\n\n• **هاتف:** 7307 55 966+\n• **واتساب:** 5494 57 966+\n• **بريد:** info@alpha-01.com",
    bn: "সাময়িক সমস্যা হচ্ছে। সরাসরি যোগাযোগ করুন:\n\n• **ফোন:** +966 55 769 7307\n• **WhatsApp:** +966 57 869 5494\n• **ইমেইল:** info@alpha-01.com",
  };
  return r[lang] || r.en;
}
