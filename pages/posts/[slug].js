import Head from 'next/head';
import { Fragment } from 'react';
import { getPostData } from '../../lib/posts-util';
import PostContent from '../../components/posts/post-detail/post-content';

function PostDetailPage(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content={props.post.excerpt} />
      </Head>
      <PostContent post={props.post} />
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const post = await getPostData(params.slug);

  return {
    props: { post },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export default PostDetailPage;
