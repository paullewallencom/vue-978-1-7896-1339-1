const Database = require('better-sqlite3');
const updater = require('./update');

const db = new Database('./db/database.db');

updater(db);
