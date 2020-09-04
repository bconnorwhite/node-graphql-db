import { typeNameToOrderByInput } from 'essence-tools';

import OrderByInput from './orderByInput';

import { ModelList } from '../';

export interface EnumList {
  [index: string]: EnumType
}

export type EnumType = string[]

export default (enums: EnumList, datamodel: ModelList) => {
  Object.keys(datamodel).forEach((typeName) => {
    enums[typeNameToOrderByInput(typeName)] = OrderByInput(datamodel, typeName);
  });
  return enums;
}
