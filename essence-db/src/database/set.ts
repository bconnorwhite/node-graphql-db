import { mapAny, reduceAny } from '@bconnorwhite/for-any';

import Database, { Node, fieldValueIsTypeFieldValue } from './';
import connect from './connect';
import { disconnectNodes } from './disconnect';


export default function set(database: Database, typeName: string, where: (object | object[]), parent: Node, fieldName: string, inverseFieldName: string) {
  let fieldValue = parent[fieldName];
  if(fieldValueIsTypeFieldValue(fieldValue)) {
    let nodes = database.whereUniqueByNodeList(fieldValue, where);
    let disconnectResults = disconnectNodes(database, typeName, nodes, parent, inverseFieldName)
    let disconnectCommit = reduceAny(disconnectResults.commit, (retval, result)=>retval.concat(result.commit), []);
    let connectResults = connect(database, typeName, where, parent, inverseFieldName);
    return {
      node: mapAny(connectResults, (result)=>result.node),
      commit: reduceAny(connectResults, (retval, result)=>retval.concat(result.commit), disconnectCommit)
    }
  }
}
