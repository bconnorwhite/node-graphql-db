import { ITypeDefinitions, IResolvers } from 'graphql-tools';

import getResolvers from './resolvers';
import getTypeDefs from './typeDefs';

import Client, { ClientOptions } from './client';
import { ModelList } from './client/database/datamodel';

export interface GraphOptions {
  clientOptions?: ClientOptions
}

export default class Graph {
  typeDefs: ITypeDefinitions;
  resolvers: IResolvers | IResolvers[];
  client: Client;
  private options: GraphOptions;
  constructor(datamodel: ModelList, options: GraphOptions={}) {
    this.options = options;
    this.client = new Client(datamodel, options.clientOptions);
    this.typeDefs = getTypeDefs(this.client);
    this.resolvers = getResolvers(this.client);
  }
}
