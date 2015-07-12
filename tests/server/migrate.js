Tinytest.addAsync("Migrations - Full Cycle - allowed", function (test, next) {

  Migrations.setContractDelay(0);

  var x = 0;
  var y = 0;
  Migrations._reset(true);
  Migrations.add({
    name: "testFullAllow",
    expand: function () {
      x = x+1;
    },
    contract: function() {
      y = y+1;
    }
  });

  test.equal(x, 0, 'expand initial');
  test.equal(y, 0, 'contact initial');
  Migrations.run();
  Meteor.setTimeout(function () {
    test.equal(x, 1, 'expand was run');
    test.equal(y, 1, 'contract was run');  //make this pass on a set interval

    Migrations._reset(true);
    next();
  }, 500)
});
