import {
  typeNameToCreateWithoutFieldInput
} from '../../../../utils';

import { ModelList } from '../';
import { InputList } from './';

export default (datamodel: ModelList, typeName: string, withoutFieldName: string, inputs: InputList) => {
  let model = datamodel[typeName];
  if(inputs[typeNameToCreateWithoutFieldInput(typeName, withoutFieldName)] == undefined) {
    inputs[typeNameToCreateWithoutFieldInput(typeName, withoutFieldName)] = Object.keys(model).reduce((retval, fieldName) => {
      if(model[fieldName].managed !== true && fieldName !== withoutFieldName) {
        retval[fieldName] = {
          returnType: model[fieldName].type,
          model: model[fieldName]
        }
      }
      return retval;
    }, {});
  }
  return inputs;
};
