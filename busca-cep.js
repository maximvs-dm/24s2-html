const URL_BASE_VIACEP = "https://viacep.com.br/ws";
const IS_NOT_DIGIT_REGEX = /\D/g;
const IS_DIGIT_REGEX = /\d/;

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

  const cep = inputCep.value.replaceAll(IS_NOT_DIGIT_REGEX, "");

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

function validateKey(event) {
  const isDigit = IS_DIGIT_REGEX.test(event.key);
  // const isDelete = ["Backspace", "Delete"].includes(event.key);
  // const isArrow = ["ArrowLeft", "ArrowRight"].includes(event.key);
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];

  if (!isDigit && !allowedKeys.includes(event.key)) event.preventDefault();
}

function clearField(id) {
  const input = document.getElementById(id);
  input.value = "";
  input.readOnly = false;
}

function clearFields(event) {
  if (!["Backspace", "Delete"].includes(event.key)) {
    return null;
  }

  clearField("rua");
  clearField("bairro");
  clearField("cidade");
  clearField("estado");
}

async function getCepData(cep) {
  const url = `${URL_BASE_VIACEP}/${cep}/json/`;

  console.log("chamando o viacep");
  const response = await fetch(url);
  console.log("convertendo para json");
  const dados = await response.json();
  console.log(dados);

  if ("erro" in dados) {
    throw new Error("CEP não encontrado");
  }

  return dados;
}

async function handleKeyUp(event) {
  const valorAtual = event.target.value;
  console.log({ key: event.key, valorAtual });

  if (valorAtual.length !== 8) {
    console.log("ainda não tem 8 dígitos, retornando nulo");
    return null;
  }

  try {
    const dadosCep = await getCepData(valorAtual);
    preencheForm(dadosCep);
  } catch (e) {
    alert("CEP não encontrado");
    console.log(e);
  }
}

// event.target.value = valorAtual.replaceAll(IS_NOT_DIGIT_REGEX, "");
const inputCep = document.getElementById("input-cep");
inputCep.addEventListener("keydown", validateKey);
inputCep.addEventListener("keydown", clearFields);
inputCep.addEventListener("keyup", handleKeyUp);
