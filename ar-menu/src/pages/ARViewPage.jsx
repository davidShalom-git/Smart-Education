import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { getMenuItem } from '../data/menu';

const ARViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const menuItem = getMenuItem(id);
  const [isARReady, setIsARReady] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!menuItem) {
      return undefined;
    }

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // load sequentially
        script.onload = resolve;
        script.onerror = () => {
          setLoadError('Could not load AR libraries. Please check internet connection and try again.');
          reject(new Error(`Failed to load script: ${src}`));
        };
        document.body.appendChild(script);
      });
    };

    const initAR = async () => {
      try {
        if (!window.AFRAME) {
          await loadScript('https://aframe.io/releases/1.6.0/aframe.min.js');
        }
        await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
        setIsARReady(true);
      } catch {
        setLoadError('Could not initialize AR. Please refresh and allow camera permission.');
      }
    };

    initAR();

    return () => {
      const video = document.querySelector('video');
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.remove();
      }

      const overlays = document.querySelectorAll('.mindar-ui-overlay, #arjs-video, #mindar-video, #mindar-canvas');
      overlays.forEach((el) => el.remove());
    };
  }, [menuItem]);

  if (!menuItem) {
    return (
      <div className="w-screen h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={34} />
          <h1 className="text-xl font-semibold mb-2">Dish not found</h1>
          <p className="text-sm text-gray-300 mb-6">
            This QR code points to an item that does not exist in <code>src/data/menu.js</code>.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-full bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-black fixed inset-0">
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center bg-linear-to-b from-black/80 to-transparent z-50 pointer-events-auto">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            {menuItem.name}
          </span>
        </div>
        <div className="text-right text-white/85 text-xs">
          <p className="font-semibold">{menuItem.price}</p>
          <p className="text-white/65">Point camera to table/menu</p>
        </div>
      </div>

      {loadError ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-white z-50 relative px-6 text-center">
          <AlertCircle size={30} className="text-red-400 mb-3" />
          <p className="font-medium mb-2">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-full bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
          >
            Retry
          </button>
        </div>
      ) : isARReady ? (
        <>
          <a-scene
            embedded
            mindar-image="imageTargetSrc: /card.mind; autoStart: true; uiScanning: yes; uiLoading: yes; maxTrack: 1;"
            color-space="sRGB"
            renderer="antialias: true; alpha: true"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
            style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 10 }}
          >
            <a-assets>
              {menuItem.imageUrl ? <img id="menu-image-asset" src={menuItem.imageUrl} alt={menuItem.name} /> : null}
            </a-assets>

            <a-light type="ambient" color="#ffffff" intensity="1.5"></a-light>
            <a-light type="directional" position="0.5 1 1" intensity="1"></a-light>

            <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

            <a-entity mindar-image-target="targetIndex: 0">
              {menuItem.imageUrl ? (
                <a-plane
                  position={menuItem.markerPosition || '0 0 0.2'}
                  scale={menuItem.markerScale || '1.1 0.75 1'}
                  rotation={menuItem.markerRotation || '0 0 0'}
                  width="1.8"
                  height="1.2"
                  material="src: #menu-image-asset; transparent: true; side: double;"
                  animation__pop="property: scale; from: 0.05 0.05 0.05; to: 1.1 0.75 1; dur: 700; easing: easeOutBack"
                ></a-plane>
              ) : (
                <a-entity
                  position={menuItem.markerPosition || '0 0 0.15'}
                  gltf-model={menuItem.modelUrl}
                  scale={menuItem.markerScale || '0.35 0.35 0.35'}
                  rotation={menuItem.markerRotation || '0 0 0'}
                  animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
                  animation__pop="property: scale; from: 0.01 0.01 0.01; to: 0.35 0.35 0.35; dur: 800; easing: easeOutElastic"
                >
                  <a-circle radius="0.8" rotation="-90 0 0" position="0 -0.06 0" color="#f59e0b" opacity="0.25"></a-circle>
                </a-entity>
              )}
            </a-entity>
          </a-scene>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/55 border border-white/15 text-xs text-white/90 backdrop-blur-sm">
            Point camera at the printed menu target image
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-white z-50 relative pointer-events-none">
          <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4"></div>
          <p className="font-medium text-amber-500 animate-pulse">Initializing AR for {menuItem.name}...</p>
        </div>
      )}

      <style>{`
        video {
            width: 100vw !important;
            height: 100vh !important;
            object-fit: cover !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 0 !important;
        }
        #mindar-video,
        #mindar-canvas {
            width: 100vw !important;
            height: 100vh !important;
        }
        canvas {
            position: absolute !important;
            inset: 0 !important;
            z-index: 5 !important;
        }
      `}</style>
    </div>
  );
};

export default ARViewPage;
