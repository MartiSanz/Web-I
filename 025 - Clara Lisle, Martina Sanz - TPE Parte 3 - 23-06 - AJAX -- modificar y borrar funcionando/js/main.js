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

    let contenedor = document.querySelector(".content");
    
    fetch("html/home.html").then( function(response){
      if(response.ok){
            response.text().then(t=> contenedor.innerHTML = t);
      }else{
            contenedor.innerHTML = "Error 404 file not found :(";
      }
    }).catch(function(response) {
            contenedor.innerHTML = "No estas conectado a internet :("
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

    let contenedor = document.querySelector(".content");
    
    fetch("html/contacto.html")
    .then(function(response){
      if(response.ok){
            return response.text(); 
      }else{
            contenedor.innerHTML = "Error 404 file not found :(";
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
            contenedor.innerHTML = "No estas conectado a internet :("
    });   
}

//------------------------ PRODUCTOS----------------------------------------

let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";
let urlPrimerPag = "https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p=1&limit=4";

function cargarProductos(){
    let contenedor = document.querySelector(".content");
    
    fetch("html/productos.html")
    .then( function(response){
      if(response.ok){
            return response.text(); 
      }else{
            contenedor.innerHTML = "Error 404 file not found :(";
      }
    })
    .then(function(text){

      contenedor.innerHTML = text; // muestra el texto por pantalla

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
        console.log("siguiente i vale " + i);
        let nuevoI= await siguiente(i); 
        i = nuevoI;
      });

      // FILTRO
      
      let selectFiltro = contenedor.querySelector("#selectFiltro");;
      selectFiltro.addEventListener('change', mostrarInputs);
      let btnFiltro = contenedor.querySelector("#btn-filtro");
      btnFiltro.addEventListener("click", filtro);


    })
    .catch(function(response) {
            contenedor.innerHTML = "No estas conectado a internet :("
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

    let btnBorrar = document.createElement("button");
    btnBorrar.innerHTML = "Borrar";
    btnBorrar.className +=  "btn-talles";
    btnBorrar.setAttribute("id","btn-borrar");

//    btnBorrar.setAttribute("data-id", talle.id);
    
    btnBorrar.addEventListener("click", function(e){
        borrarTalle(talle.id);
    });

    fila.appendChild(btnBorrar);
   
    let btnModificar = document.createElement("button");
    btnModificar.innerHTML = "Modificar";
    btnModificar.className +=  "btn-talles";
    btnModificar.setAttribute("id", "btn-modificar");
    //    btnModificar.setAttribute("data-id", talle.id);
    
    btnModificar.addEventListener("click", function(e){
        let formModificar = document.querySelector("#inputsModificar");

        formModificar.setAttribute("id", "inputsMostrar");
        
        formTallesModificar = document.querySelector("#form-modificar");
        buscarTalle(talle.id, e);
        formTallesModificar.addEventListener("submit", function(e){
            modificarTalle(talle.id, e);
        });

    });

    fila.appendChild(btnModificar);// Crea un nuevo elemento y lo agrega 
    return fila;
 }

async function obtenerDatos(url){
    
    let tabla = document.querySelector("#tablaDeTalles");
    tabla.innerHTML= "";

    try{
        let res= await fetch(url); // fetch funciona como un GET
        let talles= await res.json(); //se parsea de texto a objeto
        console.log(talles);  

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
    obtenerDatos(urlPrimerPag);
}

function getListaTalles(talles, nombreTalle){

    console.log("ENTRA A buscar talle");

    let lista = [];

    // busco todos los talles que coincidan con el talle ingresado por pantalla y formamos una lista
    for(const talle of talles){
        console.log(talle.nombre);
        if(talle.nombre == nombreTalle.toUpperCase()){ // si existe
           lista.push(talle);
           console.log("ID DE CADA TALLE buscar" + talle.id);
        }
    }  

    console.log("elementos buscar " + lista.length);

    return lista;
}


// BORRAR TALLE

async function borrarTalle(idTalle){

 //   console.log(this.dataset.id);

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
    obtenerDatos(urlPrimerPag);
}

let formTallesModificar;

function cargarNuevosDatos(e){

    console.log("entra a cargar nuevos datos");
    e.preventDefault();

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

    console.log("entra a modificar talle");

    e.preventDefault();
    let nuevoTalle = cargarNuevosDatos(e);

    console.log("sale de cargar datos");
   
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
        obtenerDatos(urlPrimerPag);
        limpiarInputs();

    } catch (error){
        console.log(error);
    }

    let formModificar = document.querySelector("#inputsMostrar");
    formModificar.setAttribute("id", "inputsModificar");
}

// modificar talle

async function modificarElemento(idTalle){

    let nuevoTalle = cargarDatos(e);

    // talle a modificar -- entran datos por pantalla
    let nombreTalle= nuevoTalle.nombre;

    // obtengo la lista de talles
    let res= await fetch(url); // fetch funciona como un GET
    let talles= await res.json(); //se parsea de texto a objeto


    if(nombreTalle.length != 0 ){

        for(const talle of talles){
            if(talle.nombre == nombreTalle.toUpperCase()){ // si existe
               let promesa = modificarTalle(talle.id, nuevoTalle);
                await promesa;
            }
        }  

       i = 1; // cuando agrego muestro desde la primer pagina, entonces reseteo el iterador para la paginacion
       obtenerDatos(urlPrimerPag);
    }

    limpiarInputs();
}


let i = 1 ; 

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

    console.log("limite vale " + limite);
    console.log("if vale " + Math.ceil(limite/cantTallesAMostrar));
    if (i < Math.ceil(limite/cantTallesAMostrar)){
        i = i + 1
        console.log("i sumo y vale " + i);
    }
    
    if(i <= Math.ceil(limite/cantTallesAMostrar)){
        console.log("i vale " + i);
        cambiarHojaTalles(i);    
    }

    return i;
}


async function cambiarHojaTalles(i){
    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p="+ i + "&limit=4";
    console.log("i cambia hoja " + i);
    obtenerDatos(url);
}

// RESALTAR

async function buscarTalle(idTalle, e){
     e.preventDefault();

    let res= await fetch(url); // fetch funciona como un GET
    let talles= await res.json(); //se parsea de texto a objeto  

    try{
        for(let i=0; i < talles.length; i++){
            console.log("entra al for");
            if(talles[i].id == idTalle){
                console.log("entra al if");
                resaltar(e, i+1);
                validarTalle.innerHTML = "";
            }
        }
        
    } catch (error){
        console.log(error);
    }
}

function resaltar(e, i){

    console.log("entra a resaltar");
    let tr = document.querySelectorAll("tr");

    if((i > 0) && (i < tr.length)){
        tr[i].classList.add("resaltar");
        console.log("entra al if de resaltar");
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
