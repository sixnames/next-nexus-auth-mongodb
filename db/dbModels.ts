import { ObjectId } from 'mongodb';

export interface BaseModel {
  _id: ObjectId;
}

export interface UserModel extends BaseModel {
  name: string;
  email: string;
}
