import {
  returnTypeToTypeName,
  returnTypeUnrequire,
  typeNameToUpdateInput,
  typeNameToUpdateWithoutFieldInput,
  returnTypeIsList,
  typeNameToUpdateOneWithoutFieldInput,
  typeNameToUpdateManyInput,
  typeNameToUpdateManyWithoutFieldInput,
  typeNameToWhereUniqueInput,
  returnTypeListRequire,
  typeNameToUpdateManyWithWhereUniqueWithoutFieldInput,
  typeNameToUpdateManyWithWhereInput,
  typeNameToWhereInput,
  typeNameToUpsertWithWhereUniqueWithoutFieldInput,
  typeNameToCreateWithoutFieldInput,
  typeNameToUpsertWithoutFieldInput,
  BooleanTypeName,
  returnTypeRequire
} from 'essence-tools';

import { ModelList } from '../';
import { InputList } from './';

import { upsertWithoutFieldInput, upsertWithWhereUniqueWithoutFieldInput } from './upsert';

function updateWithWhereUniqueWithoutFieldInput(datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName: string) {
  inputs[typeNameToUpdateManyWithWhereUniqueWithoutFieldInput(typeName, withoutFieldName)] = {
    where: {
      returnType: returnTypeRequire(typeNameToWhereInput(typeName))
    },
    data: {
      returnType: returnTypeRequire(typeNameToUpdateInput(typeName))
    }
  };
  return inputs;
}

function updateManyWithWhereInput(datamodel: ModelList, typeName: string, inputs: InputList) {
  inputs[typeNameToUpdateManyWithWhereInput(typeName)] = {
    where: {
      returnType: returnTypeRequire(typeNameToWhereInput(typeName))
    },
    data: {
      returnType: returnTypeRequire(typeNameToUpdateInput(typeName))
    }
  };
  return inputs;
}

function updateOneWithoutFieldInput(datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName: string) {
  inputs[typeNameToUpdateOneWithoutFieldInput(typeName, withoutFieldName)] = {
    create: {
      returnType: typeNameToCreateWithoutFieldInput(typeName, withoutFieldName)
    },
    connect: {
      returnType: typeNameToWhereUniqueInput(typeName)
    },
    disconnect: {
      returnType: BooleanTypeName
    },
    destroy: {
      returnType: BooleanTypeName
    },
    update: {
      returnType: typeNameToUpdateWithoutFieldInput(typeName, withoutFieldName)
    },
    upsert: {
      returnType: typeNameToUpsertWithoutFieldInput(typeName, withoutFieldName)
    }
  };
  inputs = updateInput(datamodel, typeName, inputs, withoutFieldName);
  inputs = upsertWithoutFieldInput(typeName, inputs, withoutFieldName);
  return inputs;
}

function updateManyWithoutFieldInput(datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName: string) {
  inputs[typeNameToUpdateManyWithoutFieldInput(typeName, withoutFieldName)] = {
    create: {
      returnType: returnTypeListRequire(typeNameToCreateWithoutFieldInput(typeName, withoutFieldName))
    },
    connect: {
      returnType: returnTypeListRequire(typeNameToWhereUniqueInput(typeName))
    },
    set: {
      returnType: returnTypeListRequire(typeNameToWhereUniqueInput(typeName))
    },
    disconnect: {
      returnType: returnTypeListRequire(typeNameToWhereUniqueInput(typeName))
    },
    destroy: {
      returnType: returnTypeListRequire(typeNameToWhereUniqueInput(typeName))
    },
    update: {
      returnType: returnTypeListRequire(typeNameToUpdateManyWithWhereUniqueWithoutFieldInput(typeName, withoutFieldName))
    },
    updateMany: {
      returnType: returnTypeListRequire(typeNameToUpdateManyWithWhereInput(typeName))
    },
    destroyMany: {
      returnType: returnTypeListRequire(typeNameToWhereInput(typeName))
    },
    upsert: {
      returnType: returnTypeListRequire(typeNameToUpsertWithWhereUniqueWithoutFieldInput(typeName, withoutFieldName))
    }
  };
  inputs = updateInput(datamodel, typeName, inputs, withoutFieldName);
  inputs = updateWithWhereUniqueWithoutFieldInput(datamodel, typeName, inputs, withoutFieldName);
  inputs = updateManyWithWhereInput(datamodel, typeName, inputs);
  inputs = upsertWithWhereUniqueWithoutFieldInput(typeName, inputs, withoutFieldName);
  return inputs;
}

export default function updateInput(datamodel: ModelList, typeName: string, inputs: InputList, withoutFieldName?: string) {
  let model = datamodel[typeName];
  let inputName = withoutFieldName ? typeNameToUpdateWithoutFieldInput(typeName, withoutFieldName): typeNameToUpdateInput(typeName);
  inputs[inputName] = Object.keys(model).reduce((retval, fieldName) => {
    if(model[fieldName].managed !== true && fieldName !== withoutFieldName) {
      let field = model[fieldName];
      let fieldTypeName = returnTypeToTypeName(field.type);
      if(datamodel[fieldTypeName]) { //TODO
        if(!returnTypeIsList(field.type)) {
          if(!field.inverse) {
            retval[fieldName] = {
              returnType: typeNameToUpdateInput(fieldTypeName)
            };
          } else {
            let inputType = typeNameToUpdateOneWithoutFieldInput(fieldTypeName, field.inverse);
            retval[fieldName] = {
              returnType: inputType
            };
            if(inputs[inputType] == undefined) {
              inputs = updateOneWithoutFieldInput(datamodel, fieldTypeName, inputs, field.inverse);
            }
          }
        } else {
          if(!field.inverse) {
            retval[fieldName] = {
              type: typeNameToUpdateManyInput(typeName)
            };
          } else {
            let inputType = typeNameToUpdateManyWithoutFieldInput(fieldTypeName, field.inverse);
            retval[fieldName] = {
              returnType: inputType
            }
            if(inputs[inputType] == undefined) {
              inputs = updateManyWithoutFieldInput(datamodel, fieldTypeName, inputs, field.inverse);
            }
          }
        }
      } else { //field
        retval[fieldName] = {
          returnType: returnTypeUnrequire(model[fieldName].type)
        };
      }
    }
    return retval;
  }, {});
  return inputs;
}
