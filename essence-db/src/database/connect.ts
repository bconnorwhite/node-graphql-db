import { mapAny, forEachAny, reduceAny } from '@bconnorwhite/for-any';

import {
  returnTypeToTypeName,
  returnTypeIsList
} from 'essence-tools';

import Database, { Node, FieldValue, fieldValueIsNode, fieldValueIsNodeArray } from './';
import disconnect from './disconnect';

export function connectNode(database: Database, typeName: string, node: Node, parent: Node, inverseFieldName: string) {
  let fieldModel = database.getFieldModel(typeName, inverseFieldName);
  let commit = [];
  let fieldValue = node[inverseFieldName];
  if(returnTypeIsList(fieldModel.type) && fieldValueIsNodeArray(fieldValue)) {
    fieldValue.push(parent);
  } else if(fieldValueIsNode(fieldValue)) {
    if(fieldValue && fieldModel.inverse) {
      let disconnectResults = disconnect(database, returnTypeToTypeName(fieldModel.type), { uuid: fieldValue.uuid }, node, fieldModel.inverse);
      forEachAny(disconnectResults, (result) => commit = commit.concat(result.commit));
    }
    node[inverseFieldName] = parent;
  };
  commit.unshift({
    node: node,
    typeName: typeName,
    operation: {
      op: "replace",
      path: `/${inverseFieldName}`,
      value: parent
    }
  });
  return {
    node,
    commit
  };
}

export default function connect(database: Database, typeName: string, where: (object | object[]), parent: Node, inverseFieldName: string) {
  let results = mapAny(where, (whereInstance) => {
    let node = database.whereUnique(typeName, whereInstance);
    if(node) {
      return connectNode(database, typeName, node, parent, inverseFieldName);
    } else {
      throw new Error(`Cannot connect field ${inverseFieldName}, type ${typeName} where ${JSON.stringify(where)} does not exist`);
    }
  });
  return {
    node: mapAny(results, (result)=>result.node),
    commit: reduceAny(results, (retval, result)=>retval.concat(result.commit), [])
  };
}
