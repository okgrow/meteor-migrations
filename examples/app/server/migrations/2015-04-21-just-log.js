Migrations.add({
  name: "2015-04-21-just-log",

  expand: function () {
    console.log("hey I was run");
  }
});
