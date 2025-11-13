(function () {
    // inicializa quando DOM estiver pronto
    function onReady(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    onReady(function init() {
        // Config
        const PIX_KEY = 'edcebd46-2b0e-4822-9eda-538c32196c56';
        const MERCHANT_NAME = 'WALTEMAR LIMA CARNEIRO';
        const MERCHANT_CITY = 'SAO PAULO';
        const FALLBACK_BANKS = [
            { id: 'itau', name: 'Itaú', link: 'intent://com.itau#Intent;scheme=itau;package=com.itau;end;', logo: 'https://waltemar.com.br/pay/logos/itau.svg' },
            { id: 'nubank', name: 'Nubank', link: 'https://url2333.nubank.com.br/ls/click?upn=u001.iKIqtKJvgjuNco1005EWNaT7sQHv5KztgKcP-2BFzlVuQKHXX4-2B9N-2FziSPKJXCNqZu9gYUw4aof1BwHis6ldpFjH8q9nXqjOxYVmVsNTWaDeTYhlRdr39ZZWNz4SWdTmnxxvxAkmGESGdB9pbo1ZQkADpicnJpDUi3PPVMDQ4OqMKMuff4BxDqbUb4w606Q8cyZDOmgM6yaAJC02VmNFO6yw-3D-3D0MDR_Pdz2YYJ34JE07lO1JziN41toRlq4CsiTgf3XTW1JYgZsTxAoEtKvjcTeg70r4Zm9wYzTRJ5GLW99S5b2y8KaONQwe3DOSpjej82Yxork0KgtYpY22NaJxa8gbSszJMRJr9d7O2oudhfmAof365NWfOfU3VmvJSDS-2F8h-2Fp3DRNl0tH5xJZS6Aj0BUw9GQKqXcHl8nfa20mb6QE55R0GbrXeoinKpAfSRyR6K7iynpWv2dpHU4R3NhOGwalUDS3sl5obkGq7VptWg6uNiF4o8C7StB7eGovThl51ouzZtEJNThZ6lAhmSdkplPZRPDFCNMNpevugAWN3d3SLk2UwbmDLumDEdOxLCQ2zeSoKYsNvz1965Be5-2FpdSQFzjxKHqMfOOJh6GzT93-2BpESwXnAmhsVcu37pBGJJO9XXklU5wspZsciqh5qqhQY4H2T-2BfQ4skML2AKnNVie1lW4OugiF4qA-3D-3D', logo: 'https://waltemar.com.br/pay/logos/nubank.svg' },
            { id: 'bradesco', name: 'Bradesco', link: 'intent://com.bradesco#Intent;scheme=bradesco;package=com.bradesco;end;', logo: 'https://waltemar.com.br/pay/logos/bradesco.svg' },
            { id: 'santander', name: 'Santander', link: 'intent://com.santander.app#Intent;scheme=picpay;package=com.santander.app;end;', logo: 'https://waltemar.com.br/pay/logos/santander.svg' },
            { id: 'caixa', name: 'Caixa', link: 'intent://br.com.gabba.Caixa#Intent;scheme=caixa;package=br.com.gabba.Caixa;end;', logo: 'https://waltemar.com.br/pay/logos/caixa.svg' },
            { id: 'bb', name: 'BB', link: 'intent://br.com.bb.android#Intent;scheme=bb;package=br.com.bb.android;end;', logo: 'https://waltemar.com.br/pay/logos/bb.svg' },
            { id: 'picpay', name: 'PicPay', link: 'https://tracking.transacional.picpay.com/tracking/1/click/b_weAEZcTaH4G8O8eJVBSPiQTK2yos1GotmYQsuTksv4FNbx3NuEjz0OnPHVUmP_HJs6QL7WNLtxvd1Y089BL491Y1-rI-So86QlcKaZ1m1UlzeWNEZr8CB99xvXNP6egEFsh3pMp0tSh6lOvDMuK3j1A3HHOkYVdaGZBpQ5HTwRhTpwQtXYZls-n-vklbBG03mx0jBrIinxoiUJmXFmokZHs2Gx6QOJXJG1lp2v1eXjaczN-N7VpmNctyNGhkJjqr-Gp0mZzthrTfwQqsHatx3PGU6ghK5DXIcRtxCLWbfom8Tds-ZpxG2Z9jIzMhl0ZmaBs4ruuSpr6pq0WVuBH7zK7GwI_ChQ0bXuqNjU6468ECBxpPWs0OVxFlg5ap6_7M3vZni6299CT9-P5yANW9WG0jjKjiczxdNJ2vxfX4tLFaVDQczDhxvIBdPNyVTyjms_15aSgyS3AJT2p4woTM6gBKrZNKVujbQZpYDpMp3a8G9QzYGSh8M3P3dcY-NdGzAGEa1m-cttvAiVfY2uQg==', logo: 'https://waltemar.com.br/pay/logos/picpay.svg' },
            { id: 'neon', name: 'Neon', link: 'intent://br.com.neon#Intent;scheme=neon;package=br.com.neon;end;', logo: 'https://waltemar.com.br/pay/logos/neon.svg' },
            { id: 'bmg', name: 'BMG', link: 'intent://br.com.bancobmg.bancodigital#Intent;scheme=bmg;package=br.com.bancobmg.bancodigital;end;', logo: 'https://waltemar.com.br/pay/logos/bmg.svg' },
            { id: 'inter', name: 'Inter', link: 'intent://br.com.intermedium#Intent;scheme=inter;package=br.com.intermedium;end;', logo: 'https://waltemar.com.br/pay/logos/inter.svg' },
            { id: 'dimo', name: 'Dimo', link: 'intent://com.motorola.dimo#Intent;scheme=dimo;package=com.motorola.dimo;end;', logo: 'https://waltemar.com.br/pay/logos/dimo.svg' },
            { id: 'pagbank', name: 'PagBank', link: 'intent://br.com.uol.ps.myaccount#Intent;scheme=pagbank;package=br.com.uol.ps.myaccount;end;', logo: 'https://waltemar.com.br/pay/logos/pagbank.svg' },
            { id: 'mercadopago', name: 'M. Pago', link: 'intent:com.mercadopago.wallet#Intent;scheme=mercadopago;package=com.mercadopago.wallet;end;', logo: 'https://waltemar.com.br/pay/logos/mercadopago.svg' },
            { id: 'bv', name: 'Banco BV', link: 'intent://com.votorantim.bvpd#Intent;scheme=bv;package=com.votorantim.bvpd;end;', logo: 'https://waltemar.com.br/pay/logos/bv.svg' },
            { id: 'brb', name: 'BRB', link: 'intent://br.com.brb.digitalflamengo#Intent;scheme=brb;package=br.com.brb.digitalflamengo;end;', logo: 'https://waltemar.com.br/pay/logos/brb.svg' },
            { id: 'recargapay', name: 'Rec. Pay', link: 'intent://com.recarga.recarga#Intent;scheme=recargapay;package=com.recarga.recarga;end;', logo: 'https://waltemar.com.br/pay/logos/recargapay.svg' },
            { id: 'efi', name: 'EFI Bank', link: 'https://gerencianetapp.page.link/?link=https://play.google.com/store/apps/details?id=br.com.gerencianet.app&hl=pt-BR&apn=br.com.gerencianet.app&ibi=br.com.gerencianet.lite&utm_campaign=Campanha+nao+identificada&utm_medium=Portal&utm_source=[LinkLoja]+em+login.sejaefi.com.br', logo: 'https://waltemar.com.br/pay/logos/efi.svg' },
            { id: 'sofisa', name: 'Sofisa', link: 'intent://goova.sofisa.client.v2#Intent;scheme=sofisa;package=goova.sofisa.client.v2;end;', logo: 'https://waltemar.com.br/pay/logos/sofisa.svg' },
            { id: 'caixatem', name: 'CaixaTem', link: 'intent://br.gov.caixa.tem#Intent;scheme=caixatem;package=br.gov.caixa.tem;end;', logo: 'https://waltemar.com.br/pay/logos/caixatem.svg' },
        ];

        const $ = id => document.getElementById(id);

        // Máscara de telefone (na página principal)
        const tel = $('telefone');
        if (tel) {
            tel.addEventListener('input', e => {
                let v = e.target.value.replace(/\D/g, '');
                v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
                v = v.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = v.slice(0, 15);
            });
        }

        // --- INÍCIO: máscara e conversão BRL para o input #valor ---
        // Converte "1.548,75" -> 1548.75 (number)
        function brlToNumber(raw) {
            if (!raw) return 0;
            const digits = String(raw).replace(/\D/g, '');
            if (!digits) return 0;
            return parseInt(digits, 10) / 100;
        }

        // Formata o input para "1.548,75" enquanto digita (corrigido)
        const valorInput = $('valor');
        if (valorInput) {
            const formatBRLInput = (ev) => {
                const el = ev && ev.target ? ev.target : valorInput;
                // pega apenas dígitos
                let v = String(el.value || '').replace(/\D/g, '');
                if (!v) { el.value = ''; return; }
                // garante pelo menos 3 dígitos (para ter centavos)
                while (v.length < 3) v = '0' + v;
                const cents = v.slice(-2);
                let intPart = v.slice(0, -2);
                // remove zeros à esquerda, mas deixa '0' se inteiro for zero
                intPart = intPart.replace(/^0+(?=\d)/, '');
                if (intPart === '') intPart = '0';
                // separador de milhares
                intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                el.value = intPart + ',' + cents;
            };
            valorInput.addEventListener('input', formatBRLInput);
            valorInput.addEventListener('blur', formatBRLInput);
            valorInput.addEventListener('paste', () => {
                setTimeout(() => formatBRLInput({ target: valorInput }), 0);
            });
            // formata valor inicial caso já tenha algo
            formatBRLInput({ target: valorInput });
        }
        // --- FIM: máscara e conversão BRL ---

        // helpers de formatação
        function formatBRL(value) {
            // aceita número ou string com ponto decimal; retorna "1.452,45"
            const n = Number(String(value).replace(',', '.')) || 0;
            return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Helpers TLV / CRC
        function tlv(id, value) {
            const len = String(value.length).padStart(2, '0');
            return id + len + value;
        }
        function crc16ccitt(str) {
            let crc = 0xffff;
            for (let i = 0; i < str.length; i++) {
                crc ^= str.charCodeAt(i) << 8;
                for (let j = 0; j < 8; j++) {
                    crc = (crc & 0x8000) ? (((crc << 1) ^ 0x1021) & 0xffff) : ((crc << 1) & 0xffff);
                }
            }
            return crc.toString(16).toUpperCase().padStart(4, '0');
        }

        function buildPixPayload(amount, txid = 'PAY') {
            const key = (window.PAYLIB && window.PAYLIB.PIX_KEY) ? window.PAYLIB.PIX_KEY : PIX_KEY;
            const merchant = (window.PAYLIB && window.PAYLIB.MERCHANT_NAME) ? window.PAYLIB.MERCHANT_NAME.toUpperCase() : MERCHANT_NAME.toUpperCase();
            const city = (window.PAYLIB && window.PAYLIB.MERCHANT_CITY) ? window.PAYLIB.MERCHANT_CITY : MERCHANT_CITY;

            const id00 = tlv('00', '01');
            const id01 = tlv('01', '12');
            const gui = tlv('00', 'br.gov.bcb.pix');
            const idKey = tlv('01', key);
            const desc = tlv('02', 'Ordem de Serviço');
            const id26 = tlv('26', gui + idKey + desc);
            const id52 = tlv('52', '0000');
            const id53 = tlv('53', '986');
            const id54 = tlv('54', (Number(amount) || 0).toFixed(2));
            const id58 = tlv('58', 'BR');
            const id59 = tlv('59', merchantString(merchant));
            const id60 = tlv('60', city);
            const tx = tlv('05', String(txid).slice(0, 25));
            const id62 = tlv('62', tx);
            const partial = id00 + id01 + id26 + id52 + id53 + id54 + id58 + id59 + id60 + id62 + '6304';
            const crc = crc16ccitt(partial);
            return partial + crc;
        }

        function merchantString(m) {
            // limita a 25 chars, remove acentos básicos
            try {
                const norm = m.normalize ? m.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : m;
                return norm.slice(0, 25);
            } catch {
                return String(m).slice(0, 25);
            }
        }

        //funcao copuToClipboard

    // Função para copiar o código PIX
async function copyPixCode(pixCode) {
    try {
        // Tenta usar a API Clipboard moderna
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(pixCode);
            // Mostra feedback usando toast ou alert
            alert('Código PIX copiado!');
            return;
        }
        
        // Se a API Clipboard não estiver disponível, usa método alternativo
        const tempInput = document.createElement('input');
        tempInput.setAttribute('readonly', '');
        tempInput.setAttribute('value', pixCode);
        document.body.appendChild(tempInput);
        tempInput.select();
        
        // Para iOS
        tempInput.setSelectionRange(0, 99999);
        
        // Tenta copiar
        const success = document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        if (success) {
            alert('Código PIX copiado!');
        } else {
            alert('Não foi possível copiar o código PIX automaticamente');
        }
        
    } catch (err) {
        console.error('Erro ao copiar:', err);
        alert('Não foi possível copiar o código PIX');
    }
}

// Modifique a função que abre o modal PIX para usar a nova função
window.abrirPix = function(cliente, os, valor) {
    // ...código existente para gerar o QR code...
    
    // Após gerar o código PIX, tenta copiar automaticamente
    copyPixCode(pixCode);
    
    // Exibe o modal
    document.getElementById('modalPix').style.display = 'flex';
}

        // Gerar HTML da OS (autônomo, para envio ao cliente)
        function buildOSHtml(fields) {
            const { cliente, telefone, endereco, equipamento, problema, solucao, produto, servico, valor, numOS, dataStr, horaStr } = fields;

            // pequena função para escapar (seguro)
            const esc = s => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            // template
            return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="theme-color" content="#f76700" />

   <meta name="keywords" content="Waltemar" />
   <meta property="og:title" content="Waltemar Carneiro" />
   <meta property="og:description" content="Ordem de Serviço Online" />
   <meta property="og:image" content="https://waltemar.com.br/image/og-image.jpg" />
   <meta content='website' property='og:type' />
   <meta property="og:site_name" content="Waltemar Carneiro" />
   <meta name="mobile-web-app-capable" content="yes" />

<title>OS ${esc(numOS)} - ${esc(cliente)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
  body{font-family:Inter,Arial;margin:0;padding:18px;color:#222;background:#fff}
  h1{color:#f76700;font-size:1.2rem}
  table{width:100%;border-collapse:collapse;margin-top:10px}
  td,th{border:1px solid #ddd;padding:8px;font-size:14px;text-align:left}
  th{background:#eee;}
  footer{display:flex;justify-content:space-between;align-items:center;gap:.5rem;flex-wrap:wrap;margin-top:14px}
  /* Botões */
  .btn-pay{font-weight:bold;background:#f76700;color:#fff;border:none;padding:10px 12px;border-radius:6px;cursor:pointer}
  .btn-print{background:#eeeeee;color:#222222;font-weight:bold;border:1px solid #f0f0f0;padding:8px 12px;border-radius:6px;cursor:pointer}
  .btn-white{width:100%;font-weight:bold;background:#ffffff;color:#f76700;border:1px solid #f0f0f0;padding:8px 12px;border-radius:6px;cursor:pointer}
  /* drawer & bancos */
  .drawer .actions .btn-pay{width:100%}
  .bank-item{display:flex;align-items:center;gap:.6rem;padding:10px;border-top:1px solid #eee;cursor:pointer}
  .bank-item img{width:36px;height:36px;object-fit:contain}
  .bank-item button{background:transparent;border:none;padding:0;text-align:left;width:100%;font-size:15px;color:#222}
  /* lista de bancos com scroll independente do drawer do QR */
  .banks-list{max-height:46vh;overflow:auto;border-top:1px solid #eee;padding-top:6px}
  @media (max-width:420px){ body{padding:12px} h1{font-size:1.1rem} td,th{font-size:13px} }
  .drawer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);display:none;z-index:9998}
  .drawer{position:fixed;left:0;right:0;bottom:0;background:#f2f2f2;border-top-left-radius:12px;border-top-right-radius:12px;padding:14px;transform:translateY(100%);transition:transform .28s ease;z-index:9999}
  .drawer.open{transform:translateY(0)}
  .drawer .title{color:#f76700;font-weight:600;margin-bottom:8px}
  .drawer .qr{display:block;margin:8px auto;max-width:260px;width:40%}
  .drawer .actions{display:flex;flex-direction:column;gap:8px;margin-top:12px}
</style>
</head>
<body>
<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ddd;padding-bottom:10px;">
  <h1>WALTEMAR.COM.BR</h1>
  <img src="https://waltemar.com.br/icons/icon192.png" width="32" height="32" style="border-radius:10px;" />
</div>
  <p><strong>Ordem de Serviço nº:</strong> ${esc(numOS)} — ${esc(dataStr)} ${esc(horaStr)}</p>

  <table>
    <tr><th colspan="2">Dados do Cliente</th></tr>
    <tr><td>Nome</td><td style="font-weight:bold">${esc(cliente)}</td></tr>
    <tr><td>Telefone</td><td style="font-weight:bold">${esc(telefone)}</td></tr>
    <tr><td>Endereço</td><td>${esc(endereco)}</td></tr>
  </table>

  <table>
    <tr><th colspan="2">Dados Técnicos</th></tr>
    <tr><td>Equipamento</td><td style="font-weight:bold">${esc(equipamento)}</td></tr>
    <tr><td>Problema Relatado</td><td>${esc(problema)}</td></tr>
    <tr><td>Solução Implementada</td><td>${esc(solucao)}</td></tr>
    <tr><td>Produto</td><td>${esc(produto)}</td></tr>
    <tr><td>Serviço</td><td>${esc(servico)}</td></tr>
    <tr><td>Valor</td><td>R$ <strong style="color:#f76700;font-size:1.3rem;">${esc(formatBRL(valor))}</strong></td></tr>
  </table>

  <footer>
    <!-- Pagar à esquerda, Imprimir à direita -->
    <div style="display:flex;gap:.5rem;">
      <button class="btn-pay" onclick="pagarOS('${esc(cliente)}','${esc(numOS)}','${esc(valor)}')">Pagar OS</button>
    </div>
    <div>
      <button class="btn-print" onclick="window.print()">Imprimir OS</button>
    </div>
  </footer>

  <!-- drawer e script local da OS -->
  <div id="drawerBackdrop" class="drawer-backdrop" onclick="closeDrawer()"></div>
  <div id="drawer" class="drawer" aria-hidden="true"><div id="drawerContent"></div></div>

<script>
  // Payload/QR helpers incorporados na OS
  function tlv(id, value){ const len=String(value.length).padStart(2,'0'); return id+len+value; }
  function crc16ccitt(str){ let crc=0xffff; for(let i=0;i<str.length;i++){ crc ^= str.charCodeAt(i)<<8; for(let j=0;j<8;j++){ crc = (crc & 0x8000) ? (((crc<<1)^0x1021)&0xffff) : ((crc<<1)&0xffff); } } return crc.toString(16).toUpperCase().padStart(4,'0'); }
  function buildPix(amount, key, merchant, city, txid){ const id00=tlv('00','01'); const id01=tlv('01','12'); const gui=tlv('00','br.gov.bcb.pix'); const idKey=tlv('01',key); const desc=tlv('02','Ordem de Servico'); const id26=tlv('26',gui+idKey+desc); const id52=tlv('52','0000'); const id53=tlv('53','986'); const id54=tlv('54', (Number(amount)||0).toFixed(2)); const id58=tlv('58','BR'); const id59=tlv('59',merchant.slice(0,25)); const id60=tlv('60',city); const tx=tlv('05',String(txid).slice(0,25)); const id62=tlv('62',tx); const partial = id00+id01+id26+id52+id53+id54+id58+id59+id60+id62+'6304'; const crc=crc16ccitt(partial); return partial+crc; }
  
  function copyToClipboard(text) {
  if (!text) return;
  try {
    // Cria um input temporário visível fora da tela (garante compatibilidade iOS)
    const input = document.createElement('input');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    document.body.appendChild(input);
    input.focus();
    input.select();
    const success = document.execCommand('copy');
    document.body.removeChild(input);

    if (!success && navigator.clipboard) {
      // Fallback assíncrono (executa depois do clique, se permitido)
      navigator.clipboard.writeText(text).catch(() => {});
    }
  } catch (e) {
    console.error('Falha ao copiar PIX:', e);
  }
}


  function openDrawer(html){ document.getElementById('drawerContent').innerHTML = html; document.getElementById('drawerBackdrop').style.display='block'; const d=document.getElementById('drawer'); d.classList.add('open'); d.setAttribute('aria-hidden','false'); }
  function closeDrawer(){ const d=document.getElementById('drawer'); d.classList.remove('open'); d.setAttribute('aria-hidden','true'); setTimeout(()=>{ document.getElementById('drawerBackdrop').style.display='none'; document.getElementById('drawerContent').innerHTML=''; },300); }

  function pagarOS(cliente, os, valor){
    const v = Number(valor)||0;
    const payload = buildPix(v, '${PIX_KEY}', '${MERCHANT_NAME}', '${MERCHANT_CITY}', 'OS'+os);
    window.__lastPayload = payload;
    copyToClipboard(payload); // copia imediatamente
    const qr = 'https://quickchart.io/qr?text=' + encodeURIComponent(payload) + '&size=512&margin=2';
    const banks = (window.PAYLIB && window.PAYLIB.BANKS) ? window.PAYLIB.BANKS : ${JSON.stringify(FALLBACK_BANKS)};
    const html = '<div class="title">Pagamento via PIX</div>' +
      '<div style="font-size:14px;margin-top:6px"><strong>Cliente:</strong> '+cliente+'<br><strong>OS:</strong> '+os+'<br><strong>Valor:</strong> R$ '+v.toFixed(2)+'</div>' +
      '<img src="'+qr+'" class="qr" alt="QR">' +
      '<div class="actions"><button id="chooseBank" class="btn-pay">Escolher banco</button><button id="closeBtn" class="btn-white">Fechar</button></div>';
    openDrawer(html);
    document.getElementById('closeBtn').onclick = closeDrawer;
    document.getElementById('chooseBank').onclick = function(){
      copyToClipboard(payload); // redundância
      // lista de bancos com logos
      let listHtml = '<div class="banks-list" style="margin-top:10px">';
      banks.forEach(b => {
        const logo = b.logo ? b.logo : '';
        listHtml += '<div class="bank-item"><img src="'+logo+'" alt="'+b.name+'" /><button data-link="'+b.link+'">'+b.name+'</button></div>';
      });
      listHtml += '</div><div style="margin-top:10px"><button id="cancelBanks" class="btn-white">Cancelar</button></div>';
      openDrawer(listHtml);
      document.getElementById('cancelBanks').onclick = closeDrawer;
      document.querySelectorAll('[data-link]').forEach(el => {
        el.addEventListener('click', function(){ const link=this.getAttribute('data-link'); closeDrawer(); setTimeout(()=>{ if(link) window.location.href = link; },150); });
      });
    };
  }
    
</script>
</body>
</html>`;
        }

        // listener do form principal
        const form = $('osForm');
        if (!form) {
            console.error('Form #osForm não encontrado em gerador.html');
            return;
        }
        const previewEl = $('preview');
        const frame = $('framePreview');

        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            try {
                const getVal = id => (document.getElementById(id) || { value: '' }).value.trim();
                const cliente = getVal('cliente');
                const telefone = getVal('telefone');
                const endereco = getVal('endereco');
                const equipamento = getVal('equipamento');
                const problema = getVal('problema');
                const solucao = getVal('solucao');
                const produto = getVal('produto');
                const servico = getVal('servico');
                const valor = (brlToNumber(getVal('valor')) || 0).toFixed(2);

                const agora = new Date();
                const numOS = agora.getTime().toString().slice(-6);
                const dataStr = agora.toLocaleDateString('pt-BR');
                const horaStr = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                const html = buildOSHtml({ cliente, telefone, endereco, equipamento, problema, solucao, produto, servico, valor, numOS, dataStr, horaStr });

                if (frame) frame.srcdoc = html;
                if (previewEl) previewEl.style.display = 'block';

                const filename = `${cliente.toLowerCase().replace(/\s+/g, '-')}-${numOS}.html`;
                const blob = new Blob([html], { type: 'text/html' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                a.click();
            } catch (err) {
                console.error('Erro ao gerar OS:', err);
                alert('Erro ao gerar OS. Veja console para detalhes.');
            }
        });

        // Expor funções usadas pelo HTML
        window.abrirPix = function (cliente, os, valor) {
            const payload = buildPixPayloadLocal(Number(valor || 0), `OS${os}`);
            window.__lastPayload = payload;
            copyToClipboard(payload);
            const q = $('qrcode');
            if (q) {
                q.innerHTML = '';
                try { new QRCode(q, { text: payload, width: 150, height: 150 }); } catch (e) { }
            }
            const resumo = $('pixResumo');
            if (resumo) resumo.innerHTML = `<p><strong>Cliente:</strong> ${cliente}<br><strong>OS:</strong> ${os}<br><strong>Valor:</strong> R$ ${Number(valor).toFixed(2)}</p>`;
            const m = $('modalPix');
            if (m) m.style.display = 'flex';
        };
        window.fecharModal = function () { const m = $('modalPix'); if (m) m.style.display = 'none'; };
        window.fecharModalBancos = function () { const mb = $('modalBancos'); if (mb) mb.style.display = 'none'; };
        window.abrirBancos = function () {
            const banks = (window.PAYLIB && window.PAYLIB.BANKS) ? window.PAYLIB.BANKS : FALLBACK_BANKS;
            const listEl = $('listaBancos');
            if (!listEl) return;
            listEl.innerHTML = '';
            const p = window.__lastPayload || '';
            if (p) copyToClipboard(p);
            banks.forEach(b => {
                const div = document.createElement('div');
                div.className = 'bank-item';
                div.textContent = b.name;
                div.onclick = () => { window.location.href = b.link; };
                listEl.appendChild(div);
            });
            const mb = $('modalBancos');
            if (mb) mb.style.display = 'flex';
        };
    }); // end onReady
})();
