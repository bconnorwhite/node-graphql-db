import Server from 'essence-server';

new Server({
  port: 4321,
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
