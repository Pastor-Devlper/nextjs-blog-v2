import { useRouter } from 'next/router';
import Card from '../../../components/ui/card';
import PostEditor from '../../../components/posts/PostEditor';
import { getPostData } from '../../../lib/posts-util';

function EditPostPage({ post }) {
  const router = useRouter();

  return (
    <Card>
      <PostEditor
        slug={post.slug}
        title={post.title}
        date={post.date}
        image={post.image}
        excerpt={post.excerpt}
        isFeatured={post.isFeatured}
        content={post.content}
        onSaved={() => router.push(`/posts/${post.slug}`)}
      />
    </Card>
  );
}

export async function getServerSideProps({ params }) {
  const post = await getPostData(params.slug);

  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
}

export default EditPostPage;
