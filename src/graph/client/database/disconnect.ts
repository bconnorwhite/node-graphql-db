import { mapAny } from '@bconnorwhite/for-any';

import {
  returnTypeToTypeName,
  returnTypeIsList,
  returnTypeIsRequired,
  returnTypeInnerIsRequried,
} from 'utils';

import Database, { Node } from './';

export default function disconnect(database: Database, typeName: string, where: (object | object[]), parent: Node, fieldName: string) {
  let fieldModel = database.getFieldModel(typeName, fieldName);
  let result = [];
  return mapAny(where, (whereInstance) => {
    let node = database.whereUnique(typeName, whereInstance);
    if(node) {
      if(returnTypeIsList(fieldModel.type)) {
        node[fieldName] = node[fieldName].filter((item) => item !== parent);
      } else if(returnTypeIsRequired(fieldModel.type)) {
        throw new Error(`Cannot disconnect field ${fieldName} on type ${typeName} - field is required.`);
      } else {
        node[fieldName] = null;
      }
      return {
        node,
        commit: {
          node: node,
          typeName: typeName,
          operation: {
            op: "replace",
            path: `${fieldName}`,
            value: node[fieldName]
          }
        }
      }
    } else {
      throw new Error(`Cannot disconnect ${fieldName}, type ${typeName} where ${where} does not exist`);
    }
  });
}
