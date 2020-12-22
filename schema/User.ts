import { objectType, queryType } from 'nexus';
import { getSessionUser } from '../lib/session/sessionHelpers';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('email');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
  },
});

export const UserQuery = queryType({
  definition(t) {
    t.nullable.field('me', {
      type: User,
      resolve: async (_source, _args, context) => {
        const user = await getSessionUser(context);

        if (!user) {
          return null;
        }

        // TODO _id: ObjectId
        return {
          ...user,
          id: user._id.toString(),
        };
      },
    });
  },
});
