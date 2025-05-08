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
    setor: setorCliente,
    sendEmail: true
    
  };

  
  fetch('http://192.168.0.123:3000/solicitacao', {
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

const dadosCliente = { nome, email, telefone, empresa, setor, sendEmail: true };


/* Botão de rotacionar */

const buttons = document.querySelectorAll('.benefits');

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.innerWidth < 768;

  const resetAll = () => {
    buttons.forEach((btn) => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.icon');
      btn.classList.remove('rotate');
      content.classList.remove('active');
      content.style.maxHeight = '0';
      icon.innerHTML = '<i class="fa-solid fa-arrow-right seta"></i>';
    });
  };

  if (!isMobile) {
  
    const openFirstItem = () => {
      const firstButton = buttons[0];
      const firstContent = firstButton.nextElementSibling;
      const firstIcon = firstButton.querySelector('.icon');

      firstButton.classList.add('rotate');
      firstContent.classList.add('active');
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
      firstIcon.innerHTML = '<i class="fa-solid fa-arrow-down seta"></i>';

      if (buttons[1]) {
        const iconSpan = buttons[1].querySelector('.icon');
        iconSpan.innerHTML = '<i class="fa-solid fa-hand-point-right fa-bounce"></i>';
      }
    };

    openFirstItem();

    buttons.forEach((button, index) => {
      button.addEventListener('click', function () {
        resetAll();

        const content = this.nextElementSibling;
        const iconSpan = this.querySelector('.icon');

        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        this.classList.add('rotate');
        iconSpan.innerHTML = '<i class="fa-solid fa-arrow-down seta"></i>';

        if (index < buttons.length - 1) {
          const nextIconSpan = buttons[index + 1].querySelector('.icon');
          nextIconSpan.innerHTML = '<i class="fa-solid fa-hand-point-right fa-bounce"></i>';
        }

        if (index === buttons.length - 1) {
          setTimeout(() => {
            resetAll();
            openFirstItem();
          }, 5000);
        }
      });
    });
  } else {
    resetAll();

    const firstIcon = buttons[0].querySelector('.icon');
    firstIcon.innerHTML = '<i class="fa-solid fa-hand-point-right fa-bounce"></i>';

    buttons.forEach((button, index) => {
      button.addEventListener('click', function () {
        const content = this.nextElementSibling;
        const iconSpan = this.querySelector('.icon');
        const isActive = content.classList.contains('active');

        resetAll();

        if (!isActive) {

          content.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          button.classList.add('rotate');
          iconSpan.innerHTML = '<i class="fa-solid fa-arrow-down seta"></i>';

          if (index + 1 < buttons.length) {
            const nextIcon = buttons[index + 1].querySelector('.icon');
            nextIcon.innerHTML = '<i class="fa-solid fa-hand-point-right fa-bounce"></i>';
          }
        } else {
          const firstIconAgain = buttons[0].querySelector('.icon');
          firstIconAgain.innerHTML = '<i class="fa-solid fa-hand-point-right fa-bounce"></i>';
        }
      });
    });
  }
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

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookies-choice', 'accepted');
      banner.classList.add('hidden');
    });

    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookies-choice', 'rejected');
      banner.classList.add('hidden');
    });
  });


document.addEventListener("DOMContentLoaded", function () {
  const isMobile = /iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Aqui está a correção: mudamos .phone-link para .number
  const phoneLinks = document.querySelectorAll(".number[data-phone]");
  
  phoneLinks.forEach(link => {
    const rawPhone = link.getAttribute("data-phone");
    
    if (isMobile) {
      link.href = `tel:${rawPhone}`;
    } else {
      link.href = `https://wa.me/${rawPhone}`;
      link.target = "_blank";
    }
  });
});



document.addEventListener('click', function(event) {
  // Aplica somente em telas menores que 768px (ex: celular)
  if (window.innerWidth < 500) {
    var menu = document.getElementById('navbar');
    var isClickInsideMenu = menu.contains(event.target);
    var isClickOnToggle = document.querySelector('.navbar-toggle').contains(event.target);

    // Se o menu estiver aberto e o clique for fora dele e fora do botão de abrir
    if (menu.classList.contains('in') && !isClickInsideMenu && !isClickOnToggle) {
      menu.classList.remove('in');
      menu.classList.add('collapse');
    }
  }
});

