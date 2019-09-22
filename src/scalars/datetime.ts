import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export default new GraphQLScalarType({
  name: "DateTime",
  description: "The DateTime scalar type represents date time strings from new Date().toISOString()",
  parseValue: (value) => {
    let date = new Date(value);
    if(date.toString() == "Invalid Date") {
      throw new TypeError(`DateTime cannot represent a non DateTime value: [${String(typeof value)}] given`);
    }
    return date.toISOString();
  },
  serialize: (value) => {
    let date = new Date(value);
    if(date.toString() == "Invalid Date") {
      throw new TypeError(`DateTime cannot represent a non DateTime value: [${String(typeof value)}] given`);
    }
    return date.toISOString();
  },
  parseLiteral(ast) {
    if(ast.kind === Kind.INT || ast.kind == Kind.STRING) {
      return new Date(ast.value);
    }
  }
});
