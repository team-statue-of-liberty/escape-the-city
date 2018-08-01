const { execSync } = require('child_process');
const { join } = require('path');
const mongoose = require('mongoose');
const { dropCollection } = require('./_db');
const usersDataFile = join(__dirname, '../../lib/data/users-data.json');
const gearsDataFile = join(__dirname, '../../lib/data/gears-data.json');
const eventsDataFile = join(__dirname, '../../lib/data/events-data.json');
const activitiesDataFile = join(__dirname, '../../lib/data/activities-data.json');

describe.skip('seed data', () => {

    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('gears'));
    beforeEach(() => dropCollection('activities'));
    beforeEach(() => dropCollection('events'));

    //run ONE AT A TIME
    beforeEach(() => {
        execSync(`mongoimport --db ${mongoose.connection.name} --collection users --drop --file ${usersDataFile}`);
        // execSync(`mongoimport --db ${mongoose.connection.name} --collection gears --drop --file ${gearsDataFile}`);
        // execSync(`mongoimport --db ${mongoose.connection.name} --collection events --drop --file ${eventsDataFile}`);
        // execSync(`mongoimport --db ${mongoose.connection.name} --collection activities --drop --file ${activitiesDataFile}`);
    })

    // TERMINAL commands to take seed data and export back to json data files (to keep same ObjectId)
    // mongoexport --db escape --collection users --out users-data.json
    // mongoexport --db escape --collection gears --out gears-data.json
    // mongoexport --db escape --collection activities --out activities-data.json
    // mongoexport --db escape --collection events --out events-data.json
});