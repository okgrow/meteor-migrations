Tinytest.add("Migrations - API - add - present", function (test) {
  test.equal(true, _.isFunction(Migrations.add));
});

Tinytest.add("Migrations - API - add - full", function (test) {
  Migrations.add({
    name: 'full',
    description: 'full_desc',
    expand: function() {},
    contract: function() {}
  })
  var migration = Migrations._migrations["full"]
  test.isNotNull(migration, "Migration not found")
  test.isNotNull(migration.description, "description expected")
  test.isTrue(_.isFunction(migration.expand), "expand fn expected")
  test.isTrue(_.isFunction(migration.contract), "contract fn expected")
});

Tinytest.add("Migrations - API - add - optional", function (test) {
  test.equal(true, _.isFunction(Migrations.add));
  Migrations.add({
    name: 'optional',
    expand: function() {}
  })
  var migration = Migrations._migrations["optional"]
  test.isNotNull(migration, "Migration not found")
  test.isTrue(_.isFunction(migration.expand), "expand fn expected")
});
