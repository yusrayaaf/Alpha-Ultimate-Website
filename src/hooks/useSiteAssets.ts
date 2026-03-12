/**
 * useSiteAssets — fetches logo, hero-video, yusra-icon URLs from the API.
 * Components use this hook instead of hardcoded /assets/ paths,
 * so uploading a new file in the admin panel updates the whole site instantly.
 */
import { useState, useEffect } from 'react';

export interface SiteAssets {
  logo:       string;
  hero_video: string;
  yusra_icon: string | null;
  favicon:    string;
}

const DEFAULTS: SiteAssets = {
  logo:       '/assets/alpha-logo.png',
  hero_video: '/assets/hero-video.mp4',
  yusra_icon: null,
  favicon:    '/favicon.ico',
};

let _cache: SiteAssets | null = null;
let _fetching = false;
const _listeners: Array<(a: SiteAssets) => void> = [];

async function fetchAssets() {
  if (_fetching) return;
  _fetching = true;
  try {
    const res = await fetch('/api/admin/assets');
    if (res.ok) {
      _cache = await res.json();
      _listeners.forEach(fn => fn(_cache!));
    }
  } catch { /* use defaults */ }
  finally { _fetching = false; }
}

export function useSiteAssets(): SiteAssets {
  const [assets, setAssets] = useState<SiteAssets>(_cache || DEFAULTS);

  useEffect(() => {
    if (_cache) { setAssets(_cache); return; }
    _listeners.push(setAssets);
    fetchAssets();
    return () => {
      const idx = _listeners.indexOf(setAssets);
      if (idx > -1) _listeners.splice(idx, 1);
    };
  }, []);

  return assets;
}

/** Call this after saving new assets in admin to refresh all components */
export function invalidateAssets() {
  _cache = null;
  fetchAssets();
}
