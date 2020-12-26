require("dotenv").config();

let config = {
    mysql: {
        database: "commandDb",
        user: "user",
        password: "password",
        options: {
            host: "localhost",
            dialect: "mysql",
            port: "3306",
            pool: {
                max: 10,
                min: 1,
                idel: 10000
            }
        }
    }
};