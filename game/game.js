if (localStorage.username) {
  s("#playername").innerHTML = localStorage.username;
  if(localStorage.keep === "n") localStorage.removeItem("username");
} else {
  if(localStorage.keep === "n") location.replace("../index.html")
}

let mana = 50;
let max_mana = 50;
let health = 100;
let max_health = 100;
let damage = 15;
let turn = false

class Move {
  constructor(name, damage, heal, reduction, manaCost, manaGain) {
    this.name = name;
    this.damage = damage;
    this.heal = heal;
    this.reduction = reduction;
    this.manaCost = manaCost;
    this.manaGain = manaGain;
  }
}

let attack = new Move("Attack", damage, 0, 0, Math.round(damage/1.5), 0);
let defend = new Move("Defend", 0, 0, damage + randomInt(Math.round(damage / 2), damage), Math.round(damage / randomFloat(2,3)), 0);
let heal = new Move("Heal", 0, damage + Math.round(damage / 2), 0, damage, 0);
let skip = new Move("Skip", 0, 0, 0, 0, Math.round(damage / 2.3));