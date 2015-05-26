Package.describe({
  name: "okgrow:migrations",
  summary: "Allow zero-downtime database migrations for Meteor",
  version: "0.1.0",
  git: "https://github.com/okgrow/meteor-migrations"
});

Package.onUse(function(api) {
  api.versionsFrom("1.0.1");
  api.use(["mongo", "minimongo"]);
  api.use(["underscore"]);

  api.addFiles("shared/index.js", ["client", "server"]);

  api.export("Migrations");
});

Package.onTest(function (api) {
  api.use("tinytest");
  api.use("okgrow:migrations");

  api.addFiles("tests/shared/index.js", ["client", "server"]);

});
