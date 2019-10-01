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
    biography: {
      type: "Book",
      inverse: "about"
    },
    favorite: {
      type: "Book",
      inverse: "favoritedBy"
    },
    booksWritten: {
      type: "[Book!]!",
      inverse: "author"
    },
    booksRead: {
      type: "[Book!]!",
      inverse: "readers"
    }
  },
  Book: {
    name: {
      type: "String!"
    },
    readers: {
      type: "[User!]!",
      inverse: "booksRead"
    },
    author: {
      type: "User!",
      inverse: "booksWritten"
    },
    about: {
      type: "User",
      inverse: "biography"
    },
    favoritedBy: {
      type: "[User!]!",
      inverse: "favorite"
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
