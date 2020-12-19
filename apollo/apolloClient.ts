import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createIsomorphicLInk(ctx?: any) {
  if (typeof window === 'undefined') {
    // on server
    const { SchemaLink } = require('@apollo/client/link/schema');
    const { schema } = require('../schema/schema');
    return new SchemaLink({ schema, context: ctx });
  } else {
    // on client
    const { createUploadLink } = require('apollo-upload-client');
    return createUploadLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    });
  }
}

function createApolloClient(ctx?: any) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
    link: createIsomorphicLInk(ctx),
  });
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null, ctx?: any) {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  apolloClient = apolloClient ?? _apolloClient;

  return apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject) {
  return useMemo(() => {
    return initializeApollo(initialState);
  }, [initialState]);
}
