"use strict"

let id;

//LIMPIAR INPUTS

function limpiarInputs(){
    let inputs = document.getElementsByClassName("inputT");
    
    for(let item of inputs){
        item.value ="";
    } 
}

//AGREGAR TALLE

// document.querySelector(".btn-cargar").addEventListener("click", agregarTalle);
let formTalles = document.getElementById("form-talles");
formTalles.addEventListener("submit", agregar); 

function agregar(e){
    agregarTalle(e);
    limpiarInputs();
    obtenerDatos("https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p=1&limit=4");
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

    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";

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

//IMPRIMIR
async function obtenerDatos(url){
    
    let tabla = document.querySelector("#tablaDeTalles");
    tabla.innerHTML= "";

    try{
        let res= await fetch(url); // fetch funciona como un GET
        let talles= await res.json(); //se parsea de texto a objeto
        console.log(talles);  
        for(const talle of talles){
            let nombre = talle.nombre; 
            let busto = talle.busto;
            let cintura = talle.cintura;
            let cadera = talle.cadera;
            id = talle.id;
            tabla.innerHTML += "<tr>"+"<td>"+nombre+"</td>"+"<td>"+busto+"<td>"+cintura+"<td>"+cadera+"</td>"+"</tr>";
        }      
    }  catch(error){
        console.log(error);
    }
}


//AGREGAR X3

let btnAgregarTres = document.getElementById("btn-agregarTres");
btnAgregarTres.addEventListener("click", agregarTres);
const cantidad=3;

async function agregarTres(e){

    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";

    if((document.querySelector("#talle").value.length != 0) && 
        (document.querySelector("#busto").value.length != 0) && 
        (document.querySelector("#cintura").value.length != 0) &&
        (document.querySelector("#cadera").value.length != 0)){
    
        for(let i=0; i < cantidad; i++){
           await agregarTalle(e);
        }
    }

    limpiarInputs();
    obtenerDatos("https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p=1&limit=4");
}

function buscarTalle(talles, nombreTalle){

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

let formEditDelete = document.getElementById("form-delete");
formEditDelete.addEventListener("submit", borrarTalle); 

async function borrarTalle(e){

    e.preventDefault();

    let formData = new FormData(formEditDelete);

    // talle a eliminar -- entran datos por pantalla
    let nombreTalle= formData.get('talleDelete');

    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";

    // obtengo la lista de talles
    let res= await fetch(url); // fetch funciona como un GET
    let talles= await res.json(); //se parsea de texto a objeto


    let listaTalles = buscarTalle(talles, nombreTalle); // este metodo nos devuelve una lista con todos los objetos de la api (los talles) que coincidan con el ingresado por pantalla
                                                        // si devolviamos solo un id, eliminabamos solo el ultimo elemento encontrado

    if (listaTalles.length == 0){
        document.querySelector("#mensaje").innerHTML = "Reingrese talle";
    }

    else{

        for (const t of listaTalles) {

            // borro al talle a partir del id 
            try{
                let res = await fetch(url + "/" + t.id, {
                "method": "DELETE",
                });

                if(res.status === 200){
                    document.querySelector("#mensaje").innerHTML = "Eliminado!";
                }
            } catch (error){
                console.log(error);
            }
        }     
        
    }

    limpiarInputs();
    obtenerDatos(url);
}

async function modificarTalle(id, talle){

    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";
   
    try{
        let res = await fetch(url + "/" + id, {
        "method": "PUT",
        "headers": {"Content-type": "application/json"},
        "body": JSON.stringify(talle) // body siempre espera algo de tipo texto por eso convertimos al objeto en un string
        });

        if(res.status === 200){
            document.querySelector("#mensaje").innerHTML = "Modificado";
            console.log(id);
        }
    } catch (error){
        console.log(error);
    }
}

// modificar talle
let btnModificar = document.getElementById("btn-modificar").addEventListener("click", modificarElemento);

async function modificarElemento(e){

    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";
    e.preventDefault();

    let nuevoTalle = cargarDatos(e);

    console.log("ENTRA A MODIFICAR");

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

       obtenerDatos(url);
      
    }

    limpiarInputs();
    
}


let i = 1;

document.querySelector(".btn-anterior").addEventListener("click", function(e){

    if (i > 1){
        i = i - 1
    }
    
    console.log("resta " + i);
    
    if(i >= 1){
        cambiarHojaTalles(i);
    }
});

async function getLongitud(){

    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";
    let respuesta= await fetch(url); 
    let talles= await respuesta.json(); 
    await talles;
    
    return talles.length;
}
 
const cantTallesAMostrar= 4;

document.querySelector(".btn-siguiente").addEventListener("click", async function(e){
   
    let limite = await getLongitud();

    if (i < Math.ceil(limite/cantTallesAMostrar)){
        i = i + 1
    }

    console.log("suma" + i);
    
    if(i <= Math.ceil(limite/cantTallesAMostrar)){
        cambiarHojaTalles(i);    
    }
    
});


async function cambiarHojaTalles(i){
    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p="+ i + "&limit=4";

    obtenerDatos(url);

}

// RESALTAR


// VACIAR TABLA

let btnVaciar = document.getElementById("btn-vaciar");
 btnVaciar.addEventListener("click", vaciar); 

async function vaciar(){

    let url = "https://60c006e4b8d3670017554142.mockapi.io/api/talles";

    let respuesta= await fetch(url); 
    let talles= await respuesta.json(); 

    id = 0;

    for(let i=0; i < talles.length; i++){     
        id = talles[i].id;
        try{
            let res = await fetch(url + "/" + id, {
            "method": "DELETE",
            });

            if(res.status === 200){
                document.querySelector("#msj").innerHTML = "Eliminado";
            }
        } catch (error){
            console.log(error);
        }
    }

    obtenerDatos(url);
 }

obtenerDatos("https://60c006e4b8d3670017554142.mockapi.io/api/talles/?p=1&limit=4");