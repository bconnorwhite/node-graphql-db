import {
  returnTypeToTypeName,
  typeNameToWhereUniqueInput
} from 'utils';

import { ModelList } from '../';
import { InputList } from './';

export default (datamodel: ModelList, typeName: string, inputs: InputList) => {
  let model = datamodel[typeName];
  inputs[typeNameToWhereUniqueInput(typeName)] = Object.keys(model).filter((fieldName) => model[fieldName].unique).reduce((retval, fieldName) => {
    retval[fieldName] = {
      returnType: returnTypeToTypeName(model[fieldName].type)
    };
    return retval;
  }, {});
  return inputs;
}
