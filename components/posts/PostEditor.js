import { useState } from 'react';
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
          <label htmlFor="image">이미지 파일명</label>
          <input
            id="image"
            name="image"
            type="text"
            value={fields.image}
            onChange={handleChange}
            placeholder="예: my-post.jpg"
          />
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
