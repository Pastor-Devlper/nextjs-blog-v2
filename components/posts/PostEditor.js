import { useState } from 'react';
import dynamic from 'next/dynamic';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import onImagePasted from '../../lib/onImagePasted';
import CloudinaryWidget from '../ui/CloudinaryWidget';
import ImageBrowser from './ImageBrowser';
import classes from './PostEditor.module.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

function PostEditor(props) {
  const isEdit = !!props.slug;
  const [fields, setFields] = useState({
    title: props.title || '',
    date: props.date || '',
    image: props.image || '',
    excerpt: props.excerpt || '',
    isFeatured: props.isFeatured || false,
  });
  const [content, setContent] = useState(props.content || '');
  const [thumbnailPreview, setThumbnailPreview] = useState(props.image || '');
  const [showBrowser, setShowBrowser] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function submitHandler(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    const url = isEdit ? `/api/posts/${props.slug}` : '/api/posts';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, content }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSaveMessage({ type: 'error', text: data.message });
        return;
      }

      setSaveMessage({ type: 'success', text: isEdit ? '수정 완료!' : '저장 완료!' });
      if (isEdit && props.onSaved) {
        setTimeout(() => props.onSaved(), 800);
      }
    } catch {
      setSaveMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    } finally {
      setSaving(false);
    }
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
          <label htmlFor="image">썸네일 이미지</label>
          <div className={classes.imageUpload}>
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="썸네일 미리보기" className={classes.thumbnailPreview} />
            )}
            <div className={classes.imageInputRow}>
              <input
                id="image"
                name="image"
                type="text"
                value={fields.image}
                onChange={(e) => {
                  handleChange(e);
                  setThumbnailPreview(e.target.value);
                }}
                placeholder="URL 직접 입력 또는 위젯으로 선택"
              />
              <CloudinaryWidget
                onUpload={(url) => {
                  setFields((prev) => ({ ...prev, image: url }));
                  setThumbnailPreview(url);
                }}
                folder="simslogv2"
                label="이미지 선택"
                className={classes.uploadButton}
              />
            </div>
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
        <div className={classes.editorHeader}>
          <p className={classes.editorLabel}>본문</p>
          <button
            type="button"
            className={classes.libraryButton}
            onClick={() => setShowBrowser(true)}
          >
            🖼 이미지 라이브러리
          </button>
        </div>
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

      {showBrowser && (
        <ImageBrowser
          onInsert={(md) => setContent((prev) => (prev || '') + md)}
          onClose={() => setShowBrowser(false)}
        />
      )}

      <div className={classes.actions}>
        {saveMessage && (
          <p className={saveMessage.type === 'success' ? classes.successMsg : classes.errorMsg}>
            {saveMessage.text}
          </p>
        )}
        <button type="submit" className={classes.submitButton} disabled={saving}>
          {saving ? '저장 중...' : isEdit ? '수정 저장' : '저장'}
        </button>
      </div>
    </form>
  );
}

export default PostEditor;
