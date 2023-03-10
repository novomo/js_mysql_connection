const Sequelize = require("sequelize");
module.exports.connect_to_mysql = async () => {
  const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: dbConfig.MYSQL_HOST,
      dialect: "mysql",
      operatorsAliases: false,
    }
  );
  const db = {};

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  fs.readdir(process.env.MSQL_MODELS_FOLDER, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(function (file, index) {
      // Make one pass and make the file complete
      db[file.replace(".js", "")] =
        require(`${process.env.MSQL_MODELS_FOLDER}/${file}`)(
          sequelize,
          Sequelize
        );
    });
  });
  db.sequelize
    .sync({ force: true })
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });

  module.exports = db;
};
