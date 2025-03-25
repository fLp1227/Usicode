function esconderFormulario() {
  var formulario = document.getElementById("formulario");
  var botao = document.getElementById("hidebtn");

  formulario.classList.toggle("hidden");
  botao.classList.toggle("button-right");
  botao.classList.toggle("rotated");

  botao.textContent = formulario.classList.contains("hidden") ? "<" : ">";
}

  function redirectToWhatsapp(event) {
    event.preventDefault();

    var nomeCliente = document.getElementById('nome').value.trim();
    var emailCliente = document.getElementById('email').value.trim()
    var telefoneCliente = document.getElementById('telefone').value.trim()

    if (!nomeCliente) {
      alert("Por favor, preencha seu nome antes de continuar.");
      return;
    }

    
    if (!emailCliente || !emailCliente.includes('@')) {
      alert("Por favor, preencha seu email corretamente antes de continuar. Exemplo: fulano@gmail.com");
      return;
    }

    if (!telefoneCliente || !telefoneCliente < 14) {

      alert("Por favor, preencha seu telefone corretamente antes de continuar.");
      return;
    }
    
    var mensagem = "Ol%C3%A1,%20meu%20nome%20%C3%A9%20" + encodeURIComponent(nomeCliente) + "%21%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20sistema%20da%20Usicode.";

    var urlWhatsapp = "https://wa.me/5511970861268?text=" + mensagem;

    window.open(urlWhatsapp, '_blank');
}

function formatarTelefone(event) {
  var input = event.target;
  var telefone = input.value.replace(/\D/g, "");

  if (telefone.length > 11) {
    telefone = telefone.slice(0, 11);
  }

  if (telefone.length >= 11) {
    input.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
  } else if (telefone.length >= 6) {
    input.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 6)}-${telefone.slice(6)}`;
  } else if (telefone.length >= 3) {
    input.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
  } else if (telefone.length >= 2) {
    input.value = `(${telefone})`;
  } else {
    input.value = telefone;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var telefoneInput = document.getElementById("telefone");
  if (telefoneInput) {
    telefoneInput.addEventListener("input", formatarTelefone);
  }
});
