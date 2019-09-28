import {
  returnTypeListRequire,
  typeNameToCreateManyWithoutFieldInput,
  typeNameToCreateWithoutFieldInput,
  typeNameToWhereInput
} from 'utils';

import addCreateWithoutFieldInput from './createWithoutFieldInput';

import { ModelList } from '../';
import { InputList } from './';

export default (datamodel: ModelList, typeName: string, withoutFieldName: string, inputs: InputList) => {
  if(inputs[typeNameToCreateManyWithoutFieldInput(typeName, withoutFieldName)] == undefined) {
    inputs[typeNameToCreateManyWithoutFieldInput(typeName, withoutFieldName)] = {
      create: {
        returnType: returnTypeListRequire(typeNameToCreateWithoutFieldInput(typeName, withoutFieldName))
      },
      connect: {
        returnType: returnTypeListRequire(typeNameToWhereInput(typeName))
      }
    }
  }
  inputs = addCreateWithoutFieldInput(datamodel, typeName, withoutFieldName, inputs);
  return inputs;
};
