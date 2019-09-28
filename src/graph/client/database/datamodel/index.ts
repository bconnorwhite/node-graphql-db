import { UUIDTypeName, DateTimeTypeName, FloatTypeName, returnTypeRequire } from 'utils';

import addTypes from './types';
import addInputs from './inputs';
import addEnums from './enums';

import { TypeList } from './types';
import { InputList } from './inputs';
import { EnumList } from './enums';

export type ModelList = {
  [index: string]: Model
}

export type Model = {
  [index: string]: ModelField
}

export type ModelField = {
  type: string,
  unique?: boolean,
  managed?: boolean,
  inverse?: string
}

function addManagedFields(model: Model) {
  model.uuid = {
    type: returnTypeRequire(UUIDTypeName),
    unique: true,
    managed: true
  };
  model.createdAt = {
    type: returnTypeRequire(DateTimeTypeName),
    managed: true
  };
  model.updatedAt = {
    type: returnTypeRequire(DateTimeTypeName),
    managed: true
  }
  return model;
}

export default class {
  types: TypeList = {
    Query: {
      _database: {
        returnType: "_Database!"
      }
    },
    Mutation: {
      _saveDatabase: {
        returnType: "_DatabaseAction"
      },
      _dropDatabase: {
        returnType: "_DatabaseAction"
      }
    },
    _Database: {
      size: {
        returnType: FloatTypeName
      }
    },
    _DatabaseAction: {
      elapsed: {
        returnType: FloatTypeName
      }
    }
  };
  inputs: InputList = {};
  enums: EnumList = {};
  baseTypeNames: string[] = [];
  constructor(datamodel: ModelList) {
    Object.keys(datamodel).forEach((typeName) => {
      datamodel[typeName] = addManagedFields(datamodel[typeName]);
      this.baseTypeNames.push(typeName);
    });
    this.inputs = addInputs(this.inputs, datamodel);
    this.enums = addEnums(this.enums, datamodel);
    this.types = addTypes(this.types, datamodel);
  }
}
