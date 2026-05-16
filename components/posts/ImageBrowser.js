import { useState, useEffect } from 'react';
import CloudinaryWidget from '../ui/CloudinaryWidget';
import classes from './ImageBrowser.module.css';

function ImageBrowser({ onInsert, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  function loadImages() {
    setLoading(true);
    setError(null);
    fetch('/api/cloudinary-images')
      .then((r) => r.json())
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(() => {
        setError('이미지를 불러오지 못했습니다.');
        setLoading(false);
      });
  }

  useEffect(() => {
    loadImages();
  }, []);

  function copyUrl(url) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function insertImage(url) {
    onInsert(`\n![](${url})\n`);
    onClose();
  }

  return (
    <div className={classes.overlay} onClick={onClose}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <div className={classes.header}>
          <h2 className={classes.title}>이미지 라이브러리</h2>
          <div className={classes.headerActions}>
            <CloudinaryWidget
              folder="simslogv2"
              label="+ 업로드"
              className={classes.uploadBtn}
              onUpload={(url) => {
                setImages((prev) => [{ url, publicId: url }, ...prev]);
              }}
            />
            <button className={classes.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={classes.body}>
          {loading && <p className={classes.status}>불러오는 중...</p>}
          {error && <p className={classes.statusError}>{error}</p>}
          {!loading && !error && images.length === 0 && (
            <p className={classes.status}>업로드된 이미지가 없습니다.</p>
          )}
          {!loading && images.length > 0 && (
            <div className={classes.grid}>
              {images.map((img) => (
                <div key={img.publicId} className={classes.item}>
                  <img
                    src={img.url.replace('/upload/', '/upload/w_240,h_160,c_fill/')}
                    alt=""
                    className={classes.thumb}
                  />
                  <div className={classes.actions}>
                    <button
                      className={classes.copyBtn}
                      onClick={() => copyUrl(img.url)}
                    >
                      {copied === img.url ? '복사됨 ✓' : 'URL 복사'}
                    </button>
                    <button
                      className={classes.insertBtn}
                      onClick={() => insertImage(img.url)}
                    >
                      본문 삽입
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageBrowser;
