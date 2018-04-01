"use strict";
var handleMenuClick = (function() {
    var a = document.getElementById("menu-toggle"),
      b = document.getElementById("tl-Navigation");
    a &&
      b &&
      (b.classList.add("js-active"),
      a.addEventListener("click", function() {
        b.classList.toggle("nav-toggled");
      }));
  })(),
  handleToggleSignInClick = (function() {
    var a = document.getElementById("toggle-sign-in-button"),
      b = document.getElementById("tl-Navigation");
    a &&
      b &&
      a.addEventListener("click", function(e) {
        e.preventDefault();
        "#tl-Navigation" === window.location.hash
          ? ((window.location.hash = ""),
            (window.location.hash = "#tl-Navigation"))
          : (window.location.hash = "#tl-Navigation"),
          b.classList.toggle("nav-toggled");
      });
  })();
