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
    let error = document.querySelector("#error");
    
    fetch("html/home.html").then( function(response){
      if(response.ok){
            response.text().then(t=> contenedor.innerHTML = t);
      }else{
        error.innerHTML = "Error - Failed URL!";
      }
    }).catch(function(response) {
        error.innerHTML = "Connection error"
    });
}


//------------------------------------ CAPTCHA --------------------------------------

let cambia_imagen = [ 
{
      "img" : "images/captchas/z34ja.png",
      "texto" : "z34ja"
},
{
      "img" : "images/captchas/l83ja.png",
      "texto" : "l83ja"
},
{
      "img" : "images/captchas/97ula.png",
      "texto" : "97ula"
},
{
      "img" : "images/captchas/rt62l.png",
      "texto" : "rt62l"
},
{
      "img" : "images/captchas/lty72.png",
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
    let error = document.querySelector("#error");
    
    fetch("html/contacto.html")
    .then(function(response){
      if(response.ok){
            return response.text(); 
      }else{
        error.innerHTML = "Error - Failed URL!";
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
        error.innerHTML = "Connection error"
    });   
}

//------------------------ PRODUCTOS----------------------------------------

let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";
let urlPrimerPag = "https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p=1&limit=4";


function cargarProductos(){
    let contenedor = document.querySelector("#content");
    let error = document.querySelector("#error");
    
    fetch("html/productos.html")
    .then( function(response){
      if(response.ok){
            return response.text(); 
      }else{
        error.innerHTML = "Error - Failed URL!";
      }
    })
    .then(function(text){

      contenedor.innerHTML = text; // muestra por pantalla

      obtenerDatos(urlPrimerPag);

      // AGREGAR UN TALLE
      let formTalles = contenedor.querySelector("#form-talles");
          formTalles.addEventListener("submit", agregar); 

      //AGREGAR TRES TALLES
      let btnAgregarTres = contenedor.querySelector("#btn-agregarTres");
          btnAgregarTres.addEventListener("click", agregarTres);

      //PAGINACION
      document.querySelector(".btn-anterior").addEventListener("click", async function(e){
        
        let nuevoI= await anterior(pagina);
        pagina = nuevoI;
      });

      document.querySelector(".btn-siguiente").addEventListener("click", async function(e){
        let nuevoI= await siguiente(pagina); 
        pagina = nuevoI;
      });

      // FILTRO
      let selectFiltro = contenedor.querySelector("#selectFiltro");
          selectFiltro.addEventListener('change', mostrarInputsFiltro);
      let btnFiltro = contenedor.querySelector("#btn-filtro");
          btnFiltro.addEventListener("click", filtro);

      // CERRAR EDITAR
      let btnCerrarEditar = contenedor.querySelector(".btn-cerrar"); 
          btnCerrarEditar.addEventListener("click", ocultarEditar);

      // FORM EDITAR
      let formEditar = document.querySelector("#inputsEditar"); // seccion del form editar inicialmente oculto
      let formTallesEditar = document.querySelector("#form-editar");

      formTallesEditar.addEventListener("submit", function (e) {
          editarTalle(this.dataset.btnId, e);
          formEditar.setAttribute("id", "inputsEditar"); // nuevamente hago que no se vea
      });

    })
    .catch(function(response) {
        error.innerHTML = "Connection error"
    });
}

let id;

// --------------- LIMPIAR INPUTS -------------

function limpiarInputs(){
    console.log("limpia inpust");
    let inputs = document.getElementsByClassName("inputT");
    
    for(let item of inputs){
        item.value ="";
    } 
}

// --------------- AGREGAR TALLE --------------------

async function agregar(e){  
    await agregarTalle(e);
    limpiarInputs(); 
    pagina = 1;
    obtenerDatos(urlPrimerPag);
}

// -------------- CARGA DATOS DE NUEVO TALLE -------------------

function cargarDatos(e){

    let formTalles = document.querySelector("#form-talles");

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

// -------------------- AGREGA NUEVO TALLE -------------------

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


// ----------------- IMPRIMIR TODOS LOS DATOS --------------

async function obtenerDatos(url){

    let tabla = document.querySelector("#tablaDeTalles");
    tabla.innerHTML= "";

    try{
        let res= await fetch(url); 
        let talles= await res.json();  
        tabla.innerHTML= "";
        for(const talle of talles){
            let fila = crearFila(talle);
            tabla.appendChild(fila);
        };
    }  catch(error){
        console.log(error);
    }
}


// ------------------- CREAR FILA CON DATOS Y BOTONES

function crearFila(talle){
   
    let nombre = talle.nombre; 
    let busto = talle.busto;
    let cintura = talle.cintura;
    let cadera = talle.cadera;
    let fila = document.createElement("tr");
    fila.dataset.talleId= talle.id;
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
        btnBorrar.src = 'images/iconos/borrar.ico';
    
        btnBorrar.addEventListener("click", borrarTalle);

    fila.appendChild(btnBorrar);// Crea un nuevo elemento y lo agrega 

    //EDITAR TALLE
    let btnEditar = document.createElement("input");
        btnEditar.className +=  "btn-talles";
        btnEditar.setAttribute("id", "btn-editar");
        btnEditar.dataset.editar = talle.id;
        btnEditar.type = "image";
        btnEditar.src = "images/iconos/editar.ico";
        
        btnEditar.addEventListener("click", setearId);
    
    let btnCerrarEditar = document.querySelector(".btn-cerrar"); 
        btnCerrarEditar.dataset.editar = talle.id;

    fila.appendChild(btnEditar);// Crea un nuevo elemento y lo agrega 
    
    return fila;
}


// ----------- AGREGAR X3 ---------------------

const cantidad=3;

async function agregarTres(e){

    if((document.querySelector("#talle").value.length != 0) && 
        (document.querySelector("#busto").value.length != 0) && 
        (document.querySelector("#cintura").value.length != 0) &&
        (document.querySelector("#cadera").value.length != 0)){
    
        for(let i=0; i < cantidad; i++){
           await agregarTalle(e); // con await evito que se repitan los id
        }
    }

    limpiarInputs();
    pagina = 1;

    obtenerDatos(urlPrimerPag);
}

// ----------------- BORRAR TALLE ------------------------------

async function borrarTalle(){

    let idTalle= this.dataset.borrar;
    let mensaje = document.querySelector("#mensaje");

    try{
        let res = await fetch(url + "/" + idTalle, {
        "method": "DELETE",
        });

        if(res.status === 200){
            console.log("Eliminado!");
            mensaje.innerHTML = "Eliminado!";
        }
    } catch (error){
        console.log(error);
    }

    limpiarInputs();
    mostrarBorrar();
}

async function mostrarBorrar(){

    let cantidadTalles =await getLongitud();
    let limitePagMostrar = parseInt(limitePag);
    let paginaActual = parseInt(pagina);
    let cantidadPaginasDisponibles = Math.ceil(cantidadTalles / limitePagMostrar);

    let urlPagActual;
    if(cantidadPaginasDisponibles < paginaActual) {
        pagina = cantidadPaginasDisponibles;
        urlPagActual = "https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p=" + pagina + " &limit=4";
        obtenerDatos(urlPagActual);
    }
    
    if((cantidadPaginasDisponibles == paginaActual) || (cantidadPaginasDisponibles > paginaActual)){
        urlPagActual = "https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p=" + pagina + " &limit=4";
        obtenerDatos(urlPagActual);
    }
}


// ------------- EDITAR TALLE ----------------------------

async function editarTalle(idTalle, e){

    e.preventDefault();
    let mensaje = document.querySelector("#mensaje");
    mensaje.innerHTML = " ";

    let nuevoTalle = cargarNuevosDatos(e);
   
    try{
        let res = await fetch(url + "/" + idTalle, {
        "method": "PUT",
        "headers": {"Content-type": "application/json"},
        "body": JSON.stringify(nuevoTalle) // body siempre espera algo de tipo texto por eso convertimos al objeto en un string
        });

        if(res.status === 200){
            console.log("Editado!");
            mensaje.innerHTML = "Editado!";
        }

        let urlPagActual = "https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p=" + pagina + " &limit=4";

        obtenerDatos(urlPagActual);
        limpiarInputs();

    } catch (error){
        console.log(error);
    }
}


// ------------- SETEAR ID DE BOTON EDITAR

function setearId(){

    let talleId = this.dataset.editar; 
    
    let formEditar = document.querySelector("#inputsEditar"); //seccion que tiene al form editar
        formEditar.setAttribute("id", "inputsMostrar"); // muestro la seccion
        formEditar.dataset.btnId = talleId; // guardo desde que boton lo llama


    let formTallesEditar = document.querySelector("#form-editar");
        formTallesEditar.dataset.btnId = talleId; // seteo en el form el id del boton

    resaltar(talleId); // busca el talle para resaltarlo
   
}


// ------------- CERRAR SECCION EDITAR
function ocultarEditar(){

    let formEditar = document.querySelector("#inputsMostrar");
        formEditar.setAttribute("id", "inputsEditar"); // lo oculto

    let idTalle = formEditar.dataset.btnId;

    let tr = document.querySelectorAll("tr");

    try{
        for(let i=0; i < tr.length; i++){
            if(tr[i].dataset.talleId == idTalle){
                tr[i].setAttribute("class", "quitarResaltar");
            }
        }  
    } catch (error){
        console.log(error);
    }
}


// ------------ CARGAR NUEVOS DATOS PARA EDITAR

function cargarNuevosDatos(e){

    e.preventDefault();

    let formTallesEditar = document.querySelector("#form-editar");
    let formData = new FormData(formTallesEditar);

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


// ---------------------- PAGINACION --------------------

let pagina = 1 ; 
const limitePag = 4;

function anterior(i){
    let mensaje = document.querySelector("#mensaje");
    mensaje.innerHTML = " ";

    if (i > 1){
        i = i - 1
    }
    
    if(i >= 1){
        cambiarHojaTalles(i);
    }
    return i;
}

async function getLongitud(){ // lo usa la funcion siguiente para conocer el limite al hacer click

    let respuesta= await fetch(url); 
    let talles= await respuesta.json(); 
    await talles;
    
    return talles.length;
}

const cantTallesAMostrar= 4;

async function siguiente(i){
    let limite = await getLongitud();
    let mensaje = document.querySelector("#mensaje");
    mensaje.innerHTML = " ";

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


// -----------------  RESALTAR - al editar una fila --------------------------------


function resaltar(idTalle){

    let tr = document.querySelectorAll("tr");

    try{
        for(let i=0; i < tr.length; i++){
            if(tr[i].dataset.talleId == idTalle){
                tr[i].classList.add("resaltar");
            }
        }
        
    } catch (error){
        console.log(error);
    }
}


// ---------------- FILTRO ----------------------

/// IMPRIMIR CON FILTRO

function imprimirConFiltro(tablaFiltro){

    pagina = 1; // la reinicio para que, en caso de que se borre un elemento, muestre la primer pagina de todos los elem
    
    let tablaDeTalles = document.getElementById('tablaDeTalles');
        tablaDeTalles.innerHTML = " ";

    let mensaje = document.querySelector("#mensaje");
        mensaje.innerHTML = " ";

    let selectFiltro = document.querySelector("#selectFiltro").value;
    
    if((tablaFiltro.length == 0) && (selectFiltro != "talle")){
        mensaje.innerHTML = "Sin resultados! Filtre nuevamente";
    }
    
    for(const talle of tablaFiltro){
        let fila = crearFila(talle);
        tablaDeTalles.appendChild(fila);
    };

}

 function mostrarInputsFiltro(){
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
        medidaMin.setAttribute("class", "inputVisible inputDisenio inputT");
        medidaMax.setAttribute("class", "inputVisible inputDisenio inputT");
        siguiente.setAttribute("class", "btn-siguiente inputOculto");
        anterior.setAttribute("class", "btn-anterior inputOculto");
    }
 }

 async function filtro(){

    let tablaFiltro = []; // en la que se guardan los elementos que cumplen con el filtro
    let respuesta= await fetch(url); 
    let talles= await respuesta.json(); 
    
    let selectFiltro = document.querySelector("#selectFiltro").value;
    let medidaMin = parseInt(document.querySelector("#medidaMin").value);
    let medidaMax = parseInt(document.querySelector("#medidaMax").value);
    let mensaje = document.querySelector("#mensaje");
    mensaje.innerHTML = " ";
    
    if(selectFiltro == "talle"){ // ver todos los talles
        pagina = 1;
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
    
    limpiarInputs();
    imprimirConFiltro(tablaFiltro);
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
