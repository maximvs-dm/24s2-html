const BASE_URL_VIACEP = "https://viacep.com.br/ws";

// bairro: "Bom Retiro"
// estado: "São Paulo"
// localidade: "São Paulo"
// logradouro: "Rua Ribeiro de Lima"

function preencheInput(id, valor) {
  const input = document.getElementById(id);
  input.value = valor;
  input.readOnly = true;
}

function preencheCep(dados) {
  preencheInput("rua", dados.logradouro);
  preencheInput("bairro", dados.bairro);
  preencheInput("cidade", dados.localidade);
  preencheInput("estado", dados.uf);

  const inputNumero = document.getElementById("numero");
  inputNumero.focus();
}

function buscaCep() {
  inputCep = document.getElementById("input-cep");

  cep = inputCep.value.replaceAll(/\D/g, "");

  console.log("ciclou no botão", cep);

  if (cep.length !== 8) {
    alert("CEP inválido, verifique o valor digitado");
    return null;
  }

  inputCep.value = cep;

  const url = `${BASE_URL_VIACEP}/${cep}/json/`;

  fetch(url)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Erro ao consultar a api do viacep");
      }
      return response.json();
    })
    .then((dados) => {
      if ("erro" in dados && dados.erro === "true") {
        throw new Error("CEP não encontrado");
      }
      return dados;
    })
    .then(preencheCep)
    .catch((e) => {
      alert("Erro ao consultar o cep");
      console.log(e);
    });
}

btn = document.getElementById("btn-cep");
btn.addEventListener("click", buscaCep);
