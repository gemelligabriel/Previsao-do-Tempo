import { updateWeather, mostrarCards } from "./api.js";

const closeW = document.querySelector(".close__window");
const sectionInfos = document.querySelector("#section__infos");
const li = document.querySelectorAll(".li__upcoming__days");
const locationInput = document.getElementById("location__input");
const centralizado = document.querySelector("#centraliza");
const tabelinha = document.querySelector("#tabelinha");

let listaDiasLocais = []; // Para guardar os dados que vêm da API
let i = [...li].findIndex((el) => el.classList.contains("active"));
if (i === -1) i = 0;

function updateActive() {
  li.forEach((el) => el.classList.remove("active"));
  li[i].classList.add("active");
}

//setinha louca
function arrow(x) {
  if (listaDiasLocais.length > 0) {
    i = (i + x + li.length) % li.length;
    updateActive();
    mostrarCards(listaDiasLocais, i);
  }
}

//enviar
async function enviar() {
  const valorInput = locationInput.value.trim();
  if (valorInput !== "") {
    const dados = await updateWeather(valorInput);
    if (dados) {
      listaDiasLocais = dados;
      locationInput.value = "";
      centralizado.classList.remove("centraliza");
      tabelinha.classList.remove("hidden");
    }
  }
}

//teclado
window.addEventListener("keydown", (clicada) => {
  if (clicada.key === "ArrowRight") arrow(1);
  if (clicada.key === "ArrowLeft") arrow(-1);
  if (clicada.key === "Escape") sectionInfos.classList.add("hidden");
  if (clicada.key === "Enter" && document.activeElement === locationInput) {
    enviar();
  }
});

//mouse
li.forEach((item, index) => {
  item.addEventListener("click", () => {
    if (listaDiasLocais.length > 0) {
      i = index;
      updateActive();
      sectionInfos.classList.remove("hidden");
      mostrarCards(listaDiasLocais, i);
    }
  });
});

closeW.addEventListener("click", () => {
  sectionInfos.classList.add("hidden");
});
