import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** Date custom scalar type */
  Date: any;
  /** Mongo object id scalar type */
  ObjectId: any;
};


export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  name: Scalars['String'];
  email: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  getUser?: Maybe<User>;
};


export type QueryGetUserArgs = {
  id: Scalars['ObjectId'];
};



export type InitialQueryVariables = Exact<{ [key: string]: never; }>;


export type InitialQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, '_id' | 'name' | 'email'>
  )> }
);


export const InitialDocument = gql`
    query Initial {
  me {
    _id
    name
    email
  }
}
    `;

/**
 * __useInitialQuery__
 *
 * To run a query within a React component, call `useInitialQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitialQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitialQuery({
 *   variables: {
 *   },
 * });
 */
export function useInitialQuery(baseOptions?: Apollo.QueryHookOptions<InitialQuery, InitialQueryVariables>) {
        return Apollo.useQuery<InitialQuery, InitialQueryVariables>(InitialDocument, baseOptions);
      }
export function useInitialLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitialQuery, InitialQueryVariables>) {
          return Apollo.useLazyQuery<InitialQuery, InitialQueryVariables>(InitialDocument, baseOptions);
        }
export type InitialQueryHookResult = ReturnType<typeof useInitialQuery>;
export type InitialLazyQueryHookResult = ReturnType<typeof useInitialLazyQuery>;
export type InitialQueryResult = Apollo.QueryResult<InitialQuery, InitialQueryVariables>;