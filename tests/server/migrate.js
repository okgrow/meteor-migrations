Tinytest.add("Migrations - Full Cycle", function (test) {
  var x = 0;
  Migrations._reset(true);
  Migrations.add({
    name: "test1",
    expand: function () {
      x = x+1;
    }
  });

  test.equal(x, 0);
  Migrations.run();
  test.equal(x, 1);
});
