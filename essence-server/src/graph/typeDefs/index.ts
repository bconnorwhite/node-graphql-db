import { Client } from 'essence-db';
import { TypeList } from 'essence-db/src/database/datamodel/types';
import { InputList } from 'essence-db/src/database/datamodel/inputs';
import { EnumList } from 'essence-db/src/database/datamodel/enums';

const Kinds = {
  scalar: "scalar",
  type: "type",
  input: "input",
  enum: "enum"
};

const scalars = ["UUID", "DateTime", "Email", "Upload"];

function bracket(string: string) {
  return `{${string}${"\n}"}`;
}

function keyPair(key: string, value: string) {
  return `${key}: ${value}`;
}

function block(kind: string, typeName: string, fields?: string) {
  let retval = `${kind} ${typeName}`;
  if(fields) {
    retval += ` ${bracket(fields)}`;
  }
  return retval + "\n";
}

function fieldLine(string: string, returnType?: string, args: string="") {
  let retval = `${"\n "}${string}${args}`;
  if(returnType) {
    return keyPair(retval, returnType);
  }
  return retval;
}

function getScalars() {
  return scalars.reduce((retval: string, scalarName: string) => retval + block(Kinds.scalar, scalarName), "");
}

function getTypes(types: TypeList) {
  let retval = "";
  Object.keys(types).forEach((typeName) => {
    let fields = "";
    Object.keys(types[typeName]).forEach((fieldName) => {
      let args = "";
      if(types[typeName][fieldName].args) {
        args += "(";
        Object.keys(types[typeName][fieldName].args).forEach((argName: string, index: number, arr: { length: number; }) => {
          args += keyPair(argName, types[typeName][fieldName].args[argName]);
          if(index < arr.length-1) {
            args += ", ";
          }
        });
        args += ")";
      }
      fields += fieldLine(fieldName, types[typeName][fieldName].returnType, args);
    });
    retval += block(Kinds.type, typeName, fields);
  });
  return retval;
}

function getInputs(inputs: InputList) {
  let retval = "";
  Object.keys(inputs).forEach((inputName) => {
    let fields = "";
    Object.keys(inputs[inputName]).forEach((fieldName) => {
      fields += fieldLine(fieldName, inputs[inputName][fieldName].returnType);
    });
    retval += block(Kinds.input, inputName, fields);
  });
  return retval;
}

function getEnums(enums: EnumList) {
  let retval = "";
  Object.keys(enums).forEach((enumName) => {
    let fields = enums[enumName].reduce((retval: string, fieldName: string) => {
      return retval + fieldLine(fieldName);
    }, "");
    retval += block(Kinds.enum, enumName, fields);
  });
  return retval;
}

export default (client: Client) => {
  let typeDefs = "";
  typeDefs += getScalars();
  typeDefs += getTypes(client.database.datamodel.types);
  typeDefs += getInputs(client.database.datamodel.inputs);
  typeDefs += getEnums(client.database.datamodel.enums);
  return typeDefs;
}
