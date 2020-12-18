import { makeSchema } from 'nexus';
import * as UserTypes from './User';

export const schema = makeSchema({
  types: [UserTypes],
});
