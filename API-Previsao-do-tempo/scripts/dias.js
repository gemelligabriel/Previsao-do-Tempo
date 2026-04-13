const date = new Date();
const days = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
];

const dias = [];

for (let i = 0; i < 7; i++) {
  const dia = document.querySelector(`#day${i}_h2`);
  if (dia) {
    dia.textContent = dayx(i);
    dias.push(dia);
  }
}
function dayx(x) {
  return days[(date.getDay() + x) % 7];
}
