//Adicionar as bibliotecas
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//Importar o Mysql do arquivo banco.js
const banco = require('./banco')

//Iniciar o objeto do express
const backend = express(); //Construtor do express
//Adicionar o recurso do Body Parser no backend
backend.use(bodyParser.urlencoded({extended: false}));
backend.use(bodyParser.json()); //Usar JSON na comunicação

//Adicionar a configuração do CORS
backend.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); //Permitir qualquer host
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,PATCH');
    backend.use(cors());
    next();
  });

//Criar os métodos para usar no backend (Rotas da API)
//É preciso indicar o método a ser utilizado (GET, POST, PUT, DELETE)
//O /listarTodos é o nome que será indicado após o localhost:3000
//Os objetos req e res correspondem a quem fez a requisição/pedido (req)
//e indicam qual será resposta (res) enviada ao final
backend.get("/listarUsuario", (req, res) => {
    //Enviar um comando SQL para o banco
    banco.query("SELECT * FROM usuario;",
        //O comando SQL pode retornar um erro, resultado ou os campos
        function(error, results, fields){
            if(error){
                //Envia uma resposta
                res.status(500).json({resposta: "Erro do banco"});
            }
            if(results.length != 0){ //Se encontrou algo
                //Exibe o resultado na resposta
                res.send(results);
            }else{
                res.status(400).json({resposta: "Sem produto"});
            }
        }
    )
})

//Criar um método para cadastrar (INSERT) um usuário usando POST
backend.post("/cadastrar", (req, res) => {
    //Comando SQL
    banco.query("INSERT INTO usuario (email, senha, nome, sobrenome, dataNascimento, telefone) " +
        " VALUES (?, ?, ?, ?, ?, ?);",
        //Recuperar os valores da requisição que foram enviados
        //via Body
        [req.body.email, req.body.senha, req.body.nome, req.body.sobrenome, req.body.dataNasc, req.body.telefone],
        function(error, results, fields){
            if(error){
                console.log(error);
                res.status(500).json({resposta: "Erro interno ao cadastrar"})
            }
            //Testar se houve alteração na tabela
            if(results.affectedRows != 0){
                res.status(200).json({resposta: "Cadastrado!"})
            }else{
                res.status(400).json({resposta: "Erro ao cadastrar!"})
            }
        }
    )
})

//Método para validar o acesso do usuário e senha
backend.post("/validarAcesso", (req, res) => {
    //Enviar um comando SQL para o banco
    banco.query("SELECT senha FROM usuario where email = ?;",
        [req.body.email],
        //O comando SQL pode retornar um erro, resultado ou os campos
        function(error, results, fields){
            if(error){
                //Envia uma resposta
                res.status(500).json({resposta: "Erro interno ao validar"});
            }
            if(results.length != 0){ //Se encontrou algo
                //Compara a senha digitada com a do banco
                if(req.body.senha === results[0].senha){
                    res.status(200).json({resposta: "Acesso permitido"});
                }else{
                    res.status(401).json({resposta: "Usuário ou senha incorreta"});
                }
            }else{
                res.status(401).json({resposta: "Usuário ou senha incorreta"});
            }
        }
    )
})

//Método para remover (DELETE) um produto através do seu código
//Para enviar o código vamos usar via parâmetro (na URL)
//Parâmetros são identificados com : seguido do nome.
//Por exemplo -> :cod
//Ao final a chamada será: localhost:3000/apagar/123
backend.delete("/apagar/:cod", (req, res) => {
    banco.query("DELETE FROM usuario WHERE id = ?;",
        [req.params.cod], //Acessa o valor do :cod
        function(error, results, fields){
            if(error){
                res.status(500).json({resposta: "Erro ao apagar"})
            }
            //Testar se houve alteração na tabela
            if(results.affectedRows != 0){
                res.status(200).json({resposta: "Removido!"})
            }else{
                res.status(400).json({resposta: "Erro ao apagar!"})
            }
        }
    )
})




//Iniciar o backend
backend.listen(3000, () =>{
    console.log("Iniciado com sucesso");
})


  
