import {
  typeNameToUpsertInput,
  returnTypeRequire,
  typeNameToWhereUniqueInput,
  typeNameToUpdateInput,
  typeNameToCreateInput,
  typeNameToUpdateWithoutFieldInput,
  typeNameToCreateWithoutFieldInput,
  typeNameToUpsertWithoutFieldInput,
  typeNameToUpsertWithWhereUniqueWithoutFieldInput
} from 'essence-tools';

import { InputList } from './';

export function upsertWithoutFieldInput(typeName: string, inputs: InputList, withoutFieldName: string) {
  let inputName = typeNameToUpsertWithoutFieldInput(typeName, withoutFieldName);
  inputs[inputName] = {
    update: {
      returnType: returnTypeRequire(typeNameToUpdateWithoutFieldInput(typeName, withoutFieldName))
    },
    create: {
      returnType: returnTypeRequire(typeNameToCreateWithoutFieldInput(typeName, withoutFieldName))
    }
  };
  return inputs;
}

export function upsertWithWhereUniqueWithoutFieldInput(typeName: string, inputs: InputList, withoutFieldName: string) {
  let inputName = typeNameToUpsertWithWhereUniqueWithoutFieldInput(typeName, withoutFieldName);
  inputs[inputName] = {
    where: {
      returnType: returnTypeRequire(typeNameToWhereUniqueInput(typeName))
    },
    update: {
      returnType: returnTypeRequire(typeNameToUpdateWithoutFieldInput(typeName, withoutFieldName))
    },
    create: {
      returnType: returnTypeRequire(typeNameToCreateWithoutFieldInput(typeName, withoutFieldName))
    }
  };
  return inputs;
}

export default function upsertInput(typeName: string, inputs: InputList) {
  let inputName = typeNameToUpsertInput(typeName);
  inputs[inputName] = {
    where: {
      returnType: returnTypeRequire(typeNameToWhereUniqueInput(typeName))
    },
    update: {
      returnType: typeNameToUpdateInput(typeName)
    },
    create: {
      returnType: typeNameToCreateInput(typeName)
    }
  };
  return inputs;
}
