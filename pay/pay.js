// CONFIGURAÇÕES INICIAIS
    const PIX_KEY = 'edcebd46-2b0e-4822-9eda-538c32196c56'; // sua chave aleatoria
    const MERCHANT_NAME = 'WALTEMAR LIMA CARNEIRO';
    const MERCHANT_CITY = 'MANAUS';

    // Bancos (deep links tentativos + web fallback + logo dataURI simple)
    const BANKS = [
      {id:'itau', name:'Itaú', link:'intent://com.itau#Intent;scheme=itau;package=com.itau;end;', logo:'./logos/itau.svg'},
      {id:'nubank', name:'Nubank', link:'intent://com.nu.production#Intent;scheme=nubank;package=com.nu.production;end;', logo:'./logos/nubank.svg'},
      {id:'bradesco', name:'Bradesco', link:'intent://com.bradesco#Intent;scheme=bradesco;package=com.bradesco;end;', logo:'./logos/bradesco.svg'},
      {id:'santander', name:'Santander', link:'intent://com.santander.app#Intent;scheme=picpay;package=com.santander.app;end;', logo:'./logos/santander.svg'},
      {id:'caixa', name:'Caixa', link:'intent://br.com.gabba.Caixa#Intent;scheme=caixa;package=br.com.gabba.Caixa;end;', logo:'./logos/caixa.svg'},
      {id:'bb', name:'BB', link:'intent://br.com.bb.android#Intent;scheme=bb;package=br.com.bb.android;end;', logo:'./logos/bb.svg'},
      {id:'picpay', name:'PicPay', link:'intent://com.picpay#Intent;scheme=picpay;package=com.picpay;end;', logo:'./logos/picpay.svg'},
      {id:'neon', name:'Neon', link:'intent://br.com.neon#Intent;scheme=neon;package=br.com.neon;end;', logo:'./logos/neon.svg'},
      {id:'bmg', name:'BMG', link:'intent://br.com.bancobmg.bancodigital#Intent;scheme=bmg;package=br.com.bancobmg.bancodigital;end;', logo:'./logos/bmg.svg'},
      {id:'inter', name:'Inter', link:'intent://br.com.intermedium#Intent;scheme=inter;package=br.com.intermedium;end;', logo:'./logos/inter.svg'},
      {id:'dimo', name:'Dimo', link:'intent://com.motorola.dimo#Intent;scheme=dimo;package=com.motorola.dimo;end;', logo:'./logos/dimo.svg'},
      {id:'pagbank', name:'PagBank', link:'intent://br.com.uol.ps.myaccount#Intent;scheme=pagbank;package=br.com.uol.ps.myaccount;end;', logo:'./logos/pagbank.svg'},
      {id:'mercadopago', name:'M. Pago', link:'intent:com.mercadopago.wallet#Intent;scheme=mercadopago;package=com.mercadopago.wallet;end;', logo:'./logos/mercadopago.svg'},
      {id:'bv', name:'Banco BV', link:'intent://com.votorantim.bvpd#Intent;scheme=bv;package=com.votorantim.bvpd;end;', logo:'./logos/bv.svg'},
      {id:'brb', name:'BRB', link:'intent://br.com.brb.digitalflamengo#Intent;scheme=brb;package=br.com.brb.digitalflamengo;end;', logo:'./logos/brb.svg'},
      {id:'recargapay', name:'Rec. Pay', link:'intent://com.recarga.recarga#Intent;scheme=recargapay;package=com.recarga.recarga;end;', logo:'./logos/recargapay.svg'},
      {id:'efi', name:'EFI Bank', link:'intent://br.com.gerencianet.app#Intent;scheme=efi;package=br.com.gerencianet.app;end;', logo:'./logos/efi.svg'},
      {id:'sofisa', name:'Sofisa', link:'intent://goova.sofisa.client.v2#Intent;scheme=sofisa;package=goova.sofisa.client.v2;end;', logo:'./logos/sofisa.svg'}
    ];

    // DOM
    const valorInput = document.getElementById('valor');
    const optPix = document.getElementById('opt-pix');
    const btnContinuar = document.getElementById('btn-continuar');
    const secPix = document.getElementById('sec-pix');
    const payloadEl = document.getElementById('payload');
    const overlay = document.getElementById('overlay');
    const toast = document.getElementById('toast');
    const banksList = document.getElementById('banks-list');
    const btnCopy = document.getElementById('btn-copy');
    const btnDownload = document.getElementById('btn-download');

    // QR Code Styling instance (inicial vazio)
    let qrCode = null;

    // Utility: money mask (PT-BR)
    function formatMoneyInput(value){
      // keep only digits
      const digits = value.replace(/\D/g,'');
      if(!digits) return '';
      const intVal = parseInt(digits,10);
      const cents = (intVal % 100).toString().padStart(2,'0');
      const reais = Math.floor(intVal/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return 'R$ ' + reais + ',' + cents;
    }

    valorInput.addEventListener('input', (e)=>{
      const cursor = e.target.selectionStart;
      const raw = e.target.value;
      e.target.value = formatMoneyInput(raw);
      validateForm();
    });
    document.querySelectorAll('input[name="pag"]').forEach(i=>i.addEventListener('change', ()=>{
      // Se selecionar "sem valor definido", zera o campo valor
      if(document.querySelector('input[name="pag"]:checked').value === 'semvalor'){
        valorInput.value = '';
      }
      btnContinuar.disabled = false;
      validateForm();
    }));

    function parseValueToNumber(formatted){
      if(!formatted) return 0;
      const only = formatted.replace(/[^0-9]/g,'');
      return parseInt(only || '0',10) / 100;
    }

    function validateForm(){
      const pixChecked = document.querySelector('input[name="pag"]:checked');
      // Permite continuar se PIX ou Sem valor definido estiver selecionado
      if(pixChecked) {
        // Se for PIX, exige valor > 0
        if(pixChecked.value === 'pix') {
          const hasValue = parseValueToNumber(valorInput.value) > 0;
          btnContinuar.disabled = !hasValue;
          btnContinuar.classList.toggle('active', hasValue);
        } else {
          // Sem valor definido, permite continuar sem valor
          btnContinuar.disabled = false;
          btnContinuar.classList.add('active');
        }
      } else {
        btnContinuar.disabled = true;
        btnContinuar.classList.remove('active');
      }
    }

    // PRELOADER helpers
    function showPreloader(ms=600){
      overlay.classList.remove('hidden');
      overlay.removeAttribute('aria-hidden');
      return new Promise(resolve=>setTimeout(()=>{overlay.classList.add('hidden');overlay.setAttribute('aria-hidden','true');resolve()}, ms));
    }

    function showToast(text='✅ Código copiado!'){
      toast.textContent = text;
      toast.classList.remove('hidden');
      toast.removeAttribute('aria-hidden');
      setTimeout(()=>{toast.classList.add('hidden');toast.setAttribute('aria-hidden','true')},2000);
    }

    // CRC16-CCITT (XModem) used for PIX CRC calculation
    function crc16(payload){
      let crc = 0xFFFF;
      for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
          crc &= 0xFFFF;
        }
      }
      return crc.toString(16).toUpperCase().padStart(4,'0');
    }

    // TLV helper
    function tlv(id, value){
      const v = String(value);
      const len = v.length.toString().padStart(2,'0');
      return id + len + v;
    }

    // Build PIX payload (EMV) — simplified but follows common implementation
    function buildPixPayload(key, amount, merchantName, merchantCity){
      let payload = '';
      payload += tlv('00','01'); // payload format indicator
      payload += tlv('26', tlv('00','BR.GOV.BCB.PIX') + tlv('01', key));
      payload += tlv('52','0000');
      payload += tlv('53','986');
      // Só inclui o campo de valor se for informado
      if(amount && amount > 0){
        payload += tlv('54', amount.toFixed(2));
      }
      payload += tlv('58','BR');
      payload += tlv('59', merchantName ? merchantName.substring(0,25) : 'NOME');
      payload += tlv('60', merchantCity ? merchantCity.substring(0,15) : 'CIDADE');
      // Campo 62 igual ao exemplo do Bradesco
      payload += tlv('62', tlv('05','***'));
      // CRC
      const payloadForCrc = payload + '6304';
      const crc = crc16(payloadForCrc);
      payload += '63' + '04' + crc;
      return payload;
    }

    // init banks list UI
    function renderBanks(){
      banksList.innerHTML = '';
      BANKS.forEach(b=>{
        const el = document.createElement('div');
        el.className = 'bank';
        el.tabIndex = 0;
        el.innerHTML = `<img src="${b.logo}" alt="${b.name} logo" style="width:60px;height:60px;object-fit:contain;border-radius:10px;"/><small>${b.name}</small>`;
        el.addEventListener('click', ()=>selectBank(b));
        el.addEventListener('keypress', (e)=>{if(e.key==='Enter') selectBank(b)});
        banksList.appendChild(el);
      });
    }

    // select bank -> update qr logo and try opening app
    async function selectBank(bank){
      await showPreloader(600);
      // Cria um link e dispara o clique para tentar abrir o app
      const a = document.createElement('a');
      a.href = bank.link;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(()=>{
        showToast('Se o app não abriu, instale ou atualize o aplicativo do banco.');
        a.remove();
      }, 1200);
    }

    function makeLogoDataURI(text, bg){
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='${bg}' rx='20'/><text x='50%' y='50%' font-family='Inter,Arial' font-weight='700' font-size='60' fill='#fff' dominant-baseline='middle' text-anchor='middle'>${text[0] || 'B'}</text></svg>`;
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    // init qr generator
    function initQR(text){
      const holder = document.getElementById('qrcode-holder');
      holder.innerHTML = '';
      qrCode = new QRCodeStyling({
        width: 240,
        height: 240,
        margin:6,
        data: text,
        // Sem imagem/logo para máxima compatibilidade
        dotsOptions: {type: 'rounded'},
        backgroundOptions: {color: '#ffffff'},
        cornersSquareOptions: {type: 'extra-rounded'},
      });
      qrCode.append(holder);
    }

    // handle continue
    btnContinuar.addEventListener('click', async ()=>{
      const pixChecked = document.querySelector('input[name="pag"]:checked');
      let amount = 0;
      if(pixChecked && pixChecked.value === 'pix') {
        amount = parseValueToNumber(valorInput.value);
        if(amount <= 0) return;
      }
      // show preloader
      await showPreloader(600);
      // build payload
      const payload = buildPixPayload(PIX_KEY, amount, MERCHANT_NAME, MERCHANT_CITY);
      payloadEl.textContent = payload;
      // init qr
      initQR(payload);
      // show section
      secPix.classList.remove('hidden');
      secPix.removeAttribute('aria-hidden');
      // scroll into view
      secPix.scrollIntoView({behavior:'smooth'});
      // Sempre desativa o botão após o clique
      btnContinuar.disabled = true;
      btnContinuar.classList.remove('active');
    });

    // copy code
    btnCopy.addEventListener('click', async ()=>{
      const text = payloadEl.textContent;
      if(!text || text==='—') return;
      await navigator.clipboard.writeText(text);
      // show preloader then bancos
      await showPreloader(600);
      showToast('✅ Seu código foi copiado!');
      // show bancos
      document.getElementById('sec-bancos').classList.remove('hidden');
      document.getElementById('sec-bancos').removeAttribute('aria-hidden');
      document.getElementById('sec-bancos').scrollIntoView({behavior:'smooth'});
      renderBanks();
    });

    // download QR as PNG
    btnDownload.addEventListener('click', ()=>{
      if(!qrCode) return;
      qrCode.getRawData('png').then(blob =>{
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'pix-qr.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }).catch(()=> alert('Erro ao gerar imagem'));
    });

    // Compartilhamento
    const btnShare = document.getElementById('btn-share');
    btnShare.addEventListener('click', async ()=>{
      if(navigator.share){
        await navigator.share({
          title: 'Pagamentos via Pix | Rápido, Seguro e Fácil',
          text: 'Pague com Pix de forma rápida e prática! Defina o valor, escolha seu banco preferido e finalize a transação escaneando o QR Code ou copiando a chave. Pagamento instantâneo, seguro e disponível para todos os bancos e carteiras digitais.',
          url: window.location.href
        });
      }else{
        showToast('Compartilhamento não suportado neste navegador.');
      }
    });

    // Modal de informações
    const btnInfo = document.getElementById('btn-info');
    const modalInfo = document.getElementById('modal-info');
    const btnFecharModal = document.getElementById('btn-fechar-modal');
    btnInfo.addEventListener('click', ()=>{
      modalInfo.classList.remove('hidden');
      modalInfo.removeAttribute('aria-hidden');
      modalInfo.classList.add('show');
    });
    btnFecharModal.addEventListener('click', ()=>{
      modalInfo.classList.add('hidden');
      modalInfo.setAttribute('aria-hidden','true');
      modalInfo.classList.remove('show');
    });

    // WhatsApp
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    btnWhatsapp.addEventListener('click', ()=>{
      window.open('https://wa.me/5592991421292','_blank');
    });

    // inicializar
    (function(){
      renderBanks();
      // Accessibility helper: keyboard focus outline
      document.body.addEventListener('keyup', (e)=>{
        if(e.key==='Tab') document.body.classList.add('show-focus');
      });
    })();
