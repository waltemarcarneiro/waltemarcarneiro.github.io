        // Script para esconder labels quando os campos são preenchidos (mesmo que antes)
        const inputLabels = document.querySelectorAll(".input-label");
        const inputFields = document.querySelectorAll("input, textarea");

        inputFields.forEach((input) => {
            input.addEventListener("input", () => {
                inputLabels.forEach((label) => {
                    if (input.id === label.previousElementSibling.getAttribute("for")) {
                        label.classList.toggle("hidden", input.value !== "");
                    }
                });
            });
        });

        // Script para limpar o formulário
        document.getElementById("clear-button").addEventListener("click", function() {
            inputFields.forEach((input) => {
                input.value = "";
                inputLabels.forEach((label) => {
                    if (input.id === label.previousElementSibling.getAttribute("for")) {
                        label.classList.remove("hidden");
                    }
                });
            });
        });

        // Script para enviar o e-mail (o mesmo que antes)
        document.getElementById("send-button").addEventListener("click", function() {
            var to = document.getElementById("to").value;
            var name = document.getElementById("name").value;
            var phone = document.getElementById("phone").value;
            var subject = document.getElementById("subject").value;
            var body = document.getElementById("body").value;

            var mailtoLink = "mailto:" + encodeURIComponent(to) + "?subject=" + encodeURIComponent(subject) +
                            "&body=" + encodeURIComponent("Nome: " + name + "\nTelefone: " + phone + "\n\n" + body);

            window.location.href = mailtoLink;
        });