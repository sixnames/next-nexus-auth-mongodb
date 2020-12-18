import * as React from 'react';
import { initializeApollo } from '../apollo/apolloClient';
import { useInitialQuery } from '../generated/apolloComponents';
import { INITIAL_QUERY } from '../graphql/initialQuery';

export default function Home() {
  const { data, loading, error } = useInitialQuery();

  if (error) {
    return <div>error</div>;
  }

  if (loading) {
    return loading;
  }

  return (
    <div>
      <h1>Hello</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: INITIAL_QUERY,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
