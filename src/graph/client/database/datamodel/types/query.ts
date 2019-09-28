import {
  typeNameToFieldName,
  typeNameToPluralFieldName,
  typeNameToHistoryFieldName,
  typeNameToConnectionFieldName,
  typeNameToWhereUniqueInput,
  typeNameToWhereInput,
  typeNameToOrderByInput,
  typeNameToConnectionTypeName,
  returnTypeList,
  returnTypeRequire
} from 'utils';

import { ModelList } from '../';
import { Action } from './';

function Query(typeName: string) {
  return {
    returnType: typeName,
    args: {
      where: returnTypeRequire(typeNameToWhereUniqueInput(typeName)),
    },
    action: Action.get
  }
}

function QueryPlural(typeName: string) {
  return {
    returnType: returnTypeRequire(returnTypeList(typeName)),
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

function QueryHistory(typeName: string) {
  return {
    returnType: returnTypeList(typeName),
    args: {
      where: returnTypeRequire(returnTypeList(typeNameToWhereUniqueInput(typeName))),
    },
    action: Action.getHistory
  };
}

function QueryPluralHistory(typeName: string) {
  return {
    returnType: returnTypeRequire(returnTypeList(typeName)),
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

function QueryConnection(typeName: string) {
  return {
    returnType: returnTypeRequire(typeNameToConnectionTypeName(typeName)),
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

export default (datamodel: ModelList) => {
  let queryType = {};
  Object.keys(datamodel).forEach((typeName) => {
    queryType[typeNameToFieldName(typeName)] = Query(typeName);
    queryType[typeNameToPluralFieldName(typeName)] = QueryPlural(typeName);
    queryType[typeNameToHistoryFieldName(typeName)] = QueryHistory(typeName);
    queryType[typeNameToHistoryFieldName(typeName)] = QueryPluralHistory(typeName);
    queryType[typeNameToConnectionFieldName(typeName)] = QueryConnection(typeName);
  });
  return queryType;
}
