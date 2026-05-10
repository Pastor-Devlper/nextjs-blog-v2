import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

import classes from './main-navigation.module.css';
import Logo from './logo';

function MainNavigation() {
  const { data: session } = useSession();

  return (
    <header className={classes.header}>
      <Link href="/">
        <Logo />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/posts">Posts</Link>
          </li>
          {session && (
            <li>
              <Link href="/posts/edit">New Post</Link>
            </li>
          )}
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            {session ? (
              <button className={classes.authButton} onClick={() => signOut()}>
                로그아웃
              </button>
            ) : (
              <button className={classes.authButton} onClick={() => signIn()}>
                로그인
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
