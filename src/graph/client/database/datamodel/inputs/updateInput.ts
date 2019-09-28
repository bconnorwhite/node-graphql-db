import {
  returnTypeToTypeName,
  returnTypeUnrequire,
  typeNameToUpdateInput
} from 'utils';

import { ModelList } from '../';
import { InputList } from './';

export default (datamodel: ModelList, typeName: string, inputs: InputList) => {
  let model = datamodel[typeName];
  inputs[typeNameToUpdateInput(typeName)] = Object.keys(model).reduce((retval, fieldName) => {
    if(model[fieldName].managed !== true) {
      let fieldTypeName = returnTypeToTypeName(model[fieldName].type);
      if(model) { //TODO
        retval[fieldName] = {
          returnType: "Boolean"
        }
      } else { //field
        retval[fieldName] = {
          returnType: returnTypeUnrequire(model[fieldName].type)
        };
      }
    }
    return retval;
  }, {});
  return inputs;
}
