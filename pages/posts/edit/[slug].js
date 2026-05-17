import Head from 'next/head';
import { getSession } from 'next-auth/react';
import Card from '../../../components/ui/card';
import PostEditor from '../../../components/posts/PostEditor';
import { getPostData } from '../../../lib/posts-util';

function EditPostPage({ post }) {
  return (
    <>
      <Head><title>{post.title} 수정</title></Head>
      <Card>
        <PostEditor
        slug={post.slug}
        title={post.title}
        date={post.date}
        image={post.image}
        excerpt={post.excerpt}
        isFeatured={post.isFeatured}
        content={post.content}
        onSaved={() => { window.location.href = `/posts/${post.slug}`; }}
      />
      </Card>
    </>
  );
}

export async function getServerSideProps({ req, params }) {
  const session = await getSession({ req });

  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }

  const post = await getPostData(params.slug);

  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
}

export default EditPostPage;
