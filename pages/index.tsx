import * as React from 'react';
import { initializeApollo } from '../apollo/apolloClient';
import { useInitialQuery } from '../generated/apolloComponents';
import { INITIAL_QUERY } from '../graphql/initialQuery';
import { signIn, signOut, useSession } from 'next-auth/client';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

const Home = () => {
  const [session] = useSession();
  const { data, loading, error } = useInitialQuery();

  if (error) {
    return <div>Error in useInitialQuery</div>;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <>
      {!session && (
        <React.Fragment>
          <h1>Not signed in</h1>
          <button onClick={() => signIn()}>Sign in</button>
        </React.Fragment>
      )}
      {session && (
        <React.Fragment>
          <h1>Hello</h1>
          <h2>Signed in as {session.user.email}</h2>
          <h3>User from DB: </h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <button onClick={() => signOut()}>Sign out</button>
        </React.Fragment>
      )}
    </>
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
