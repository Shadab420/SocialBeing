//firebase admin for database
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore(); //get the database

module.exports = { admin, db }