import React from 'react';
import dynamic from 'next/dynamic';
import Card from '../../components/ui/card';

const CustomEditor = dynamic(
  () => {
    return import('../../components/custom-editor');
  },
  { ssr: false }
);

function editPost() {
  return (
    <Card>
      <CustomEditor initialData="<h1>Hello from CKEditor in Next.js!</h1>" />
    </Card>
  );
}

export default editPost;
