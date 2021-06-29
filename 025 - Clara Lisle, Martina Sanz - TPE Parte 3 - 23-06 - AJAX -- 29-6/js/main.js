"use strict";

//---------------- NAV CON BOTON MENU RESPONSIVE ------------------------------
 
document.querySelector(".btn_menu").addEventListener("click", toggleMenu);

function toggleMenu() {
    document.querySelector(".navigation").classList.toggle("show");
}


//-------------------AJAX ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
  cargarInicio();
  let botonHome = document.querySelectorAll(".js-loadHome");
  botonHome.forEach(e=> e.addEventListener("click", cargarInicio));
  let botonContacto = document.querySelectorAll(".js-loadContacto");
  botonContacto.forEach(e=> e.addEventListener("click", cargarContacto));
  let botonProductos = document.querySelectorAll(".js-loadProductos");
  botonProductos.forEach(e=> e.addEventListener("click", cargarProductos));
})


function cargarInicio(){

    let contenedor = document.querySelector("#content");
    
    fetch("html/home.html").then( function(response){
      if(response.ok){
            response.text().then(t=> contenedor.innerHTML = t);
      }else{
            contenedor.innerHTML = "Error - Failed URL!";
      }
    }).catch(function(response) {
            contenedor.innerHTML = "Connection error"
    });
}

 
//------------------------------------ CAPTCHA --------------------------------------

let cambia_imagen = [ 
{
      "img" : "js/images/z34ja.png",
      "texto" : "z34ja"
},
{
      "img" : "js/images/l83ja.png",
      "texto" : "l83ja"
},
{
      "img" : "js/images/97ula.png",
      "texto" : "97ula"
},
{
      "img" : "js/images/rt62l.png",
      "texto" : "rt62l"
},
{
      "img" : "js/images/lty72.png",
      "texto" : "lty72"
}
];


let rtaInput= 0;
let rta=0 ;

function enviarFormulario(coincide) {  

let validacion = document.getElementById("validacion");
      if(coincide == true){
            document.getElementById("formulario").reset();
            validacion.innerHTML = "Información enviada. ¡Muchas gracias!";
      }
      else{
            validacion.innerHTML = "Captcha incorrecto";
      }   
}

function obtenerResultado(rta){

      let coincide= false;

      for (var i = 0; i < 5; i++) {
            if(rta == cambia_imagen[i].texto)
            coincide=true;
      }

      enviarFormulario(coincide);
}


function obtenerRespuesta(){
      //obtengo lo que ingresó el usuario
      rtaInput= document.getElementById("txt-captcha");
      rta = rtaInput.value.toLowerCase(); /*para que sea minuscula*/
      /*llama a la funcion obtenerResultado con la respuesta del usuario y la posicion del arreglo*/
      obtenerResultado(rta);
}

function obtenerNumero() {
      //math da como resultado 0 o 1
      let posicionImg =0;
      posicionImg = Math.floor(Math.random() * 4); //funcion floor toma el valor entero redondeando hacia abajo 
      return (posicionImg);
}

function cambiar(){
      let posicion = obtenerNumero();
      document.getElementById("ia").src = cambia_imagen[posicion].img;
};

function cargarContacto(){

    let contenedor = document.querySelector("#content");
    
    fetch("html/contacto.html")
    .then(function(response){
      if(response.ok){
            return response.text(); 
      }else{
            contenedor.innerHTML = "Error - Failed URL!";
      }
    })
    .then(function(text){

      contenedor.innerHTML = text; 
      cambiar();

      /*cambia el captcha*/
      let btnImg = contenedor.querySelector("#btn-img");
      btnImg.addEventListener("click", cambiar);

      /*envia formulario*/
      let btnRespuesta = contenedor.querySelector("#btn-enviar");
      btnRespuesta.addEventListener("click", obtenerRespuesta);

    })
    .catch(function(response) {
            contenedor.innerHTML = "Connection error"
    });   
}

//------------------------ PRODUCTOS----------------------------------------

let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";
let urlPrimerPag = "https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p=1&limit=4";



