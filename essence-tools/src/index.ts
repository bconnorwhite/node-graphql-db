import Pluralize from 'pluralize';

function firstTo(char: string, string: string) {
  return char + string.slice(1);
}

function firstToLower(string: string) {
  return firstTo(string.charAt(0).toLowerCase(), string);
}

function firstToUpper(string: string) {
  return firstTo(string.charAt(0).toUpperCase(), string);
}

function typeNameToFieldName(typeName: string){
  return firstToLower(typeName);
}

function typeNameToPluralFieldName(typeName: string) {
  return Pluralize(typeNameToFieldName(typeName));
}

function typeNameToSingularTypeName(typeName: string) {
  return Pluralize.singular(typeName);
}

function typeNameIsPlural(typeName: string) {
  return Pluralize.isPlural(typeName);
}

function typeNameToHistoryFieldName(typeName: string) {
  return `${typeNameToFieldName(typeName)}History`;
}

function typeNameToPluralHistoryFieldName(typeName: string) {
  return `${Pluralize(typeNameToFieldName(typeName))}History`;
}

function typeNameToConnectionFieldName(typeName: string) {
  return `${typeNameToFieldName(typeName)}Connection`;
}

function typeNameToCreateFieldName(typeName: string) {
  return `create${typeName}`;
}

function typeNameToCreateManyFieldName(typeName: string) {
  return `createMany${Pluralize(typeName)}`;
}

function typeNameToUpdateFieldName(typeName: string) {
  return `update${typeName}`;
}

function typeNameToUpdateManyFieldName(typeName: string) {
  return `updateMany${Pluralize(typeName)}`;
}

function typeNameToUpsertFieldName(typeName: string) {
  return `upsert${typeName}`;
}

function typeNameToDestroyFieldName(typeName: string) {
  return `destroy${typeName}`;
}

function typeNameToDestroyManyFieldName(typeName: string) {
  return `destroyMany${Pluralize(typeName)}`;
}

function typeNameToRollbackFieldName(typeName: string) {
  return `rollback${typeName}`;
}

function typeNameToRollbackManyFieldName(typeName: string) {
  return `rollbackMany${Pluralize(typeName)}`;
}

function typeNameToWhereUniqueInput(typeName: string) {
  return `${typeName}WhereUniqueInput`;
}

function typeNameToWhereInput(typeName: string) {
  return `${typeName}WhereInput`;
}

function typeNameToCreateInput(typeName: string) {
  return `${typeName}CreateInput`;
}

function typeNameToCreateManyInput(typeName: string) {
  return `${typeName}CreateManyInput`;
}

function typeNameToCreateWithoutFieldInput(typeName: string, fieldName: string) {
  return `${typeName}CreateWithout${firstToUpper(fieldName)}Input`;
}

function typeNameToCreateOneWithoutFieldInput(typeName: string, fieldName: string) {
  return `${typeName}CreateOneWithout${firstToUpper(fieldName)}Input`;
}

function typeNameToCreateManyWithoutFieldInput(typeName: string, fieldName: string) {
  return `${typeName}CreateManyWithout${firstToUpper(fieldName)}Input`;
}

function typeNameToUpdateInput(typeName: string) {
  return `${typeName}UpdateInput`;
}

function typeNameToUpdateManyInput(typeName: string) {
  return `${typeName}UpdateManyInput`;
}

function typeNameToUpdateWithoutFieldInput(typeName: string, fieldName: string) {
  return `${typeName}UpdateWithout${firstToUpper(fieldName)}Input`;
}

function typeNameToUpdateOneWithoutFieldInput(typeName: string, fieldName: string) {
  return `${typeName}UpdateOneWithout${firstToUpper(fieldName)}Input`;
}

function typeNameToUpdateManyWithoutFieldInput(typeName: string, fieldName: string) {
  return `${typeName}UpdateManyWithout${firstToUpper(fieldName)}Input`;
}

function typeNameToUpdateManyWithWhereUniqueWithoutFieldInput(typeName: string, fieldName: string) {
  return `${typeName}UpdateManyWithWhereUniqueWithout${firstToUpper(fieldName)}Input`;
}

function typeNameToUpdateManyWithWhereInput(typeName: string) {
  return `${typeName}UpdateManyWithWhereInput`;
}

function typeNameToUpsertWithWhereUniqueWithoutFieldInput(typeName: string, fieldName: string) {
  return `${typeName}UpsertWithWhereUniqueWithout${firstToUpper(fieldName)}Input`;
}

