import {
  typeNameToWhereUniqueInput,
  typeNameToCreateOneWithoutFieldInput,
  typeNameToCreateWithoutFieldInput
} from 'utils';

import addCreateWithoutFieldInput from './createWithoutFieldInput';

import { ModelList } from '../';
import { InputList } from './';

export default (datamodel: ModelList, typeName: string, withoutFieldName: string, inputs: InputList) => {
  if(inputs[typeNameToCreateOneWithoutFieldInput(typeName, withoutFieldName)] == undefined) {
    inputs[typeNameToCreateOneWithoutFieldInput(typeName, withoutFieldName)] = {
      create: {
        returnType: typeNameToCreateWithoutFieldInput(typeName, withoutFieldName)
      },
      connect: {
        returnType: typeNameToWhereUniqueInput(typeName)
      }
    };
  }
  inputs = addCreateWithoutFieldInput(datamodel, typeName, withoutFieldName, inputs);
  return inputs;
};