function cargarProductos(){
    let contenedor = document.querySelector("#content");
    
    fetch("html/productos.html")
    .then( function(response){
      if(response.ok){
            return response.text(); 
      }else{
            contenedor.innerHTML = "Error - Failed URL!";
      }
    })
    .then(function(text){

      contenedor.innerHTML = text; // muestra el texto por pantalla

      
    console.log("llama desde carga productos");
      obtenerDatos(urlPrimerPag);

      // AGREGAR UN TALLE
      formTalles = contenedor.querySelector("#form-talles");
      formTalles.addEventListener("submit", agregar); 

      //AGREGAR TRES TALLES
      let btnAgregarTres = contenedor.querySelector("#btn-agregarTres");
      btnAgregarTres.addEventListener("click", agregarTres);

      //PAGINACION
      document.querySelector(".btn-anterior").addEventListener("click", async function(e){
        
        let nuevoI= await anterior(i);
        i = nuevoI;
      });

      document.querySelector(".btn-siguiente").addEventListener("click", async function(e){
        let nuevoI= await siguiente(i); 
        i = nuevoI;
      });

      // FILTRO
      
      let selectFiltro = contenedor.querySelector("#selectFiltro");
      selectFiltro.addEventListener('change', mostrarInputs);
      let btnFiltro = contenedor.querySelector("#btn-filtro");
      btnFiltro.addEventListener("click", filtro);

      // CERRAR MODIFICAR
      let btnCerrarModificar = contenedor.querySelector(".btn-cerrar"); 
      btnCerrarModificar.addEventListener("click", ocultarModificar);
    })
    .catch(function(response) {
            contenedor.innerHTML = "Connection error"
    });
}

let id;

//LIMPIAR INPUTS

function limpiarInputs(){
    let inputs = document.getElementsByClassName("inputT");
    
    for(let item of inputs){
        item.value ="";
    } 
}

//AGREGAR TALLE
let formTalles;

async function agregar(e){
    await agregarTalle(e);
    limpiarInputs();
    i = 1;
    
    console.log("llama desde agregar comun");
    obtenerDatos(urlPrimerPag);
}

function cargarDatos(e){

    e.preventDefault();

    let formData = new FormData(formTalles);

    let nombre= formData.get('talle');
    let busto= formData.get('busto');
    let cintura= formData.get('cintura');
    let cadera= formData.get('cadera');

    let talle = {
        "nombre": nombre.toUpperCase(), 
        "busto": busto,
        "cintura": cintura,
        "cadera": cadera,
    }

    return talle;
}

async function agregarTalle(e){

    e.preventDefault();

    let talle = cargarDatos(e);

    try{
        let res = await fetch(url, {
            "method": "POST",
            "headers": {"Content-Type" : "application/JSON"},
            "body": JSON.stringify(talle)            
        });

        if(res.status === 201){
            console.log("cargo");
        }
        
    } catch(error){
        console.log(error);
    }
}

//IMPRIMIR OBTENER DATOS

function crearFila(talle){
   
    let nombre = talle.nombre; 
    let busto = talle.busto;
    let cintura = talle.cintura;
    let cadera = talle.cadera;
    let fila = document.createElement("tr");
    fila.innerHTML = `<td>${nombre}</td>
                    <td>${busto}</td>
                    <td>${cintura}</td>
                    <td>${cadera}</td> `;



    //BORRAR TALLE
    let btnBorrar = document.createElement("input");
        btnBorrar.innerHTML = "Borrar";
        btnBorrar.className +=  "btn-talles";
        btnBorrar.setAttribute("id","btn-borrar");
        btnBorrar.dataset.borrar = talle.id;
        btnBorrar.type = 'image';
        btnBorrar.src = 'js/images/borrar.ico';
    
        btnBorrar.addEventListener("click", borrarTalle);

   
    fila.appendChild(btnBorrar);// Crea un nuevo elemento y lo agrega 

    //EDITAR TALLE
    let btnEditar = document.createElement("input");
        btnEditar.className +=  "btn-talles";
        btnEditar.setAttribute("id", "btn-editar");
        btnEditar.dataset.modificar = talle.id;
        btnEditar.type = "image";
        btnEditar.src = "js/images/editar.ico";
        
        btnEditar.addEventListener("click", editarTalle);
    
    let btnCerrarModificar = document.querySelector(".btn-cerrar"); 
        btnCerrarModificar.dataset.modificar = talle.id;

    fila.appendChild(btnEditar);// Crea un nuevo elemento y lo agrega 
    return fila;
}

