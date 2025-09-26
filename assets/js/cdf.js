document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("tabela-usuarios").getElementsByTagName('tbody')[0];
    const form = document.getElementById("cadastro-form");

    // Função para adicionar um novo usuário
    function adicionarUsuario() {
        const nome = document.getElementById("nome").value;
        const idade = document.getElementById("idade").value;
        const cpf = document.getElementById("cpf").value;
        const telefone = document.getElementById("telefone").value;
        const email = document.getElementById("email").value;
        const data = document.getElementById("selectedDate").value;

        if (!nome || !idade || !cpf || !telefone || !email || !data) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        const novoFuncionario = { nome, idade, cpf, telefone, email, data };
        adicionarLinhaTabela(novoFuncionario);
        salvarNoLocalStorage(novoFuncionario);

        form.reset();
        alert("Funcionário cadastrado com sucesso!");
    }

    // Função para adicionar uma nova linha na tabela
    function adicionarLinhaTabela(funcionario) {
        const novaLinha = tabela.insertRow();

        novaLinha.insertCell(0).textContent = funcionario.nome;
        novaLinha.insertCell(1).textContent = funcionario.idade;
        novaLinha.insertCell(2).textContent = funcionario.cpf;
        novaLinha.insertCell(3).textContent = funcionario.telefone;
        novaLinha.insertCell(4).textContent = funcionario.email;
        novaLinha.insertCell(5).textContent = funcionario.data;

        const acaoCell = novaLinha.insertCell(6);
        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "X";
        
        // ALTERAÇÃO: Removi o estilo inline e adicionei uma classe
        botaoRemover.className = "delete-btn"; 

        botaoRemover.addEventListener("click", function () {
            removerFuncionario(novaLinha);
        });

        acaoCell.appendChild(botaoRemover);
    }

    // Função para remover funcionário da tabela e do localStorage
    function removerFuncionario(linha) {
        const nome = linha.cells[0].textContent;
        linha.remove();

        let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
        funcionarios = funcionarios.filter(funcionario => funcionario.nome !== nome);
        localStorage.setItem("funcionarios", JSON.stringify(funcionarios));

        alert("Funcionário removido com sucesso!");
    }

    // Função para salvar funcionário no localStorage
    function salvarNoLocalStorage(funcionario) {
        let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
        funcionarios.push(funcionario);
        localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    }

    // Função para carregar os dados do localStorage
    function carregarDoLocalStorage() {
        const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
        funcionarios.forEach(adicionarLinhaTabela);
    }

    // Função para importar CSV
    function importarCSV() {
        const input = document.getElementById("importar-csv");
        const file = input.files[0];
        if (!file) {
            alert("Por favor, selecione um arquivo CSV!");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const linhas = event.target.result.split("\n");
            linhas.forEach((linha, index) => {
                if (index === 0 || linha.trim() === "") return;
                const dados = linha.split(",");
                if (dados.length === 6) {
                    const funcionario = {
                        nome: dados[0],
                        idade: dados[1],
                        cpf: dados[2],
                        telefone: dados[3],
                        email: dados[4],
                        data: dados[5]
                    };
                    adicionarLinhaTabela(funcionario);
                    salvarNoLocalStorage(funcionario);
                }
            });
        };
        reader.readAsText(file);
    }

    // Função para exportar para CSV
    function exportarParaCSV() {
        const linhas = document.querySelectorAll("#tabela-usuarios tr");
        let csv = [];

        linhas.forEach((linha) => {
            const colunas = linha.querySelectorAll("td, th");
            // Mapeia os dados e remove a última coluna (Ação) da exportação
            const dados = Array.from(colunas).slice(0, -1).map(coluna => `"${coluna.innerText}"`);
            csv.push(dados.join(","));
        });

        const csvContent = csv.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "funcionarios.csv";
        link.click();
        URL.revokeObjectURL(url);
    }

    // Máscara de CPF
    const cpfInput = document.getElementById("cpf");
    cpfInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = value;
    });

    // Máscara de Celular
    const telefoneInput = document.getElementById("telefone");
    telefoneInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
        e.target.value = value;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        adicionarUsuario();
    });

    document.getElementById("importar-csv").addEventListener("change", importarCSV);
    document.getElementById("botao-exportar").addEventListener("click", exportarParaCSV);
    
    carregarDoLocalStorage();
});

function irParaProximaPagina() {
    window.location.href = "captcha.html";
}
