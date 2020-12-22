import NextAuth, { InitOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../db/mongodb';
import { ObjectId } from 'mongodb';
import { SessionUser } from '../../../db/dbModels';

const options: InitOptions = {
  database: process.env.MONGO_URL,
  session: {
    jwt: true,
  },

  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials: Record<string, any>) => {
        try {
          const db = await getDatabase();
          const collection = db.collection('users');
          const user = await collection.findOne(
            { email: credentials.username },
            { projection: { password: 0 } },
          );

          if (user) {
            const sessionUser = {
              ...user,
              id: user._id.toString(),
            };
            return Promise.resolve(sessionUser);
          } else {
            return Promise.resolve(null);
          }
        } catch (e) {
          console.log(e);
          return Promise.resolve(null);
        }
      },
    }),
  ],

  callbacks: {
    async session(session, user: any) {
      const sessionUser: SessionUser = {
        ...session.user,
        id: user.id,
        lastName: user.lastName,
        email: user.email,
        name: user.name,
      };

      return Promise.resolve({
        ...session,
        user: sessionUser,
      });
    },
    async jwt(token, user: any, _account, _profile) {
      let response = token;

      if (user?.id) {
        const db = await getDatabase();
        const dbUser = await db.collection('users').findOne({ _id: new ObjectId(user?.id) });

        if (!dbUser) {
          throw new Error('No user found');
        }

        response = {
          ...token,
          id: user?.id,
        };
      }

      return Promise.resolve(response);
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
