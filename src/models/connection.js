const mysql=require("mysql2/promise")

const connection=mysql.createPool({
    host:"db4free.net",
    user:"lssammini",
    password:"123456789",
    database:"papcic"
})

module.exports=connection