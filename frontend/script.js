//============================================
// ELEMENTOS HTML
//============================================

const dogImage = document.getElementById("tenisImage");
//nome do tenis (o id no HTML é "breedName")
const breedName = document.getElementById("breedName");
//botão de tenis aleatório (o id no HTML é "randomBtn")
const randomBtn = document.getElementById("randomBtn");
//botao que busca por tenis
const searchBtn = document.getElementById("searchBtn");
//campo de input para digitar o nome do tenis
const breedInput = document.getElementById("breedInput");
//area onde fica a imagem do tenis
//usamos querySelector para selecionar o elemento com a classe "tenis-area"
const dogArea = document.querySelector(".tenis-area");

//============================================
// URL DA API
//============================================

const API = "http://localhost:3000/api/tenis";

//============================================
// FUNÇÃO PRINCIPAL
//============================================

async function buscarTenis(url) {
    //adiciona a classe "loading"
    //normalmente usada para mostrar animação de carregamento
    dogArea.classList.add("loading");

    try {
        //faz a requisição HTTP para a API
        const response = await fetch(url);
        // converte a resposta para JSON
        const data = await response.json();
        //mostra no console a resposta da API
        console.log("Resposta da API:", data);

        // Vamos verificar se a resposta da API retornou erro
        if (data.status === "error") {
            //breedName - Elemento HTML
            //.textContent - Propriedade que define o conteúdo de texto do elemento
            //data.message - mensagem de erro enviada pela API
            breedName.textContent = data.message;
            // Remove a imagem
            dogImage.src = "";
            // encerra a função aqui, não há foto para mostrar
            return;
        }

        //coloca a imagem do cachorro na tela
        // o src define qual imagem será exibida
        // a API devolve a URL completa no campo "url"
        dogImage.src = data.url;

        //extrai o nome da raça do campo "foto"
        // exemplo: "nike/1.jpg"
        // separa em partes usando "/" e pega a primeira posição
        const raca = data.foto.split("/")[0];

        //coloca a primeira letra maiúscula
        // ex: nike --> Nike
        // raca.charAt(0) - pega a primeira letra
        // toUpperCase() - transforma em maiúscula
        // raca.slice(1) - pega o texto a partir da segunda letra
        breedName.textContent =
            raca.charAt(0).toUpperCase() + raca.slice(1);

    } catch (erro) {
        //caso o servidor esteja desligado
        // ou aconteça algum erro na requisição
        console.error(erro);

        //mostra a mensagem na tela
        breedName.textContent =
            "📴 Servidor offline - rode: node server.js";

        //remove a imagem
        dogImage.src = "";
    } finally {
        //remove a classe de carregamento
        //independentemente de erro ou sucesso
        dogArea.classList.remove("loading");
    }
}


// ============================================
// AÇÕES
// ============================================

// Função que busca um tênis aleatório
function buscarTenisAleatorio() {
    //chama a função principal passando a URL da API
    buscarTenis(`${API}/aleatorio`);
}

// Função que busca tênis por marca
function buscarTenisPorMarca() {
    // pega o valor digitado no campo de input
    // trim() - remove espaços em branco no início e no final
    const marca = breedInput.value.trim().toLowerCase();

    // verificar se o usuario digitou alguma coisa
    if (!marca) {
        // se não digitou nada, mostra um alerta
        alert("Digite uma marca de tênis!");
        return;
    }
    // chamar a API passando a marca na URL
    // exemplo: /api/tenis/marca/nike
    buscarTenis(`${API}/marca/${marca}`);
}

//============================================
// EVENTOS
//============================================

// quando o usuario clicar no botão "aleatório"
randomBtn.addEventListener("click", buscarTenisAleatorio);

// quando o usuario clicar no botão "buscar"
searchBtn.addEventListener("click", buscarTenisPorMarca);

// quando clicar na imagem do tênis
// carrega outro tênis aleatório
dogImage.addEventListener("click", buscarTenisAleatorio);

// quando o usuario apertar a tecla "Enter" no campo de input
breedInput.addEventListener("keydown", (event) => {
    // verifica se a tecla pressionada foi enter
    if (event.key === "Enter") {
        // chama a função que busca tênis por marca
        buscarTenisPorMarca();
    }
});

// Carrega ao Abrir a Página
buscarTenisAleatorio();