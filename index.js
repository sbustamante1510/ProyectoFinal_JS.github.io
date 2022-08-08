//Simulador de prestamos
//Nota: Se usara un interes simple

const prestamos = []

const URL = './data.json'
const cantidad = document.getElementById("cantidad");
const plazo = document.getElementById("plazo");
const tasa = document.getElementById("tasa");
const btnSimulador = document.getElementById("btnSimulador");
const btnPrestamos = document.getElementById("btn_prestamos");
const container_prestamos = document.getElementById("container_prestamos");
let tempAnadirPrestamoDisplay;
let conversionTiempoPorcentaje;

fetch(URL)
    .then(res => { return res.json();})
    .then(data => {
        tempAnadirPrestamoDisplay = data.tempAnadirPrestamoDisplay;
        conversionTiempoPorcentaje = data.conversionTiempoPorcentaje;
    })
    .catch( err => {console.log("Hubo un error: " +err); })
    .finally( () => {console.log("Termino el fetch"); })

const calculoValorCuota = (prestamox,tiempoMesesx,tasax) => {
    prestamox = Number(prestamox);
    tiempoMesesx = Number(tiempoMesesx);
    tasax = Number(tasax);

    let interes = (prestamox * tiempoMesesx * tasax)/(conversionTiempoPorcentaje); 
    let montoTotal = prestamox + interes;
    let valorCuotax = montoTotal/tiempoMesesx;

    return valorCuotax.toFixed(2);
}

const anhadirPrestamo = () => {
    if(cantidad.value > 0 && plazo.value>0 && tasa.value>0){
        prestamos.push({cantidadPrestamo : cantidad.value, 
                        plazoPrestamos : plazo.value,
                        tasaPrestamos : tasa.value,
                        valorCuotaMes : calculoValorCuota(cantidad.value,plazo.value,tasa.value)
                        });
        
        tempAnadirPrestamoDisplay = 1;
    }

    cantidad.value = "";
    plazo.value = "";
    tasa.value = "";

}

btnSimulador.onclick = anhadirPrestamo;

const alertDataNone = () => {
    Swal.fire({
        title: 'Error!',
        text: 'Simule un prestamo!',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    })
}

const updateDisplay = () => {

    container_prestamos.innerHTML = null;

    for(const prestamo of prestamos){
    
        let divPrestamo = document.createElement("div");
        let pPrestamo = document.createElement("p");
        let pPlazo = document.createElement("p");
        let pTasa = document.createElement("p");
        let h2Cuota = document.createElement("h2");
    
        divPrestamo.className = "cont_prestamo";
        
        const {cantidadPrestamo,plazoPrestamos,tasaPrestamos,valorCuotaMes} = prestamo;

        pPrestamo.append(`Prestamo : S/ ${cantidadPrestamo}`);
        pPlazo.append(`Plazo : ${plazoPrestamos} meses`);
        pTasa.append(`Tasa : ${tasaPrestamos}%`);
        h2Cuota.append(`Cuota : S/ ${valorCuotaMes}`);

        divPrestamo.append(pPrestamo,pPlazo,pTasa,h2Cuota)
    
        container_prestamos.append(divPrestamo);

    }
    const enJSON    = JSON.stringify(prestamos);
    localStorage.setItem("db", enJSON);

}

const verPrestamos = () => {

    prestamos.length == 0 && alertDataNone();

    if (tempAnadirPrestamoDisplay ==1){
        updateDisplay();
        tempAnadirPrestamoDisplay = 0;
    }
}

btnPrestamos.onclick = verPrestamos;

let prestamosInStorage =JSON.parse(localStorage.getItem("db"));

if(prestamosInStorage) {
    prestamosInStorage.forEach(e => {
        prestamos.push(e);
    });

    updateDisplay();
}
