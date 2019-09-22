import { UUID, DateTime, Email } from '../scalars';
import { TypeList, DatabaseInterface } from '../interfaces';
import Query from './query';
import Mutation from './mutation';

export default (types: TypeList, database: DatabaseInterface) => ({
  UUID: UUID,
  DateTime: DateTime,
  Email: Email,
  Query: {
    _database: async (parent, args, context, info) => {
      return await database.stats();
    },
    ...Query(types, database)
  },
  Mutation: {
    _saveDatabase: (parent, args, context, info) => {
      return {
        elapsed: database.save()
      }
    },
    _dropDatabase: (parent, args, context, info) => {
      return {
        elapsed: database.drop()
      }
    },
    ...Mutation(types, database)
  }
})
