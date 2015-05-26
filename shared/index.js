/* global Migrations:true */
Migrations = {
  collection: new Mongo.Collection("migrations")
};

Migrations.collection._ensureIndex({name: 1}, {unique: 1});
