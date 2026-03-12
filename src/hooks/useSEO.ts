import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const BASE_TITLE = 'Alpha Ultimate | Premium Cleaning Services in Riyadh';
const BASE_URL = 'https://www.alpha-ultimate.com';

export function useSEO({ title, description, canonical }: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title ? `${title} | Alpha Ultimate` : BASE_TITLE;

    // Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // Update canonical URL
    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link') as HTMLLinkElement;
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    // Update OG URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    return () => {
      // Reset on unmount
      document.title = BASE_TITLE;
    };
  }, [title, description, canonical]);
}
