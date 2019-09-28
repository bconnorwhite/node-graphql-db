import {
  returnTypeToTypeName,
  returnTypeIsList,
  typeNameToCreateInput,
  typeNameToCreateOneWithoutFieldInput,
  typeNameToCreateManyWithoutFieldInput
} from 'utils';

import addCreateOneWithoutFieldInput from './createOneWithoutFieldInput';
import addCreateManyWithoutFieldInput from './createManyWithoutFieldInput';

import { ModelList } from '../';
import { InputList } from './';

export default (datamodel: ModelList, typeName: string, inputs: InputList) => {
  let model = datamodel[typeName];
  inputs[typeNameToCreateInput(typeName)] = Object.keys(model).reduce((retval, fieldName) => {
    if(model[fieldName].managed !== true) {
      let field = model[fieldName];
      let fieldTypeName = returnTypeToTypeName(field.type);
      if(field.inverse) { //type
        if(!returnTypeIsList(fieldTypeName)) {
          retval[fieldName] = {
            returnType: typeNameToCreateOneWithoutFieldInput(fieldTypeName, field.inverse)
          }
          inputs = addCreateOneWithoutFieldInput(datamodel, fieldTypeName, field.inverse, inputs);
        } else {
          retval[fieldName] = {
            returnType: typeNameToCreateManyWithoutFieldInput(fieldTypeName, field.inverse)
          }
          inputs = addCreateManyWithoutFieldInput(datamodel, fieldTypeName, field.inverse, inputs);
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
