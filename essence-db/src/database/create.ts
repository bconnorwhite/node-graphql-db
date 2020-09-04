import {
  mapAny,
  reduceAny
} from '@bconnorwhite/for-any';

import {
  returnTypeToTypeName,
  returnTypeIsList,
  returnTypeIsRequired
} from 'essence-tools';

import Database, { Node } from './';
import { Model } from './datamodel';
import connect from './connect';

function cleanData(data: object, model: Model) {
  Object.keys(model).forEach((fieldName) => {
    if(!model[fieldName].managed && data[fieldName] == undefined) {
      if(model[fieldName].default !== undefined) {
        data[fieldName] = model[fieldName].default;
      } else if(returnTypeIsList(model[fieldName].type)) {
        data[fieldName] = [];
      } else if(returnTypeIsRequired(model[fieldName].type)) {
        throw new Error(`${fieldName} is a required field`);
      }
    }
  });
  return data;
}

export default function create(database: Database, typeName: string, data: (object | object[]), parent?: Node, inverseFieldName?: string) {
  let results = mapAny(data, (data) => {
    if(parent && inverseFieldName) {
      data[inverseFieldName] = parent;
    }
    data = cleanData(data, database.getTypeModel(typeName));
    let node = database.generateNode(typeName);
    let commit = [];
    for(let fieldName of Object.keys(data)) {
      let fieldModel = database.getFieldModel(typeName, fieldName);
      let field = data[fieldName];
      if(fieldName == inverseFieldName) {
        node[fieldName] = returnTypeIsList(fieldModel.type) ? [field] : field;
      } else if(database.getTypeModel(returnTypeToTypeName(fieldModel.type))) {
        if(fieldModel.unique && database.whereUnique(typeName, { [fieldName]: field })) {
          throw new Error(`${typeName} with unique field ${fieldName}=${field} already exists.`);
        }
        node[fieldName] = field;
      } else {
        let fieldTypeName = returnTypeToTypeName(fieldModel.type);
        if(field.create) {
          let createResults = create(database, fieldTypeName, field.create, node, fieldModel.inverse);
          if(createResults) {
            node[fieldName] = createResults.node;
            commit = commit.concat(createResults.commit);
          } else if(returnTypeIsRequired(fieldModel.type)) {
            throw new Error(`${fieldName} is a required field`);
          }
        } else if(field.connect) {
          let connectResults = connect(database, fieldTypeName, field.connect, node, fieldModel.inverse);
          if(connectResults) {
            node[fieldName] = connectResults.node;
            commit = commit.concat(connectResults.commit);
          } else if(returnTypeIsRequired(fieldModel.type)) {
            throw new Error(`${fieldName} is a required field`);
          }
        } else if(returnTypeIsList(fieldModel.type) && Array.isArray(field)) {
          node[fieldName] = field;
        }
      }
    }
    commit.unshift({
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
  });
  return {
    node: mapAny(results, (result)=>result.node),
    commit: reduceAny(results, (retval, result)=>retval.concat(result.commit), [])
  };
}
