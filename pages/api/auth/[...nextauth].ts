import NextAuth, { InitOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../db/mongodb';
import { SessionUser } from '../../../lib/data-types';
import { getUserFromId, updateUser } from '../../../db/user-dao';

const options: InitOptions = {
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'smith' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials: Record<string, any>) => {
        try {
          const db = await getDatabase();
          const collection = db.collection('users');
          const user = await collection.findOne({ email: credentials.username });
          if (user) {
            const sessionUser = {
              ...user,
              id: user._id.toString(),
            };
            // Any object returned will be saved in `user` property of the JWT
            return Promise.resolve(sessionUser);
          } else {
            // If you return null or false then the credentials will be rejected
            return Promise.resolve(null);
            // You can also Reject this callback with an Error or with a URL:
            // return Promise.reject(new Error('error message')) // Redirect to error page
            // return Promise.reject('/path/to/redirect')        // Redirect to a URL
          }
        } catch (e) {
          console.log(e);
          return Promise.resolve(null);
        }
      },
    }),
  ],

  session: {
    jwt: true,
  },

  // A database is optional, but required to persist accounts in a database
  database: process.env.MONGO_URL,

  callbacks: {
    async session(session, user: any) {
      const sessionUser: SessionUser = {
        ...session.user,
        id: user.id,
        username: user.username,
        role: user.role,
      };

      return Promise.resolve({
        ...session,
        user: sessionUser,
      });
    },
    async jwt(token, user: any, _account, profile) {
      let response = token;

      if (user?.id) {
        let dbUser = await getUserFromId(user.id);

        if (!dbUser.username && profile.login) {
          dbUser = await updateUser(user.id, { username: profile.login });
        }

        response = {
          ...token,
          id: user?.id,
          username: dbUser.username,
          role: dbUser.role,
        };
      }

      return Promise.resolve(response);
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
