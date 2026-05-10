import { getProviders, signIn } from 'next-auth/react';
import classes from './signin.module.css';

function SignInPage({ providers }) {
  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <h1 className={classes.title}>로그인</h1>
        {Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            className={classes.button}
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
          >
            {provider.name}으로 로그인
          </button>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return { props: { providers } };
}

export default SignInPage;
