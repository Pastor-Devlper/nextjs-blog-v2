import { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
// import { commands, ICommand, TextState, TextApi } from '@uiw/react-md-editor';
import onImagePasted from '../../lib/onImagePasted';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

function PostEditor(props) {
  const content = props.content;
  const [value, setValue] = useState();

  useEffect(() => {
    if (content) {
      setValue(content);
    }
  }, []);

  function submitHandler(e) {
    e.preventDefault();
    console.log(value.title);
    // save value to local Storage

    setValue('**Hello world!!!**');
  }

  return (
    <MDEditor
      value={value}
      height={440}
      onChange={setValue}
      onPaste={async (event) => {
        await onImagePasted(event.clipboardData, setValue);
      }}
      onDrop={async (event) => {
        await onImagePasted(event.dataTransfer, setValue);
      }}
      textareaProps={{
        placeholder: 'Fill in your markdown for the coolest of the cool.',
      }}
    />
  );
}

export default PostEditor;
