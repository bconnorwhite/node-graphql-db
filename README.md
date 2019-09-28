TODO:

- object connections

- INDEX HIST BY UPDATEDAT

- subscriptions

- upload/file scalar -> store directory (auto generate structure from types/etc)
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
https://github.com/Cardinal90/graphql-union-input-type
or maybe just make your own, i.e. image/..., video/..., text/... audio/..., font/...
ideally let the user create their own combination though

- external (add on typedefs + resolvers)
- computed (add on typedefs + resolvers)

- need to figure out how handled deleted nodes: null, deleted: true, etc? query userDeleted?
- generalized rollback instead of restore?
- cascades

-----
Extension Features (beyond Prisma)
-----
- createMany
- upsertMany
- union unique
- TypeAggregate {
    count(where: TypeWhereInput): Int!
    booleanField: BooleanAggregate {
      count(where: BooleanWhereInput): Int!
    }
    intField: IntAggregate {
      average: Float!
      max: Float!
      min: Float!
      sum: Int!
      count(where: IntWhereInput): Int!
    }
    floatField: FloatAggregate {
      average: Float!
      max: Float!
      min: Float!
      sum: Float!
      count(where: FloatWhereInput): Float!
    }
    stringField: {
      max: String!
      min: String!
      mode: String!
      count(where: StringWhereInput!): String!
    }
    dateTimeField: DateTimeAggregate {
      max: DateTime!
      min: DateTime!
      count(DateTimeWhereInput): DateTime!
    }
    typeField: TypeAggregate {
      ...
    }
  }
- new top level type: Function

-----
Error Checking
-----
- throw error if datamodel has type Node (or better, make type Node `_Node`)

-----
Server Admin
-----

- `_startServer`
- `_restartServer`
- `_stopServer`
- `_server`
- `_databaseLoad` (reload & discard current db)

- server table for logs (option)
- database table for logs (option)
- query/access log (option)

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
- https://www.npmjs.com/package/event-stream not readFile()

-----
Admin
-----
https://www.npmjs.com/package/ra-data-graphql

-----
Notes:
-----
gqlite?
https://sqlite.org/whentouse.html

distributed in mem db:
-split nodes across machines, schema stitch
