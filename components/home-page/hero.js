import Image from 'next/image';

import classes from './hero.module.css';

function Hero() {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src="/images/site/logo01.png"
          alt="An image showing Sim"
          width={300}
          height={300}
        />
      </div>
      <h1>Hi, I'm Sim</h1>
      <p>
        I blog about web development - especially frontend frameworks like
        Next.js or React.
      </p>
    </section>
  );
}

export default Hero;
