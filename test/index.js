const fetch = require('node-fetch');

fetch('http://localhost:4321', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    query: `
      mutation create {
        createUser(data: {
          name:"Author 1",
          email:"author1@gmail.com",
          booksWritten: {
            create: [{
                name:"Book 1"
              }
            ]
          }
        }) {
          uuid
          name
        }
      }
    `
  })
}).then((res) => res.json()).then((json) => console.log(json));
