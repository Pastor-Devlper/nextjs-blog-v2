import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import onImagePasted from '../../lib/onImagePasted';
import classes from './PostEditor.module.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

function PostEditor(props) {
  const [fields, setFields] = useState({
    title: props.title || '',
    date: props.date || '',
    image: props.image || '',
    excerpt: props.excerpt || '',
    isFeatured: props.isFeatured || false,
  });
  const [content, setContent] = useState(props.content || '');
  const [thumbnailPreview, setThumbnailPreview] = useState(props.image || '');
  const [uploading, setUploading] = useState(false);
  const thumbnailInputRef = useRef(null);

  async function handleThumbnailUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-cloudinary-api', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const url = data.filePaths[0];
      setFields((prev) => ({ ...prev, image: url }));
      setThumbnailPreview(url);
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function submitHandler(e) {
    e.preventDefault();
    const post = { ...fields, content };
    console.log(post);
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.meta}>
        <div className={classes.field}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            name="title"
            type="text"
            value={fields.title}
            onChange={handleChange}
            placeholder="포스트 제목"
          />
        </div>

        <div className={classes.field}>
          <label htmlFor="date">날짜</label>
          <input
            id="date"
            name="date"
            type="date"
            value={fields.date}
            onChange={handleChange}
          />
        </div>

        <div className={classes.field}>
          <label>썸네일 이미지</label>
          <div className={classes.imageUpload}>
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="썸네일 미리보기" className={classes.thumbnailPreview} />
            )}
            <button
              type="button"
              className={classes.uploadButton}
              onClick={() => thumbnailInputRef.current.click()}
              disabled={uploading}
            >
              {uploading ? '업로드 중...' : '이미지 선택'}
            </button>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className={classes.checkboxField}>
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            checked={fields.isFeatured}
            onChange={handleChange}
          />
          <label htmlFor="isFeatured">추천 포스트</label>
        </div>

        <div className={classes.fieldFull}>
          <label htmlFor="excerpt">요약</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={fields.excerpt}
            onChange={handleChange}
            placeholder="포스트 요약 (목록 페이지에 표시됩니다)"
          />
        </div>
      </div>

      <hr className={classes.divider} />

      <div>
        <p className={classes.editorLabel}>본문</p>
        <MDEditor
          value={content}
          height={440}
          onChange={setContent}
          onPaste={async (event) => {
            await onImagePasted(event.clipboardData, setContent);
          }}
          onDrop={async (event) => {
            await onImagePasted(event.dataTransfer, setContent);
          }}
          textareaProps={{
            placeholder: '마크다운으로 본문을 작성하세요.',
          }}
        />
      </div>

      <div className={classes.actions}>
        <button type="submit" className={classes.submitButton}>
          저장
        </button>
      </div>
    </form>
  );
}

export default PostEditor;
