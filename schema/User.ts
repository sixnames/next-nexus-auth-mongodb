import { objectType, queryType } from 'nexus';
import { getDatabase } from '../db/mongodb';
import { getSession } from 'next-auth/client';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

export const UserQuery = queryType({
  definition(t) {
    t.nullable.field('getUser', {
      type: 'User',
      resolve: async (_source, _args, context) => {
        // Get session user
        const session = await getSession(context);

        if (!session?.user) {
          return null;
        }

        // Get session user from db
        const db = await getDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ email: session.user.email });

        if (!user) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
        };
      },
    });
  },
});
