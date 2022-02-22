const mysql = require("mysql");
const { promisify }=require("util");//this turns callbacks into promises
const { database } = require("./keysDb");

const poolDb= mysql.createPool(database);

poolDb.getConnection((err, connection)=>{ 
    if(err){//Validation of connection 
        if(err.code === "PROTOCOL_CONNECTION_LOST"){
            console.error("DATABASE CONNECTION WAS CLOSED");
        }
        if(err.code === "ER_CON_COUNT_ERROR"){
            console.error("DATABASE HAS TO MANY CONNECTIONS");
        }
        if(err.code === "ECONNREFUSED"){
            console.error("DATABASE CONNECTION WAS REFUSED");
        }   
    }

    if(connection){ //Starts the conection
        connection.release();
        console.log("DB is connected");
    }
    return; 
});
//Promisify pool querys
poolDb.query= promisify(poolDb.query);//With this, when we make a query to db, we can use async/await and promises 
module.exports=poolDb;