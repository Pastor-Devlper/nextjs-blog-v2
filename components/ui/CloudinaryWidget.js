import { useRef, useState, useEffect } from 'react';

function addOptimization(url) {
  return url.replace('/upload/', '/upload/q_auto:good,w_1920,c_limit,f_auto/');
}

function CloudinaryWidget({ onUpload, folder = 'simslogv2', label = '이미지 선택', disabled = false, className }) {
  const widgetRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.cloudinary) {
      setReady(true);
      return;
    }
    const interval = setInterval(() => {
      if (window.cloudinary) {
        setReady(true);
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  function openWidget() {
    if (!window.cloudinary) return;

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          folder,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          maxImageFileSize: 10000000,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            onUpload(addOptimization(result.info.secure_url));
          }
        }
      );
    }

    widgetRef.current.open();
  }

  return (
    <button
      type="button"
      onClick={openWidget}
      disabled={disabled || !ready}
      className={className}
    >
      {ready ? label : '로딩 중...'}
    </button>
  );
}

export default CloudinaryWidget;
