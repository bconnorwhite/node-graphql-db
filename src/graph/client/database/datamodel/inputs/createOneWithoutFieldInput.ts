import {
  typeNameToWhereUniqueInput,
  typeNameToCreateOneWithoutFieldInput,
  typeNameToCreateWithoutFieldInput
} from 'utils';

import addCreateWithoutFieldInput from './createInput';

import { ModelList } from '../';
import { InputList } from './';

export default (datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName: string) => {
  inputs[typeNameToCreateOneWithoutFieldInput(typeName, withoutFieldName)] = {
    create: {
      returnType: typeNameToCreateWithoutFieldInput(typeName, withoutFieldName)
    },
    connect: {
      returnType: typeNameToWhereUniqueInput(typeName)
    }
  };
  inputs = addCreateWithoutFieldInput(datamodel, typeName, inputs, withoutFieldName);
  return inputs;
};
