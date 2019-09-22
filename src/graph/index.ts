import { Action, TypeList, InputList, EnumList, Resolvers, DatabaseInterface, DatabaseOptions } from '../interfaces';
import Datamodel from '../datamodel';
import Database from '../database';
import Client from '../client';
import getResolvers from '../resolvers';
import getTypeDefs from '../typeDefs';

interface Options {
  database?: DatabaseOptions
}

export default class Graph {
  typeDefs: string;
  resolvers: Resolvers;
  datamodel;
  database: DatabaseInterface;
  client;
  options: Options;
  constructor(datamodel: TypeList, options: Options={}) {
    this.options = options;
    this.datamodel = new Datamodel(datamodel);
    this.database = new Database(this.datamodel.types, this.datamodel.inputs, options.database);
    this.client = new Client(datamodel, this.database);
    //Build typeDefs
    this.typeDefs = getTypeDefs(this.datamodel.types, this.datamodel.inputs, this.datamodel.enums);
    //Build resolvers
    this.resolvers = getResolvers(this.datamodel.types, this.client);
  }
  save() {
    this.database.save();
  }
}