function typeNameToUpsertWithoutFieldInput(typeName: string, fieldName: string) {
  return `${typeName}UpsertWithout${firstToUpper(fieldName)}Input`;
}

function typeNameToUpsertInput(typeName: string) {
  return `${typeName}UpsertInput`;
}

function typeNameToOrderByInput(typeName: string) {
  return `${typeName}OrderByInput`;
}

function typeNameToConnectionTypeName(typeName: string) {
  return `${typeName}Connection`;
}

function typeNameToEdgeTypeName(typeName: string) {
  return `${typeName}Edge`;
}

function typeNameToAggregateTypeName(typeName: string) {
  return `${typeName}Aggregate`;
}

function typeNameToBatchTypeName(typeName: string) {
  return `${typeName}Batch`;
}

const suffixes = ["Connection", "Batch"];

function returnTypeToTypeName(returnType: string) {
  let name = returnType.replace(/[!\[\]]+/g,"");
  let suffix = suffixes.find((suffix) => name.endsWith(suffix));
  return suffix ? name.substring(0, name.length - suffix.length) : name;
}

function returnTypeIsList(returnType: string) {
  let unrequire = returnTypeUnrequire(returnType);
  return unrequire.startsWith("[") && unrequire.endsWith("]");
}

function returnTypeIsRequired(returnType: string) {
  return returnType.endsWith("!");
}

function returnTypeUnlist(returnType: string) {
  let unrequire = returnTypeUnrequire(returnType);
  if(returnTypeIsList(unrequire)) {
    return unrequire.slice(1,-1);
  }
  return unrequire;
}

function returnTypeInnerIsRequried(returnType: string) {
  let inner = returnTypeUnlist(returnType);
  return returnTypeIsRequired(inner);
}

function returnTypeList(returnType: string) {
  return `[${returnType}]`;
}

function returnTypeListRequire(returnType: string) {
  return returnTypeList(returnTypeRequire(returnType));
}

function returnTypeRequire(returnType: string) {
  return `${returnType}!`
}

function returnTypeUnrequire(returnType: string) {
  if(returnType.endsWith("!")) {
    return returnType.slice(0,-1);
  }
  return returnType;
}

const UUIDTypeName = "UUID";
const IDTypeName = "ID";
const DateTimeTypeName = "DateTime";
const IntTypeName = "Int";
const StringTypeName = "String";
const BooleanTypeName = "Boolean";
const FloatTypeName = "Float";
const EmailTypeName = "Email";

export {
  typeNameToFieldName,
  typeNameToPluralFieldName,
  typeNameToSingularTypeName,
  typeNameIsPlural,
  typeNameToHistoryFieldName,
  typeNameToPluralHistoryFieldName,
  typeNameToConnectionFieldName,
  typeNameToCreateFieldName,
  typeNameToCreateManyFieldName,
  typeNameToUpdateFieldName,
  typeNameToUpdateManyFieldName,
  typeNameToUpsertFieldName,
  typeNameToDestroyFieldName,
  typeNameToDestroyManyFieldName,
  typeNameToRollbackFieldName,
  typeNameToRollbackManyFieldName,
  typeNameToWhereUniqueInput,
  typeNameToWhereInput,
  typeNameToCreateInput,
  typeNameToCreateManyInput,
  typeNameToCreateWithoutFieldInput,
  typeNameToCreateOneWithoutFieldInput,
  typeNameToCreateManyWithoutFieldInput,
  typeNameToUpdateInput,
  typeNameToUpdateManyInput,
  typeNameToUpdateWithoutFieldInput,
  typeNameToUpdateOneWithoutFieldInput,
  typeNameToUpdateManyWithoutFieldInput,
  typeNameToUpdateManyWithWhereUniqueWithoutFieldInput,
  typeNameToUpdateManyWithWhereInput,
  typeNameToUpsertWithWhereUniqueWithoutFieldInput,
  typeNameToUpsertWithoutFieldInput,
  typeNameToUpsertInput,
  typeNameToOrderByInput,
  typeNameToConnectionTypeName,
  typeNameToEdgeTypeName,
  typeNameToAggregateTypeName,
  typeNameToBatchTypeName,
  returnTypeToTypeName,
  returnTypeUnrequire,
  returnTypeRequire,
  returnTypeListRequire,
  returnTypeList,
  returnTypeIsList,
  returnTypeIsRequired,
  returnTypeUnlist,
  returnTypeInnerIsRequried,
  UUIDTypeName,
  IDTypeName,
  DateTimeTypeName,
  IntTypeName,
  StringTypeName,
  BooleanTypeName,
  FloatTypeName,
  EmailTypeName
}
