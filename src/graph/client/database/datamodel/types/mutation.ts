import {
  typeNameToCreateFieldName,
  typeNameToCreateManyFieldName,
  typeNameToUpdateFieldName,
  typeNameToUpdateManyFieldName,
  typeNameToUpsertFieldName,
  typeNameToDeleteFieldName,
  typeNameToDeleteManyFieldName,
  typeNameToRestoreFieldName,
  typeNameToRestoreManyFieldName,
  typeNameToWhereUniqueInput,
  typeNameToCreateInput,
  typeNameToUpdateInput,
  typeNameToBatchTypeName,
  returnTypeRequire,
  returnTypeListRequire,
  typeNameToWhereInput,
  typeNameToOrderByInput
} from 'utils';

import { ModelList } from '../';
import { Action } from './';

function MutationCreate(typeName: string) {
  return {
    returnType: typeName,
    args: {
      data: returnTypeRequire(typeNameToCreateInput(typeName))
    },
    action: Action.create
  }
}

function MutationCreateMany(typeName: string) {
  return {
    returnType: returnTypeRequire(typeNameToBatchTypeName(typeName)),
    args: {
      data: returnTypeListRequire(typeNameToCreateInput(typeName)),
      orderBy: typeNameToOrderByInput(typeName)
    },
    action: Action.createMany
  }
}

function MutationUpdate(typeName: string) {
  return {
    returnType: typeName,
    args: {
      data: returnTypeRequire(typeNameToUpdateInput(typeName)),
      where: returnTypeRequire(typeNameToWhereUniqueInput(typeName)),
    },
    action: Action.update
  }
}

function MutationUpdateMany(typeName: string) {
  return {
    returnType: returnTypeRequire(typeNameToBatchTypeName(typeName)),
    args: {
      data: returnTypeListRequire(typeNameToUpdateInput(typeName)),
      where: typeNameToWhereInput(typeName),
      orderBy: typeNameToOrderByInput(typeName)
    },
    action: Action.updateMany
  }
}

function MutationUpsert(typeName: string) {
  return {
    returnType: typeName,
    args: {
      where: returnTypeRequire(typeNameToWhereUniqueInput(typeName)),
      update: typeNameToUpdateInput(typeName),
      create: typeNameToCreateInput(typeName)
    },
    action: Action.upsert
  }
}

function MutationDelete(typeName: string) {
  return {
    returnType: typeName,
    args: {
      where: returnTypeRequire(typeNameToWhereUniqueInput(typeName))
    },
    action: Action.delete
  }
}

function MutationDeleteMany(typeName: string) {
  return {
    returnType: returnTypeRequire(typeNameToBatchTypeName(typeName)),
    args: {
      where: typeNameToWhereInput(typeName),
      orderBy: typeNameToOrderByInput(typeName)
    },
    action: Action.deleteMany
  }
}

function MutationRestore(typeName: string) {
  return {
    returnType: typeName,
    args: {
      where: returnTypeRequire(typeNameToWhereUniqueInput(typeName))
    },
    action: Action.restore
  }
}

function MutationRestoreMany(typeName: string) {
  return {
    returnType: returnTypeRequire(typeNameToBatchTypeName(typeName)),
    args: {
      where: typeNameToWhereInput(typeName),
      orderBy: typeNameToOrderByInput(typeName)
    },
    action: Action.restoreMany
  }
}

export default (datamodel: ModelList) => {
  let mutationType = {};
  Object.keys(datamodel).forEach((typeName) => {
    mutationType[typeNameToCreateFieldName(typeName)] = MutationCreate(typeName);
    mutationType[typeNameToCreateManyFieldName(typeName)] = MutationCreateMany(typeName);
    mutationType[typeNameToUpdateFieldName(typeName)] = MutationUpdate(typeName);
    mutationType[typeNameToUpdateManyFieldName(typeName)] = MutationUpdateMany(typeName);
    mutationType[typeNameToUpsertFieldName(typeName)] = MutationUpsert(typeName);
    mutationType[typeNameToDeleteFieldName(typeName)] = MutationDelete(typeName);
    mutationType[typeNameToDeleteManyFieldName(typeName)] = MutationDeleteMany(typeName);
    mutationType[typeNameToRestoreFieldName(typeName)] = MutationRestore(typeName);
    mutationType[typeNameToRestoreManyFieldName(typeName)] = MutationRestoreMany(typeName);
  });
  return mutationType;
}
