import { UUID, DateTime, Email, Upload } from './scalars';
import Query from './query';
import Mutation from './mutation';

import Client from '../client';

export default (client: Client) => ({
  UUID: UUID,
  DateTime: DateTime,
  Email: Email,
  Upload: Upload,
  Query: {
    _database: async (parent, args, context, info) => {
      return await client.database.stats();
    },
    ...Query(client)
  },
  Mutation: {
    _saveDatabase: (parent, args, context, info) => {
      return {
        elapsed: client.database.save()
      }
    },
    _dropDatabase: (parent, args, context, info) => {
      return {
        elapsed: client.database.drop()
      }
    },
    ...Mutation(client)
  }
})
