import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGNSS } from '../ros/hooks/useGNSS';
import { useOdometry } from '../ros/hooks/useOdometry';

const BOUNDS = [[13.351414, 74.790075], [13.348914, 74.792739]];

function quatToYawDeg({ x, y, z, w }) {
  const yawRad = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
  return yawRad * (180 / Math.PI);
}

function getRoverIcon(yawDeg, zoom) {
  const angle = Math.round(((yawDeg % 360) + 360) % 360 / 10) * 10 % 360;
  const angleStr = String(angle).padStart(3, '0');
  const size = 64 * Math.max(0.6, Math.min(zoom / 15, 1.4));
  return L.icon({
    iconUrl: `/icons/rover_angles/rover_${angleStr}.png`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function RoverMarker({ followRef }) {
  const { data: gnssData } = useGNSS();
  const { data: odomData } = useOdometry();
  const map = useMap();
  const markerRef = useRef(null);

  // disable follow on manual pan/zoom
    useEffect(() => {
    const disable = () => {
        followRef.current = false;
        onDisableFollow();   // ← call this to update button state
    };
    map.on('mousedown wheel touchstart', disable);
    return () => map.off('mousedown wheel touchstart', disable);
    }, [map]);

  // update icon on zoom
  useEffect(() => {
    const onZoom = () => {
      if (!markerRef.current) return;
      const yawDeg = odomData?.orientation ? quatToYawDeg(odomData.orientation) : 0;
      markerRef.current.setIcon(getRoverIcon(yawDeg, map.getZoom()));
    };
    map.on('zoomend', onZoom);
    return () => map.off('zoomend', onZoom);
  }, [map, odomData]);

  // update position + yaw
    useEffect(() => {
    const lat = gnssData?.latitude ?? 13.349584;  // fallback to map center
    const lon = gnssData?.longitude ?? 74.791522;

    const yawDeg = odomData?.orientation ? quatToYawDeg(odomData.orientation) : 0;

    if (!markerRef.current) {
        markerRef.current = L.marker([lat, lon], {
        icon: getRoverIcon(yawDeg, map.getZoom()),
        }).addTo(map);
    } else {
        markerRef.current.setLatLng([lat, lon]);
        markerRef.current.setIcon(getRoverIcon(yawDeg, map.getZoom()));
    }

    if (followRef.current) {
        map.panTo([lat, lon], { animate: true });
    }
    }, [gnssData, odomData]);

  return null;
}

export function MapPanel() {
  const followRef = useRef(true);
  const [following, setFollowing] = useState(true);

  const handleFollow = () => {
    followRef.current = true;
    setFollowing(true);
  };

  // sync button state when user pans away
  const handleDisableFollow = () => setFollowing(false);

  return (
    <div style={{ height: '250px', width: '500px', position: 'relative' }} className='border-2 border-red-600 rounded-lg overflow-hidden'>
      <MapContainer
        center={[13.349584, 74.791522]}
        zoom={16}
        minZoom={2}
        maxZoom={24}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="/OSMPublicTransport/{z}/{x}/{y}.png"
          maxZoom={24}
          maxNativeZoom={19}
        />
        <ImageOverlay url="/ircground-main.png" bounds={BOUNDS} />
        <RoverMarker followRef={followRef} onDisableFollow={handleDisableFollow} />
      </MapContainer>

      {/* Follow rover button */}
      <button
        onClick={handleFollow}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1001,
          padding: '6px 12px',
          background: '#111',
          color: 'white',
          border: '1px solid #444',
          borderRadius: '4px',
          cursor: 'pointer',
          opacity: following ? 1 : 0.5,
          fontFamily: 'monospace',
        }}
      >
        Follow Rover
      </button>
    </div>
  );
}