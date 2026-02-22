// ==== CONFIGURAÇÕES DA BG TECH ====
const CONFIG = {
    whatsappNumber: '5511999998888', // Coloque o seu numero real
    webhookUrl: '' // Se tiver Make.com, coloque aqui depois
  };
  
  let leadLocation = "sua região"; 
  fetch('https://ipapi.co/json/').then(r=>r.json()).then(d=>{ if(d.city) leadLocation = d.city; }).catch(()=>{});
  
  // O FUNIL DE VENDAS (SPIN SELLING)
  const QUESTIONS = [
    {
      id: 'gargalo', label: 'PASSO 1 DE 5',
      title: 'Onde está o maior gargalo da sua empresa?',
      desc: 'Selecione a área que mais "sangra" tempo ou dinheiro da operação.',
      type: 'options',
      options: [
        { icon: 'trending-down', title: 'Vendas e Comercial', sub: 'Leads demoram a ser atendidos' },
        { icon: 'settings', title: 'Operação e Entregas', sub: 'Processos manuais e retrabalho' },
        { icon: 'pie-chart', title: 'Gestão e Financeiro', sub: 'Falta de dados confiáveis' },
        { icon: 'cable', title: 'Tecnologia Fragmentada', sub: 'Sistemas que não se falam' }
      ]
    },
    {
      id: 'caos', label: 'PASSO 2 DE 5',
      title: 'Como está o nível da sua operação hoje?',
      desc: 'Seja 100% sincero sobre a rotina da equipe.',
      type: 'options',
      options: [
        { icon: 'alert-triangle', title: 'Caótico', sub: 'Erros frequentes, quase tudo é manual' },
        { icon: 'lock', title: 'Engessado', sub: 'Temos sistemas, mas exigem muito esforço' },
        { icon: 'activity', title: 'No limite', sub: 'Funciona, mas quebra se as vendas dobrarem' }
      ]
    },
    {
      id: 'faturamento', label: 'PASSO 3 DE 5',
      title: 'Qual a faixa de faturamento mensal?',
      desc: 'Isso determina o custo do desperdício operacional em reais.',
      type: 'options',
      options: [
        { icon: 'wallet', title: 'Até R$ 50 mil', sub: 'Fase de validação/tração' },
        { icon: 'briefcase', title: 'R$ 50k a R$ 200k', sub: 'Crescimento ativo' },
        { icon: 'landmark', title: 'Acima de R$ 200k', sub: 'Operação de alta complexidade' }
      ]
    },
    {
      id: 'contato', label: 'PASSO 4 DE 5',
      title: 'Para onde enviamos a análise?',
      desc: 'Seu diagnóstico está pronto. Informe os dados corporativos.',
      type: 'text',
      fields: [
        { id: 'nome', placeholder: 'Seu Nome e Cargo (Ex: Daniel - CEO)' },
        { id: 'empresa', placeholder: 'Nome da Empresa' },
        { id: 'whatsapp', placeholder: 'WhatsApp (com DDD)' }
      ]
    }
  ];
  
  let currentStep = 0;
  let answers = {};
  let textData = {};
  
  // INICIALIZAÇÃO BLINDADA
  document.addEventListener('DOMContentLoaded', () => {
    
    // Ícones do Lucide
    lucide.createIcons();
  
    // Animações Reveal ao rolar a página
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
    // Scroll do Header (Glassmorphism)
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      if(window.scrollY > 60) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  
    // Menu Mobile
    const mobileMenu = document.getElementById('mobile-menu');
    document.querySelector('.js-toggle-menu').addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    document.querySelectorAll('.js-close-menu').forEach(btn => {
      btn.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  
    // Acionadores do Quiz (Isso conserta o bug dos botões mortos)
    document.querySelectorAll('.js-open-quiz').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openQuiz();
      });
    });
  
    document.querySelector('.js-close-quiz').addEventListener('click', closeQuiz);
  });
  
  // LOGICA DO QUIZ
  function openQuiz() {
    currentStep = 0; answers = {}; textData = {};
    document.getElementById('quiz-overlay').classList.add('open');
    document.body.classList.add('modal-open');
    renderStep();
  }
  
  function closeQuiz() {
    document.getElementById('quiz-overlay').classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  
  function renderStep() {
    const q = QUESTIONS[currentStep];
    const body = document.getElementById('quiz-body');
    document.getElementById('quiz-progress-fill').style.width = `${(currentStep / QUESTIONS.length) * 100}%`;
  
    if (q.type === 'options') {
      let html = `<span class="q-label">${q.label}</span><h2 class="q-title">${q.title}</h2><p class="q-desc">${q.desc}</p><div class="q-options">`;
      q.options.forEach((opt, i) => {
        const isSelected = answers[q.id] === i ? 'selected' : '';
        html += `
          <div class="q-option ${isSelected}" data-index="${i}">
            <div class="q-icon"><i data-lucide="${opt.icon}"></i></div>
            <div class="q-text"><strong>${opt.title}</strong><span>${opt.sub}</span></div>
            <div class="q-check"><i data-lucide="check-circle-2"></i></div>
          </div>`;
      });
      html += `</div>`;
      
      if(currentStep > 0) {
        html += `<div class="q-nav"><button class="btn-ghost js-prev"><i data-lucide="arrow-left" width="16"></i> Voltar</button></div>`;
      }
      body.innerHTML = html;
  
      body.querySelectorAll('.q-option').forEach(opt => {
        opt.addEventListener('click', function() {
          answers[q.id] = parseInt(this.getAttribute('data-index'));
          renderStep();
          setTimeout(() => { nextStep(); }, 350); // Delay suave
        });
      });
  
    } else {
      let html = `<span class="q-label">${q.label}</span><h2 class="q-title">${q.title}</h2><p class="q-desc">${q.desc}</p>`;
      q.fields.forEach(f => {
        html += `<div class="q-input-group">
                  <input type="text" class="q-input" id="inp-${f.id}" placeholder="${f.placeholder}" value="${textData[f.id]||''}">
                  <div class="q-error-msg" id="err-${f.id}">Preenchimento obrigatório</div>
                 </div>`;
      });
      html += `
        <div class="q-nav">
          <button class="btn-ghost js-prev"><i data-lucide="arrow-left" width="16"></i> Voltar</button>
          <button class="btn-primary js-next">Finalizar Análise <i data-lucide="arrow-right" width="16"></i></button>
        </div>`;
      body.innerHTML = html;
      
      body.querySelector('.js-next').addEventListener('click', handleTextSubmit);
      
      // Remove erro ao digitar
      q.fields.forEach(f => {
          document.getElementById(`inp-${f.id}`).addEventListener('input', function() {
              this.classList.remove('error');
              document.getElementById(`err-${f.id}`).style.display = 'none';
          });
      });
    }
  
    if(body.querySelector('.js-prev')) {
      body.querySelector('.js-prev').addEventListener('click', () => { currentStep--; renderStep(); });
    }
    
    lucide.createIcons();
  }
  
  function nextStep() {
    if (currentStep < QUESTIONS.length - 1) {
      currentStep++; renderStep();
    } else {
      showResult();
    }
  }
  
  function handleTextSubmit() {
    const q = QUESTIONS[currentStep];
    let hasError = false;
    q.fields.forEach(f => {
      const el = document.getElementById(`inp-${f.id}`);
      if(!el.value.trim()) {
        hasError = true;
        el.classList.add('error');
        document.getElementById(`err-${f.id}`).style.display = 'block';
      } else {
        textData[f.id] = el.value.trim();
      }
    });
    if(!hasError) showResult(); // Vai direto para o resultado após validar contato
  }
  
  // TELA DE RESULTADO MATADORA (NEUROMARKETING)
  function showResult() {
    document.getElementById('quiz-progress-fill').style.width = '100%';
    const body = document.getElementById('quiz-body');
    
    const fat = answers['faturamento'];
    let perda = "R$ 4.500";
    if(fat === 1) perda = "R$ 14.800";
    if(fat === 2) perda = "R$ 38.500+";
  
    const nome = textData.nome ? textData.nome.split(' ')[0] : 'Gestor';
    
    body.innerHTML = `
      <div style="text-align:center; margin-bottom:24px;">
        <i data-lucide="check-circle" style="color:var(--blue); width:56px; height:56px;"></i>
      </div>
      <div class="result-box">
        <div class="alert-tag"><i data-lucide="alert-triangle" width="16"></i> Risco Competitivo Detectado</div>
        <h2 class="q-title" style="color:var(--text-heading); font-size:22px;">${nome}, a operação da ${textData.empresa || 'sua empresa'} está vulnerável.</h2>
        <p style="color:var(--text-muted); line-height:1.6; margin-bottom:24px; font-size: 15px;">
          Empresas em <b>${leadLocation}</b> com o seu perfil estão escalando usando automação. Operar de forma manual neste nível está causando uma sangria invisível todos os dias.
        </p>
        <div style="background:white; border: 1px solid var(--border-light); padding:24px; border-radius:12px;">
          <div class="loss-desc">Estimativa de desperdício mensal:</div>
          <div class="loss-value">Até ${perda}</div>
          <p style="font-size:13px; color:var(--text-muted); font-weight: 500;">Valor sendo corroído direto da sua margem de lucro.</p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <h3 style="font-family: var(--font-display); font-size: 18px; color: var(--text-heading); margin-bottom: 16px;">Nós desenhamos a solução para estancar isso.</h3>
        <button class="btn-primary js-wpp" style="width:100%; padding: 20px; font-size: 16px;">
          <i data-lucide="calendar"></i> Agendar Desenho da Arquitetura
        </button>
      </div>
    `;
    lucide.createIcons();
  
    body.querySelector('.js-wpp').addEventListener('click', () => {
      if(CONFIG.webhookUrl) {
        fetch(CONFIG.webhookUrl, { method: 'POST', body: JSON.stringify({dados: textData, respostas: answers})}).catch(()=>{});
      }
      const msg = `Olá, sou ${nome}. Concluí o diagnóstico da BG Tech e descobri a perda financeira da minha operação. Quero conversar sobre como resolver isso com tecnologia.`;
      window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
