declare global {
  interface Window {
    google?: any;
    __assetTrackGoogleMapsPromise?: Promise<any>;
    __assetTrackGoogleMapsInit?: () => void;
  }
}

const GOOGLE_MAPS_SCRIPT_ID = 'asset-track-google-maps-script';

export const getGoogleMapsApiKey = () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const loadGoogleMaps = async (): Promise<any> => {
  if (window.google?.maps) {
    return window.google.maps;
  }

  if (window.__assetTrackGoogleMapsPromise) {
    return window.__assetTrackGoogleMapsPromise;
  }

  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    throw new Error('Missing Google Maps API key. Set VITE_GOOGLE_MAPS_API_KEY in the frontend environment.');
  }

  window.__assetTrackGoogleMapsPromise = new Promise((resolve, reject) => {
    window.__assetTrackGoogleMapsInit = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
        return;
      }

      reject(new Error('Google Maps failed to initialize.'));
    };

    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps script.')));
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=geometry&loading=async&callback=__assetTrackGoogleMapsInit`;
    script.onerror = () => reject(new Error('Failed to load Google Maps script.'));
    document.head.appendChild(script);
  });

  return window.__assetTrackGoogleMapsPromise;
};
