function esconderFormulario() {
  var formulario = document.getElementById("formulario");
  var botao = document.getElementById("hidebtn");

  formulario.classList.toggle("hidden");
  botao.classList.toggle("button-right");
  botao.classList.toggle("rotated");

  botao.textContent = formulario.classList.contains("hidden") ? "<" : ">";
}
