import { Action, TypeList } from '../../interfaces';

import {
  typeNameToCreateFieldName,
  typeNameToUpdateFieldName,
  typeNameToUpdateManyFieldName,
  typeNameToUpsertFieldName,
  typeNameToDeleteFieldName,
  typeNameToDeleteManyFieldName,
  typeNameToRestoreFieldName,
  typeNameToRestoreManyFieldName,
  typeNameToFieldName,
  typeNameToPluralFieldName,
  typeNameToHistoryFieldName,
  typeNameToPluralHistoryFieldName,
  typeNameToConnectionFieldName,
  typeNameToWhereUniqueInput,
  typeNameToWhereInput,
  typeNameToOrderByInput,
  typeNameToConnectionTypeName,
  typeNameToEdgeTypeName,
  typeNameToAggregateTypeName,
  typeNameToBatchTypeName,
  returnTypeList,
  returnTypeRequire
} from '../../utils';

const AggregateType = {
  count: {
    type: returnTypeRequire("Int")
  }
}

function EdgeType(typeName) {
  return {
    node: {
      type: returnTypeRequire(typeName)
    },
    cursor: {
      type: returnTypeRequire("String")
    }
  }
}

function BatchType(typeName) {
  return {
    aggregate: {
      type: returnTypeRequire(typeNameToAggregateTypeName(typeName))
    },
    edges: {
      type: returnTypeRequire(returnTypeList(typeNameToEdgeTypeName(typeName)))
    }
  }
}

function ConnectionType(typeName) {
  return {
    aggregate: {
      type: returnTypeRequire(typeNameToAggregateTypeName(typeName))
    },
    edges: {
      type: returnTypeRequire(returnTypeList(typeNameToEdgeTypeName(typeName)))
    },
    pageInfo: {
      type: returnTypeRequire("PageInfo")
    }
  }
}

function Query(typeName) {
  return {
    type: typeName,
    args: {
      where: returnTypeRequire(typeNameToWhereUniqueInput(typeName)),
    },
    action: Action.get
  }
}

function QueryPlural(typeName) {
  return {
    type: returnTypeRequire(returnTypeList(typeName)),
    args: {
      where: typeNameToWhereInput(typeName),
      orderBy: typeNameToOrderByInput(typeName),
      skip: "Int",
      after: "String",
      before: "String",
      first: "Int",
      last: "Int"
    },
    action: Action.getMany
  }
}

function QueryHistory(typeName) {
  return {
    type: returnTypeList(typeName),
    args: {
      where: returnTypeRequire(returnTypeList(typeNameToWhereUniqueInput(typeName))),
    },
    action: Action.getHistory
  };
}

function QueryPluralHistory(typeName) {
  return {
    type: returnTypeRequire(returnTypeList(typeName)),
    args: {
      where: typeNameToWhereInput(typeName),
      orderBy: typeNameToOrderByInput(typeName),
      skip: "Int",
      after: "String",
      before: "String",
      first: "Int",
      last: "Int"
    },
    action: Action.getMany
  }
}

function QueryConnection(typeName) {
  return {
    type: returnTypeRequire(typeNameToConnectionTypeName(typeName)),
    args: {
      where: typeNameToWhereInput(typeName),
      orderBy: typeNameToOrderByInput(typeName),
      skip: "Int",
      after: "String",
      before: "String",
      first: "Int",
      last: "Int"
    },
    action: Action.getConnection
  }
}

function MutationCreate(typeName) {
  return {
    type: typeName,
    args: {
      data: `${typeName}CreateInput!`
    },
    action: Action.create
  }
}

function MutationUpdate(typeName) {
  return {
    type: typeName,
    args: {
      data: `${typeName}UpdateInput!`,
      where: `${typeName}WhereUniqueInput!`
    },
    action: Action.update
  }
}

function MutationUpdateMany(typeName) {
  return {
    type: `${typeName}Batch!`,
    args: {
      data: `${typeName}UpdateManyInput!`,
      where: `${typeName}WhereInput`,
      orderBy: `${typeName}OrderByInput`
    },
    action: Action.updateMany
  }
}

function MutationUpsert(typeName) {
  return {
    type: typeName,
    args: {
      where: `${typeName}WhereUniqueInput!`,
      update: `${typeName}UpdateInput!`,
      create: `${typeName}CreateInput!`
    },
    action: Action.upsert
  }
}

function MutationDelete(typeName) {
  return {
    type: typeName,
    args: {
      where: `${typeName}WhereUniqueInput!`
    },
    action: Action.delete
  }
}

function MutationDeleteMany(typeName) {
  return {
    type: `${typeName}Batch!`,
    args: {
      where: `${typeName}WhereInput`,
      orderBy: `${typeName}OrderByInput`
    },
    action: Action.deleteMany
  }
}

function MutationRestore(typeName) {
  return {
    type: typeName,
    args: {
      where: `${typeName}WhereUniqueInput!`
    },
    action: Action.restore
  }
}

function MutationRestoreMany(typeName) {
  return {
    type: `${typeName}Batch!`,
    args: {
      where: `${typeName}WhereInput`,
      orderBy: `${typeName}OrderByInput`
    },
    action: Action.restoreMany
  }
}

function getTypes(datamodel: TypeList, typeName: string) {
  let types = {};
  types[typeName] = datamodel[typeName];
  types[typeNameToAggregateTypeName(typeName)] = AggregateType;
  types[typeNameToEdgeTypeName(typeName)] = EdgeType(typeName);
  types[typeNameToBatchTypeName(typeName)] = BatchType(typeName);
  types[typeNameToConnectionTypeName(typeName)] = ConnectionType(typeName);
  return types;
}

function getQueryType(datamodel: TypeList, typeName: string) {
  let queryType = {};
  queryType[typeNameToFieldName(typeName)] = Query(typeName);
  queryType[typeNameToPluralFieldName(typeName)] = QueryPlural(typeName);
  queryType[typeNameToHistoryFieldName(typeName)] = QueryHistory(typeName);
  queryType[typeNameToHistoryFieldName(typeName)] = QueryPluralHistory(typeName);
  queryType[typeNameToConnectionFieldName(typeName)] = QueryConnection(typeName);
  return queryType;
}

function getMutationType(datamodel: TypeList, typeName: string) {
  let mutationType = {};
  mutationType[typeNameToCreateFieldName(typeName)] = MutationCreate(typeName);
  mutationType[typeNameToUpdateFieldName(typeName)] = MutationUpdate(typeName);
  mutationType[typeNameToUpdateManyFieldName(typeName)] = MutationUpdateMany(typeName);
  mutationType[typeNameToUpsertFieldName(typeName)] = MutationUpsert(typeName);
  mutationType[typeNameToDeleteFieldName(typeName)] = MutationDelete(typeName);
  mutationType[typeNameToDeleteManyFieldName(typeName)] = MutationDeleteMany(typeName);
  mutationType[typeNameToRestoreFieldName(typeName)] = MutationRestore(typeName);
  mutationType[typeNameToRestoreManyFieldName(typeName)] = MutationRestoreMany(typeName);
  return mutationType;
}

export {
  getTypes,
  getQueryType,
  getMutationType
}
