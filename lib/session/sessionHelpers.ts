import { UserModel } from '../../db/dbModels';
import { getSession } from 'next-auth/client';
import { getDatabase } from '../../db/mongodb';

export const getSessionUser = async (context: any): Promise<UserModel | null> => {
  // Get session user
  const session = await getSession(context);
  if (!session?.user) {
    return null;
  }

  // Get session user from db
  const db = await getDatabase();
  const collection = db.collection('users');

  return collection.findOne<UserModel>(
    { email: session.user.email },
    { projection: { password: 0 } },
  );
};

export const getSessionLocale = (context: any): string => {
  return context.locale || context.req.headers['content-language'] || 'ru';
};
