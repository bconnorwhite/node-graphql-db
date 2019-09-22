import { Action, TypeList } from '../interfaces';
import {
  typeNameToFieldName,
  typeNameToPluralFieldName,
  typeNameToHistoryFieldName,
  typeNameToPluralHistoryFieldName,
  typeNameToConnectionFieldName,
  returnTypeToTypeName
} from '../utils';

export default (types: TypeList, client) => {
  let resolver = {};
  Object.keys(types.Query).forEach((field) => {
    let typeName = returnTypeToTypeName(types.Query[field].type);
    switch(types.Query[field].action) {
      case Action.get: {
        resolver[field] = (parent, { where }, context, info) => {
          return client[typeNameToFieldName(typeName)](where);
        };
        break;
      }
      case Action.getMany: {
        resolver[field] = (parent, args, context, info) => {
          return client[typeNameToPluralFieldName(typeName)](args);
        };
        break;
      }
      case Action.getHistory: {
        resolver[field] = (parent, { where }, context, info) => {
          return client[typeNameToHistoryFieldName(typeName)](where);
        };
        break;
      }
      case Action.getManyHistory: {
        resolver[field] = (parent, args, context, info) => {
          return client[typeNameToPluralHistoryFieldName(typeName)](args);
        };
        break;
      }
      case Action.getConnection: {
        resolver[field] = (parent, args, context, info) => {
          return client[typeNameToConnectionFieldName(typeName)](args);
        };
        break;
      }
    }
  });
  return resolver;
}
