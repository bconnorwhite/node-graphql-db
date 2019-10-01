import {
  returnTypeListRequire,
  typeNameToCreateManyWithoutFieldInput,
  typeNameToCreateWithoutFieldInput,
  typeNameToWhereInput
} from 'utils';

import addCreateWithoutFieldInput from './createInput';

import { ModelList } from '../';
import { InputList } from './';

export default (datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName: string) => {
  inputs[typeNameToCreateManyWithoutFieldInput(typeName, withoutFieldName)] = {
    create: {
      returnType: returnTypeListRequire(typeNameToCreateWithoutFieldInput(typeName, withoutFieldName))
    },
    connect: {
      returnType: returnTypeListRequire(typeNameToWhereInput(typeName))
    }
  }
  inputs = addCreateWithoutFieldInput(datamodel, typeName, inputs, withoutFieldName);
  return inputs;
};
