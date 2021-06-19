"use strict"
/// CAPTCHA

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

window.addEventListener("load",cambiar);//para que la imagen inicial del captcha sea aleatorio.
  /*cambia el captcha*/
let btnImg = document.getElementById("btn-img");
btnImg.addEventListener("click", cambiar);

  /*envia formulario*/
let btnRespuesta = document.getElementById("btn-enviar");


btnRespuesta.addEventListener("click", obtenerRespuesta); //La función sin (). No la está llamando en esta sentencia. Le dice que función llamar (después)
                                              //Está pendiente de escuchar un evento para ejecutarlo solo en el momento en que suceda

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
