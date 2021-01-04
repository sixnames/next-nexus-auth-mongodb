import { hash } from 'bcryptjs';
import { UserModel } from 'db/dbModels';
import { COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';

export interface CreateInitialDataPayloadInterface {
  admin: UserModel;
}

export const createInitialData = async (): Promise<CreateInitialDataPayloadInterface> => {
  const db = await getDatabase();
  const usersCollection = db.collection(COL_USERS);
  let admin: any = await usersCollection.findOne<UserModel>({ email: process.env.ADMIN_EMAIL });

  if (!admin) {
    const adminPassword = await hash(`${process.env.ADMIN_PASSWORD}`, 10);
    const createdAdmin = await usersCollection.insertOne({
      name: process.env.ADMIN_NAME,
      lastName: process.env.ADMIN_LAST_NAME,
      email: process.env.ADMIN_EMAIL,
      phone: process.env.ADMIN_PHONE,
      password: adminPassword,
    });

    if (!createdAdmin.result.ok) {
      throw Error('Admin creation error in createInitialData');
    }

    admin = createdAdmin.ops[0];
  }

  return { admin };
};
