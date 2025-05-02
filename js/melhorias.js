/* Formulário */

function esconderFormulario() {
  var formulario = document.getElementById("formulario");
  var botao = document.getElementById("hidebtn");

  formulario.classList.toggle("hidden");
  botao.classList.toggle("button-right");
  botao.classList.toggle("rotated");

  botao.textContent = formulario.classList.contains("hidden") ? "<" : ">";
}

var SPMaskBehavior = function (val) {
  return val.replace(/\D/g, '').length === 11 
         ? '(00) 00000-0000' 
         : '(00) 0000-00009';
},
spOptions = {
  onKeyPress: function(val, e, field, options) {
    field.mask(SPMaskBehavior.apply({}, arguments), options);
  }
};

$('#telefone').mask(SPMaskBehavior, spOptions);

  function redirectToWhatsapp(event) {
    event.preventDefault();

    var nomeCliente = document.getElementById('nome').value.trim();
    var emailCliente = document.getElementById('email').value.trim();
    var telefoneCliente = document.getElementById('telefone').value.trim();
    var empresaCliente = document.getElementById('empresa') ? document.getElementById('empresa').value.trim() : '';
    var setorCliente = document.getElementById('setor') ? document.getElementById('setor').value.trim() : '';


    if (!nomeCliente) {
      alert("Por favor, preencha seu nome antes de continuar.");
      return;
    }

    
    if (!emailCliente || !emailCliente.includes('@')) {
      alert("Por favor, preencha seu email corretamente antes de continuar. Exemplo: fulano@gmail.com");
      return;
    }

     if (!telefoneCliente || telefoneCliente.replace(/\D/g, '').length < 10) {
    alert("Por favor, preencha seu telefone corretamente antes de continuar.");
    return;
  }
    
  var dadosCliente = {
    nome: nomeCliente,
    email: emailCliente,
    telefone: telefoneCliente,
    empresa: empresaCliente,
    setor: setorCliente
  };

  
  fetch('http://localhost:3000/solicitacao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosCliente)
  })
  .then(response => response.json())
  .then(result => {
    console.log(result.mensagem);
    
    var mensagem = "Ol%C3%A1,%20meu%20nome%20%C3%A9%20" + encodeURIComponent(nomeCliente) + "%21%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20sistema%20da%20Usicode.";
    var urlWhatsapp = "https://wa.me/5511970861268?text=" + mensagem;
    window.open(urlWhatsapp, '_blank');
  })
  .catch(error => {
    console.error('Erro ao enviar dados:', error);
    alert("Ocorreu um erro ao enviar os dados. Tente novamente.");
  });
}

/* Botão de rotacionar */

const buttons = document.querySelectorAll('.benefits');

buttons.forEach((button) => {
  button.addEventListener('click', function () {
    const content = this.nextElementSibling;

    document.querySelectorAll('.benefits').forEach((otherButton) => {
      const otherContent = otherButton.nextElementSibling;

      if (otherButton !== this && otherContent.classList.contains('active')) {
        otherButton.classList.remove('rotate');
        otherContent.style.maxHeight = otherContent.scrollHeight + 'px';

        requestAnimationFrame(() => {
          otherContent.style.maxHeight = '0';
          otherContent.classList.remove('active');
        })
      }
    })

    this.classList.toggle('rotate');

    if (content.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 'px';
      requestAnimationFrame(() => {
        content.style.maxHeight = '0';
      content.classList.remove('active');
      })
    } else {
      content.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';

      const handler = () => {
        content.style.maxHeight = '';
        content.removeEventListener('transitionend', handler);
      };
      content.addEventListener('transitionend', handler);
    }
  });
});

/* logos dos cliente */

var swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
});





/* evento ao clicar no botão */ 

const arrows = document.querySelectorAll('.seta');

arrows.forEach((arrow, index) => {
  arrow.addEventListener('click', () => {
    
    arrows.forEach(a => a.classList.remove('custom-blink'));


    const nextArrow = arrows[index + 1];
    if (nextArrow) {
      nextArrow.classList.add('custom-blink');
    } else {

      setTimeout(() => {
        arrows.forEach(a => a.classList.remove('custom-blink'));
        arrows[0].classList.add('custom-blink');
      }, 1000);
    }
  });
});

/* animação do "Quem somos" */

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate')
      observer.unobserve(entry.target)
    }
  })
}, {root: null,
  rootMargin: '0px',
  threshold: 0.5
});

observer.observe(document.querySelector('.from-left'))
observer.observe(document.querySelector('.from-right'))

/* scrollar até o tópico "quem somos" */

document.getElementById("oquesomos").addEventListener("click", function() {
  const destino = document.getElementById("oquesomos");
  const offset = 100; 
  
  
  const position = destino.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top: position,
    behavior: "smooth"
  });
});


/* animação do h1 em "nosso sistema" */

const botoes = document.querySelectorAll('.benefits');
const titles = document.querySelectorAll('.title-destaque h1');

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    const content = botao.parentElement.querySelector('.benefits-content');
    const list = content.querySelector('ul');
    const itens = list ? list.querySelectorAll('li').length : 0;

    const isOpenNow = content.classList.toggle('open');

    if (isOpenNow && itens >= 6) {
      titles.forEach(h1 => h1.classList.add('animate-slide'));
    } else {
      titles.forEach(h1 => h1.classList.remove('animate-slide'));
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.logo-track');
  // 1. Clona tudo pra duplicar automaticamente
  track.innerHTML += track.innerHTML;

  // 2. Mede metade da largura total (original + clone)
  const scrollWidth = track.scrollWidth / 2;
  document.documentElement.style.setProperty('--scroll-width', `${scrollWidth}px`);
});

/* cookies */

  document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    // Se já tiver escolha, oculta o banner

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookies-choice', 'accepted');
      banner.classList.add('hidden');
    });

    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookies-choice', 'rejected');
      banner.classList.add('hidden');
    });
  });





    






