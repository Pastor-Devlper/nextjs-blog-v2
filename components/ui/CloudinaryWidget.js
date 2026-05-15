import { useRef } from 'react';
import Script from 'next/script';

function addOptimization(url) {
  return url.replace('/upload/', '/upload/q_auto:good,w_1920,c_limit,f_auto/');
}

function CloudinaryWidget({ onUpload, folder = 'simslogv2', label = '이미지 선택', disabled = false, className }) {
  const widgetRef = useRef(null);

  function openWidget() {
    if (!window.cloudinary) {
      alert('위젯을 로드 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

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
    <>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="lazyOnload" />
      <button type="button" onClick={openWidget} disabled={disabled} className={className}>
        {label}
      </button>
    </>
  );
}

export default CloudinaryWidget;
