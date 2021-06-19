"use strict"

/// NAV CON BOTON MENU RESPONSIVE

document.querySelector(".btn_menu").addEventListener("click", toggleMenu);

function toggleMenu() {
    document.querySelector(".navigation").classList.toggle("show");
}

