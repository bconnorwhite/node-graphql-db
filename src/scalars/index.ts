import {
  GraphQLUUID,
  GraphQLEmail,
  GraphQLPassword,
  GraphQLIPv4,
  GraphQLLimitedString,
  GraphQLMacAddress,
  GraphQLURL
} from 'graphql-extra-scalars';

import GraphQLJSON from 'graphql-type-json';

import DateTime from './datetime';

export {
  GraphQLUUID as UUID,
  DateTime,
  GraphQLEmail as Email,
  GraphQLPassword as Password,
  GraphQLIPv4 as IPv4,
  GraphQLLimitedString as LimitedString,
  GraphQLMacAddress as MacAddress,
  GraphQLURL as URL,
  GraphQLJSON as JSON
}
