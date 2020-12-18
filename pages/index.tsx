import * as React from 'react';
import { gql, useQuery } from '@apollo/client';
import { initializeApollo } from '../apollo/apolloClient';

const MyQuery = gql`
  query MyQuery {
    name
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(MyQuery);

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
    query: MyQuery,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
