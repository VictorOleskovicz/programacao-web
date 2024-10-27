function renderList() {
    const registrosContainer = document.getElementById("registros-relatorio");
    registrosContainer.innerHTML = ""; // Limpar o conteúdo anterior

    const registers = JSON.parse(localStorage.getItem("register")) || [];

    registers.forEach(register => {
        // Criação de um contêiner para cada registro
        const divRegistro = document.createElement("div");
        divRegistro.classList.add("registro-item");

        // Formatação da exibição do registro
        divRegistro.innerHTML = `
            <p><strong>Data:</strong> ${register.date}</p>
            <p><strong>Tipo:</strong> ${register.type} | <strong>Hora:</strong> ${register.time}</p>
            ${register.observacao ? `<p><strong>Observação:</strong> ${register.observacao}</p>` : ""}
            ${register.arquivo ? `<p><strong>Anexo:</strong> <a href="#">${register.arquivo}</a></p>` : ""}
            <button onclick="editRegister('${register.id}')">Editar</button>
            <button onclick="exibirMensagemExcluir()">Excluir</button>
        `;

        registrosContainer.appendChild(divRegistro);
    });
}

// Função para exibir mensagem ao tentar excluir um registro
function exibirMensagemExcluir() {
    alert("A exclusão de registros não é permitida.");
}

// Função para editar um registro
function editRegister(id) {
    let registers = JSON.parse(localStorage.getItem("register")) || [];
    const register = registers.find(r => r.id === id);

    if (register) {
        const novoTipo = prompt("Digite o novo tipo de ponto (entrada, intervalo, volta-intervalo, saída):", register.type);
        const novaObservacao = prompt("Digite a nova observação:", register.observacao || "");

        // Atualizar valores se houver mudança
        if (novoTipo) register.type = novoTipo;
        if (novaObservacao) register.observacao = novaObservacao;

        localStorage.setItem("register", JSON.stringify(registers));
        renderList(); // Atualiza a lista na tela
    }
}

// Função para filtrar registros por período
function filtrarPeriodo(periodo) {
    let registers = JSON.parse(localStorage.getItem("register")) || [];
    const hoje = new Date();

    registers = registers.filter(register => {
        const dataRegistro = new Date(register.date.split('/').reverse().join('-'));
        if (periodo === "semana") {
            const umaSemanaAtras = new Date();
            umaSemanaAtras.setDate(hoje.getDate() - 7);
            return dataRegistro >= umaSemanaAtras;
        } else if (periodo === "mes") {
            const umMesAtras = new Date();
            umMesAtras.setMonth(hoje.getMonth() - 1);
            return dataRegistro >= umMesAtras;
        }
        return true;
    });

    // Renderizar registros filtrados
    renderFilteredList(registers);
}

// Função para exibir a lista filtrada
function renderFilteredList(filteredRegisters) {
    const registrosContainer = document.getElementById("registros-relatorio");
    registrosContainer.innerHTML = ""; // Limpar o conteúdo anterior

    filteredRegisters.forEach(register => {
        const divRegistro = document.createElement("div");
        divRegistro.classList.add("registro-item");

        divRegistro.innerHTML = `
            <p><strong>Data:</strong> ${register.date}</p>
            <p><strong>Tipo:</strong> ${register.type} | <strong>Hora:</strong> ${register.time}</p>
            ${register.observacao ? `<p><strong>Observação:</strong> ${register.observacao}</p>` : ""}
            ${register.arquivo ? `<p><strong>Anexo:</strong> <a href="#">${register.arquivo}</a></p>` : ""}
            <button onclick="editRegister('${register.id}')">Editar</button>
            <button onclick="exibirMensagemExcluir()">Excluir</button>
        `;

        registrosContainer.appendChild(divRegistro);
    });
}

renderList(); // Chamar a função ao carregar a página para exibir a lista completa
