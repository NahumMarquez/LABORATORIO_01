/**
 * Clase Calculadora - Maneja la lógica y operaciones de una calculadora básica
 */
class Calculadora {
    /**
     * Constructor de la clase Calculadora
     * @param {HTMLElement} valorPrevioTextElement - Elemento HTML que muestra el valor previo
     * @param {HTMLElement} valorActualTextElement - Elemento HTML que muestra el valor actual
     */
    constructor(valorPrevioTextElement, valorActualTextElement) {
        // Almacena referencias a los elementos del DOM para mostrar los valores
        this.valorPrevioTextElement = valorPrevioTextElement
        this.valorActualTextElement = valorActualTextElement
        this.ultimoFueIgual = false;   // 3. Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
        this.historialOperacion = ''; // 4. Muestre la operacion completa en el display superior
        // Inicializa la calculadora limpiando todos los valores
        this.borrarTodo()
    }

    /**
     * Limpia todos los valores de la calculadora, resetea a estado inicial
     */
    borrarTodo() {
        this.valorActual = '0'      // Valor que se está ingresando actualmente
        this.valorPrevio = ''      // Valor que se usará para la operación
        this.operacion = undefined // Tipo de operación seleccionada (+, -, x, ÷)
        this.historialOperacion = '';
    }

    /**
     * Elimina el último dígito del valor actual
     */
    borrar() {
        // Convierte a string y remueve el último carácter usando slice
        this.valorActual = this.valorActual.toString().slice(0, -1)
    }

    /**
     * Agrega un número (dígito) al valor actual que se está ingresando
     * @param {string} numero - El dígito o punto decimal a agregar
     */
    agregarNumero(numero) {
        if (this.ultimoFueIgual) {
            this.valorActual = '';
            this.valorPrevio = '';
            this.operacion = undefined;
            this.ultimoFueIgual = false;
    }

        if (this.valorActual.toString().length >= 9) return;     //1- Arreglar bug que limite los numeros en pantalla-----------------------------------
        // Evita agregar múltiples puntos decimales
        if (numero === '.' && this.valorActual.includes('.')) return
        // Concatena el nuevo número al valor actual
        this.valorActual = this.valorActual.toString() + numero.toString()
    }

    /**
     * Selecciona la operación matemática a realizar
     * @param {string} operacion - El símbolo de la operación (+, -, x, ÷)
     */
    elejirOperacion(operacion) {
    if (this.valorActual === '') {
        // Si ya hay operación pendiente, cambiar operación
        if (this.valorPrevio !== '') {
            this.operacion = operacion;
        }
        return;
    }
    // Si ya hay un valor previo, calcular primero
    if (this.valorPrevio !== '') {
        this.calcular();
    }
    this.operacion = operacion;
    this.valorPrevio = this.valorActual;
    this.valorActual = '';
    }

calcular() {
    let resultado;
    const valor_1 = parseFloat(this.valorPrevio);
    const valor_2 = parseFloat(this.valorActual);

    // 2- Funcionabilidad de boton de porcentaje-------------------------------
    if (!isNaN(valor_1) && !isNaN(valor_2)) {     
            this.historialOperacion = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion} ${this.obtenerNumero(this.valorActual)}`;
        }

    if (this.operacion === '%') {
        // Caso 1: si valor_2 existe, calculamos porcentaje relativo
        if (!isNaN(valor_1) && !isNaN(valor_2)) {
            resultado = (valor_1 * valor_2) / 100;
        }
        // Caso 2: si sólo hay valor_1 (y no valor_2), calculamos porcentaje simple
        else if (!isNaN(valor_1) && isNaN(valor_2)) {
            resultado = valor_1 / 100;
        } else {
            return;
        }
    } else {
        // Otras operaciones normales
        if (isNaN(valor_1) || isNaN(valor_2)) return;

        switch (this.operacion) {
            case '+':
                resultado = valor_1 + valor_2;
                break;
            case '-':
                resultado = valor_1 - valor_2;
                break;
            case 'x':
                resultado = valor_1 * valor_2;
                break;
            case '÷':
                resultado = valor_1 / valor_2;
                break;
            default:
                return;
        }
    }

    resultado = parseFloat(resultado.toPrecision(9));
    this.valorActual = resultado.toString();
    this.operacion = undefined;
    this.valorPrevio = '';
    }


    /**
     * Formatea un número para mostrarlo en pantalla con separadores de miles
     * @param {number} numero - El número a formatear
     * @returns {string} - El número formateado como string
     */
    obtenerNumero(numero) {
        const cadena = numero.toString()
        // Separa la parte entera de la decimal
        const enteros = parseFloat(cadena.split('.')[0])
        const decimales = cadena.split('.')[1]
        let mostrarEnteros
        
        // Si la parte entera no es un número válido, mostrar vacío
        if (isNaN(enteros)) {
            mostrarEnteros = ''
        } else {
            // Formatea los enteros con separadores de miles
            mostrarEnteros = enteros.toLocaleString('en', { maximumFractionDigits: 0 })
        }

        // Si hay decimales, los agrega al número formateado
        if (decimales != null) {
            return `${mostrarEnteros}.${decimales}`
        } else {
            return mostrarEnteros
        }
    }

    /**
     * Actualiza la pantalla de la calculadora con los valores actuales
     */
    actualizarPantalla() {
        // Muestra el valor actual formateado en el display principal
        this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual)
        // Si hay una operación seleccionada, muestra el valor previo y la operación
        if (this.ultimoFueIgual && this.historialOperacion) {
            
            this.valorPrevioTextElement.innerText = this.historialOperacion;  

        } else if (this.operacion != null) {
            this.valorPrevioTextElement.innerText = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion} ${this.valorActual}`    
        } else {
            this.valorPrevioTextElement.innerText = ''
        }
    }
}

