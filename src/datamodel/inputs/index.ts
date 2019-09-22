import { TypeList } from '../../interfaces';

import {
  typeNameToWhereUniqueInput,
  typeNameToWhereInput,
  typeNameToCreateInput,
  typeNameToUpdateInput,
  typeNameToUpdateManyInput
} from '../../utils';

import WhereInput from './whereInput';
import WhereUniqueInput from './whereUniqueInput';
import CreateInput from './createInput';
import UpdateInput from './updateInput';
import UpdateManyInput from './updateManyInput';

export default (datamodel: TypeList, typeName: string) => {
  let inputs = {};
  inputs[typeNameToWhereUniqueInput(typeName)] = WhereUniqueInput(datamodel, typeName);
  inputs[typeNameToWhereInput(typeName)] = WhereInput(datamodel, typeName);
  inputs[typeNameToCreateInput(typeName)] = CreateInput(datamodel, typeName);
  inputs[typeNameToUpdateInput(typeName)] = UpdateInput(datamodel, typeName);
  inputs[typeNameToUpdateManyInput(typeName)] = UpdateManyInput(datamodel, typeName);
  return inputs;
}
