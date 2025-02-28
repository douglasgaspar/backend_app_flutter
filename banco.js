//Criar um objeto e fazer ele receber a biblioteca do mysql
//O const cria uma constante -> final do Java
const mysql = require('mysql');

//Criar outro const com a configuração do MySQL
const bd = mysql.createConnection({
    //host: "localhost", //IP do Banco
    host: "10.87.100.6", //IP do Banco
    user: "",
    password: "",
    database: "douglas_flutter"
});

//Exportar o conteúdo do objeto bd para acessar fora do
//arquivo banco.js
module.exports = bd;