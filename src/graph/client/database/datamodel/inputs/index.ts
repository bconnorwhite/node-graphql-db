import addWhereInput from './whereInput';
import addWhereUniqueInput from './whereUniqueInput';
import addCreateInput from './createInput';
//createMany
import addUpdateInput from './updateInput';
import addUpdateManyInput from './updateManyInput';
//upsert
//upsertMany
//delete
//deleteMany
//restore
//restoreMany

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
    inputs = addUpdateManyInput(datamodel, typeName, inputs);
  });
  return inputs;
}
