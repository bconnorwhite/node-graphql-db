import { TypeList } from '../../interfaces';

const orderByTypes = [
  "UUID",
  "DateTime",
  "String",
  "Email",
  "Int",
  "Boolean",
  "ID"
];

import {
  returnTypeToTypeName,
  typeNameToOrderByInput
} from '../../utils';

function OrderByInput(datamodel, typeName) {
  let type = datamodel[typeName];
  return Object.keys(type).reduce((retval, fieldName) => {
    let type = returnTypeToTypeName(datamodel[typeName][fieldName].type);
    if(orderByTypes.includes(type)) {
      retval.push(`${fieldName}_ASC`);
      retval.push(`${fieldName}_DESC`);
    }
    return retval;
  }, []);
}

export default (datamodel: TypeList, typeName: string) => {
  let enums = {};
  enums[typeNameToOrderByInput(typeName)] = OrderByInput(datamodel, typeName);
  return enums;
}
