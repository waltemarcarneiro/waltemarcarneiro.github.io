const buttons = document.querySelectorAll("#metodos button");

buttons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const valor = document.getElementById("valor").value || 10.0;
    const email = document.getElementById("email").value || "cliente_teste@teste.com";
    const metodo = btn.dataset.metodo;

    const div = document.getElementById("resultado");
    div.innerHTML = `<p>Processando pagamento via ${metodo.toUpperCase()}...</p>`;

    try {
      const res = await fetch("/api/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valor,
          descricao: "Serviço de teste - Corte + Escova",
          email,
          metodo,
        }),
      });

      const data = await res.json();
      console.log("Pagamento retornou:", data);

      if (metodo === "pix" && data.point_of_interaction?.transaction_data?.qr_code_base64) {
        div.innerHTML = `
          <p><strong>Escaneie o QR Code abaixo:</strong></p>
          <img src="data:image/png;base64,${data.point_of_interaction.transaction_data.qr_code_base64}" width="250">
          <p>${data.point_of_interaction.transaction_data.qr_code}</p>
        `;
      } else if (metodo === "bolbradesco" || metodo === "visa") {
        div.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      } else {
        div.innerHTML = `<p>Erro ao gerar pagamento: ${data.message || "Verifique o console"}</p>`;
      }
    } catch (err) {
      console.error("Erro de rede:", err);
      div.innerHTML = `<p>Falha ao conectar com o servidor</p>`;
    }
  });
});
