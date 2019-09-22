import {
  returnTypeToTypeName,
  typeNameToWhereUniqueInput,
  typeNameToCreateWithoutInput,
  typeNameToCreateOneWithoutInput,
} from '../../utils';

export default (datamodel, typeName) => {
  let type = datamodel[typeName];
  return Object.keys(type).reduce((retval, fieldName) => {
    if(type[fieldName].managed !== true) {
      let fieldType = returnTypeToTypeName(type[fieldName].type);
      if(datamodel[fieldType]) { //type
        this.inputs[typeNameToCreateWithoutInput(fieldType, typeName)] = {
          test: { //TODO
            type: "Boolean"
          }
        }
        this.inputs[typeNameToCreateOneWithoutInput(fieldType, typeName)] = {
          create: {
            type: typeNameToCreateWithoutInput(fieldType, typeName)
          },
          connect: {
            type: typeNameToWhereUniqueInput(fieldType)
          }
        }
        retval[fieldName] = {
          type: typeNameToCreateOneWithoutInput(fieldType, typeName)
        }
      } else { //field
        retval[fieldName] = type[fieldName];
      }
    }
    return retval;
  }, {});
}
