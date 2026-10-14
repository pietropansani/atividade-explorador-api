// ===================================================
// NOSSA API DE TÊNIS
// ===================================================

// As fotos NÃO são baixadas automaticamente!
// Elas devem existir manualmente na pasta
// data/img
// ===================================================

// NOTAS
// GET /api/tenis/aleatorio
// GET /api/tenis/marca/:marca

// IMPORTAR o framework express para criar o servidor
const express = require("express");
// Importar o CORS para permitir requisições de outros domínios (ex: frontend)
const cors = require("cors");
// Importa o módulo de arquivos do NODE
const fs = require("fs");
// Importa utilidade para trabalhar com caminhos de arquivos
const path = require("path");
// Importa o arquivo JSON que contém as marcas e fotos
const tenis = require("./data/tenis.json");
// Cria a aplicação Express
const app = express();
// Definir a porta onde o servidor irá rodar
const PORT = 3000;
// Habilitar o uso do CORS na aplicação
app.use(cors());

// ===========================================
// SERVIR ARQUIVOS ESTÁTICOS
// ===========================================

// Nós falamos para o express
// "Tudo o que estiver na pasta data/img pode ser acessado pela URL /fotos"
// Exemplo:
// http://localhost:3000/fotos/air_force/1.jpg

app.use(
    "/fotos",
    express.static(
        path.join(__dirname, "data", "img") // caminho real da pasta do servidor
    )
);

// ======================================
// FUNÇÃO AUXILIAR
// ======================================

// Função que recebe um array e retorna um item aleatório dele
function sortear(array) {
    // Math.random() sorteia um número decimal entre 0 e 1
    // Math.random() * array.length multiplica pelo número de itens
    // Math.floor() tira a parte decimal, arredondando para baixo
    const i = Math.floor(Math.random() * array.length);
    // Retorna o item sorteado
    return array[i];
}

// ================================
// ROTAS DA API
// ================================

// ROTA 1 - Tênis Aleatório
app.get("/api/tenis/aleatorio", (req, res) => {
    // req - request (requisição) = pedido que chega ao servidor
    // res - response (resposta) = o que o servidor envia de volta

    // pegar todas as fotos de todas as marcas
    // Object.values pega os valores do objeto
    // flat transforma tudo em um único array
    const todasAsFotos = Object.values(tenis).flat();

    // sorteia uma foto aleatória
    const item = sortear(todasAsFotos);

    // responder para o cliente em formato JSON
    res.json({
        // status da resposta
        status: "ok",
        foto: item,
        // URL da foto, que é a URL do servidor + o caminho da foto
        url: `http://localhost:${PORT}/fotos/${item}`
    });
});

// ROTA 2 - Tênis por Marca
// Exemplo de URL: http://localhost:3000/api/tenis/marca/new_balance

app.get("/api/tenis/marca/:marca", (req, res) => {
    // pegar a marca da URL, em minúsculas
    // espaços e hifens viram "_" para casar com as chaves do JSON
    // ex: "New Balance" ou "new-balance" -> "new_balance"
    const marca = req.params.marca
        .toLowerCase()
        .trim()
        .replace(/[\s-]+/g, "_");

    // verificar se a marca existe
    if (!tenis[marca]) {
        return res.status(404).json({
            status: "error",
            message: "Marca não encontrada"
        });
    }

    // sortear uma foto aleatória da marca
    const item = sortear(tenis[marca]);

    // responder para o cliente em formato JSON
    res.json({
        status: "ok",
        foto: item,
        url: `http://localhost:${PORT}/fotos/${item}`
    });
});

// ======================================
// INICIAR O SERVIDOR
// ======================================

// Inicia o servidor express
app.listen(PORT, () => {
    console.log(`🌎 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📂 Coloque as fotos manualmente na pasta data/img, e atualize o arquivo data/tenis.json com os nomes das marcas e fotos.`);
});