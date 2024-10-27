// Seleção de elementos principais e configuração inicial
const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");

const btnBaterPonto = document.getElementById("btn-bater-ponto");
btnBaterPonto.addEventListener("click", register);

const dialogPonto = document.getElementById("dialog-ponto");
const dialogData = document.getElementById("dialog-data");
const dialogHora = document.getElementById("dialog-hora");

const btnDialogFechar = document.getElementById("btn-dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

// Elemento de alerta e botão de fechar do alerta
const divAlertaRegistroPonto = document.getElementById("alerta-registro-ponto");
const btnCloseAlertRegister = document.getElementById("alerta-registro-ponto-fechar");

const nextRegister = {
    "entrada": "intervalo",
    "intervalo": "volta-intervalo", 
    "volta-intervalo": "saida", 
    "saida": "entrada"
};

// Seleção dos elementos de justificativa
const btnJustificarAusencia = document.getElementById("btn-justificar-ausencia");
const divJustificativa = document.getElementById("div-justificativa");
const btnEnviarJustificativa = document.getElementById("btn-enviar-justificativa");
const justificativaTexto = document.getElementById("justificativa-texto");
const justificativaArquivo = document.getElementById("justificativa-arquivo");

// Campo para observação
const observacaoTexto = document.getElementById("observacao-texto");

// Exibe o campo de justificativa e upload de arquivo ao clicar no botão "Justificar Ausência"
btnJustificarAusencia.addEventListener("click", () => {
    divJustificativa.classList.remove("hidden");
});

// Função para registrar a justificativa e salvar no LocalStorage
btnEnviarJustificativa.addEventListener("click", () => {
    const justificativa = justificativaTexto.value;
    const arquivo = justificativaArquivo.files[0] ? justificativaArquivo.files[0].name : null;

    if (!justificativa && !arquivo) {
        alert("Por favor, insira uma justificativa ou selecione um arquivo.");
        return;
    }

    // Criar o objeto de justificativa de ausência
    const ausencia = {
        date: getCurrentDate(),
        time: getCurrentHour(),
        type: "Ausência",
        justificativa: justificativa,
        arquivo: arquivo
    };

    // Salvar a justificativa de ausência no LocalStorage
    saveRegisterLocalStorage(ausencia);

    // Limpar os campos de justificativa
    justificativaTexto.value = "";
    justificativaArquivo.value = "";

    // Ocultar a seção de justificativa e mostrar o alerta de sucesso
    divJustificativa.classList.add("hidden");
    showAlert();
});

// Função para exibir o alerta temporariamente ao registrar o ponto
function showAlert() {
    divAlertaRegistroPonto.classList.remove("hidden");
    divAlertaRegistroPonto.classList.add("show");

    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
        divAlertaRegistroPonto.classList.remove("show");
        divAlertaRegistroPonto.classList.add("hidden");
    }, 5000);
}

// Função para fechar o alerta manualmente ao clicar no "X"
btnCloseAlertRegister.addEventListener("click", () => {
    divAlertaRegistroPonto.classList.remove("show");
    divAlertaRegistroPonto.classList.add("hidden");
});

diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();

// Função para abrir o diálogo de registro de ponto
function register() {
    dialogData.textContent = "Data: " + getCurrentDate();
    dialogHora.textContent = "Hora: " + getCurrentHour();
    
    let lastTypeRegister = localStorage.getItem("lastTypeRegister");
    if (lastTypeRegister) {
        const typeRegister = document.getElementById("tipos-ponto");
        typeRegister.value = nextRegister[lastTypeRegister];
        let lastRegisterText = "Último registro: " + localStorage.getItem("lastDateRegister") + " - " + localStorage.getItem("lastTimeRegister") + " | " + localStorage.getItem("lastTypeRegister");
        document.getElementById("dialog-last-register").textContent = lastRegisterText;
    }

    // Iniciar o intervalo de atualização da hora no diálogo
    const intervalId = setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrentHour();
    }, 1000);

    // Limpar o intervalo quando o diálogo é fechado
    dialogPonto.addEventListener("close", () => clearInterval(intervalId));

    dialogPonto.showModal();
}

// Seleção do botão de registro no passado
const btnHistoricDate = document.getElementById("btn-historic-date");

// Adiciona evento de clique para abrir o registro no passado
btnHistoricDate.addEventListener("click", setHistoricDate);

// Função para registro no passado
function setHistoricDate() {
    const dateInput = prompt("Digite a data anterior (formato DD/MM/AAAA):");
    const dateParts = dateInput.split("/");
    const selectedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    const today = new Date();

    // Verificar se a data é no futuro
    if (selectedDate > today) {
        alert("Data futura não permitida.");
        return;
    }

    // Formatar a data inserida
    const formattedDate = dateParts[0].padStart(2, '0') + "/" + dateParts[1].padStart(2, '0') + "/" + dateParts[2];
    const currentTime = getCurrentHour();

    // Criar o objeto de ponto histórico
    const historicPoint = {
        date: formattedDate,
        time: currentTime,
        type: document.getElementById("tipos-ponto").value,
        isHistoric: true // Marcação diferenciada para ponto no passado
    };

    // Salvar o ponto histórico no LocalStorage
    saveRegisterLocalStorage(historicPoint);

    // Fechar o diálogo
    dialogPonto.close();

    // Mostrar mensagem de sucesso
    showAlert();
}

// Botão para registrar ponto ao clicar em "Registrar ponto" no diálogo
const btnDialogBaterPonto = document.getElementById("btn-dialog-bater-ponto");
btnDialogBaterPonto.addEventListener("click", async () => {
    const typeRegister = document.getElementById("tipos-ponto");
    const observacao = observacaoTexto.value;
    let userCurrentPosition = await getCurrentPosition();

    let ponto = {
        data: getCurrentDate(),
        hora: getCurrentHour(),
        localizacao: userCurrentPosition,
        tipo: typeRegister.value,
        observacao: observacao || null
    }

    saveRegisterLocalStorage(ponto);

    localStorage.setItem("lastDateRegister", ponto.data);
    localStorage.setItem("lastTimeRegister", ponto.hora);
    observacaoTexto.value = ""; // Limpar observação após salvar

    dialogPonto.close();

    // Mostrar mensagem de sucesso
    showAlert();
});

// Função para salvar registros no LocalStorage
function saveRegisterLocalStorage(register) {
    let registers = JSON.parse(localStorage.getItem("register")) || [];
    registers.push(register);
    localStorage.setItem("register", JSON.stringify(registers));
    
    if (register.type !== "Ausência") {
        const typeRegister = document.getElementById("tipos-ponto");
        localStorage.setItem("lastTypeRegister", typeRegister.value);
    }
}

function getRegisterLocalStorage() {
    let registers = localStorage.getItem("register");
    return registers ? JSON.parse(registers) : [];
}

// Função auxiliar para obter a localização do usuário
async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }),
            (error) => reject("Erro ao recuperar a localização: " + error)
        );
    });
}

// Funções para exibir data e hora atualizadas
function getWeekDay() {
    const date = new Date();
    let days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return days[date.getDay()];
}

function getCurrentHour() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

function getCurrentDate() {
    const date = new Date();
    return String(date.getDate()).padStart(2, '0') + "/" + String((date.getMonth() + 1)).padStart(2, '0') + "/" + String(date.getFullYear()).padStart(2, '0');
}

function printCurrentHour() {
    horaMinSeg.textContent = getCurrentHour();
}

printCurrentHour();
setInterval(printCurrentHour, 1000);
