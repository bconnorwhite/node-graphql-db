TODO:

- object connections

- subscriptions

- upload/file scalar -> store directory (auto generate structure from types/etc)

- `_startServer`
- `_restartServer`
- `_stopServer`
- `_server`
- `_databaseLoad` (reload & discard current db)

- server table for logs (option)
- database table for logs (option)
- query/access log (option)

- external (add on typedefs + resolvers)
- computed (add on typedefs + resolvers)

* need to figure out how handled deleted nodes: null, deleted: true, etc? query userDeleted?

- throw error if datamodel has type Node (or better, make type Node `_Node`)

-----
DB Integrity
-----

- delete -> create w/unique conflict w/deleted -> restore:
  1. Don't restore if unique conflict
  2. Don't create if deleted with unique

- ensure unique, even on updateMany

- migrations

-----
Authentication && Authorization
-----

- default role "Super Admin" can do everything
- Auth0? build yourself?

-----
Performance
-----
- async forEach (ex: update many)
- keep some tables on disc (ex: logs)
- load test with simulated "sensor data"
- db.json pointer file to other files, some on disc, some in mem
https://medium.com/@denisanikin/what-an-in-memory-database-is-and-how-it-persists-data-efficiently-f43868cff4c1
