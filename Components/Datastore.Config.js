
// Settings

// Datastore will store everything in this (local) database.
module.exports.database = 'whofw-dev-002';

// Datastore will create AsyncStore backends for these tables
// and Datastore.Sync will keep these synchronised with the server
// IMPORTANT: This list should be kept in sync with the models defined on the server
module.exports.tables = ["countries", "locations", "brands", "incomeTypes", "storeTypes", "ageGroups", "products", "registrations", "test-uploads"];

// Datastore.Sync will only upload entries in these tables (but not pull changes)
module.exports.uploadOnly = ["registrations"];

// *Simple* access protection
module.exports.auth_token = "fr9a7as792jjd0293hddxonxo0x1309210cpdshcpihvq0823t373e4463";

// Datastore server
module.exports.server = "http://localhost:8080";
//module.exports.server = "http://whofw.fndn.dk:8080";

// Network timeout (browser defaults are typically 2 mins)
module.exports.timeout = 2 * 60 * 1000;

