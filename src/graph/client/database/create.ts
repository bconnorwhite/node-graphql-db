import {
  mapAny,
  forEachAny
} from '@bconnorwhite/for-any';

import {
  returnTypeToTypeName,
  returnTypeIsList,
  returnTypeIsRequired
} from 'utils';

import Database from './';
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

export default function create(database: Database, typeName: string, data: object) { //don't pass this in, just return up
  data = cleanData(data, database.getTypeModel(typeName));
  let node = database.generateNode(typeName);
  let commit = [];
  for(let fieldName of Object.keys(data)) {
    let fieldModel = database.getFieldModel(typeName, fieldName);
    let field = data[fieldName];
    if(typeof field !== "object") {
      if(fieldModel.unique && database.whereUnique(typeName, { [fieldName]: field })) {
        throw new Error(`${typeName} with unique field ${fieldName}=${field} already exists.`);
      }
      node[fieldName] = field;
    } else {
      let fieldTypeName = returnTypeToTypeName(fieldModel.type);
      if(field.create) {
        if(fieldModel.inverse) {
          let inverseReturnType = database.getFieldModel(fieldTypeName, fieldModel.inverse).type;
          field.create = mapAny(field.create, (item) => ({
            ...item,
            [fieldModel.inverse]: {
              inverse: returnTypeIsList(inverseReturnType) ? [node] : node
            }
          }));
        }
        let results = mapAny(field.create, (data) => create(database, fieldTypeName, data));
        node[fieldName] = mapAny(results, (result) => result.node);
        forEachAny(results, (result) => commit = commit.concat(result.commit));
      } else if(field.connect) {
        let results = connect(database, fieldTypeName, field.connect, node, fieldModel.inverse);
        if(results) {
          node[fieldName] = mapAny(results, (result) => result.node);
          forEachAny(results, (result) => commit = commit.concat(result.commit));
        } else if(returnTypeIsRequired(fieldModel.type)) {
          return;
        }
      } else if(field.inverse) {
        node[fieldName] = field.inverse;
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
}
