const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dias-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");
const dialogPonto = document.getElementById("dialog-ponto");


const btnBaterPonto = document.getElementById("btn-bater-ponto");
btnBaterPonto.addEventListener("click", register)

const btnFecharPonto = document.getElementById("btn-fechar-dialog");
btnFecharPonto.addEventListener("click", exit
)


diaSemana.textContent = getWeekDay();
diaMesAno.textContent = getCurrentDate();
horaMinSeg.textContent = getCurrentHour(); 


function getWeekDay(){
    const date = new Date();
    const diaDaSemana = new Map ([
        [0, "Domingo"],
        [1, "Segunda"],
        [2, "Terça"],
        [3, "Quarta"],
        [4, "Quinta"],
        [5, "Sexta"],
        [6, "Sabado"]
        
    ]);
    return diaDaSemana.get(date.getDay());
}
function getCurrentHour() {
    const date = new Date();
    
    let hora = date.getHours();
    let min = date.getMinutes();
    let seg = date.getSeconds();
    
    if (hora < 10) {
        hora = "0"+hora
    };
    if (min < 10) {
        min = "0"+min
    };
    if (seg < 10) {
        seg = "0"+seg
    };
    return hora + ":" + min + ":" + seg;
    
}
function printCurrentHour(){
    horaMinSeg.textContent = getCurrentHour();

}
function getCurrentDate() {
    const date = new Date();
    const dia = date.getDate();
    const ano = date.getFullYear();
    let mes = date.getMonth();
    if (mes < 10) {
        mes = "0" + (mes + 1 )
    };

    return dia + "/" + mes + "/" + ano;
    
}

setInterval(printCurrentHour, 1000);


function register() {
    dialogPonto.showModal();
};

function exit() {
    dialogPonto.close();
};