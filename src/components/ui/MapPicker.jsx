import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Search, Loader2, MapPin, Navigation, X, Palette } from 'lucide-react';
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

const PIN_COLOR_THEMES = {
  gold: {
    id: 'gold',
    name: 'Gold',
    nameAr: 'ذهبي فاخر',
    pinColor: '#D4AF37',
    dotColor: '#0C0A09',
    pingColor: 'rgba(212, 175, 55, 0.4)'
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson',
    nameAr: 'قرمزي',
    pinColor: '#E11D48',
    dotColor: '#FFFFFF',
    pingColor: 'rgba(225, 29, 72, 0.4)'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    nameAr: 'زمردي',
    pinColor: '#10B981',
    dotColor: '#FFFFFF',
    pingColor: 'rgba(16, 185, 129, 0.4)'
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire',
    nameAr: 'ياقوتي',
    pinColor: '#2563EB',
    dotColor: '#FFFFFF',
    pingColor: 'rgba(37, 99, 235, 0.4)'
  },
  dark: {
    id: 'dark',
    name: 'Obsidian',
    nameAr: 'أسود داكن',
    pinColor: '#0F172A',
    dotColor: '#F59E0B',
    pingColor: 'rgba(245, 158, 11, 0.4)'
  }
};

const createPinHTML = (themeKey = 'gold') => {
  const theme = PIN_COLOR_THEMES[themeKey] || PIN_COLOR_THEMES.gold;
  return `
    <div class="custom-pin-container" style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 34px; transform: translate(-50%, -100%); cursor: grab;">
      <div style="position: absolute; bottom: 0; width: 28px; height: 28px; background: ${theme.pingColor}; border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.6;"></div>
      <div style="position: relative; width: 26px; height: 32px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.35)); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 24 30" fill="none">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18c0-6.63-5.37-12-12-12z" fill="${theme.pinColor}"/>
          <circle cx="12" cy="11" r="4" fill="${theme.dotColor}"/>
        </svg>
      </div>
    </div>
  `;
};

