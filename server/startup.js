Meteor.startup(function () {

  console.log("Beginning DB Migrations");

  var unstarted = unstartedMigrations();
  if(unstarted.length === 0){
    console.log("No migrations to apply");
    return
  }

  console.log("Applying migrations", unstarted);

  unstarted.forEach(runExpand);

  // // debugging variables
  Migrations.unstarted = unstartedMigrations;
});

function unstartedMigrations () {
  var pending = Migrations.collection.find({
    expandStartedAt: {$exists: false}
  }, {$sort: {name: 1}});

  return pending.fetch().map(function (m) { return m.name });
}

function runExpand (name) {
  runPhase("expand", name);
}

function runContract (name) {
  runPhase("contract", name);
}

function runPhase (phase, name) {
  console.log("running " + phase + " phase of:", name);

  var phaseFn = Migrations._migrations[name][phase];

  // update startedAt
  var modifier = {};
  modifier[phase + "StartedAt"] = new Date();
  Migrations.collection.update({name: name}, {$set: modifier});

  // run phase, dealing with exceptions
  phaseFn();

  // update completedAt, status
  var modifier = {};
  modifier[phase + "CompletedAt"] = new Date();
  Migrations.collection.update({name: name}, {$set: modifier});

}
