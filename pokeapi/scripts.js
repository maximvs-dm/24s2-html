function criaCard(dados) {
  const container = document.getElementById("container");

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
  vida.textContent = `${dados.hp} HP`;

  card.appendChild(foto);
  card.appendChild(nome);
  card.appendChild(vida);

  container.appendChild(card);
}

function buscaPokemon() {
  const input = document.getElementById("nome-pokemon");
  const nome = input.value;

  console.log("valor digitado:", nome);

  if (!nome) {
    alert("Digite o nome de um Pokemon para buscar!");
    return null;
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${nome}`;

  fetch(url)
    .then((resposta) => {
      if (resposta.status === 404) {
        throw new Error("Pokemon não encontrado.");
      }
      if (resposta.status !== 200) {
        throw new Error("Erro desconhecido");
      }

      return resposta.json();
    })
    .then((dados) => {
      const hpStat = dados.stats.find((f) => f.stat.name === "hp");
      console.log(hpStat);
      const dadosUteis = {
        imageSrc: dados.sprites.front_default,
        nome: dados.name,
        hp: hpStat.base_stat,
      };
      criaCard(dadosUteis);
    })
    .catch((erro) => alert(erro.message));
}

// {
//   base_stat: 35;
//   stat: {
//     name: "hp";
//   }
// }

const btnBuscar = document.getElementById("buscar-pokemon");
btnBuscar.addEventListener("click", buscaPokemon);
