
async function carregarAcessibilidade() {
    const response = await fetch('assets/data/acessibilidade.json');
    acessibilidadeData = await response.json();
}

function aplicarAcessibilidade() {
    const body = document.body;


    if (acessibilidadeData.contrasteAlto) {
        body.style.backgroundColor = '#000';
        body.style.color = '#000';
    } else {
        body.style.backgroundColor = '';
        body.style.color = '';
    }

    // Alterar tamanho da fonte
    if (acessibilidadeData.aumentoDeFonte) {
        body.style.fontSize = '1.5em';
    } else {
        body.style.fontSize = '';
    }
}

function toggleAccessibility() {
    acessibilidadeData.contrasteAlto = !acessibilidadeData.contrasteAlto;
    acessibilidadeData.aumentoDeFonte = !acessibilidadeData.aumentoDeFonte;
    aplicarAcessibilidade();
}

window.onload = () => {
    carregarAcessibilidade();
};




document.addEventListener("DOMContentLoaded", function () {
    
    // =======================================================
    // MÓDULO DO CAPTCHA
    // =======================================================
    const verifyButton = document.getElementById("verifyButton");
    const captchaContainer = document.getElementById("captchaContainer");
    const submitButton = document.getElementById("submitButton");

    // Verifica se os elementos do CAPTCHA existem na página antes de continuar
    if (verifyButton && captchaContainer && submitButton) {
        let recaptchaWidgetId;

        function renderCaptcha() {
            // Garante que o grecaptcha está carregado antes de usar
            if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
                captchaContainer.classList.remove("d-none");
                recaptchaWidgetId = grecaptcha.render("captchaContainer", {
                    sitekey: "6LehsIgqAAAAAPubPus2HOhABU6qtImaS963mbEN", // Lembre-se de usar sua própria Site Key
                });
            } else {
                console.error("API do reCAPTCHA não carregou a tempo.");
            }
        }

        verifyButton.addEventListener("click", () => {
            verifyButton.classList.add("d-none");
            renderCaptcha();
            submitButton.classList.remove("d-none");
        });

        submitButton.addEventListener("click", () => {
            const response = grecaptcha.getResponse(recaptchaWidgetId);

            if (response.length === 0) {
                alert("Por favor, resolva o CAPTCHA antes de continuar.");
            } else {
                alert("CAPTCHA validado com sucesso!");
                // Ação após validação (ex: redirecionar)
                window.location.href = 'adm.html';
            }
        });
    }
});