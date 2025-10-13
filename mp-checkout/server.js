import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const MP_API_URL = "https://api.mercadopago.com/v1/payments";

// Rota para criar pagamento
app.post("/api/pagar", async (req, res) => {
  try {
    const { valor, descricao, email, metodo } = req.body;

    // Garante chave de idempotência
    const idemKey = crypto.randomUUID();

    // Monta payload
    const paymentData = {
      transaction_amount: Number(valor) || 10.0,
      description: descricao || "Serviço de teste",
      payment_method_id: metodo || "pix", // 'pix', 'bolbradesco', 'visa'
      payer: {
        email: email || "test_user_123456@testuser.com",
        first_name: "Cliente",
        last_name: "Teste",
        identification: {
          type: "CPF",
          number: "19119119100",
        },
      },
    };

    // Faz a requisição para o Mercado Pago
    const response = await fetch(MP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": idemKey,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    // Mostra detalhes completos no console para debug
    console.log("📦 RESPOSTA MERCADO PAGO:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Erro interno no servidor", details: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});
