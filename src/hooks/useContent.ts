import { useState, useEffect } from 'react';
import { Service } from '../types';

export interface ContentData {
  home: {
    hero: {
      title: Record<string, string>;
      subtitle: Record<string, string>;
      cta: Record<string, string>;
    };
  };
  services: Service[];
  faq: Array<{
    question: Record<string, string>;
    answer: Record<string, string>;
  }>;
  contact: {
    address: Record<string, string>;
    phone: string;
    email: string;
  };
  testimonials: Array<{
    name: Record<string, string>;
    text: Record<string, string>;
    rating: number;
  }>;
}

// Static fallback content (always available even if API fails)
let staticContent: ContentData | null = null;

const loadStaticContent = async (): Promise<ContentData | null> => {
  if (staticContent) return staticContent;
  try {
    const response = await fetch('/content.json');
    if (response.ok) {
      staticContent = await response.json();
      return staticContent;
    }
  } catch {
    // Ignore
  }
  return null;
};

const emptyContent: ContentData = {
  home: { hero: { title: {}, subtitle: {}, cta: {} } },
  services: [],
  faq: [],
  contact: { address: {}, phone: '', email: '' },
  testimonials: [],
};

export const useContent = () => {
  const [content, setContent] = useState<ContentData>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Try the API first
        const response = await fetch('/api/admin/content');
        if (response.ok) {
          const data = await response.json();
          // If we got valid content (not empty object), use it
          if (data && Object.keys(data).length > 0 && data.services) {
            setContent(data);
            return;
          }
        }
      } catch {
        // API failed, fall through to static content
      }

      // Fallback to static content.json served from public/
      try {
        const fallback = await loadStaticContent();
        if (fallback) {
          setContent(fallback);
          return;
        }
      } catch {
        // Ignore
      }

      setError('Failed to load content');
    };

    fetchContent().finally(() => setLoading(false));
  }, []);

  return { content, loading, error };
};
