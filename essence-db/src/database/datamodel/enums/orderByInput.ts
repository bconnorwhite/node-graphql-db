import { ModelList } from "../";
import {
  returnTypeToTypeName
} from 'essence-tools';

const orderByTypes = [
  "UUID",
  "DateTime",
  "String",
  "Email",
  "Int",
  "Boolean",
  "ID"
];

export default (datamodel: ModelList, typeName: string) => {
  let model = datamodel[typeName];
  return Object.keys(model).reduce((retval, fieldName) => {
    let model = returnTypeToTypeName(datamodel[typeName][fieldName].type);
    if(orderByTypes.includes(model)) {
      retval.push(`${fieldName}_ASC`);
      retval.push(`${fieldName}_DESC`);
    }
    return retval;
  }, []);
}
