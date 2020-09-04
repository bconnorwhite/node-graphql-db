import { mapAny, reduceAny } from '@bconnorwhite/for-any';

import Database, { Node, TypeFieldValue, fieldValueIsNode } from './';
import { disconnectNodes } from './disconnect';

export default function destroy(database: Database, typeName: string, nodes: TypeFieldValue) {
  let destroyed = Object.assign({}, nodes);
  let results = mapAny(nodes, (node) => {
    let commit = [];
    for(let fieldName of Object.keys(node)) {
      let fieldModel = database.getFieldModel(typeName, fieldName);
      let parent = node[fieldName];
      if(fieldValueIsNode(parent) && fieldModel.inverse) {
        let disconnectResults = disconnectNodes(database, typeName, node, parent, fieldModel.inverse);
        if(disconnectResults) {
          commit = commit.concat(disconnectResults.commit);
        }
      }
    }
    commit.unshift({
      node: node,
      typeName: typeName,
      operation: {
        op: "remove",
        path: "",
        value: node
      }
    });
    return {
      node: node,
      commit: commit
    };
  });
  return {
    node: destroyed,
    commit: reduceAny(results, (retval, result)=>retval.concat(result.commit), [])
  }
}
