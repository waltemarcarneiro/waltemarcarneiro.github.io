
      document.addEventListener('DOMContentLoaded', function () {
         const chevronIconLink = document.getElementById('chevronIconLink');
         if (chevronIconLink) {
            chevronIconLink.addEventListener('click', function () {
               const chevronIcon = document.getElementById('chevronIcon');
               if (chevronIcon) {
                  chevronIcon.style.visibility = 'hidden';
               }
            });
         }

         const backIconLink = document.getElementById('backIconLink');
         if (backIconLink) {
            backIconLink.addEventListener('click', function () {
               const chevronIcon = document.getElementById('chevronIcon');
               if (chevronIcon) {
                  chevronIcon.style.visibility = 'visible';
               }
            });
         }
      });

      function getDataHoraAtual() {
         const dataHora = new Date();
         const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'America/Recife'
         };
         const dataHoraFormatada = dataHora.toLocaleDateString('pt-BR', options);
         const dataHoraSemSegundos = dataHoraFormatada.replace(/:\d{2}\sAMT/, '');
         return `Recife, ${dataHoraSemSegundos}`;
      }

      function atualizarData() {
         const dataContainer = document.getElementById('dataContainer');
         if (dataContainer) {
            dataContainer.textContent = getDataHoraAtual();
         }
      }

      atualizarData();
      setInterval(atualizarData, 60000);

      window.addEventListener('scroll', function () {
         var footer = document.getElementById('footer');
         if (window.scrollY > 0) {
            footer.style.display = 'none';
         } else {
            footer.style.display = 'block';
         }
      });
