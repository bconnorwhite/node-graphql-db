import {
  returnTypeToTypeName,
  returnTypeIsList,
  returnTypeIsRequired,
  returnTypeInnerIsRequried,
} from 'utils';

import Database, { Node, TypeFieldValue } from './';
import { Commit } from './commit';

export default function create(database: Database, typeName: string, data: object, commit: Commit=[]) {
  let node = database.generateNode(typeName);
  for(let fieldName of Object.keys(data)) {
    let field = data[fieldName];
    if(typeof field !== "object") {
      node[fieldName] = field;
    } else {
      let fieldModel = database.datamodel[typeName][fieldName];
      let fieldTypeName = returnTypeToTypeName(fieldModel.type);
      let inverse = fieldModel.inverse;
      if(field.create) {
        let fieldData = field.create;
        if(inverse) {
          let inverseReturnType = database.datamodel[fieldTypeName][inverse].type;
          if(!returnTypeIsList(inverseReturnType)) {
            fieldData[inverse] = { inverse: node };
          } else {
            fieldData[inverse] = { inverse: [node] };
          }
        }
        let result = create(database, fieldTypeName, fieldData, commit);
        if(result) {
          node[fieldName] = result.node;
          commit = commit.concat(result.commit);
        } else if(returnTypeIsRequired(fieldModel.type)) {
          return;
        }
      } else if(field.connect) {
        throw new Error("create -> connect is not yet implemented.");
        // let fieldValue: TypeFieldValue;
        // if(!returnTypeIsList(fieldModel.type)) {
        //   let fieldValueHist = database.whereUnique(fieldTypeName, field.connect);
        //   fieldValue = histToNode(fieldValueHist);
        //   if(fieldValue == null && returnTypeInnerIsRequried(fieldModel.type)) {
        //     return;
        //   }
        // } else {
        //   let fieldValueHistMatches = data[fieldName].connect.map((where: object) => database.whereUnique(fieldTypeName, where));
        //   fieldValue = fieldValueHistMatches.map((fieldNodeHist: Node[]) => histToNode(fieldNodeHist));
        //   if(fieldValue == null && returnTypeIsRequired(fieldModel.type)) {
        //     return;
        //   }
        // }
        // node[fieldName] = fieldValue; // connect node to fieldValue
        // if(fieldValue && inverse && fieldValue[inverse]) {
        //   let inverseReturnType = datamodel[fieldTypeName][inverse].type;
        //   if(!returnTypeIsList(inverseReturnType)) {
        //     if(returnTypeIsRequired(inverseReturnType)) {
        //       return;
        //     } else { // disconnect old fieldValue connection
        //       let disconnect = Object.assign({}, fieldValue[inverse]);
        //       disconnect[fieldName] = null;
        //       if(isNode(disconnect)) {
        //         let nodeDisconnect = Object.assign({}, database.data.Node[disconnect.uuid]);
        //         nodeDisconnect[fieldName] = null;
        //         if(isNode(nodeDisconnect)) {
        //           commit.push({
        //             typeName: typeName,
        //             node: nodeDisconnect
        //           });
        //           commit.push({
        //             typeName: typeName,
        //             node: disconnect
        //           });
        //         } else {
        //           return;
        //         }
        //       } else {
        //         return;
        //       }
        //       fieldValue[inverse] = node; // connect fieldValue to node
        //     }
        //   } else {
        //     if(!Array.isArray(fieldValue[inverse])) {
        //       fieldValue[inverse] = [];
        //     }
        //     fieldValue[inverse].push(node);
        //   }
        // }
      } else if(field.inverse) {
        node[fieldName] = field.inverse;
      }
    }
  }
  commit.push({
    node: node,
    typeName: typeName,
    operation: {
      op: "add",
      path: "",
      value: node
    }
  });
  return {
    node: node,
    commit: commit
  };
}
