import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  id: string;
  name: string;
  username: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  role?: 'admin';
}

export type SessionUser = Pick<User, 'username' | 'id' | 'role'>;
