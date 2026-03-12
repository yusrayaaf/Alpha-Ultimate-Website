import { useState, useEffect } from 'react';
import { LocateFixed, MapPin } from 'lucide-react';

interface LocationPickerProps {
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
}

// Lazy-load leaflet only when this component mounts — prevents SSR/bundle crashes
let leafletLoaded = false;
let MapContainerComp: any = null;
let TileLayerComp: any = null;
let MarkerComp: any = null;

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const [position, setPosition] = useState({ lat: 24.7136, lng: 46.6753 });
  const [manualAddress, setManualAddress] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);

  // Dynamically import leaflet only on client to avoid SSR crash
  useEffect(() => {
    if (leafletLoaded) {
      setMapComponents({ MapContainerComp, TileLayerComp, MarkerComp });
      setMapReady(true);
      return;
    }

    import('leaflet').then(L => {
      import('leaflet/dist/leaflet.css' as any).catch(() => {});
      // Fix default marker icons
      try {
        delete (L.default.Icon.Default.prototype as any)._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      } catch {}
      return import('react-leaflet');
    }).then((rl: any) => {
      if (!rl) return;
      MapContainerComp = rl.MapContainer;
      TileLayerComp    = rl.TileLayer;
      MarkerComp       = rl.Marker;
      leafletLoaded    = true;
      setMapComponents({ MapContainerComp, TileLayerComp, MarkerComp });
      setMapReady(true);
    }).catch(() => setMapReady(false));
  }, []);

  useEffect(() => {
    onLocationChange({ lat: position.lat, lng: position.lng, address: manualAddress || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` });
  }, [position, manualAddress]);

  const handleDetect = () => {
    navigator.geolocation.getCurrentPosition(
      pos => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert('Could not detect location. Please enter it manually.')
    );
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={handleDetect}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm text-white transition-all"
        style={{ background: 'linear-gradient(135deg,#06D6A0,#0BB4CC)' }}>
        <LocateFixed size={16} /> Auto-Detect My Location
      </button>

      {/* Map */}
      <div className="h-56 w-full rounded-xl overflow-hidden border border-white/10 relative bg-[#0c0c14]">
        {mapReady && MapComponents ? (
          <MapComponents.MapContainerComp
            center={[position.lat, position.lng]} zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <MapComponents.TileLayerComp
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapComponents.MarkerComp position={[position.lat, position.lng]} />
          </MapComponents.MapContainerComp>
        ) : (
          <div className="flex items-center justify-center h-full gap-2 text-gray-600 text-sm">
            <MapPin size={20} className="text-yellow-400/40" />
            Map loading…
          </div>
        )}
      </div>

      {/* Manual address */}
      <div>
        <label className="block text-sm font-semibold text-gray-400 mb-2">Or enter address manually</label>
        <input
          type="text"
          value={manualAddress}
          onChange={e => { setManualAddress(e.target.value); onLocationChange({ lat: position.lat, lng: position.lng, address: e.target.value }); }}
          className="input-field"
          placeholder="e.g. Al Malqa District, Riyadh"
        />
      </div>
    </div>
  );
}
