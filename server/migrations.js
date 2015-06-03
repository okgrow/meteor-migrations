Migrations.run = function () {

  console.log("Beginning DB Migrations");

  console.log(Migrations._migrations)
  var unexpanded = unexpandedMigrations();
  if (unexpanded.length === 0) {
    console.log("No expand migrations found");
  } else {
    console.log("Applying migrations", unexpanded);
    unexpanded.forEach(runExpand);
  }

  var uncontracted = uncontractedMigrations();
  if (uncontracted.length === 0) {
    console.log("No contract migrations found")
  } else {
    console.log("Applying migrations", uncontracted);
    uncontracted.forEach(runContract);
  }

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
  console.log(names)
  return _.select(names, function(name) {
    console.log(name)
    console.log(Migrations._migrations[name])
    return Migrations._migrations[name].contract !== undefined
  })
}

function log(phase,name,state) {
  var now = moment().format("YYYY-MM-DD h:mma")
  console.log("--- "+now+" - migration "+phase+" phase of: "+name+" - "+state)
}

function runExpand (name) {
  if (requirementsMet(name))
    runPhase("expand", name)
  else
    log("expand", name, "prepempted: no records")
}

function requirementsMet(name) {
  console.log(name,Migrations._migrations[name])
  var requiredFn = Migrations._migrations[name].required
  return requiredFn ? requiredFn() : true
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

  timestamp(name, phase, "StartedAt");

  // run phase, dealing with/noting exceptions
  phaseFn();

  timestamp(name, phase, "CompletedAt");
}

function timestamp (name, phase, evt) {
  var modifier = {};
  modifier[phase + evt] = new Date();
  Migrations.collection.update({name: name}, {$set: modifier});
}
