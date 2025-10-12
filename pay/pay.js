document.addEventListener('DOMContentLoaded', () => {
  // Links oficiais dos bancos (intents) fornecidos pelo usuário

/* ======== UTIL ======== */
function extractSchemeName(s) {
  if (!s) return null;
  return String(s).split(':')[0].replace(/\/+$/, '');
}
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

/* ======== OPEN BANK (robusto) ========
 - Deve ser chamado dentro de um handler de clique (user gesture).
 - Estratégia:
    1) se directLink -> location.href (é o jeito mais limpo)
    2) se scheme -> try location.href (user gesture); depois intent fallback
    3) se intent pronto -> criar <a href=intent..> e clicar (melhor compat)
    4) fallback pra store/web
 - Usa visibilitychange + blur como heurística para detectar sucesso.
*/
function openBank(bank, opts = {}) {
  opts = Object.assign({ timeout: 1400, log: true }, opts);
  if (opts.log) console.log(`[openBank] tentando abrir ${bank.id}`, bank);

  // só funciona realmente em user gesture — log se não for
  // (não vamos bloquear execução, apenas avisamos)
  const userGesture = !!(window.event || (performance && performance.now()));
  if (!userGesture && opts.log) {
    console.warn('[openBank] recomendado chamar dentro de um click handler (user gesture).');
  }

  let handled = false;
  const start = Date.now();
  let fallbackT = null;

  function cleanup() {
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('blur', onBlur);
    if (fallbackT) clearTimeout(fallbackT);
  }
  function onVis() {
    if (document.visibilityState === 'hidden') {
      handled = true;
      if (opts.log) console.log('[openBank] detectado hidden -> app provavelmente abriu');
      cleanup();
    }
  }
  function onBlur() {
    // alguns browsers não mudam visibilityState; blur é bom complemento
    handled = true;
    if (opts.log) console.log('[openBank] detectado blur -> app provavelmente abriu');
    cleanup();
  }

  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('blur', onBlur);

  // Helper: redirect to store/web
  function doFallback() {
    cleanup();
    if (bank.store) {
      if (opts.log) console.log('[openBank] fallback -> Play Store', bank.store);
      window.location.href = bank.store;
    } else if (bank.web) {
      if (opts.log) console.log('[openBank] fallback -> web', bank.web);
      window.location.href = bank.web;
    } else {
      if (opts.log) console.warn('[openBank] sem fallback cadastrado para', bank.id);
    }
  }

  // 1) directLink
  if (bank.directLink) {
    if (opts.log) console.log('[openBank] usando directLink');
    window.location.href = bank.directLink;
    // aguarda heurística
    fallbackT = setTimeout(() => {
      if (!handled) doFallback();
    }, opts.timeout);
    return;
  }

  // 2) scheme (ex: nubank://)
  if (bank.scheme) {
    if (opts.log) console.log('[openBank] tentando scheme', bank.scheme);
    // location.href dentro do user gesture costuma funcionar
    try {
      window.location.href = bank.scheme;
    } catch (e) {
      if (opts.log) console.warn('[openBank] location.href scheme falhou', e);
    }

    // se não houver resposta em X ms, tenta montar intent:// com fallback
    fallbackT = setTimeout(() => {
      if (handled) return;
      if (bank.package) {
        const schemeName = extractSchemeName(bank.scheme) || bank.package;
        const fallbackUrl = bank.store ? encodeURIComponent(bank.store) : '';
        const intentUri = `intent://#Intent;scheme=${schemeName};package=${bank.package};S.browser_fallback_url=${fallbackUrl};end;`;
        if (opts.log) console.log('[openBank] tentando intent fallback', intentUri);
        // clicar em <a> é mais confiável que location.href em alguns Chrome
        const a = document.createElement('a');
        a.href = intentUri;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { try { a.remove(); } catch (e) {} }, 2000);
        // aguarda nova heurística
        fallbackT = setTimeout(() => {
          if (!handled) doFallback();
        }, opts.timeout);
      } else {
        // sem package, vai direto pra store/web
        doFallback();
      }
    }, 800); // breve: se o app não respondeu rápido, cai no intent
    return;
  }

  // 3) intent já pronto (use anchor click pattern)
  if (bank.intent) {
    if (opts.log) console.log('[openBank] tentando intent (anchor click)', bank.intent);
    const intentUri = bank.intent.startsWith('intent://') ? bank.intent : bank.intent.replace(/^intent:/, 'intent://');
    const a = document.createElement('a');
    a.href = intentUri;
    a.style.display = 'none';
    document.body.appendChild(a);
    // preferimos click do usuário — se este método for chamado dentro de um click, programmatic click costuma funcionar
    a.click();
    fallbackT = setTimeout(() => {
      if (!handled) doFallback();
      try { a.remove(); } catch(e){}
    }, opts.timeout);
    return;
  }

  // último recurso
  doFallback();
}

/* ======== EXEMPLO DE BANKS (corrigido com browser_fallback_url já montado) ======== */
const BANKS = [
  // Nubank: intent com browser_fallback_url já embutido
  {
    id: 'nubank',
    name: 'Nubank',
    logo: './logos/nubank.svg',
    intent: 'intent://#Intent;scheme=nubank;package=com.nu.production;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.nu.production;end;',
    package: 'com.nu.production',
    store: 'https://play.google.com/store/apps/details?id=com.nu.production',
    open() { openBank(this); }
  },

  // EFI (seu directLink)
  {
    id: 'efi',
    name: 'EFI Bank',
    logo: './logos/efi.svg',
    directLink: 'https://gerencianetapp.page.link/?link=https://play.google.com/store/apps/details?id=br.com.gerencianet.app&hl=pt-BR&apn=br.com.gerencianet.app&ibi=br.com.gerencianet.lite',
    package: 'br.com.gerencianet.app',
    store: 'https://play.google.com/store/apps/details?id=br.com.gerencianet.app',
    open() { openBank(this); }
  },

  // Exemplo Itaú (intent montado com fallback)
  {
    id: 'itau',
    name: 'Itaú',
    logo: './logos/itau.svg',
    intent: 'intent://#Intent;scheme=itau;package=com.itau;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.itau;end;',
    package: 'com.itau',
    store: 'https://play.google.com/store/apps/details?id=com.itau',
    open() { openBank(this); }
  }
  // ... complete com o resto da lista no mesmo padrão
];


  
  // segue o resto dos codigos
  const btn = document.getElementById('shareButton');

  const getShareData = () => ({
    title: document.title || 'Compartilhar',
    text: document.querySelector('meta[name="description"]')?.content || document.title || 'Confira esta página',
    url: location.href
  });

  const fallbackCopy = () => {
    const url = location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => alert('Link copiado para a área de transferência.'))
        .catch(() => prompt('Não foi possível copiar automaticamente. Copie o link abaixo:', url));
    } else {
      prompt('Copie o link:', url);
    }
  };

  btn?.addEventListener('click', async () => {
    const data = getShareData();
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (err) {
        // Se o usuário cancelar, não fazer nada; outros erros usam fallback
        if (!err || err.name !== 'AbortError') {
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  });
  // ===== Seção 1: habilitar "Continuar" quando valor válido =====
  const amountInput = document.getElementById('amountInput');
  const continueButton = document.getElementById('continueButton');
  const amountForm = document.getElementById('amountForm');

  // Helpers para formatação apenas na exibição do resumo
  const toCents = (raw) => {
    if (typeof raw !== 'string') return 0;
    const digits = raw.replace(/\D+/g, '');
    if (!digits) return 0;
    return parseInt(digits, 10);
  };
  const formatBRL = (raw) => {
    const cents = toCents(raw);
    const abs = Math.abs(cents);
    const intPart = Math.floor(abs / 100);
    const decPart = String(abs % 100).padStart(2, '0');
    const intStr = intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${intStr},${decPart}`;
  };
  // Leitura do valor do input a partir dos dígitos (compatível com máscara com vírgula)
  const readAmountNumber = () => {
    const raw = amountInput?.value?.trim() ?? '';
    const cents = toCents(raw); // extrai somente dígitos
    if (!cents) return NaN;
    return cents / 100;
  };

  const updateButtonState = () => {
    const v = readAmountNumber();
    const valid = Number.isFinite(v) && v > 0;
    if (continueButton) continueButton.disabled = !valid;
  };

  // Formatação visual com vírgula enquanto digita
  const handleInputFormat = (ev) => {
    const el = ev.currentTarget;
    const prev = el.value;
    el.value = formatBRL(prev);
    updateButtonState();
  };

  amountInput?.addEventListener('input', handleInputFormat);
  amountInput?.addEventListener('blur', handleInputFormat);
  amountInput?.addEventListener('paste', () => {
    requestAnimationFrame(() => handleInputFormat({ currentTarget: amountInput }));
  });
  // estado inicial
  updateButtonState();

  amountForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = readAmountNumber();
    if (!Number.isFinite(v) || v <= 0) return;
    goToSummary(v);
  });

  // ===== Navegação e geração do PIX (Seção 2) =====
  const sectionAmount = document.getElementById('section-amount');
  const sectionSummary = document.getElementById('section-summary');
  const sectionBanks = document.getElementById('section-banks');
  const headerTitle = document.getElementById('headerTitle');
  const brandLink = document.getElementById('brandLink');
  let backButton = document.getElementById('backButton');
  const pixQr = document.getElementById('pixQr');
  const pixCopyPaste = document.getElementById('pixCopyPaste');
  const pixAmountRef = document.getElementById('pixAmountRef');
  const continueButton2 = document.getElementById('continueButton2');
  // Bottom sheet (aviso antes de abrir o app do banco)
  const handoffSheet = document.getElementById('handoffSheet');
  const handoffContinue = document.getElementById('handoffContinue');
  const sheetBackdrop = handoffSheet?.querySelector('[data-sheet-close]');
  let pendingBankLink = null;

  const PIX_KEY = 'eaaccac3-e4be-4f6b-a597-9af2d941290a';
  const MERCHANT_NAME = 'Waltemar Lima Carneiro';
  const MERCHANT_CITY = 'SAO PAULO';

  function tlv(id, value) {
    const len = String(value.length).padStart(2, '0');
    return `${id}${len}${value}`;
  }

  function crc16ccitt(str) {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function buildPixPayload({ amount, txid = 'PAY' }) {
    // 00 - Payload Format Indicator
    const id00 = tlv('00', '01');
    // 01 - POI Method (12 = dynamic)
    const id01 = tlv('01', '12');
    // 26 - Merchant Account Information (PIX)
    const gui = tlv('00', 'br.gov.bcb.pix');
    const key = tlv('01', PIX_KEY);
    // opcional: descrição (até 99)
    const desc = tlv('02', 'Pagamento');
    const id26 = tlv('26', gui + key + desc);
    // 52 - Merchant Category Code
    const id52 = tlv('52', '0000');
    // 53 - Transaction Currency (986 BRL)
    const id53 = tlv('53', '986');
    // 54 - Transaction Amount (ponto como separador decimal)
    const amt = amount.toFixed(2);
    const id54 = tlv('54', amt);
    // 58 - Country Code
    const id58 = tlv('58', 'BR');
    // 59 - Merchant Name (máx 25 em teoria; usaremos como dado)
    const id59 = tlv('59', MERCHANT_NAME.toUpperCase());
    // 60 - Merchant City (maiúsculas, sem acentos)
    const id60 = tlv('60', MERCHANT_CITY);
    // 62 - Additional Data Field Template (TXID)
    const tx = tlv('05', (txid || 'PAY').slice(0, 25));
    const id62 = tlv('62', tx);
    // 63 - CRC (calculado depois)
    const partial = id00 + id01 + id26 + id52 + id53 + id54 + id58 + id59 + id60 + id62 + '6304';
    const crc = crc16ccitt(partial);
    return partial + crc;
  }

  function goToSummary(amountNumber) {
    // Atualiza header
    headerTitle.textContent = 'REVISÃO';
    brandLink.hidden = true;
    document.getElementById('brandLogo')?.setAttribute('hidden', '');
    // garantir remoção visual do logo na segunda seção
    brandLink.style.display = 'none';
    // cria botão de voltar se não existir (apenas para seção 2 e 3)
    if (!backButton) {
      const headerContainer = document.querySelector('.site-header .container');
      backButton = document.createElement('button');
      backButton.id = 'backButton';
      backButton.className = 'icon-button';
      backButton.type = 'button';
      backButton.setAttribute('aria-label', 'Voltar');
      const img = document.createElement('img');
      img.src = './images/back.svg';
      img.alt = 'Voltar';
      img.className = 'icon';
      backButton.appendChild(img);
      // insere antes do título
      headerContainer.insertBefore(backButton, headerTitle);
      backButton.addEventListener('click', handleBack);
    }
    // Exibe o botão de voltar (não aparece na seção 1)
    backButton.hidden = false;

    // Alterna seções
    sectionAmount.hidden = true;
    sectionSummary.hidden = false;

    // Atualiza valor de referência e payload
    const brl = formatBRL(String(Math.round(amountNumber * 100)));
    if (pixAmountRef) pixAmountRef.textContent = `R$ ${brl}`;

    const payload = buildPixPayload({ amount: amountNumber, txid: `PAY${Date.now()}` });
    if (pixCopyPaste) pixCopyPaste.value = payload;

    // Gera QR via quickchart
    if (pixQr) {
      const encoded = encodeURIComponent(payload);
      pixQr.src = `https://quickchart.io/qr?text=${encoded}&margin=2&size=512&dark=000000&light=ffffff`;
    }

    // garantir botão continuar da seção 2 ativo
    if (continueButton2) continueButton2.disabled = false;
  }

  function handleBack() {
    // Se está na seção 3 (bancos), volta para a seção 2 (resumo)
    if (sectionBanks && !sectionBanks.hidden) {
      headerTitle.textContent = 'RESUMO';
      sectionBanks.hidden = true;
      sectionSummary.hidden = false;
      // Mantém o botão voltar visível na seção 2
      if (backButton) backButton.hidden = false;
      return;
    }
    // Caso contrário, volta para a seção 1 (valor)
    headerTitle.textContent = 'PAGAMENTOS PIX';
    brandLink.hidden = false;
    document.getElementById('brandLogo')?.removeAttribute('hidden');
    brandLink.style.display = '';
    // Remove completamente o botão de voltar na seção 1
    if (backButton) {
      backButton.remove();
      backButton = null;
    }
    sectionSummary.hidden = true;
    sectionAmount.hidden = false;
  }

  continueButton2?.addEventListener('click', async () => {
    // Copiar payload PIX (copia e cola) para a área de transferência
    const payload = pixCopyPaste?.value?.trim() || '';
    if (payload && navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(payload); } catch {}
    }
    // Ir para a Seção 3 (BANCOS)
    headerTitle.textContent = 'ESCOLHA SEU BANCO';
    if (sectionSummary) sectionSummary.hidden = true;
    if (sectionBanks) sectionBanks.hidden = false;
    // Mantém botão voltar visível na seção 3 e o logo oculto
    if (backButton) backButton.hidden = false;
    brandLink.style.display = 'none';
  });

  // ===== Seção 3: render e interação com lista de bancos =====
  const banksGrid = document.querySelector('.banks-grid');

  function renderBanks() {
    if (!banksGrid) return;
    banksGrid.innerHTML = BANKS.map(b => (
      `<div class="bank-card" data-bank="${b.id}">`+
        `<button class="bank-thumb" type="button" data-bank="${b.id}" aria-label="${b.name}">`+
          `<img src="${b.logo}" alt="${b.name}" class="bank-logo" />`+
        `</button>`+
        `<div class="bank-name">${b.name}</div>`+
      `</div>`
    )).join('');
  }

  renderBanks();

  banksGrid?.addEventListener('click', (e) => {
    const el = e.target.closest('.bank-thumb, .bank-card');
    if (!el) return;
    const bankId = el.getAttribute('data-bank');
    const bank = BANKS.find(b => b.id === bankId);
    if (!bank || !bank.link) return;
    pendingBankLink = bank.link; // usar exatamente o link fornecido
    if (handoffSheet) {
      handoffSheet.hidden = false;
      requestAnimationFrame(() => handoffSheet.classList.add('open'));
    }
  });

  function closeSheet() {
    if (!handoffSheet) return;
    handoffSheet.classList.remove('open');
    // aguarda a transição finalizar para ocultar
    setTimeout(() => { handoffSheet.hidden = true; }, 250);
  }

  sheetBackdrop?.addEventListener('click', closeSheet);

  handoffContinue?.addEventListener('click', () => {
    const link = pendingBankLink;
    closeSheet();
    if (link) {
      // pequena espera para a animação terminar
      setTimeout(() => { window.location.href = link; }, 260);
    }
  });
});

