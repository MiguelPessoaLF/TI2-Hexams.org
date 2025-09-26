document.addEventListener("DOMContentLoaded", () => {
    // --- SELEÇÃO DOS ELEMENTOS DA PÁGINA ---
    const buscaInput = document.getElementById("busca-cpf");
    const buscarBtn = document.getElementById("btn-buscar");
    const gerenciarBtn = document.getElementById("btn-gerenciar");
    const overlay = document.getElementById("overlay");
    const formExibicao = document.getElementById("form-exibicao");

    // --- ELEMENTOS DO FORMULÁRIO DE EXIBIÇÃO ---
    const displayFields = {
        nome: document.getElementById("display-nome"),
        dataNascimento: document.getElementById("display-data-nascimento"),
        cpf: document.getElementById("display-cpf"),
        telefone: document.getElementById("display-telefone"),
        email: document.getElementById("display-email"),
        cep: document.getElementById("display-cep"),
        endereco: document.getElementById("display-endereco"),
        bairro: document.getElementById("display-bairro"),
        numero: document.getElementById("display-numero"),
        cidade: document.getElementById("display-cidade"),
        uf: document.getElementById("display-uf")
    };

    // --- FUNÇÕES ---

    // Função para preencher o formulário com os dados do funcionário
    function preencherFormulario(funcionario) {
        displayFields.nome.value = funcionario.nome;
        // A data vem como 'AAAA-MM-DD', então formatamos para DD/MM/AAAA
        displayFields.dataNascimento.value = funcionario.data.split('-').reverse().join('/');
        displayFields.cpf.value = funcionario.cpf;
        displayFields.telefone.value = funcionario.telefone;
        displayFields.email.value = funcionario.email;
        
        // Preenche os dados de endereço, que estão em um objeto aninhado
        displayFields.cep.value = funcionario.endereco.cep;
        displayFields.endereco.value = funcionario.endereco.logradouro;
        displayFields.bairro.value = funcionario.endereco.bairro;
        displayFields.numero.value = funcionario.endereco.numero;
        displayFields.cidade.value = funcionario.endereco.cidade;
        displayFields.uf.value = funcionario.endereco.uf;
    }

    // Função para limpar todos os campos do formulário de exibição
    function limparFormulario() {
        formExibicao.reset();
    }

    // Função principal de busca (versão melhorada que ignora formatação do CPF)
    function buscarFuncionario() {
        const cpfBuscado = buscaInput.value;

        if (!cpfBuscado) {
            alert("Por favor, digite um CPF para realizar a busca.");
            return;
        }

        // Carrega os funcionários salvos no localStorage (pela página cdf.js)
        const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
        
        // Limpa a formatação (pontos, traços) do CPF digitado para a busca
        const cpfBuscadoLimpo = cpfBuscado.replace(/\D/g, '');

        // Procura pelo funcionário comparando apenas os números do CPF
        const funcionarioEncontrado = funcionarios.find(f => {
            const cpfSalvoLimpo = f.cpf.replace(/\D/g, ''); // Limpa também o CPF salvo
            return cpfSalvoLimpo === cpfBuscadoLimpo;
        });

        if (funcionarioEncontrado) {
            alert("Funcionário encontrado!");
            preencherFormulario(funcionarioEncontrado);
        } else {
            alert("Nenhum funcionário encontrado com o CPF informado.");
            limparFormulario();
        }
    }

    // --- EVENT LISTENERS (QUEM ACIONA AS FUNÇÕES) ---

    // Adiciona o evento de clique ao botão de buscar
    buscarBtn.addEventListener("click", buscarFuncionario);

    // Permite buscar pressionando "Enter" no campo de busca
    buscaInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            buscarFuncionario();
        }
    });

    // Mantém a sua lógica original do overlay
    gerenciarBtn.addEventListener("click", () => {
        overlay.style.visibility = "visible";
        // Esconde o overlay depois de um tempo (ex: 2 segundos)
        setTimeout(() => {
            overlay.style.visibility = "hidden";
        }, 2000);
    });

    // Adiciona máscara de CPF ao campo de busca para facilitar a digitação
    buscaInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = v;
    });


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
});