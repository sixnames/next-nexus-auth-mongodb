import { arg, nonNull, objectType, queryType } from 'nexus';
import { getSessionUser } from '../lib/session/sessionHelpers';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.string('name');
    t.nonNull.string('email');
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

        return user;
      },
    });

    t.nullable.field('getUser', {
      type: User,
      args: {
        id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_source, _args, context) => {
        const user = await getSessionUser(context);

        if (!user) {
          return null;
        }

        return user;
      },
    });
  },
});
