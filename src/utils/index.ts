

function plural(string: string) {
  return `${string}s`;
}

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
  return plural(typeNameToFieldName(typeName));
}

function typeNameToHistoryFieldName(typeName: string) {
  return `${typeNameToFieldName(typeName)}History`;
}

function typeNameToPluralHistoryFieldName(typeName: string) {
  return `${plural(typeNameToFieldName(typeName))}History`;
}

function typeNameToConnectionFieldName(typeName: string) {
  return `${typeNameToFieldName(typeName)}Connection`;
}

function typeNameToCreateFieldName(typeName: string) {
  return `create${typeName}`;
}

function typeNameToUpdateFieldName(typeName: string) {
  return `update${typeName}`;
}

function typeNameToUpdateManyFieldName(typeName: string) {
  return `updateMany${plural(typeName)}`;
}

function typeNameToUpsertFieldName(typeName: string) {
  return `upsert${typeName}`;
}

function typeNameToDeleteFieldName(typeName: string) {
  return `delete${typeName}`;
}

function typeNameToDeleteManyFieldName(typeName: string) {
  return `deleteMany${plural(typeName)}`;
}

function typeNameToRestoreFieldName(typeName: string) {
  return `delete${typeName}`;
}

function typeNameToRestoreManyFieldName(typeName: string) {
  return `deleteMany${plural(typeName)}`;
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

function typeNameToCreateWithoutInput(typeName: string, withoutTypeName: string) {
  return `${typeName}CreateWithout${withoutTypeName}Input`;
}

function typeNameToCreateOneWithoutInput(typeName: string, withoutTypeName: string) {
  return `${typeName}CreateOneWithout${withoutTypeName}Input`;
}

function typeNameToUpdateInput(typeName: string) {
  return `${typeName}UpdateInput`;
}

function typeNameToUpdateManyInput(typeName: string) {
  return `${typeName}UpdateManyInput`;
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
  return returnType.includes("[") && returnType.includes("]");
}

function returnTypeList(returnType: string) {
  return `[${returnType}]`;
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

export {
  typeNameToFieldName,
  typeNameToPluralFieldName,
  typeNameToHistoryFieldName,
  typeNameToPluralHistoryFieldName,
  typeNameToConnectionFieldName,
  typeNameToCreateFieldName,
  typeNameToUpdateFieldName,
  typeNameToUpdateManyFieldName,
  typeNameToUpsertFieldName,
  typeNameToDeleteFieldName,
  typeNameToDeleteManyFieldName,
  typeNameToRestoreFieldName,
  typeNameToRestoreManyFieldName,
  typeNameToWhereUniqueInput,
  typeNameToWhereInput,
  typeNameToCreateInput,
  typeNameToCreateWithoutInput,
  typeNameToCreateOneWithoutInput,
  typeNameToUpdateInput,
  typeNameToUpdateManyInput,
  typeNameToOrderByInput,
  typeNameToConnectionTypeName,
  typeNameToEdgeTypeName,
  typeNameToAggregateTypeName,
  typeNameToBatchTypeName,
  returnTypeToTypeName,
  returnTypeUnrequire,
  returnTypeRequire,
  returnTypeList,
  returnTypeIsList
}
