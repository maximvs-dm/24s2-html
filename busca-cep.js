const BASE_URL_VIACEP = "https://viacep.com.br/ws";

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
  const inputCep = document.getElementById("input-cep");

  const cep = inputCep.value.replaceAll(/\D/g, "");

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

const IS_DIGIT_REGEX = /\d/;

const btn = document.getElementById("btn-cep");
btn.addEventListener("click", buscaCep);

async function getCep(cep) {
  const url = `${BASE_URL_VIACEP}/${cep}/json/`;
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error("Falha na comunicação com a API do ViaCep")
  }

  const dados = await response.json();

  if ("erro" in dados) {
    throw new Error("Cep não encontrado");
  }

  return dados;
}

function handleKeyDown(event) {
  const isDigit = IS_DIGIT_REGEX.test(event.key);
  const allowedKeys = ["ArrowRight", "ArrowLeft", "Backspace", "Delete"];
  const valorAtual = event.target.value;
  console.log("down", { tecla: event.key, isDigit, valorAtual });
  if (!isDigit && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}

async function handleKeyUp(event) {
  const valorAtual = event.target.value;
  console.log("up", { valorAtual });

  if (valorAtual.length !== 8) {
    return null;
  }

  try {
    const dadosCep = await getCep(valorAtual);
    preencheCep(dadosCep);
  } catch (e) {
    alert(e.message);
  }
}

const inputCep = document.getElementById("input-cep");
inputCep.addEventListener("keydown", handleKeyDown);
inputCep.addEventListener("keyup", handleKeyUp);
