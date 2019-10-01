import { mapAny, forEachAny } from '@bconnorwhite/for-any';

import {
  returnTypeToTypeName,
  returnTypeIsList,
  returnTypeIsRequired,
  returnTypeInnerIsRequried,
} from 'utils';

import Database, { Node, TypeFieldValue } from './';
import { Commit } from './commit';
import disconnect from './disconnect';

export default function connect(database: Database, typeName: string, where: (object | object[]), parent: Node, fieldName: string) {
  let fieldModel = database.getFieldModel(typeName, fieldName);
  return mapAny(where, (whereInstance) => {
    let node = database.whereUnique(typeName, whereInstance);
    if(node) {
      let commit = [];
      if(returnTypeIsList(fieldModel.type)) {
        node[fieldName].push(parent);
      } else {
        if(node[fieldName] && fieldModel.inverse) {
          let results = disconnect(database, returnTypeToTypeName(fieldModel.type), { uuid: node[fieldName].uuid }, node, fieldModel.inverse);
          forEachAny(results, (result)=> commit = commit.concat(result.commit));
        }
        node[fieldName] = parent;
      }
      commit.unshift({
        node: node,
        typeName: typeName,
        operation: {
          op: "replace",
          path: `/${fieldName}`,
          value: parent
        }
      });
      return {
        node,
        commit
      };
    } else {
      throw new Error(`Cannot connect field ${fieldName}, type ${typeName} where ${JSON.stringify(where)} does not exist`);
    }
  });
}

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
