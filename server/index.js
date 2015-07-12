/* global Migrations:true */

Migrations.collection._ensureIndex({name: 1}, {unique: 1});

/** The expand/contract functions to run */
Migrations._migrations = {}

/** The public API to add a migration */
Migrations.add = function (migration) {
  var self = this;

  check(migration, {
    name: String,
    required: Match.Optional(Function),
    expand: Function,
    description: Match.Optional(String),
    contract: Match.Optional(Function)
  });

  if (self._migrations[migration.name]) {
    throw new Error("Duplicate migration: " + migration.name);
  }

  self.collection.upsert({name: migration.name}, {$set: {name: migration.name}});

  self._migrations[migration.name] = {
    required: migration.required,
    expand: migration.expand,
    contract: migration.contract
  };

  //throw new Error("TODO implement me");
};
