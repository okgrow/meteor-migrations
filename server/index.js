/* global Migrations:true */

/** The expand/contract functions to run */
Migrations._migrations = {}

/** The public API to add a migration */
Migrations.add = function (migration) {
  var self = this;

  check(migration, {
    name: String,
    description: Match.Optional(String),
    expand: Function,
    contract: Match.Optional(Function)
  });

  if (self._migrations[migration.name]) {
    throw new Error("Duplicate migration: " + migration.name);
  }

  var record = {name: migration.name};
  self.collection.upsert(record, record);

  self._migrations[migration.name] = {
    expand: migration.expand,
    contract: migration.contract
  };

  //throw new Error("TODO implement me");
};
