function criaCard(dados) {
  const containerPai = document.getElementById("container");

  const card = document.createElement("div");
  card.style.border = "solid 1px black";
  card.style.borderRadius = "8px";
  card.style.textAlign = "center";
  card.style.padding = "4px";
  card.style.margin = "4px";
  card.style.width = "fit-content";

  const foto = document.createElement("img");
  const nome = document.createElement("p");
  const vida = document.createElement("p");

  foto.src = dados.imageSrc;
  nome.textContent = dados.nome;
  vida.textContent = dados.hp;

  card.appendChild(foto); //sprites.front_default
  card.appendChild(nome); //name
  card.appendChild(vida);

  containerPai.appendChild(card);
}

// {
//   base_stat: 35,
//   stat: {
//     name: "hp"
//   }
// }

function buscaPokemon() {
  const input = document.getElementById("nome-pokemon");
  const nome = input.value;

  // console.log("nome digitado:", nome);

  if (!nome) {
    alert("Digite o nome do Pokemon");
    return null;
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${nome}`;

  fetch(url)
    .then((resposta) => {
      if (resposta.status === 404) {
        throw new Error("Pokemon não encontrado");
      }
      if (resposta.status !== 200) {
        throw new Error("Erro desconhecido");
      }
      return resposta.json();
    })
    .then((dados) => {
      const hpStat = dados.stats.find((f) => f.stat.name === "hp");
      // console.log(hpStat);

      const dadosUteis = {
        imageSrc: dados.sprites.front_default,
        nome: dados.name,
        hp: hpStat.base_stat,
      };

      // console.log(dadosUteis);
      criaCard(dadosUteis);
    })
    .then(() => (input.value = ""))
    .catch((erro) => alert(erro.message));
}

const btnBuscar = document.getElementById("buscar-pokemon");
const inputNome = document.getElementById("nome-pokemon");
btnBuscar.addEventListener("click", buscaPokemon);
inputNome.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    evento.preventDefault();
    buscaPokemon();
  }
});
