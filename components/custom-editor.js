// components/custom-editor.js

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build';

function CustomEditor(props) {
  const editorConfiguration = {
    toolbar: [
      'redo',
      'undo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'link',
      '|',
      'horizontalLine',
      'bulletedList',
      'numberedList',
      'blockQuote',
      'insertTable',
      '|',
      'outdent',
      'indent',
      '|',
      'imageInsert',
      'mediaEmbed',
      'sourceEditing',
    ],
    extraPlugins: [uploadPlugin],
  };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append('files', file);
            fetch('/api/upload-cloudinary-api', {
              method: 'POST',
              body: body,
            })
              .then((res) => res.json())
              .then((data) => {
                resolve({
                  default: `${data.filePaths[0]}`,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <CKEditor
      editor={Editor}
      config={editorConfiguration}
      data={props.initialData}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
      }}
    />
  );
}

export default CustomEditor;
