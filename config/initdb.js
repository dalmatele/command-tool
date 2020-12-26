const {Sequelize} = require("sequelize");
const config = require("./config");
const includeAll = require("include-all");
const path = require("path");
const _ = require("lodash");

const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, config.mysql.options);
const modelSchema = includeAll({
    dirname: path.resolve(__dirname, "../schema/db"),
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/
}) ||  {};

let model = {};

_.map(modelSchema, (item) => {
    if(!item.options.indexes){
        item.options.indexes = [];
    }
    //always make id is unique index
    let extendDataIndex = [
        {
            unique: true,
            name: "index_id",
            fields: ["id"]
        }
    ];
    item.options.indexes = _.union(item.options.indexes, extendDataIndex);
    item.options.paranoid = false;
    model[item.name] = sequelize.define(item.name, item.define, item.options);
});

sequelize
.authenticate()
.then(() => {
    console.log("Database connection is successful");
})
.catch(err => {
    console.log("Database connections is unsuccessful");
});

const migrate = () => {
    console.log("Start migration data...");
    sequelize.sync({
        alter: true
    })
    .then(() => {
        console.log("Migration is success");
        sequelize.close();
    })
    .catch(error => {
        console.log("Migration is unsuccess");
        sequelize.close();
        throw error;
    })
};