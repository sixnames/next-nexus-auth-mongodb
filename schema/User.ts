import { objectType, queryType } from 'nexus';
import { getDatabase } from '../db/mongodb';
import { getSession } from 'next-auth/client';
import { UserModel } from '../db/dbModels';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('email');
  },
});

export const UserQuery = queryType({
  definition(t) {
    t.nullable.field('getUser', {
      type: User,
      resolve: async (_source, _args, context) => {
        // Get session user
        const session = await getSession(context);
        console.log(session?.user);
        if (!session?.user) {
          return null;
        }

        // Get session user from db
        const db = await getDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne<UserModel>({ email: session.user.email });

        if (!user) {
          return null;
        }

        return {
          ...user,
          id: user._id.toString(),
        };
      },
    });
  },
});
