import addWhereInput from './whereInput';
import addWhereUniqueInput from './whereUniqueInput';
import addCreateInput from './create';
import addUpdateInput from './update';
import addUpsertInput from './upsert';

import { ModelList } from '../';

export interface InputList {
  [index: string]: InputType
}

export interface InputType {
  [index: string]: {
    returnType: string,
    filter?: (node: any, value: string)=>boolean
  }
}

export default (inputs: InputList, datamodel: ModelList) => {
  Object.keys(datamodel).forEach((typeName) => {
    inputs = addWhereInput(datamodel, typeName, inputs);
    inputs = addWhereUniqueInput(datamodel, typeName, inputs);
    inputs = addCreateInput(datamodel, typeName, inputs);
    inputs = addUpdateInput(datamodel, typeName, inputs);
    inputs = addUpsertInput(typeName, inputs);
  });
  return inputs;
}
