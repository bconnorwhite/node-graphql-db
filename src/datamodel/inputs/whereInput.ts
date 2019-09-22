import {
  returnTypeToTypeName,
  typeNameToWhereInput
} from '../../utils';

const stringTypes = [
  "UUID",
  "ID",
  "String",
  "Email"
];

const numTypes = [
  "DateTime",
  "Int"
];

export default (datamodel, typeName) => {
  let type = datamodel[typeName];
  Object.keys(type).reduce((retval, fieldName) => {
    let fieldTypeName = returnTypeToTypeName(type[fieldName].type);
    if(fieldTypeName == "Boolean" || numTypes.includes(fieldTypeName) || stringTypes.includes(fieldTypeName)) {
      retval[fieldName] = {
        type: fieldTypeName,
        filter: (node, value) => node[fieldName] == value
      };
      retval[`${fieldName}_not`] = {
        type: fieldTypeName,
        filter: (node, value) => node[fieldName] !== value
      };
    }
    if(numTypes.includes(type) || stringTypes.includes(type)) {
      retval[`${fieldName}_in`] = {
        type: `[${fieldTypeName}!]`,
        filter: (node, value) => value.includes(node[fieldName])
      };
      retval[`${fieldName}_not_in`] = {
        type: `[${fieldTypeName}!]`,
        filter: (node, value) => !value.includes(node[fieldName])
      };
      retval[`${fieldName}_lt`] = {
        type: fieldTypeName,
        filter: (node, value) => node[fieldName] < value
      };
      retval[`${fieldName}_lte`] = {
        type: fieldTypeName,
        filter: (node, value) => node[fieldName] <= value
      };
      retval[`${fieldName}_gt`] = {
        type: fieldTypeName,
        filter: (node, value) => node[fieldName] > value
      };
      retval[`${fieldName}_gte`] = {
        type: fieldTypeName,
        filter: (node, value) => node[fieldName] >= value
      };
    } else if(stringTypes.includes(fieldTypeName)) {
      retval[`${fieldName}_contains`] = {
        type: fieldTypeName,
        filter: (node, value: string) => value.includes(node[fieldName])
      };
      retval[`${fieldName}_not_contains`] = {
        type: fieldTypeName,
        filter: (node, value: string) => !value.includes(node[fieldName])
      };
      retval[`${fieldName}_starts_with`] = {
        type: fieldTypeName,
        filter: (fieldName) => (node, value: string) => node[fieldName].starts_with(value)
      };
      retval[`${fieldName}_not_starts_with`] = {
        type: fieldTypeName,
        filter: (node, value: string) => !node[fieldName].starts_with(value)
      };
      retval[`${fieldName}_ends_with`] = {
        type: fieldTypeName,
        filter: (node, value: string) => node[fieldName].ends_with(value)
      };
      retval[`${fieldName}_not_ends_with`] = {
        type: fieldTypeName,
        filter: (node, value: string) => !node[fieldName].ends_with(value)
      };
    }
    if(type) {
      retval[`${fieldName}`] = {
        type: typeNameToWhereInput(fieldTypeName)
      }
    }
    return retval;
  }, {
    AND: {
      type: `[${typeNameToWhereInput(typeName)}!]`
    },
    OR: {
      type: `[${typeNameToWhereInput(typeName)}!]`
    },
    NOT: {
      type: `[${typeNameToWhereInput(typeName)}!]`
    }
  });
}
