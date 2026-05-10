import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomDark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';

import PostHeader from './post-header';
import classes from './post-content.module.css';

SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('css', css);

function PostContent(props) {
  const { post } = props;
  const imagePath = post.image?.startsWith('http')
    ? post.image
    : `/images/posts/${post.slug}/${post.image}`;

  const customRenderers = {
    p(props) {
      const { node } = props;
      if (node.children[0].tagName === 'img') {
        const image = node.children[0];
        const src = image.properties.src;
        const resolvedSrc = src?.startsWith('http')
          ? src
          : `/images/posts/${post.slug}/${src}`;
        return (
          <div className={classes.image}>
            <img
              src={resolvedSrc}
              alt={image.properties.alt}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        );
      }
      return <p>{props.children}</p>;
    },

    code(props) {
      const { children, className, node, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <SyntaxHighlighter
          {...rest}
          PreTag="div"
          children={String(children).replace(/\n$/, '')}
          language={match[1]}
          style={atomDark}
        />
      ) : (
        <code {...rest} className={className}>
          {children}
        </code>
      );
    },
  };

  return (
    <article className={classes.content}>
      <PostHeader title={post.title} image={imagePath} />
      <div className={classes.editRow}>
        <Link href={`/posts/edit/${post.slug}`} className={classes.editButton}>
          수정
        </Link>
      </div>
      <ReactMarkdown components={customRenderers}>{post.content}</ReactMarkdown>
    </article>
  );
}

export default PostContent;
