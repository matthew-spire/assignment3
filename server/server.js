const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const inventoryDB = [];

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    addProduct,
  },
};

function productList() {
  return inventoryDB;
}

function addProduct(_, {product}) {
  product.id = inventoryDB.length + 1;
  inventoryDB.push(product);
  return product;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

app.use(express.static('public'));

server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });
  app.listen({ port: 3000 }, () =>
    console.log('App started on port 3000 and GraphQL Studio Sandbox accessible at localhost:3000' + server.graphqlPath)
  )
})