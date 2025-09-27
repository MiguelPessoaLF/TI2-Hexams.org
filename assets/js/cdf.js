// --- Início do Bloco Principal ---

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



document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("tabela-usuarios").getElementsByTagName('tbody')[0];
    const form = document.getElementById("cadastro-form");

    const cepInput = document.getElementById("CEP");
    const logradouroInput = document.getElementById("logradouro");
    const numeroInput = document.getElementById("numero");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");

    const buscarCep = async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            const url = `https://viacep.com.br/ws/${cep}/json/`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (!data.erro) {
                    logradouroInput.value = data.logradouro;
                    bairroInput.value = data.bairro;
                    cidadeInput.value = data.localidade;
                    ufInput.value = data.uf;
                    numeroInput.focus();
                } else {
                    alert('CEP não encontrado.');
                }
            } catch (error) {
                alert('Não foi possível buscar o CEP.');
            }
        }
    };

    const formatarData = (data) => !data ? '' : data.split('-').reverse().join('/');

    function adicionarUsuario() {
        const nome = document.getElementById("nome").value;
        const cpf = cpfInput.value;
        const telefone = telefoneInput.value;
        const email = document.getElementById("email").value;
        const data = document.getElementById("selectedDate").value;
        
        const endereco = {
            cep: cepInput.value,
            logradouro: logradouroInput.value,
            numero: numeroInput.value,
            bairro: bairroInput.value,
            cidade: cidadeInput.value,
            uf: ufInput.value
        };

        if (!nome || !cpf || !telefone || !email || !data || !endereco.cep || !endereco.numero) {
            alert("Por favor, preencha todos os campos obrigatórios (*)");
            return;
        }

        const novoFuncionario = { nome, cpf, telefone, email, data, endereco };
        adicionarLinhaTabela(novoFuncionario);
        salvarNoLocalStorage(novoFuncionario);

        form.reset();
        alert("Funcionário cadastrado com sucesso!");
    }

    function adicionarLinhaTabela(funcionario) {
        const novaLinha = tabela.insertRow();

        novaLinha.insertCell(0).textContent = funcionario.nome;
        novaLinha.insertCell(1).textContent = funcionario.cpf;
        novaLinha.insertCell(2).textContent = formatarData(funcionario.data);
        novaLinha.insertCell(3).textContent = funcionario.telefone;
        novaLinha.insertCell(4).textContent = funcionario.email;
        
        novaLinha.insertCell(5).textContent = funcionario.endereco.cep;
        novaLinha.insertCell(6).textContent = funcionario.endereco.logradouro;
        novaLinha.insertCell(7).textContent = funcionario.endereco.numero;
        novaLinha.insertCell(8).textContent = funcionario.endereco.bairro;
        novaLinha.insertCell(9).textContent = funcionario.endereco.cidade;
        novaLinha.insertCell(10).textContent = funcionario.endereco.uf;

        const acaoCell = novaLinha.insertCell(11);
        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "X";
        botaoRemover.className = "delete-btn";
        botaoRemover.addEventListener("click", () => removerFuncionario(novaLinha, funcionario.cpf));
        acaoCell.appendChild(botaoRemover);
    }

    function removerFuncionario(linha, cpf) {
        linha.remove();
        let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
        funcionarios = funcionarios.filter(f => f.cpf !== cpf);
        localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
        alert("Funcionário removido com sucesso!");
    }

    function salvarNoLocalStorage(funcionario) {
        let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
        funcionarios.push(funcionario);
        localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    }

    function carregarDoLocalStorage() {
        const funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
        funcionarios.forEach(adicionarLinhaTabela);
    }

    function importarCSV() {
        const input = document.getElementById("importar-csv");
        const file = input.files[0];
        if (!file) { alert("Por favor, selecione um arquivo CSV!"); return; }
        const reader = new FileReader();
        reader.onload = function (event) {
            // Lógica de importação a ser implementada
        };
        reader.readAsText(file);
    }

    function exportarParaCSV() {
        const linhas = Array.from(document.querySelectorAll("#tabela-usuarios tr"));
        const conteudo = linhas.map(l => Array.from(l.querySelectorAll("th, td")).slice(0, -1).map(c => `"${c.innerText}"`).join(",")).join("\n");
        const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "funcionarios.csv";
        link.click();
        URL.revokeObjectURL(url);
    }
    
    cpfInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = v;
    });

    telefoneInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
        e.target.value = v;
    });
    
    cepInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        adicionarUsuario();
    });

    document.getElementById("importar-csv").addEventListener("change", importarCSV);
    document.getElementById("botao-exportar").addEventListener("click", exportarParaCSV);
    cepInput.addEventListener('blur', buscarCep);
    
    carregarDoLocalStorage();
});

function irParaProximaPagina() {
    window.location.href = "adm.html";
}