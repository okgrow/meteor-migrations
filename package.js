Package.describe({
  name: "okgrow:migrations",
  summary: "Allow zero-downtime database migrations for Meteor",
  version: "0.1.0",
  git: "https://github.com/okgrow/meteor-migrations"
});

Package.onUse(function (api) {
  api.versionsFrom("1.0.1");
  api.use(["mongo", "minimongo"]);
  api.use(["underscore", "check", "momentjs:moment@2.10.6"]);

  api.addFiles("shared/index.js", ["client", "server"]);

  api.addFiles("server/index.js", "server");
  api.addFiles("server/migrations.js", "server");
  api.addFiles("server/startup.js", "server");

  api.export("Migrations");
});

Package.onTest(function (api) {
  api.use("tinytest");
  api.use("okgrow:migrations");

  api.addFiles("tests/server/index.js", "server");
  api.addFiles("tests/server/migrate.js", "server");
});
