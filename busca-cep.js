const URL_BASE_VIACEP = "https://viacep.com.br/ws";

function preencheInput(id, valor) {
  const input = document.getElementById(id);
  input.value = valor;
  input.readOnly = true;
}

function preencheForm(dados) {
  preencheInput("rua", dados.logradouro);
  preencheInput("bairro", dados.bairro);
  preencheInput("cidade", dados.localidade);
  preencheInput("estado", dados.uf);

  const inputNumero = document.getElementById("numero");
  inputNumero.focus();
}

function msgErro(erro) {
  console.log(erro);
  alert("Não foi possível buscar o cep, preencha manualmente os campos.");
}

function buscaCep() {
  const inputCep = document.getElementById("input-cep");

  const cep = inputCep.value.replaceAll(/\D/g, "");

  if (cep.length !== 8) {
    alert("O CEP digitado é inválido, corrija o valor e tente novamente.");
    return null;
  }

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
    .catch(msgErro);
}

btn = document.getElementById("btn-buscar");
btn.addEventListener("click", buscaCep);