async function obtenerDatos(url){

    console.log("llamar a obtener datos");
    
    let tabla = document.querySelector("#tablaDeTalles");
    tabla.innerHTML= "";

    try{
        let res= await fetch(url); // fetch funciona como un GET
        let talles= await res.json(); //se parsea de texto a objeto
        console.log(talles);  
        tabla.innerHTML= "";
        for(const talle of talles){
            let fila = crearFila(talle);
            tabla.appendChild(fila);
        };
    }  catch(error){
        console.log(error);
    }
}


//AGREGAR X3

const cantidad=3;

async function agregarTres(e){

    if((document.querySelector("#talle").value.length != 0) && 
        (document.querySelector("#busto").value.length != 0) && 
        (document.querySelector("#cintura").value.length != 0) &&
        (document.querySelector("#cadera").value.length != 0)){
    
        for(let i=0; i < cantidad; i++){
           await agregarTalle(e);
        }
    }

    limpiarInputs();
    i = 1;
    console.log("llama desde agregar tres");
    obtenerDatos(urlPrimerPag);
}

// BORRAR TALLE

async function borrarTalle(){

    let idTalle= this.dataset.borrar;

    try{
        let res = await fetch(url + "/" + idTalle, {
        "method": "DELETE",
        });

        if(res.status === 200){
            console.log("Eliminado!");
        }
    } catch (error){
        console.log(error);
    }

    limpiarInputs();
    i=1;
    
    console.log("llama desde borrar talle");
    obtenerDatos(urlPrimerPag);
}

function editarTalle(){
    
    let formModificar = document.querySelector("#inputsModificar");

    limpiarInputs();
    let talleId= " ";
    talleId= this.dataset.modificar;

    console.log(talleId + "entro a editar talle");

    formModificar.setAttribute("id", "inputsMostrar");

    let formTallesModificar = document.querySelector("#form-modificar");
    buscarTalle(talleId);

    formTallesModificar.addEventListener("submit", function(e){
        console.log(talleId + "entro al evento");
        modificarTalle(talleId, e);
        formModificar.setAttribute("id", "inputsModificar");
    });
   
}

//CERRAR MODIFICAR
async function ocultarModificar(){
    let formModificar = document.querySelector("#inputsMostrar");
    formModificar.setAttribute("id", "inputsModificar");

    let idTalle = this.dataset.modificar;

    let res= await fetch(url);
    let talles= await res.json();

    try{
        for(let i=0; i < talles.length; i++){
            if(talles[i].id == idTalle){
                let tr = document.querySelectorAll("tr");
                if(tr != null){
                    tr[i+1].setAttribute("class", "quitarResaltar");
                }
                
            }
        }  
    } catch (error){
        console.log(error);
    }
}

// let formTallesModificar;

function cargarNuevosDatos(e){

    console.log("entra a cargar nuevos datos");
    e.preventDefault();

    let formTallesModificar = document.querySelector("#form-modificar");
    let formData = new FormData(formTallesModificar);

    let nombre= formData.get('talleNuevo');
    let busto= formData.get('bustoNuevo');
    let cintura= formData.get('cinturaNuevo');
    let cadera= formData.get('caderaNuevo');

    let talle = {
        "nombre": nombre.toUpperCase(), 
        "busto": busto,
        "cintura": cintura,
        "cadera": cadera,
    }

    return talle;
}


async function modificarTalle(idTalle, e){

    e.preventDefault();

    console.log("entra a modificar talle");

    let nuevoTalle = cargarNuevosDatos(e);

    console.log("sale de cargar nuevos datos");
   
    try{
        let res = await fetch(url + "/" + idTalle, {
        "method": "PUT",
        "headers": {"Content-type": "application/json"},
        "body": JSON.stringify(nuevoTalle) // body siempre espera algo de tipo texto por eso convertimos al objeto en un string
        });

        if(res.status === 200){
            console.log("Modificado");
            console.log(id);
        }

        i = 1; // cuando agrego muestro desde la primer pagina, entonces reseteo el iterador para la paginacion
        
        console.log("llama desde modificar talle");
        obtenerDatos(urlPrimerPag);
        limpiarInputs();

    } catch (error){
        console.log(error);
    }

}


let i = 1 ; 
const limitePag = 4;

function anterior(i){
    if (i > 1){
        i = i - 1
    }
    
    if(i >= 1){
        cambiarHojaTalles(i);
    }

    return i;
}

async function getLongitud(){

    let respuesta= await fetch(url); 
    let talles= await respuesta.json(); 
    await talles;
    
    return talles.length;
}

const cantTallesAMostrar= 4;

