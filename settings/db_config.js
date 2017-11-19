if (process.env.CLEARDB_DATABASE_URL) {
  module.exports = process.env.CLEARDB_DATABASE_URL;
} else {
    module.exports = {
        host: "localhost",
        user: "root",
        password: "mysql13",
        database: "itrev17"
    };
}