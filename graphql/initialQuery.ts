import { gql } from '@apollo/client';

export const INITIAL_QUERY = gql`
  query Initial {
    me {
      id
      name
      email
    }
  }
`;
