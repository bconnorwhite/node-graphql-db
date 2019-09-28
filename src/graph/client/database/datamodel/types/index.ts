import {
  typeNameToConnectionTypeName,
  typeNameToEdgeTypeName,
  typeNameToAggregateTypeName,
  typeNameToBatchTypeName,
  returnTypeList,
  returnTypeRequire,
  IntTypeName,
  StringTypeName,
  BooleanTypeName
} from 'utils';

import getQuery from './query';
import getMutation from './mutation';

import { ModelList } from '../';

export type TypeList = {
  [index: string]: Type
}

export type Type = {
  [index: string]: TypeField
}

export type TypeField = {
  returnType: string,
  args?: Args,
  action?: Action,
  isBaseType?: Boolean
}

export type Args = {
  [index: string]: string
}

export enum Action {
  get,
  getHistory,
  getMany,
  getManyHistory,
  getConnection,
  create,
  createMany,
  update,
  updateMany,
  upsert,
  delete,
  deleteMany,
  restore,
  restoreMany
}

const AggregateType = {
  count: {
    returnType: returnTypeRequire(IntTypeName)
  }
}

function EdgeType(typeName: string) {
  return {
    node: {
      returnType: returnTypeRequire(typeName)
    },
    cursor: {
      returnType: returnTypeRequire(StringTypeName)
    }
  }
}

const PageInfo = {
  hasNextPage: {
    returnType: returnTypeRequire(BooleanTypeName)
  },
  hasPreviousPage: {
    returnType: returnTypeRequire(BooleanTypeName)
  },
  startCursor: {
    returnType: StringTypeName
  },
  endCursor: {
    returnType: StringTypeName
  }
}

function BatchType(typeName: string) {
  return {
    aggregate: {
      returnType: returnTypeRequire(typeNameToAggregateTypeName(typeName))
    },
    edges: {
      returnType: returnTypeRequire(returnTypeList(typeNameToEdgeTypeName(typeName)))
    }
  }
}

function ConnectionType(typeName: string) {
  return {
    aggregate: {
      returnType: returnTypeRequire(typeNameToAggregateTypeName(typeName))
    },
    edges: {
      returnType: returnTypeRequire(returnTypeList(typeNameToEdgeTypeName(typeName)))
    },
    pageInfo: {
      returnType: returnTypeRequire("PageInfo")
    }
  }
}

export default (types: TypeList, datamodel: ModelList) => {
  types.Query = {
    ...types.Query,
    ...getQuery(datamodel)
  };
  types.Mutation = {
    ...types.Mutation,
    ...getMutation(datamodel)
  };
  types.PageInfo = PageInfo;
  Object.keys(datamodel).forEach((typeName) => {
    types[typeName] = Object.keys(datamodel[typeName]).reduce((retval, modelFieldName) => {
      let modelField = datamodel[typeName][modelFieldName];
      retval[modelFieldName] = {
        returnType: modelField.type
      };
      return retval;
    }, {});
    types[typeNameToAggregateTypeName(typeName)] = AggregateType;
    types[typeNameToEdgeTypeName(typeName)] = EdgeType(typeName);
    types[typeNameToBatchTypeName(typeName)] = BatchType(typeName);
    types[typeNameToConnectionTypeName(typeName)] = ConnectionType(typeName);
  });
  return types;
}
