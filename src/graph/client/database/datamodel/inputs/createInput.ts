import {
  returnTypeToTypeName,
  returnTypeIsList,
  typeNameToCreateInput,
  typeNameToCreateManyInput,
  typeNameToCreateOneWithoutFieldInput,
  typeNameToCreateManyWithoutFieldInput,
  typeNameToCreateWithoutFieldInput
} from 'utils';

import addCreateOneWithoutFieldInput from './createOneWithoutFieldInput';
import addCreateManyWithoutFieldInput from './createManyWithoutFieldInput';

import { ModelList, Model } from '../';
import { InputList } from './';

export default (datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName?: string) => {
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
              inputs = addCreateOneWithoutFieldInput(datamodel, fieldTypeName, inputs, field.inverse);
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
              inputs = addCreateManyWithoutFieldInput(datamodel, fieldTypeName, inputs, field.inverse);
            }
          }
        }
      } else { //field
        retval[fieldName] = {
          returnType: model[fieldName].type,
          model: model[fieldName]
        }
      }
    }
    return retval;
  }, {});
  return inputs;
}