/*
 * SECCIÓN DE INICIALIZACIÓN Y CONFIGURACIÓN DEL DOM
 * Esta sección maneja la captura de elementos DOM y la configuración inicial
 */

// Captura de elementos de botones numéricos (0-9 y punto decimal)
const numeroButtons = document.querySelectorAll('[data-numero]')
// Captura de elementos de botones de operaciones (+, -, x, ÷)
const operacionButtons = document.querySelectorAll('[data-operacion]')
// Captura del botón igual (=) para ejecutar cálculos
const igualButton = document.querySelector('[data-igual]')
// Captura del botón de porcentaje (%) - funcionalidad pendiente
const porcentajeButton = document.querySelector('[data-porcentaje]')
// Captura del botón para borrar último dígito (backspace)
const borrarButton = document.querySelector('[data-borrar]')
// Captura del botón para limpiar toda la calculadora (clear)
const borrarTodoButton = document.querySelector('[data-borrar-todo]')
// Captura del elemento que muestra el valor previo/operación en pantalla
const valorPrevioTextElement = document.querySelector('[data-valor-previo]')
// Captura del elemento que muestra el valor actual en pantalla
const valorActualTextElement = document.querySelector('[data-valor-actual]')

// Instancia principal de la calculadora con referencias a los elementos de display
const calculator = new Calculadora(valorPrevioTextElement, valorActualTextElement)

/*
 * CONFIGURACIÓN DE EVENT LISTENERS
 * Esta sección asigna eventos de click a cada tipo de botón
 */

// Asigna evento click a cada botón numérico
// Cuando se presiona un botón numérico, agrega ese número al valor actual y actualiza la pantalla
numeroButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.agregarNumero(button.innerText)
        calculator.actualizarPantalla()
    })
})

// Asigna evento click a cada botón de operación
// Cuando se presiona una operación (+, -, x, ÷), selecciona esa operación y actualiza la pantalla
operacionButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.elejirOperacion(button.innerText)
        calculator.actualizarPantalla()
    })
})

// Evento para el botón igual (=)
// Ejecuta el cálculo de la operación pendiente y muestra el resultado
igualButton.addEventListener('click', () => {
    calculator.calcular();
    calculator.ultimoFueIgual = true;
    calculator.actualizarPantalla();
})

// Evento para el botón de borrar todo (AC/Clear)
// Limpia completamente la calculadora y vuelve al estado inicial
borrarTodoButton.addEventListener('click', _button => {
    calculator.borrarTodo()
    calculator.actualizarPantalla()
})

// Evento para el botón de borrar (DEL/Backspace)
// Elimina el último dígito ingresado del valor actual
borrarButton.addEventListener('click', _button => {
    calculator.borrar()
    calculator.actualizarPantalla()
})


//boton de porcentaje
porcentajeButton.addEventListener('click', () => {
    if (calculator.valorActual === '') return;

    if (calculator.valorPrevio === '') {
        // asignar valorActual a valorPrevio y setear operación porcentaje
        calculator.valorPrevio = calculator.valorActual;
        calculator.operacion = '%';
        calculator.valorActual = '';
        calculator.actualizarPantalla();
        return;
    }

    if (calculator.valorActual !== '') {
        // Si ya hay valor previo y valor actual, calcular antes de asignar nuevo porcentaje
        calculator.calcular();
        calculator.operacion = '%';
        calculator.valorPrevio = calculator.valorActual;
        calculator.valorActual = '';
        calculator.actualizarPantalla();
    }
});



/*Laboratorio:
1. Arreglar bug que limite los numeros en pantalla 
2. Funcionabilidad de boton de porcentaje
3. Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
4. Muestre la operacion completa en el display superior
*/