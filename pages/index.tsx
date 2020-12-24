import * as React from 'react';
import { initializeApollo } from 'apollo/apolloClient';
import { useInitialQuery } from 'generated/apolloComponents';
import { INITIAL_QUERY } from 'graphql/initialQuery';
import { signIn, signOut } from 'next-auth/client';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Home = () => {
  const { locales, locale } = useRouter();
  const { data, loading, error } = useInitialQuery();

  if (error) {
    return <div>Error in useInitialQuery</div>;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>Error in useInitialQuery</div>;
  }

  const { me } = data;

  return (
    <React.Fragment>
      {!me ? (
        <React.Fragment>
          <h1>Not signed in</h1>
          <div>
            <button onClick={() => signIn('Credentials')}>Sign in</button>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h1>Hello</h1>
          <h2>Signed in as {me.email}</h2>
          <h3>User from DB: </h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <button onClick={() => signOut()}>Sign out</button>
        </React.Fragment>
      )}

      <h3>Nav</h3>
      <Link href={'/about'}>
        <a>About</a>
      </Link>

      <h3>Current locale</h3>
      <div>{locale}</div>

      <h3>All locales</h3>
      {(locales || []).map((locale) => {
        return (
          <div key={locale}>
            <Link locale={locale} href={'/'}>
              <a>{locale}</a>
            </Link>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  const apolloClient = initializeApollo(null, context);
  await apolloClient.query({
    query: INITIAL_QUERY,
    context,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default Home;
