import * as React from 'react';
import { initializeApollo } from '../apollo/apolloClient';
import { MY_QUERY } from '../graphql/myQuery';
import { useMyQuery } from '../generated/apolloComponents';

export default function Home() {
  const { data, loading, error } = useMyQuery();

  if (error) {
    return <div>error</div>;
  }

  if (loading) {
    return loading;
  }

  return (
    <div>
      <h1>Hello</h1>
      <h2>{data?.name}</h2>
    </div>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: MY_QUERY,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
