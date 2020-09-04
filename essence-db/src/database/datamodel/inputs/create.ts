import {
  returnTypeToTypeName,
  returnTypeIsList,
  typeNameToCreateInput,
  typeNameToCreateManyInput,
  typeNameToCreateOneWithoutFieldInput,
  typeNameToCreateManyWithoutFieldInput,
  typeNameToCreateWithoutFieldInput,
  returnTypeListRequire,
  typeNameToWhereInput,
  typeNameToWhereUniqueInput
} from 'essence-tools';

import { ModelList } from '../';
import { InputList } from './';

function createOneWithoutFieldInput(datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName: string) {
  inputs[typeNameToCreateOneWithoutFieldInput(typeName, withoutFieldName)] = {
    create: {
      returnType: typeNameToCreateWithoutFieldInput(typeName, withoutFieldName)
    },
    connect: {
      returnType: typeNameToWhereUniqueInput(typeName)
    }
  };
  inputs = createInput(datamodel, typeName, inputs, withoutFieldName);
  return inputs;
};

function createManyWithoutFieldInput(datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName: string) {
  inputs[typeNameToCreateManyWithoutFieldInput(typeName, withoutFieldName)] = {
    create: {
      returnType: returnTypeListRequire(typeNameToCreateWithoutFieldInput(typeName, withoutFieldName))
    },
    connect: {
      returnType: returnTypeListRequire(typeNameToWhereInput(typeName))
    }
  }
  inputs = createInput(datamodel, typeName, inputs, withoutFieldName);
  return inputs;
};

export default function createInput(datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName?: string) {
  let model = datamodel[typeName];
  let inputName = withoutFieldName ? typeNameToCreateWithoutFieldInput(typeName, withoutFieldName) : typeNameToCreateInput(typeName);
  inputs[inputName] = Object.keys(model).reduce((retval, fieldName) => {
    if(model[fieldName].managed !== true && fieldName !== withoutFieldName) {
      let field = model[fieldName];
      let fieldTypeName = returnTypeToTypeName(field.type);
      if(datamodel[fieldTypeName]) { //type
        if(!returnTypeIsList(field.type)) {
          if(!field.inverse) {
            retval[fieldName] = {
              returnType: typeNameToCreateInput(fieldTypeName)
            }
          } else {
            let inputType = typeNameToCreateOneWithoutFieldInput(fieldTypeName, field.inverse);
            retval[fieldName] = {
              returnType: inputType
            }
            if(inputs[inputType] == undefined) {
              inputs = createOneWithoutFieldInput(datamodel, fieldTypeName, inputs, field.inverse);
            }
          }
        } else {
          if(!field.inverse) {
            retval[fieldName] = {
              type: typeNameToCreateManyInput(typeName)
            };
          } else {
            let inputType = typeNameToCreateManyWithoutFieldInput(fieldTypeName, field.inverse);
            retval[fieldName] = {
              returnType: inputType
            }
            if(inputs[inputType] == undefined) {
              inputs = createManyWithoutFieldInput(datamodel, fieldTypeName, inputs, field.inverse);
            }
          }
        }
      } else { //field
        retval[fieldName] = {
          returnType: model[fieldName].type
        }
      }
    }
    return retval;
  }, {});
  return inputs;
}
