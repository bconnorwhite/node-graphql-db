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
      type: "City!",
      inverse: "users"
    }
  },
  City: {
    name: {
      type: "String!"
    },
    users: {
      type: "[User!]!",
      inverse: "city"
    }
  }
}, {
  clientOptions: {
    databaseOptions: {
      watch: true,
      fileOptions: {
        compress: false,
        pretty: true,
      }
    }
  }
});

const server = new GraphQLServer({
  typeDefs: graph.typeDefs,
  resolvers: graph.resolvers
});

server.start({
  port: 4321
}, ({ port }) => {
  console.log({ message: 'server started', port });
});
