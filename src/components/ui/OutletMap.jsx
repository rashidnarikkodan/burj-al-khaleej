import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Phone, Navigation, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { MAP_DEFAULTS } from '../../config/constants';

const MAP_STYLES = {
  streets: {
    name: 'Streets',
    nameAr: 'خريطة الشوارع',
    style: {
      version: 8,
      sources: {
        'carto-voyager': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
          ],
          tileSize: 256,
          attribution: '&copy; CartoDB & OpenStreetMap'
        }
      },
      layers: [
        {
          id: 'carto-voyager-layer',
          type: 'raster',
          source: 'carto-voyager',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  },
  satellite: {
    name: 'Satellite',
    nameAr: 'أقمار صناعية',
    style: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
          attribution: '&copy; Esri World Imagery'
        }
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  },
  dark: {
    name: 'Dark Mode',
    nameAr: 'خريطة داكنة',
    style: {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
          ],
          tileSize: 256,
          attribution: '&copy; CartoDB & OpenStreetMap'
        }
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  }
};

const OutletMap = ({ locations = [], activeLocation = null }) => {
  const { lang } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedLayer, setSelectedLayer] = useState('streets');

  const defaultCenter = [MAP_DEFAULTS.LNG, MAP_DEFAULTS.LAT];

  // Initialize MapLibre Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[selectedLayer].style,
      center: defaultCenter,
      zoom: MAP_DEFAULTS.ZOOM,
      pitchWithRotate: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update map style on layer change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(MAP_STYLES[selectedLayer].style);
    }
  }, [selectedLayer]);

  // Render Outlet Markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    locations.forEach((loc) => {
      const lat = parseFloat(loc.coords?.lat);
      const lng = parseFloat(loc.coords?.lng);
      if (!lat || !lng) return;

      const isActive = activeLocation && activeLocation.id === loc.id;

      // Custom Minimal Gold Vector Pin Element
      const el = document.createElement('div');
      el.className = 'custom-maplibre-outlet-pin';

      const pinWidth = isActive ? 30 : 26;
      const pinHeight = isActive ? 36 : 32;

      el.innerHTML = `
        <div class="custom-outlet-pin-container" style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 34px; transform: translate(-50%, -100%); cursor: pointer;">
          <div style="position: absolute; bottom: 0; width: 28px; height: 28px; background: rgba(212, 175, 55, 0.4); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.6;"></div>
          <div style="position: relative; width: ${pinWidth}px; height: ${pinHeight}px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.35)); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
            <svg xmlns="http://www.w3.org/2000/svg" width="${pinWidth}" height="${pinHeight}" viewBox="0 0 24 30" fill="none">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18c0-6.63-5.37-12-12-12z" fill="#D4AF37"/>
              <circle cx="12" cy="11" r="4" fill="#0C0A09"/>
            </svg>
          </div>
        </div>
      `;

      // Popup Content
      const popupHtml = `
        <div class="p-3 min-w-[210px]" style="font-family: inherit; padding: 12px; min-width: 200px;">
          <div style="display: flex; items-center: center; gap: 4px; color: #B8962E; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
            <span>📍 ${loc.city || 'Burj Al Khaleej'}</span>
          </div>
          <h4 style="font-weight: 900; color: #0F172A; font-size: 15px; margin: 0 0 4px 0; line-height: 1.2;">${loc.name}</h4>
          <p style="color: #475569; font-size: 12px; font-weight: 500; margin: 0 0 10px 0; line-height: 1.4;">${loc.desc || ''}</p>
          ${
            loc.phone
              ? `<a href="tel:${loc.phone}" style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #B8962E; font-weight: 700; text-decoration: none; margin-bottom: 10px;">📞 ${loc.phone}</a>`
              : ''
          }
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"
            target="_blank"
            rel="noopener noreferrer"
            style="display: block; text-align: center; width: 100%; padding: 8px 12px; background: #0C0A09; color: #D4AF37; border-radius: 12px; font-size: 12px; font-weight: 700; text-decoration: none; box-sizing: border-box; box-shadow: 0 4px 10px rgba(0,0,0,0.15);"
          >
            🧭 ${lang === 'ar' ? 'الاتجاهات عبر الخرائط' : 'Get Directions'}
          </a>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: [0, -35] }).setHTML(popupHtml);

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [locations, activeLocation, lang]);

  // Smooth camera pan to active location
  useEffect(() => {
    if (activeLocation && activeLocation.coords?.lat && activeLocation.coords?.lng && mapRef.current) {
      const activeLat = parseFloat(activeLocation.coords.lat);
      const activeLng = parseFloat(activeLocation.coords.lng);

      mapRef.current.flyTo({
        center: [activeLng, activeLat],
        zoom: 13,
        speed: 1.4,
        curve: 1.2
      });
    }
  }, [activeLocation]);

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] rounded-[36px] overflow-hidden shadow-2xl border border-surface-200 dark:border-surface-800 z-10 group">
      {/* Map Style Selector Controls */}
      <div className="absolute top-4 right-4 z-[10] flex items-center gap-1.5 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-xl">
        {Object.entries(MAP_STYLES).map(([key, layer]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedLayer(key)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${selectedLayer === key
                ? 'bg-[#D4AF37] text-[#0C0A09] shadow-md font-black'
                : 'text-slate-700 dark:text-slate-200 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
          >
            {lang === 'ar' ? layer.nameAr : layer.name}
          </button>
        ))}
      </div>

      {/* MapLibre Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default OutletMap;
