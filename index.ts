import Graph from './src/graph';
import { GraphQLServer } from 'graphql-yoga';

let graph = new Graph({
  User: {
    name: {
      type: "String!"
    },
    email: {
      type: "Email!",
      unique: true
    },
    city: {
      type: "City!"
    }
  },
  City: {
    name: {
      type: "String!"
    }
  }
}, {
  database: {
    compress: false,
    pretty: true,
    watch: true
  }
});

function save() {
  console.log();
  graph.save();
  process.exit();
}

process.on('SIGINT', save);

const server = new GraphQLServer({ typeDefs: graph.typeDefs, resolvers: graph.resolvers });
server.start({
  port: 4321
}, ({ port }) => {
  console.log({ message: 'server started', port });
});
