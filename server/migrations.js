Migrations.run = function () {

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
};

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

function unstartedMigrations () {
  var pending = Migrations.collection.find({
    expandStartedAt: {$exists: false}
  }, {$sort: {name: 1}});

  return pending.fetch().map(function (m) { return m.name });
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
  var requiredFn = Migrations._migrations[name].required
  return requiredFn ? requiredFn() : true
}

function runContract (name) {
  runPhase("contract", name);
}

function runPhase (phase, name) {
  console.log(phase, name, "is running");
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
