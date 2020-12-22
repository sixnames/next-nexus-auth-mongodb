import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const About = () => {
  const { asPath, locales } = useRouter();

  return (
    <React.Fragment>
      <Link href={'/'}>
        <a>Home</a>
      </Link>
      <br />

      {(locales || []).map((locale) => {
        return (
          <div key={locale}>
            <br />
            <Link locale={locale} href={asPath}>
              <a>{locale}</a>
            </Link>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default About;
