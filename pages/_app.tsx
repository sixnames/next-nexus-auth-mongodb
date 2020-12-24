import * as React from 'react';
import './reset.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/apolloClient';
import { Provider } from 'next-auth/client';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();
  const { session } = pageProps;
  const apolloClient = useApollo(pageProps.initialApolloState, locale);

  return (
    <Provider session={session}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  );
}

export default MyApp;
