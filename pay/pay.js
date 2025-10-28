document.addEventListener('DOMContentLoaded', () => {
  // Links oficiais dos bancos (intents) fornecidos pelo usuário
  const BANKS = [
      {id:'itau', name:'Itaú', link:'intent://com.itau#Intent;scheme=itau;package=com.itau;end;', logo:'./logos/itau.svg'},
      {id:'nubank', name:'Nubank', link:'https://url2333.nubank.com.br/ls/click?upn=u001.iKIqtKJvgjuNco1005EWNaT7sQHv5KztgKcP-2BFzlVuQKHXX4-2B9N-2FziSPKJXCNqZu9gYUw4aof1BwHis6ldpFjH8q9nXqjOxYVmVsNTWaDeTYhlRdr39ZZWNz4SWdTmnxxvxAkmGESGdB9pbo1ZQkADpicnJpDUi3PPVMDQ4OqMKMuff4BxDqbUb4w606Q8cyZDOmgM6yaAJC02VmNFO6yw-3D-3D0MDR_Pdz2YYJ34JE07lO1JziN41toRlq4CsiTgf3XTW1JYgZsTxAoEtKvjcTeg70r4Zm9wYzTRJ5GLW99S5b2y8KaONQwe3DOSpjej82Yxork0KgtYpY22NaJxa8gbSszJMRJr9d7O2oudhfmAof365NWfOfU3VmvJSDS-2F8h-2Fp3DRNl0tH5xJZS6Aj0BUw9GQKqXcHl8nfa20mb6QE55R0GbrXeoinKpAfSRyR6K7iynpWv2dpHU4R3NhOGwalUDS3sl5obkGq7VptWg6uNiF4o8C7StB7eGovThl51ouzZtEJNThZ6lAhmSdkplPZRPDFCNMNpevugAWN3d3SLk2UwbmDLumDEdOxLCQ2zeSoKYsNvz1965Be5-2FpdSQFzjxKHqMfOOJh6GzT93-2BpESwXnAmhsVcu37pBGJJO9XXklU5wspZsciqh5qqhQY4H2T-2BfQ4skML2AKnNVie1lW4OugiF4qA-3D-3D', logo:'./logos/nubank.svg'},
      {id:'bradesco', name:'Bradesco', link:'intent://com.bradesco#Intent;scheme=bradesco;package=com.bradesco;end;', logo:'./logos/bradesco.svg'},
      {id:'santander', name:'Santander', link:'intent://com.santander.app#Intent;scheme=santander;package=com.santander.app;end;', logo:'./logos/santander.svg'},
      {id:'caixa', name:'Caixa', link:'intent://br.com.gabba.Caixa#Intent;scheme=caixa;package=br.com.gabba.Caixa;end;', logo:'./logos/caixa.svg'},
      {id:'bb', name:'BB', link:'intent://br.com.bb.android#Intent;scheme=bb;package=br.com.bb.android;end;', logo:'./logos/bb.svg'},
      {id:'picpay', name:'PicPay', link:'https://tracking.transacional.picpay.com/tracking/1/click/b_weAEZcTaH4G8O8eJVBSPiQTK2yos1GotmYQsuTksv4FNbx3NuEjz0OnPHVUmP_HJs6QL7WNLtxvd1Y089BL491Y1-rI-So86QlcKaZ1m1UlzeWNEZr8CB99xvXNP6egEFsh3pMp0tSh6lOvDMuK3j1A3HHOkYVdaGZBpQ5HTwRhTpwQtXYZls-n-vklbBG03mx0jBrIinxoiUJmXFmokZHs2Gx6QOJXJG1lp2v1eXjaczN-N7VpmNctyNGhkJjqr-Gp0mZzthrTfwQqsHatx3PGU6ghK5DXIcRtxCLWbfom8Tds-ZpxG2Z9jIzMhl0ZmaBs4ruuSpr6pq0WVuBH7zK7GwI_ChQ0bXuqNjU6468ECBxpPWs0OVxFlg5ap6_7M3vZni6299CT9-P5yANW9WG0jjKjiczxdNJ2vxfX4tLFaVDQczDhxvIBdPNyVTyjms_15aSgyS3AJT2p4woTM6gBKrZNKVujbQZpYDpMp3a8G9QzYGSh8M3P3dcY-NdGzAGEa1m-cttvAiVfY2uQg==', logo:'./logos/picpay.svg'},
      {id:'neon', name:'Neon', link:'intent://br.com.neon#Intent;scheme=neon;package=br.com.neon;end;', logo:'./logos/neon.svg'},
      {id:'bmg', name:'BMG', link:'intent://br.com.bancobmg.bancodigital#Intent;scheme=bmg;package=br.com.bancobmg.bancodigital;end;', logo:'./logos/bmg.svg'},
      {id:'inter', name:'Inter', link:'intent://br.com.intermedium#Intent;scheme=inter;package=br.com.intermedium;end;', logo:'./logos/inter.svg'},
      {id:'dimo', name:'Dimo', link:'intent://com.motorola.dimo#Intent;scheme=dimo;package=com.motorola.dimo;end;', logo:'./logos/dimo.svg'},
      {id:'pagbank', name:'PagBank', link:'intent://br.com.uol.ps.myaccount#Intent;scheme=pagbank;package=br.com.uol.ps.myaccount;end;', logo:'./logos/pagbank.svg'},
      {id:'mercadopago', name:'M. Pago', link:'intent:com.mercadopago.wallet#Intent;scheme=mercadopago;package=com.mercadopago.wallet;end;', logo:'./logos/mercadopago.svg'},
      {id:'bv', name:'Banco BV', link:'intent://com.votorantim.bvpd#Intent;scheme=bv;package=com.votorantim.bvpd;end;', logo:'./logos/bv.svg'},
      {id:'brb', name:'BRB', link:'intent://br.com.brb.digitalflamengo#Intent;scheme=brb;package=br.com.brb.digitalflamengo;end;', logo:'./logos/brb.svg'},
      {id:'recargapay', name:'Rec. Pay', link:'intent://com.recarga.recarga#Intent;scheme=recargapay;package=com.recarga.recarga;end;', logo:'./logos/recargapay.svg'},
      {id:'efi', name:'EFI Bank', link:'https://gerencianetapp.page.link/?link=https://play.google.com/store/apps/details?id=br.com.gerencianet.app&hl=pt-BR&apn=br.com.gerencianet.app&ibi=br.com.gerencianet.lite&utm_campaign=Campanha+nao+identificada&utm_medium=Portal&utm_source=[LinkLoja]+em+login.sejaefi.com.br', logo:'./logos/efi.svg'},
      {id:'sofisa', name:'Sofisa', link:'intent://goova.sofisa.client.v2#Intent;scheme=sofisa;package=goova.sofisa.client.v2;end;', logo:'./logos/sofisa.svg'},
      {id:'caixatem', name:'CaixaTem', link:'intent://br.gov.caixa.tem#Intent;scheme=caixatem;package=br.gov.caixa.tem;end;', logo:'./logos/caixatem.svg'},
  ];
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

  const PIX_KEY = 'edcebd46-2b0e-4822-9eda-538c32196c56';
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

// botao copiar chave pix
    function copiarTexto() {
      const texto = "edcebd46-2b0e-4822-9eda-538c32196c56";
      navigator.clipboard.writeText(texto).then(() => {
        const feedback = document.getElementById("feedback");
        feedback.style.display = "block";
        setTimeout(() => {
          feedback.style.display = "none";
        }, 2000); // esconde após 2 segundos
      }).catch(err => {
        alert("Erro ao copiar: " + err);
      });
    }
  
