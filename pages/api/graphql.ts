import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../schema';
import { getSession } from 'next-auth/client';

const server = new ApolloServer({
  schema,
  context: (ctx) => {
    const session = getSession(ctx);
    console.log(JSON.stringify(session, null, 2));
    return ctx;
  },
});
const handler = server.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
