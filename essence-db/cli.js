#!/usr/bin/env node

function usage() {
  console.log('Usage:');
  console.log('  graphqldb');

  console.log('  graphqldb init');
  console.log('  graphqldb rename <type>');
  console.log('  graphqldb rename <type> <fieldname>');
  console.log('  graphqldb migrate');
  console.log('  graphqldb --help');
}

var args = process.argv.slice(2);

if (args.indexOf('--help') >= 0) {
  usage();
  process.exit(0);
}
var command = args.shift();

switch (command) {
  case 'init':
    var datamodel = args.shift();
    //init
    break;

  case 'rename':
    var type = args.shift();
    var fieldname = args.shift();
    //rename
    break;

  case 'migrate':

    break;

  default:
    usage();
    process.exit(1);
}
