import {
  typeNameToCreateFieldName,
  typeNameToCreateManyFieldName,
  typeNameToUpdateFieldName,
  typeNameToUpdateManyFieldName,
  typeNameToUpsertFieldName,
  typeNameToDeleteFieldName,
  typeNameToDeleteManyFieldName,
  typeNameToRestoreFieldName,
  typeNameToRestoreManyFieldName,
  returnTypeToTypeName
} from 'utils';

import Client from '../client';
import { Action } from '../client/database/datamodel/types';

export default (client: Client) => {
  let resolver = {};
  let Mutation = client.database.datamodel.types.Mutation;
  Object.keys(Mutation).forEach((field) => {
    let typeName = returnTypeToTypeName(Mutation[field].returnType);
    switch(Mutation[field].action) {
      case Action.create: {
        resolver[field] = (parent, { data }, context, info) => {
          return client[typeNameToCreateFieldName(typeName)](data);
        };
        break;
      }
      case Action.createMany: {
        resolver[field] = (parent, { data }, context, info) => {
          return client[typeNameToCreateManyFieldName(typeName)](data);
        };
        break;
      }
      case Action.update: {
        resolver[field] = (parent, args, context, info) => {
          return client[typeNameToUpdateFieldName(typeName)](args);
        };
        break;
      }{}
      case Action.updateMany: {
        resolver[field] = (parent, args, context, info) => {
          return client[typeNameToUpdateManyFieldName(typeName)](args);
        };
        break;
      }
      case Action.upsert: {
        resolver[field] = (parent, args, context, info) => {
          return client[typeNameToUpsertFieldName(typeName)](args);
        };
        break;
      }
      case Action.delete: {
        resolver[field] = (parent, { where }, context, info) => {
          return client[typeNameToDeleteFieldName(typeName)](where);
        };
        break;
      }
      case Action.deleteMany: {
        resolver[field] = (parent, args, context, info) => {
          return client[typeNameToDeleteManyFieldName(typeName)](args);
        };
        break;
      }
      case Action.restore: {
        resolver[field] = (parent, { where }, context, info) => {
          return client[typeNameToRestoreFieldName(typeName)](where);
        };
        break;
      }
      case Action.restoreMany: {
        resolver[field] = (parent, args, context, info) => {
          return client[typeNameToRestoreManyFieldName(typeName)](args);
        };
        break;
      }
    }
  });
  return resolver;
}
