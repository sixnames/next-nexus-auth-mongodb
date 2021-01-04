import NextAuth, { InitOptions } from 'next-auth';
import Providers from 'next-auth/providers';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from 'db/mongodb';
import bcrypt from 'bcryptjs';
import { UserModel } from 'db/dbModels';
import { COL_USERS } from 'db/collectionNames';

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
          const collection = db.collection(COL_USERS);
          const user = await collection.findOne<UserModel>({ email: credentials.username });

          if (user) {
            const passwordResult = await bcrypt.compare(credentials.password, `${user.password}`);

            if (!passwordResult) {
              return Promise.resolve(null);
            }

            return Promise.resolve({
              name: user.name,
              email: user.email,
            });
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
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
