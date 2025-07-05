export async function desbloquearComBiometria() {
  if (!window.PublicKeyCredential) {
    console.warn("Biometria não suportada.");
    return false;
  }

  try {
    await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32),
        timeout: 60000,
        userVerification: "required"
      }
    });

    console.log("✅ Biometria validada");
    return true;

  } catch (err) {
    console.warn("❌ Biometria falhou:", err);
    return false;
  }
}
