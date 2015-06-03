// In dev/prod, run migrations on startup. Tests should call Migrations.run
// XXX is this the best way to detect test mode?
if (typeof Tinytest === "undefined")
  Meteor.startup(function () {
    Meteor.defer(Migrations.run);
  });
