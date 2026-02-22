// ==== CONFIGURAÇÕES ====
const CONFIG = {
    whatsappNumber: '5511999998888',
    webhookUrl: '' // Make.com/n8n URL
  };
  
  let leadLocation = "sua região"; 
  fetch('https://ipapi.co/json/').then(r=>r.json()).then(d=>{ if(d.city) leadLocation = d.city; }).catch(()=>{});
  
  // O DIAGNÓSTICO
  const QUESTIONS = [
    {
      id: 'gargalo', label: 'PASSO 1 DE 5',
      title: 'Onde está o maior gargalo da sua empresa?',
      desc: 'Selecione a área que mais "sangra" tempo ou dinheiro.',
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
      desc: 'Seja sincero sobre o dia a dia da equipe.',
      type: 'options',
      options: [
        { icon: 'alert-triangle', title: 'Caótico', sub: 'Erros frequentes, tudo manual' },
        { icon: 'lock', title: 'Engessado', sub: 'Temos sistemas, mas exigem esforço' },
        { icon: 'activity', title: 'No limite', sub: 'Funciona, mas não aguenta o dobro de vendas' }
      ]
    },
    {
      id: 'faturamento', label: 'PASSO 3 DE 5',
      title: 'Qual a faixa de faturamento mensal?',
      desc: 'Isso determina o custo do desperdício operacional.',
      type: 'options',
      options: [
        { icon: 'wallet', title: 'Até R$ 50 mil', sub: 'Fase inicial' },
        { icon: 'briefcase', title: 'R$ 50k a R$ 200k', sub: 'Ganhando tração' },
        { icon: 'landmark', title: 'Acima de R$ 200k', sub: 'Operação consolidada' }
      ]
    },
    {
      id: 'contato', label: 'PASSO 4 DE 5',
      title: 'Para onde enviamos a análise?',
      desc: 'Informe os dados corporativos do decisor.',
      type: 'text',
      fields: [
        { id: 'nome', placeholder: 'Seu Nome' },
        { id: 'empresa', placeholder: 'Nome da Empresa' },
        { id: 'whatsapp', placeholder: 'WhatsApp (com DDD)' }
      ]
    }
  ];
  
  let currentStep = 0;
  let answers = {};
  let textData = {};
  
  // QUANDO O SITE CARREGA
  document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializa Ícones
    lucide.createIcons();
  
    // Intersecion Observer para Animações Reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
    // Menu Mobile
    document.querySelector('.js-toggle-menu').addEventListener('click', () => {
      document.getElementById('mobile-menu').classList.toggle('open');
    });
    document.querySelectorAll('.js-close-menu').forEach(btn => {
      btn.addEventListener('click', () => document.getElementById('mobile-menu').classList.remove('open'));
    });
  
    // Botões de Abrir Quiz (ISSO RESOLVE O BUG DOS BOTÕES)
    document.querySelectorAll('.js-open-quiz').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openQuiz();
      });
    });
  
    // Botão Fechar Quiz
    document.querySelector('.js-close-quiz').addEventListener('click', closeQuiz);
  });
  
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
    const progress = document.getElementById('quiz-progress-fill');
    progress.style.width = `${(currentStep / (QUESTIONS.length)) * 100}%`;
  
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
        html += `<div class="q-nav"><button class="btn-ghost js-prev"><i data-lucide="arrow-left"></i> Voltar</button></div>`;
      }
      body.innerHTML = html;
  
      // Binda os cliques das opções
      body.querySelectorAll('.q-option').forEach(opt => {
        opt.addEventListener('click', function() {
          answers[q.id] = parseInt(this.getAttribute('data-index'));
          renderStep(); // re-render to show selection
          setTimeout(() => { nextStep(); }, 300);
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
          <button class="btn-ghost js-prev"><i data-lucide="arrow-left"></i> Voltar</button>
          <button class="btn-primary js-next">Finalizar Análise <i data-lucide="arrow-right"></i></button>
        </div>`;
      body.innerHTML = html;
      
      body.querySelector('.js-next').addEventListener('click', handleTextSubmit);
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
        el.classList.remove('error');
        document.getElementById(`err-${f.id}`).style.display = 'none';
        textData[f.id] = el.value.trim();
      }
    });
    if(!hasError) nextStep();
  }
  
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
        <i data-lucide="check-circle" style="color:var(--blue); width:48px; height:48px;"></i>
      </div>
      <div class="result-box">
        <div class="alert-tag"><i data-lucide="alert-triangle"></i> Risco Competitivo Detectado</div>
        <h2 class="result-header-text">${nome}, analisamos o cenário da ${textData.empresa || 'sua empresa'}.</h2>
        <p style="color:rgba(255,255,255,0.8); line-height:1.6; margin-bottom:24px;">
          Empresas em <b>${leadLocation}</b> com o seu perfil estão escalando usando integrações automáticas. Operar de forma manual está causando uma sangria financeira invisível.
        </p>
        <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:12px;">
          <div class="loss-desc">Estimativa de perda mensal de produtividade/vendas:</div>
          <div class="loss-value">Até ${perda}</div>
        </div>
      </div>
      <button class="btn-primary btn-large js-wpp" style="width:100%; justify-content:center;">
        <i data-lucide="calendar"></i> Agendar Desenho da Arquitetura
      </button>
    `;
    lucide.createIcons();
  
    body.querySelector('.js-wpp').addEventListener('click', () => {
      // Dispara Webhook
      if(CONFIG.webhookUrl) {
        fetch(CONFIG.webhookUrl, { method: 'POST', body: JSON.stringify({dados: textData, respostas: answers})}).catch(()=>{});
      }
      // Abre WPP
      const msg = `Olá, sou ${nome}. Concluí o diagnóstico e descobri a perda financeira da minha operação. Quero conversar sobre como a BG Tech pode resolver isso.`;
      window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
