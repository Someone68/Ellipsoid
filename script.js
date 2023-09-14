function entergame() {
  localStorage.username = s("#username").value;
  if (s("#keep").checked) {
    localStorage.keep = "y";
  } else {
    localStorage.keep = "n";
  }
  location.href = "game/game.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.keep) {
    if (localStorage.keep === "y") {
      s("#keep").checked = true;
      if(localStorage.username) s("#username").value = localStorage.username;
    }
  }
});