const MapPicker = ({ lat, lng, onSelectLocation, lang }) => {
  const initialLat = parseFloat(lat) || MAP_DEFAULTS.LAT;
  const initialLng = parseFloat(lng) || MAP_DEFAULTS.LNG;

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const markerElRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('');
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('streets');
  const [selectedPinColor, setSelectedPinColor] = useState('gold');

  const currentPos = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[selectedLayer].style,
      center: [initialLng, initialLat],
      zoom: lat && lng ? 12 : MAP_DEFAULTS.ZOOM,
      pitchWithRotate: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    const el = document.createElement('div');
    el.className = 'custom-maplibre-pin';
    el.innerHTML = createPinHTML(selectedPinColor);
    markerElRef.current = el;

    const marker = new maplibregl.Marker({
      element: el,
      draggable: true,
      anchor: 'bottom'
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map);

    markerRef.current = marker;
    mapRef.current = map;

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      const newLat = parseFloat(lngLat.lat.toFixed(6));
      const newLng = parseFloat(lngLat.lng.toFixed(6));
      onSelectLocation({ lat: newLat, lng: newLng });
    });

    map.on('click', (e) => {
      const clickLat = parseFloat(e.lngLat.lat.toFixed(6));
      const clickLng = parseFloat(e.lngLat.lng.toFixed(6));
      marker.setLngLat([clickLng, clickLat]);
      onSelectLocation({ lat: clickLat, lng: clickLng });
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update pin color dynamically
  useEffect(() => {
    if (markerElRef.current) {
      markerElRef.current.innerHTML = createPinHTML(selectedPinColor);
    }
  }, [selectedPinColor]);

  // Update map style on layer change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(MAP_STYLES[selectedLayer].style);
    }
  }, [selectedLayer]);

  // Sync marker position when props change
  useEffect(() => {
    if (lat && lng && markerRef.current && mapRef.current) {
      const nLat = parseFloat(lat);
      const nLng = parseFloat(lng);
      markerRef.current.setLngLat([nLng, nLat]);

      const timer = setTimeout(async () => {
        setIsResolvingAddress(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${nLat}&lon=${nLng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setDetectedAddress(data.display_name);
          }
        } catch (e) {
          console.error("Reverse geocoding error:", e);
        } finally {
          setIsResolvingAddress(false);
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [lat, lng]);

  // Debounced City & Location Search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=6`
        );
        const data = await res.json();
        setSuggestions(data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (item) => {
    const foundLat = parseFloat(parseFloat(item.lat).toFixed(6));
    const foundLng = parseFloat(parseFloat(item.lon).toFixed(6));

    if (mapRef.current && markerRef.current) {
      mapRef.current.flyTo({
        center: [foundLng, foundLat],
        zoom: 14,
        duration: 1600
      });
      markerRef.current.setLngLat([foundLng, foundLat]);
    }

    setSearchQuery(item.display_name.split(',')[0]);
    setDetectedAddress(item.display_name);
    setShowSuggestions(false);
    onSelectLocation({ lat: foundLat, lng: foundLng, address: item.display_name });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert(lang === 'ar' ? 'خدمة الموقع غير مدعومة' : 'Geolocation is not supported.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const myLat = parseFloat(pos.coords.latitude.toFixed(6));
        const myLng = parseFloat(pos.coords.longitude.toFixed(6));

        if (mapRef.current && markerRef.current) {
          mapRef.current.flyTo({
            center: [myLng, myLat],
            zoom: 15,
            duration: 1500
          });
          markerRef.current.setLngLat([myLng, myLat]);
        }

        onSelectLocation({ lat: myLat, lng: myLng });
        setIsLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert(lang === 'ar' ? 'تعذر الحصول على الموقع الحقيقي' : 'Could not fetch your location.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Header Info & Color Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {lang === 'ar' ? 'حدد الموقع الدقيق على الخريطة' : 'Search City & Pin Location'}
        </label>

        {/* Pin Color Selector */}
        <div className="flex items-center gap-1.5 bg-surface-100 dark:bg-surface-800/80 px-2.5 py-1 rounded-xl border border-surface-200 dark:border-surface-700">
          <Palette className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">
            {lang === 'ar' ? 'لون المؤشر:' : 'Pin:'}
          </span>
          {Object.entries(PIN_COLOR_THEMES).map(([key, theme]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedPinColor(key)}
              title={lang === 'ar' ? theme.nameAr : theme.name}
              className={`w-4 h-4 rounded-full transition-transform ${
                selectedPinColor === key ? 'scale-125 ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-surface-900' : 'opacity-70 hover:opacity-100'
              } ${
                key === 'gold' ? 'bg-[#D4AF37]' :
                key === 'crimson' ? 'bg-rose-500' :
                key === 'emerald' ? 'bg-emerald-500' :
                key === 'sapphire' ? 'bg-blue-500' : 'bg-slate-900 border border-amber-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Autocomplete Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} w-4 h-4 text-slate-400 z-10`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={
              lang === 'ar'
                ? 'ابحث عن اسم المدينة أو المنطقة (مثال: مسقط، البداية، دبي، صلالة)...'
                : 'Search any city or location (e.g. Muscat, Dubai, Barka, London)...'
            }
            className="input-field py-2.5 text-xs input-with-icon-left pr-10"
          />
          {isSearching ? (
            <Loader2 className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} w-4 h-4 text-amber-500 animate-spin`} />
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSuggestions([]); }}
              className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} text-slate-400 hover:text-slate-600`}
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-surface-100 dark:divide-surface-800 max-h-60 overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-4 py-3 text-xs hover:bg-amber-50 dark:hover:bg-surface-800 transition-colors flex items-start gap-2.5"
              >
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white leading-snug">
                    {item.display_name.split(',')[0]}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {item.display_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-inner border border-surface-200 dark:border-surface-800 z-10 group">
        {/* Style Selector & Locate Overlay */}
        <div className="absolute top-3 right-3 z-[10] flex items-center gap-1.5 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md p-1.5 rounded-xl border border-surface-200 dark:border-surface-700 shadow-lg">
          {Object.entries(MAP_STYLES).map(([key, layer]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedLayer(key)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                selectedLayer === key
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              {lang === 'ar' ? layer.nameAr : layer.name}
            </button>
          ))}
          <div className="w-[1px] h-4 bg-surface-200 dark:bg-surface-700 mx-0.5" />
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            title={lang === 'ar' ? 'موقعي الحالي' : 'Use My GPS Location'}
            className="p-1.5 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> : <Navigation className="w-4 h-4" />}
          </button>
        </div>

        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {currentPos && (
        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl text-xs flex items-start gap-2">
          <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
              {lang === 'ar' ? 'العنوان المحدد في الخريطة:' : 'Selected Location Address:'}
            </span>
            {isResolvingAddress ? (
              <span className="text-slate-400 flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                {lang === 'ar' ? 'جاري العثور على اسم الشارع والمنطقة...' : 'Detecting street & district address...'}
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {detectedAddress || (lang === 'ar' ? 'تم تحديد الإحداثيات' : 'Coordinates set successfully.')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
