import { TypeList, EnumList } from '../interfaces';

export default (types: TypeList, inputs: TypeList, enums: EnumList) => {
  let typeDefs = `
    scalar UUID
    scalar DateTime
    scalar Email
  `;
  Object.keys(types).forEach((typeName) => {
    let fields = "";
    Object.keys(types[typeName]).forEach((fieldName) => {
      let args = "";
      if(types[typeName][fieldName].args) {
        args += "(";
        Object.keys(types[typeName][fieldName].args).forEach((argName, index, arr) => {
          args += `${argName}: ${types[typeName][fieldName].args[argName]}`;
          if(index < arr.length-1) {
            args += ", ";
          }
        });
        args += ")";
      }
      fields += `${"\n  "}${fieldName}${args}: ${types[typeName][fieldName].type}`;
    });
    typeDefs += `type ${typeName} {${fields}${"\n}\n"}`;
  });
  Object.keys(inputs).forEach((typeName) => {
    let fields = "";
    Object.keys(inputs[typeName]).forEach((fieldName) => {
      let args = "";
      if(inputs[typeName][fieldName].args) {
        args += "(";
        Object.keys(inputs[typeName][fieldName].args).forEach((argName, index, arr) => {
          args += `${argName}: ${inputs[typeName][fieldName].args[argName]}`;
          if(index < arr.length-1) {
            args += ", ";
          }
        });
        args += ")";
      }
      fields += `${"\n  "}${fieldName}${args}: ${inputs[typeName][fieldName].type}`;
    });
    typeDefs += `input ${typeName} {${fields}${"\n}\n"}`;
  });
  Object.keys(enums).forEach((enumName) => {
    let fields = enums[enumName].reduce((retval: string, item: string) => {
      return retval + `${"\n  "}${item}`;
    }, "");
    typeDefs += `enum ${enumName} {${fields}${"\n}\n"}`;
  });
  return typeDefs;
}
