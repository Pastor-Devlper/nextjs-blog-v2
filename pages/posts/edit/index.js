import { getSession } from 'next-auth/react';
import Card from '../../../components/ui/card';
import PostEditor from '../../../components/posts/PostEditor';

function EditPostPage() {
  return (
    <Card>
      <PostEditor />
    </Card>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }

  return { props: {} };
}

export default EditPostPage;
