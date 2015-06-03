Migrations.run = function () {

  console.log("Beginning DB Migrations");

  var unexpanded = unexpandedMigrations();
  if (unexpanded.length === 0) {
    console.log("  No expand migrations found");
  } else {
    console.log("  Applying expand migrations", unexpanded);
    unexpanded.forEach(runExpand);
  }

  Migrations.contractDelay = 5

  Meteor.setTimeout(function() {
    var uncontracted = uncontractedMigrations();
    if (uncontracted.length === 0) {
      console.log("  No contract migrations found")
    } else {
      console.log("  Applying contract migrations", uncontracted);
      uncontracted.forEach(runContract);
    }
  }, Migrations.contractDelay*1000)

  // // debugging variables
  Migrations.unexpanded = unexpandedMigrations;
  Migrations.uncontracted = uncontractedMigrations;
};

// Return true is exend has been run successfully
Migrations.isExpanded = function(name) {
  return Migrations.collection.find(
    {name: name, expandCompletedAt: {$exists: true}}).count() > 0
}

// Remove all memory of migrations, allow 'add's to take effect
// INTENDED FOR TEST/DEV USE ONLY
Migrations._reset = function (sameProcess) {
  if (process.env.METEOR_ENV === "production" || process.env.NODE_ENV === "production"){
    console.warn("Refusing to reset Migrations in production");
    return;
  }
  Migrations.collection.remove({});
  Migrations._migrations = {};
  sameProcess || process.exit(); //it comes back, don't worry
};

function unexpandedMigrations () {
  var pending = Migrations.collection.find(
    {expandStartedAt: {$exists: false}},
    {$sort: {name: 1}});

  return pending.fetch().map(function (m) { return m.name });
}

function uncontractedMigrations () {
  var pending = Migrations.collection.find(
    { contractStartedAt: {$exists: false}},
    {$sort: {name: 1}});

  var names = pending.fetch().map(function (m) { return m.name });
  return _.select(names, function(name) {
    return Migrations._migrations[name].contract !== undefined
  })
}

function log(phase,name,state) {
  var now = moment().format("YYYY-MM-DD h:mma")
  console.log("--- "+now+" - migration "+phase+" phase of: "+name+" - "+state)
}

function runExpand (name) {
  runPhase("expand", name)
}

function runContract (name) {
  if (Migrations.isExpanded(name))
    runPhase("contract", name);
  else
    log("contract", name, "preempted: expand incomplete")
}

function runPhase (phase, name) {
  log(phase, name, "is running");
  var phaseFn = Migrations._migrations[name][phase];

  // run phase, dealing with/noting exceptions
  timestamp(name, phase, "StartedAt");
  phaseFn();
  timestamp(name, phase, "CompletedAt");
}

function timestamp (name, phase, evt) {
  var modifier = {};
  modifier[phase + evt] = new Date();
  Migrations.collection.update({name: name}, {$set: modifier});
}
