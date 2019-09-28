import {
  returnTypeToTypeName,
  typeNameToWhereInput,
  returnTypeListRequire,
  UUIDTypeName,
  IDTypeName,
  StringTypeName,
  EmailTypeName,
  DateTimeTypeName,
  IntTypeName,
  BooleanTypeName
} from 'utils';

import { ModelList } from '../';
import { InputList } from './';

const stringTypes = [
  UUIDTypeName,
  IDTypeName,
  StringTypeName,
  EmailTypeName
];

const numTypes = [
  DateTimeTypeName,
  IntTypeName
].concat(stringTypes);

const boolTypes = [
  BooleanTypeName
].concat(numTypes);

export default (datamodel: ModelList, typeName: string, inputs: InputList) => {
  let type = datamodel[typeName];
  inputs[typeNameToWhereInput(typeName)] = Object.keys(type).reduce((retval, fieldName) => {
    let fieldTypeName = returnTypeToTypeName(type[fieldName].type);
    if(boolTypes.includes(fieldTypeName)) {
      retval[fieldName] = {
        returnType: fieldTypeName,
        filter: (node: object, value: boolean | number | string) => node[fieldName] == value
      };
      retval[`${fieldName}_not`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: boolean | number | string) => node[fieldName] !== value
      };
    } else if(datamodel[fieldTypeName]) {
      retval[`${fieldName}`] = {
        returnType: typeNameToWhereInput(fieldTypeName)
      }
    }
    if(numTypes.includes(fieldTypeName)) {
      retval[`${fieldName}_in`] = {
        returnType: returnTypeListRequire(fieldTypeName),
        filter: (node: object, value: (string | number)[]) => value.includes(node[fieldName])
      };
      retval[`${fieldName}_not_in`] = {
        returnType: returnTypeListRequire(fieldTypeName),
        filter: (node: object, value: (string | number)[]) => !value.includes(node[fieldName])
      };
      retval[`${fieldName}_lt`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: number | string) => node[fieldName] < value
      };
      retval[`${fieldName}_lte`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: number | string) => node[fieldName] <= value
      };
      retval[`${fieldName}_gt`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: number | string) => node[fieldName] > value
      };
      retval[`${fieldName}_gte`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: number | string) => node[fieldName] >= value
      };
    }
    if(stringTypes.includes(fieldTypeName)) {
      retval[`${fieldName}_contains`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: string) => value.includes(node[fieldName])
      };
      retval[`${fieldName}_not_contains`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: string) => !value.includes(node[fieldName])
      };
      retval[`${fieldName}_starts_with`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: string) => node[fieldName].starts_with(value)
      };
      retval[`${fieldName}_not_starts_with`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: string) => !node[fieldName].starts_with(value)
      };
      retval[`${fieldName}_ends_with`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: string) => node[fieldName].ends_with(value)
      };
      retval[`${fieldName}_not_ends_with`] = {
        returnType: fieldTypeName,
        filter: (node: object, value: string) => !node[fieldName].ends_with(value)
      };
    }
    return retval;
  }, {
    AND: {
      returnType: returnTypeListRequire(typeNameToWhereInput(typeName))
    },
    OR: {
      returnType: returnTypeListRequire(typeNameToWhereInput(typeName))
    },
    NOT: {
      returnType: returnTypeListRequire(typeNameToWhereInput(typeName))
    }
  });
  return inputs;
}
