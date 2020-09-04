import fs from 'fs';
import Graph, { GraphOptions } from './graph';
import { GraphQLServer, Options as GraphQLYogaOptions } from 'graphql-yoga';

export interface ServerOptions extends GraphQLYogaOptions {
  graphOptions?: GraphOptions
}

export default class Server {
  graph: Graph;
  server: GraphQLServer;
  private options: ServerOptions;
  constructor(options: ServerOptions={}) {
    this.options = options;
    let datamodel = this.getDatamodel();
    this.graph = new Graph(datamodel, this.options.graphOptions);
    this.server = new GraphQLServer({
      typeDefs: this.graph.typeDefs,
      resolvers: this.graph.resolvers
    });
    this.start();
  }
  start() {
    this.server.start(this.options, (options) => {
      console.log({ message: 'server started', port: options.port });
    });
  }
  getDatamodel() {
    try {
      let string = fs.readFileSync(`${process.env.PWD}/datamodel.json`, 'utf8');
      if(string) {
        return JSON.parse(string);
      }
    } catch(e) {
      console.error(e);
    }
  }
}