async function siguiente(i){
    let limite = await getLongitud();

    if (i < Math.ceil(limite/cantTallesAMostrar)){
        i = i + 1
    }
    
    if(i <= Math.ceil(limite/cantTallesAMostrar)){
        cambiarHojaTalles(i);    
    }

    return i;
}


async function cambiarHojaTalles(i){
    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p="+ i + "&limit=4";

    obtenerDatos(url);
}


// RESALTAR

async function buscarTalle(idTalle){

    console.log(idTalle + " entro a buscar talle");

    let res= await fetch(url);
    let talles= await res.json();

    try{
        for(let i=0; i < talles.length; i++){
            if(talles[i].id == idTalle){
                resaltar(i+1);
            }
        }
        
    } catch (error){
        console.log(error);
    }
}

function resaltar(indice){


    if(i > 1){
        indice = indice - ((i-1)*limitePag);
    }

    let tr = document.querySelectorAll("tr");
   
    if((indice > 0) && (indice < tr.length)){
        tr[indice].classList.add("resaltar");
    }

}

//FILTRO

 /// IMPRIMIR CON FILTRO

function imprimir(tablaFiltro){
    
    let tablaDeTalles = document.getElementById('tablaDeTalles');
    tablaDeTalles.innerHTML = " ";

    
    for(const talle of tablaFiltro){
        let fila = crearFila(talle);
       
        tablaDeTalles.appendChild(fila);
    };

}

 function mostrarInputs(){
    let selectFiltro = document.querySelector("#selectFiltro").value;
    let medidaMin = document.querySelector("#medidaMin");
    let medidaMax = document.querySelector("#medidaMax");
    let siguiente = document.querySelector(".btn-siguiente");
    let anterior = document.querySelector(".btn-anterior");

    if(selectFiltro == "talle"){
        medidaMin.setAttribute("class", "inputOculto");
        medidaMax.setAttribute("class", "inputOculto");
        siguiente.setAttribute("class", "btn-siguiente btn-talles");
        anterior.setAttribute("class", "btn-anterior btn-talles");
    }
    

    if(selectFiltro != "talle"){
        medidaMin.setAttribute("class", "inputVisible inputDisenio");
        medidaMax.setAttribute("class", "inputVisible inputDisenio");
        siguiente.setAttribute("class", "btn-siguiente inputOculto");
        anterior.setAttribute("class", "btn-anterior inputOculto");
    }
 }

 async function filtro(){

    let tablaFiltro = [];
    let respuesta= await fetch(url); 
    let talles= await respuesta.json(); 
    
    let selectFiltro = document.querySelector("#selectFiltro").value;
    let medidaMin = parseInt(document.querySelector("#medidaMin").value);
    let medidaMax = parseInt(document.querySelector("#medidaMax").value);
    
    if(selectFiltro == "talle"){
        i = 1;
        
        console.log("llama desde filtro");
        obtenerDatos(urlPrimerPag);
    }

    if(selectFiltro == "busto"){
        tablaFiltro = filtroBusto(medidaMax,medidaMin, talles);
    }
    
    if(selectFiltro == "cintura"){
        tablaFiltro = filtroCintura(medidaMax,medidaMin, talles);
    }

    if(selectFiltro == "cadera"){
        tablaFiltro = filtroCadera(medidaMax,medidaMin, talles);
    }
    
    imprimir(tablaFiltro);
 }

function filtroBusto(medidaMax,medidaMin, talles){
    let tablaFiltro = [];

    for(let i=0; i < talles.length; i++){   
        if((parseInt(talles[i].busto) >= medidaMin) && (parseInt(talles[i].busto) <= medidaMax)){
            tablaFiltro.push(talles[i]);
        }
    }

    return tablaFiltro;
}

function filtroCintura(medidaMax,medidaMin, talles){
    let tablaFiltro = [];

    for(let i=0; i < talles.length; i++){   
        if((parseInt(talles[i].cintura) >= medidaMin) && (parseInt(talles[i].busto) <= medidaMax)){
            tablaFiltro.push(talles[i]);
        }
    }

    return tablaFiltro;
}


function filtroCadera(medidaMax,medidaMin, talles){
    let tablaFiltro = [];

    for(let i=0; i < talles.length; i++){   
        if((parseInt(talles[i].cadera) >= medidaMin) && (parseInt(talles[i].busto) <= medidaMax)){
            tablaFiltro.push(talles[i]);
        }
    }

    return tablaFiltro;
}
