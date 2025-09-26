// Espera o HTML ser completamente carregado para o script ser executado.
document.addEventListener('DOMContentLoaded', function() {

    // Seleciona os elementos do formulário que vamos usar.
    const form = document.getElementById('formulario-login');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Cria um elemento para exibir mensagens de erro (vamos adicioná-lo no HTML depois).
    const errorMessageContainer = document.createElement('div');
    errorMessageContainer.id = 'error-message';
    errorMessageContainer.style.color = 'red'; // Estilo básico para o erro.
    errorMessageContainer.style.textAlign = 'center';
    errorMessageContainer.style.marginBottom = '15px';

    // Insere a caixa de erro antes do botão de submit.
    const submitButton = form.querySelector('.btn-submit');
    form.insertBefore(errorMessageContainer, submitButton);

    // Adiciona um "escutador" para o evento de 'submit' do formulário.
    form.addEventListener('submit', function(event) {
        // 1. Impede o envio padrão do formulário para podermos validar primeiro.
        event.preventDefault();

        // Limpa mensagens de erro antigas.
        errorMessageContainer.textContent = '';

        // 2. Pega os valores dos campos, removendo espaços em branco no início e fim.
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // 3. Realiza as validações.
        if (emailValue === '') {
            errorMessageContainer.textContent = 'Por favor, preencha seu e-mail.';
            emailInput.focus(); // Coloca o foco no campo de e-mail.
            return; // Para a execução.
        }

        if (!isValidEmail(emailValue)) {
            errorMessageContainer.textContent = 'Por favor, digite um formato de e-mail válido.';
            emailInput.focus();
            return;
        }

        if (passwordValue === '') {
            errorMessageContainer.textContent = 'Por favor, preencha sua senha.';
            passwordInput.focus();
            return;
        }
        
        // Se todas as validações passarem...
        console.log('Validação bem-sucedida! Enviando formulário...');

        // 4. Envia o formulário programaticamente.
        form.submit();
    });

    /**
     * Função auxiliar para validar o formato do e-mail de forma simples.
     * @param {string} email O e-mail a ser validado.
     * @returns {boolean} Verdadeiro se o e-mail for válido.
     */
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});

async function carregarAcessibilidade() {
    const response = await fetch('acessibilidade.json');
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
