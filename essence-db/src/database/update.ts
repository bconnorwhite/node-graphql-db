import { mapAny, reduceAny } from '@bconnorwhite/for-any';

import { returnTypeToTypeName } from 'essence-tools';

import Database, { Node, fieldValueIsTypeFieldValue } from './';
import create from './create';
import connect from './connect';
import disconnect from './disconnect';
import set from './set';
import { Commit } from './commit';

export default function update(database: Database, typeName: string, currentNode: (Node | Node[]), data: object) {
  let results = mapAny(currentNode, (currentNode) => {
    //data = cleanData(data, database.getTypeModel(typeName));
    let node = Object.assign({}, currentNode);
    let commit: Commit = [];
    for(let fieldName of Object.keys(data)) {
      let fieldModel = database.getFieldModel(typeName, fieldName);
      let field = data[fieldName];
      let fieldValue = node[fieldName];
      if(!fieldValueIsTypeFieldValue(fieldValue)) {
        if(fieldModel.unique && database.whereUnique(typeName, { [fieldName]: field })) {
          throw new Error(`${typeName} with unique field ${fieldName}=${field} already exists.`);
        }
        node[fieldName] = field;
      } else {
        let fieldTypeName = returnTypeToTypeName(fieldModel.type);
        if(field.create) {
          let results = create(database, fieldTypeName, data, node, fieldModel.inverse);
          if(results) {
            node[fieldName] = results.node;
            commit = commit.concat(results.commit);
          } else {
            return;
          }
        } else if(field.connect) {
          let results = connect(database, fieldTypeName, field.connect, node, fieldModel.inverse);
          if(results) {
            node[fieldName] = results.node;
            commit = commit.concat(results.commit);
          } else {
            return;
          }
        } else if(field.set) {
          let results = set(database, fieldTypeName, field.set, node, fieldName, fieldModel.inverse);
          if(results) {
            node[fieldName] = results.node;
            commit = commit.concat(results.commit);
          } else {
            return;
          }
        } else if(field.disconnect) {
          let results = disconnect(database, fieldTypeName, field.disconnect, node, fieldModel.inverse);
          if(results) {
            node[fieldName] = results.node;
            commit = commit.concat(results.commit);
          } else {
            return;
          }
        } else if(field.destroy) {
          throw new Error('destroy is not yet implemented');
        } else if(field.update) {
          let results = update(database, fieldTypeName, database.whereUniqueByNodeList(fieldValue, field.update.where), field.update.data);
          if(results) {
            node[fieldName] = results.node;
            commit = commit.concat(results.commit);
          } else {
            return;
          }
        } else if(field.updateMany) {
          throw new Error('updateMany is not yet implemented');
        } else if(field.destroyMany) {
          throw new Error('destroyMany is not yet implemented');
        } else if(field.upsert) {
          throw new Error('upsert is not yet implemented');
        } else if(field.inverse) {
          throw new Error('inverse is not yet implemented');
        }
      }
    }
    commit.unshift({
      node: node,
      typeName: typeName,
      operation: {
        op: "replace",
        path: "",
        value: node
      }
    });
    return {
      node: node,
      commit: commit
    }
  });
  return {
    node: mapAny(results, (result)=>result.node),
    commit: reduceAny(results, (retval, result)=>retval.concat(result.commit), [])
  };
}
