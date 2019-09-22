import { TypeList, InputList, EnumList } from '../interfaces';

import getInputs from './inputs';
import getEnums from './enums';
import { getTypes, getQueryType, getMutationType } from './types';

export default class {
  types: TypeList = {
    Query: {
      _database: {
        type: "_Database!"
      }
    },
    Mutation: {
      _saveDatabase: {
        type: "_DatabaseAction"
      },
      _dropDatabase: {
        type: "_DatabaseAction"
      }
    },
    _Database: {
      size: {
        type: "Float"
      }
    },
    _DatabaseAction: {
      elapsed: {
        type: "Float"
      }
    },
    PageInfo: {
      hasNextPage: {
        type: "Boolean!"
      },
      hasPreviousPage: {
        type: "Boolean!"
      },
      startCursor: {
        type: "String"
      },
      endCursor: {
        type: "String"
      }
    }
  };
  inputs: InputList = {};
  enums: EnumList = {};
  constructor(datamodel: TypeList) {
    Object.keys(datamodel).forEach((typeName) => {
      // Add managed types to datamodel
      datamodel[typeName] = {
        uuid: {
          type: "UUID!",
          unique: true,
          managed: true
        },
        createdAt: {
          type: "DateTime!",
          managed: true
        },
        updatedAt: {
          type: "DateTime!",
          managed: true
        },
        ...datamodel[typeName]
      };
      //Inputs
      this.inputs = {
        ...this.inputs,
        ...getInputs(datamodel, typeName)
      };
      //Enums
      this.enums = {
        ...this.enums,
        ...getEnums(datamodel, typeName)
      }
      //Types
      this.types.Query = {
        ...this.types.Query,
        ...getQueryType(datamodel, typeName)
      };
      this.types.Mutation = {
        ...this.types.Mutation,
        ...getMutationType(datamodel, typeName)
      }
      this.types = {
        ...this.types,
        ...getTypes(datamodel, typeName)
      };
    });
  }
}
