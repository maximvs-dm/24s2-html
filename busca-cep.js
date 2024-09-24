const URL_BASE_VIACEP = "https://viacep.com.br/ws";

function preencheForm(dados) {
  console.log(dados);
}

function buscaCep() {
  const inputCep = document.getElementById("input-cep");

  const cep = inputCep.value;

  const url = `${URL_BASE_VIACEP}/${cep}/json/`;

  fetch(url)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Falha na requisição do cep");
      }
      return response.json();
    })
    .then((dados) => {
      if ("erro" in dados && dados.erro === "true") {
        throw new Error("CEP não encontrado");
      }
      return dados;
    })
    .then(preencheForm)
    .catch((erro) => console.log(erro));
}

btn = document.getElementById("btn-buscar");
btn.addEventListener("click", buscaCep);
