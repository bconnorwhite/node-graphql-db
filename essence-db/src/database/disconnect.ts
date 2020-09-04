import { mapAny, reduceAny } from '@bconnorwhite/for-any';

import { returnTypeIsRequired } from 'essence-tools';

import Database, { Node, TypeFieldValue, fieldValueIsNodeArray } from './';

export function disconnectNodes(database: Database, typeName: string, nodes: TypeFieldValue, parent: Node, inverseFieldName: string) {
  let results = mapAny(nodes, (node) => {
    let fieldModel = database.getFieldModel(typeName, inverseFieldName);
    let fieldValue = node[inverseFieldName];
    if(fieldValueIsNodeArray(fieldValue)) {
      node[inverseFieldName] = fieldValue.filter((item: Node) => item !== parent);
    } else if(returnTypeIsRequired(fieldModel.type)) {
      throw new Error(`Cannot disconnect field ${inverseFieldName} on type ${typeName} - field is required.`);
    } else {
      node[inverseFieldName] = null;
    }
    return {
      node,
      commit: {
        node: node,
        typeName: typeName,
        operation: {
          op: "replace",
          path: `${inverseFieldName}`,
          value: node[inverseFieldName]
        }
      }
    }
  });
  return {
    node: mapAny(results, (result)=>result.node),
    commit: reduceAny(results, (retval, result)=>retval.concat(result.commit), [])
  };
}

export default function disconnect(database: Database, typeName: string, where: (object | object[]), parent: Node, inverseFieldName: string) {
  let results = mapAny(where, (whereInstance) => {
    let node = database.whereUnique(typeName, whereInstance);
    if(node) {
      return disconnectNodes(database, typeName, node, parent, inverseFieldName);
    } else {
      throw new Error(`Cannot disconnect ${inverseFieldName}, type ${typeName} where ${where} does not exist`);
    }
  });
  return {
    node: mapAny(results, (result)=>result.node),
    commit: reduceAny(results, (retval, result)=>retval.concat(result.commit), [])
  };
}
