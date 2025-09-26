
document.addEventListener("DOMContentLoaded", function () {

    
    // ===================================================================
    // 1. ACESSIBILIDADE
    // ===================================================================
    let acessibilidadeData = {
        contrasteAlto: false,
        aumentoDeFonte: false,
    };

    // Função para carregar e aplicar as configurações de acessibilidade
    async function inicializarAcessibilidade() {
        try {
            const response = await fetch('acessibilidade.json');
            if (response.ok) {
                acessibilidadeData = await response.json();
            }
        } catch (error) {
            console.error("Não foi possível carregar o arquivo de acessibilidade.", error);
        } finally {
            aplicarAcessibilidade(); // Aplica as configurações carregadas (ou as padrões)
        }
    }

    // Aplica os estilos com base nos dados
    function aplicarAcessibilidade() {
        const body = document.body;

        // Contraste (CORRIGIDO: cor do texto é branca)
        if (acessibilidadeData.contrasteAlto) {
            body.classList.add('alto-contraste');
        } else {
            body.classList.remove('alto-contraste');
        }

        // Aumento de fonte
        if (acessibilidadeData.aumentoDeFonte) {
            body.classList.add('fonte-aumentada');
        } else {
            body.classList.remove('fonte-aumentada');
        }
    }
    
    // Toggles independentes 
    window.toggleContraste = function() {
        acessibilidadeData.contrasteAlto = !acessibilidadeData.contrasteAlto;
        aplicarAcessibilidade();
    }

    window.toggleFonte = function() {
        acessibilidadeData.aumentoDeFonte = !acessibilidadeData.aumentoDeFonte;
        aplicarAcessibilidade();
    }
    
    const verifyButton = document.getElementById("verifyButton");
    const captchaContainer = document.getElementById("captchaContainer");
    const submitButton = document.getElementById("submitButton");

    let recaptchaWidgetId;

    function renderCaptcha() {
        captchaContainer.classList.remove("d-none");
        recaptchaWidgetId = grecaptcha.render("captchaContainer", {
            sitekey: "6LehsIgqAAAAAPubPus2HOhABU6qtImaS963mbEN"
        });
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
            window.location.href = 'planos.html';
        }
    });

    if (captchaContainer.classList.contains("d-none")) {
        renderCaptcha();
    }
});
