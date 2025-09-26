// --- Início do Bloco Principal ---
document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // 1. ACESSIBİLİDADE (VERSÃO CORRIGIDA PARA SEU BOTÃO)
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

        // Contraste
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

    window.toggleAccessibility = function () {
        acessibilidadeData.contrasteAlto = !acessibilidadeData.contrasteAlto;
        acessibilidadeData.aumentoDeFonte = !acessibilidadeData.aumentoDeFonte;
        aplicarAcessibilidade();
    }

    // Inicia o sistema de acessibilidade
    inicializarAcessibilidade();

    // ===================================================================
    // 2. FORMULÁRIO (.formularioEmpresa)
    // ===================================================================
    const formEmpresa = document.querySelector('.formularioEmpresa');
    if (formEmpresa) {
        // --- Funções Auxiliares ---

        // Máscaras (sem alteração, apenas movidas para dentro do escopo)
        function applyMasks() {
            const inputs = {
                cnpj: document.getElementById('cnpj'),
                celular: document.getElementById('celular'),
                inscricao: document.getElementById('inscricao'),
                inicioAtividade: document.getElementById('inicio-atividade')
            };

            if (inputs.cnpj) inputs.cnpj.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').substring(0, 18);
            });
            if (inputs.celular) inputs.celular.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
            });
            if (inputs.inscricao) inputs.inscricao.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
            if (inputs.inicioAtividade) inputs.inicioAtividade.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
            });
        }

        // Validação de Data (CORRIGIDO)
        function isValidDate(dateString) {
            if (!/^\d{2}\/\d{2}$/.test(dateString)) return false;

            const parts = dateString.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);

            if (month < 1 || month > 12 || day < 1 || day > 31) {
                return false;
            }
            // Verificações mais complexas (ex: Fevereiro com 30 dias) podem ser adicionadas se necessário
            return true;
        }

        // LocalStorage (sem alteração)
        function saveToLocalStorage() {
            const empresaData = {
                cnpj: document.getElementById('cnpj').value,
                celular: document.getElementById('celular').value,
                inscricao: document.getElementById('inscricao').value,
                inicioAtividade: document.getElementById('inicio-atividade').value,
                email: document.getElementById('email').value
            };
            localStorage.setItem('empresaData', JSON.stringify(empresaData));
        }

        function loadFromLocalStorage() {
            const savedData = localStorage.getItem('empresaData');
            if (savedData) {
                const empresaData = JSON.parse(savedData);
                for (const key in empresaData) {
                    const field = document.getElementById(key.replace('-', '')); // Ajuste para 'inicio-atividade'
                    if (field) field.value = empresaData[key];
                }
            }
        }

        // --- Validação no Envio ---
        formEmpresa.addEventListener('submit', function (event) {
            event.preventDefault();
            let errors = []; // Array para armazenar todas as mensagens de erro

            // Função para limpar estilos de erro antigos
            formEmpresa.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

            // Validações
            const cnpjInput = document.getElementById('cnpj');
            if (cnpjInput.value.length < 18) errors.push("CNPJ inválido.");

            const celularInput = document.getElementById('celular');
            if (celularInput.value.length < 15) errors.push("Número de celular inválido.");

            const emailInput = document.getElementById('email');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) errors.push("E-mail inválido.");

            const inicioAtividadeInput = document.getElementById('inicio-atividade');
            if (!isValidDate(inicioAtividadeInput.value)) errors.push("Data de início inválida (use DD/MM).");

            // Validação de senha integrada
            const senhaInput = document.getElementById('senha');
            if (senhaInput) { // Verifica se o campo de senha existe neste formulário
                if (senhaInput.value.length < 8) errors.push("Senha deve ter no mínimo 8 caracteres.");
                if (!/\d/.test(senhaInput.value)) errors.push("Senha deve conter ao menos um número.");
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(senhaInput.value)) errors.push("Senha deve conter ao menos um caractere especial.");
            }

            // Exibição de Erros (Melhorado: sem múltiplos alerts)
            if (errors.length > 0) {
                alert("Foram encontrados os seguintes erros:\n\n- " + errors.join("\n- "));
            } else {
                saveToLocalStorage();
                alert("Formulário enviado com sucesso!");
                window.location.href = 'planos.html';
            }
        });

        // Inicialização do formulário
        applyMasks();
        loadFromLocalStorage();
    }

    // ===================================================================
    // 3. VALIDAÇÃO DE SENHA EM TEMPO REAL
    // ===================================================================
    const senhaInput = document.getElementById('senha');
    const mensagemValidacao = document.getElementById('mensagem-validacao');
    if (senhaInput && mensagemValidacao) {
        senhaInput.addEventListener('input', function () {
            const senha = senhaInput.value;
            if (senha.length === 0) {
                mensagemValidacao.textContent = 'Mínimo 8 caracteres, um número e um especial.';
                mensagemValidacao.style.color = 'inherit';
                return;
            }
            if (senha.length < 8) {
                mensagemValidacao.textContent = 'ERRO: Mínimo 8 caracteres.';
                mensagemValidacao.style.color = 'red';
            } else if (!/\d/.test(senha)) {
                mensagemValidacao.textContent = 'ERRO: Adicione ao menos um número.';
                mensagemValidacao.style.color = 'red';
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
                mensagemValidacao.textContent = 'ERRO: Adicione ao menos um caractere especial.';
                mensagemValidacao.style.color = 'red';
            } else {
                mensagemValidacao.textContent = 'Senha válida!';
                mensagemValidacao.style.color = 'green';
            }
        });
    }

    // Inicializa a acessibilidade
    inicializarAcessibilidade();
});