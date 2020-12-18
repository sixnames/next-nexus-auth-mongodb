import { objectType, queryType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

export const UserQuery = queryType({
  definition(t) {
    t.field('getUser', {
      type: 'User',
      resolve: () => {
        return {
          id: 1,
          name: 'User name',
        };
      },
    });
  },
});
