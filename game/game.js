let mana = 50;
let maxMana = 50;
let health = 100;
let maxHealth = 100;
let damage = 15;
let turn = true;
let username;
let playerIconSeed;
let started = false;
let kills = 0;

function percentage(partialValue, totalValue) {
	return (100 * partialValue) / totalValue;
}

function removeNumbers(string) {
	return string.replace(/\d+/g, "");
}

if (localStorage.username) {
	username = localStorage.username;
	s("#playername").innerHTML = localStorage.username;
	if (localStorage.seed) playerIconSeed = localStorage.seed;
	else playerIconSeed = username;
	if (localStorage.keep === "n") {
		localStorage.removeItem("username");
		localStorage.removeItem("seed");
	}
} else {
	if (localStorage.keep === "n") location.replace("../index.html");
}

let enemyNames = ["Skeleton", "Zombie", "Mage", "Goblin", "Ghoul"];
class Enemy {
	constructor(name, health, damage, mana) {
		this.name = name;
		this.health = health;
		this.damage = damage;
		this.reduction = 0;
		this.mana = mana;
		this.maxHealth = health;
		this.maxMana = mana;
		this.pic = `https://api.dicebear.com/7.x/shapes/svg?seed=${name.toLowerCase()}`;
	}
}

function generateEnemy() {
	let enemy = new Enemy(
		enemyNames[randomInt(0, enemyNames.length - 1)],
		randomInt(Math.round(maxHealth / 2), maxHealth + 5),
		randomInt(Math.round(damage / 2), damage + 5),
		maxMana
	);
	return enemy;
}

let currentEnemy = generateEnemy();

function update() {
	if (health > maxHealth) {
		health = maxHealth;
	}
	if (currentEnemy.health > currentEnemy.maxHealth) {
		currentEnemy.health = currentEnemy.maxHealth;
	}
	if (mana > maxMana) {
		mana = maxMana;
	}
	if (currentEnemy.mana > currentEnemy.maxMana) {
		currentEnemy.mana = currentEnemy.maxMana;
	}
	if (health <= 0) {
		health = 0;
		gameOver();
	}
	if (currentEnemy.health <= 0) {
		currentEnemy.health = 0;
		let healthGain = randomInt(10, 20);
		let manaGain = randomInt(5, 15);
		let damageGain = randomInt(5, 10);
		maxHealth += healthGain;
		maxMana += manaGain;
		damage += damageGain;
		health = maxHealth;
		mana = maxMana;
		temp(
			"+ 1 Kill<br>+ " +
				healthGain +
				" HP<br>+ " +
				manaGain +
				" Mana<br>+ " +
				damageGain +
				" Damage"
		);
		attack = new Move("Attack", damage, 0, 0, Math.round(damage / 1.5), 0);
		defend = new Move(
			"Defend",
			0,
			0,
			Math.round(damage / randomInt(2, 3)),
			Math.round(damage / randomFloat(2, 3)),
			0
		);
		heal = new Move("Heal", 0, damage + Math.round(damage / 2), 0, damage, 0);
		skip = new Move("Skip", 0, 0, 0, 0, Math.round(damage / 2.3));
		s("#playerturn").style.visibility = "visible";
		show(s(".moves"), "inline-block");
		s("#enemyturn").style.visibility = "hidden";
		currentEnemy = generateEnemy();
		kills++;
		turn = true;
		s(".player").classList.add("active");
		s(".enemy").classList.remove("active");
	}
	s("#dmg").innerHTML = damage;
	s("#hp").innerHTML = health;
	s("#mana").innerHTML = mana;
	s("#emaxhp").innerHTML = currentEnemy.maxHealth;
	s("#emaxmana").innerHTML = currentEnemy.maxMana;
	s("#maxhp").innerHTML = maxHealth;
	s("#maxmana").innerHTML = maxMana;
	s("#edmg").innerHTML = currentEnemy.damage;
	s("#ehp").innerHTML = currentEnemy.health;
	s("#emana").innerHTML = currentEnemy.mana;
	s(".attackmanacost").innerHTML = attack.manaCost;
	s(".defendmanacost").innerHTML = defend.manaCost;
	s(".healmanacost").innerHTML = heal.manaCost;
	s("#manabar").style.width = percentage(mana, maxMana) + "%";
	s("#hpbar").style.width = percentage(health, maxHealth) + "%";
	s("#emanabar").style.width =
		percentage(currentEnemy.mana, currentEnemy.maxMana) + "%";
	s("#ehpbar").style.width =
		percentage(currentEnemy.health, currentEnemy.maxHealth) + "%";
	s("#kills").innerHTML = kills;
	s("#kills2").innerHTML = kills;
}

document.addEventListener("DOMContentLoaded", () => {
	s("#enemyicon").src = currentEnemy.pic;
	s("#enemyname").innerHTML = currentEnemy.name;
	if (playerIconSeed.toLowerCase() === "rick astley") {
		s("#playericon").src = "../assets/rick.png";
	} else if (playerIconSeed.toLowerCase() === "ellipsoid") {
		s("#playericon").src = "../assets/ellipsoid.png";
	} else if (playerIconSeed.toLowerCase() === "amogus") {
		s("#playericon").src = "../assets/amogus.png";
	} else {
		s("#playericon").src =
			"https://api.dicebear.com/7.x/shapes/svg?seed=" +
			removeNumbers(playerIconSeed).toLowerCase();
	}
	update();
});

function randomSeed() {
	let characters = "abcdefghijklmnopqrstuvwxyz";
	let seed = "";
	for (let i = 0; i < randomInt(8, 25); i++) {
		seed += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return seed.toLowerCase();
}

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

let attack = new Move("Attack", damage, 0, 0, Math.round(damage / 1.5), 0);
let defend = new Move(
	"Defend",
	0,
	0,
	Math.round(damage / randomInt(2, 3)),
	Math.round(damage / randomFloat(2, 3)),
	0
);
let heal = new Move("Heal", 0, damage + Math.round(damage / 2), 0, damage, 0);
let skip = new Move("Skip", 0, 0, 0, 0, Math.round(damage / 2.3));

function move(movename) {
	if (started && turn) {
		if (mana >= movename.manaCost) {
			s("#load").innerHTML = movename.name + "...";
			show(s("#load"), "inline-block");
			hide(s(".moves"));
			setTimeout(() => {
				mana -= movename.manaCost;
				damagedo = movename.damage - currentEnemy.reduction;
				let crit = false;
				if (Math.random() >= 0.75 && damagedo > 0) {
					damagedo += Math.round(damagedo / 2.2);
					crit = true;
				}
				if (damagedo < 0) {
					damagedo = 0;
				}
				if (crit) {
					s("#load").innerHTML =
						"<span style='color:red;font-style:italic;font-weight:bold'>Critical Hit!</span>";
					setTimeout(() => {
						hide(s("#load"));
						currentEnemy.health -= damagedo;
						health += movename.heal;
						mana += movename.manaGain;
						currentEnemy.reducedDamage = movename.reduction;
						turn = false;
						currentEnemy.reduction = 0;
						s("#playerturn").style.visibility = "hidden";
						s("#enemyturn").style.visibility = "visible";
						update();
						if (currentEnemy.health > 0) enemyTurn(movename);

						s(".player").classList.remove("active");
						s(".enemy").classList.add("active");
					}, 1000);
				} else {
					hide(s("#load"));
					currentEnemy.health -= damagedo;
					health += movename.heal;
					mana += movename.manaGain;
					currentEnemy.reducedDamage = movename.reduction;
					turn = false;
					currentEnemy.reduction = 0;
					s("#playerturn").style.visibility = "hidden";
					s("#enemyturn").style.visibility = "visible";
					update();
					if (currentEnemy.health > 0) enemyTurn(movename);

					s(".player").classList.remove("active");
					s(".enemy").classList.add("active");
				}
			}, randomInt(1000, 1500));
			update();
		}
	}
}

function enemyTurn(playerMove) {
	if (!turn && started) {
		let randomthing = randomFloat(2, 3);
		let currentMove = [
			"Attack",
			"Attack",
			"Attack",
			"Attack",
			"Attack",
			"Attack",
			"Defend",
			"Defend",
			"Defend",
			"Heal",
			"Heal",
			"Heal",
			"Skip",
			"Skip",
		][randomInt(0, 13)];
		console.log(Math.round(currentEnemy.damage / randomthing));
		console.log(currentMove);
		console.log(Math.round(currentEnemy.damage / randomthing));
		console.log(currentEnemy.mana);
		if (
			currentMove === "Attack" &&
			currentEnemy.mana > Math.round(currentEnemy.damage / 1.5)
		) {
			//dont do anything
		} else if (
			currentMove === "Defend" &&
			currentEnemy.mana > Math.round(currentEnemy.damage / randomthing)
		) {
			//dont do anything
		} else if (
			currentMove === "Heal" &&
			currentEnemy.mana > currentEnemy.damage
		) {
			//dont do anything
		} else {
			currentMove = "Skip";
		}
		console.log(currentMove);
		s("#eload").innerHTML = currentMove + "...";
		show(s("#eload"), "inline-block");
		setTimeout(() => {
			hide(s("#eload"));
			if (
				currentMove === "Attack" &&
				currentEnemy.mana > Math.round(currentEnemy.damage / 1.5)
			) {
				currentEnemy.mana -= Math.round(currentEnemy.damage / 1.5);
				let damagedo = currentEnemy.damage - playerMove.reduction;
				if (damagedo < 0) {
					damagedo = 0;
				}
				health -= damagedo;
			} else if (
				currentMove === "Defend" &&
				currentEnemy.mana > Math.round(currentEnemy.damage / randomthing)
			) {
				currentEnemy.mana -= Math.round(currentEnemy.damage / randomthing);
				currentEnemy.reduction = Math.round(currentEnemy.damage / randomthing);
			} else if (
				currentMove === "Heal" &&
				currentEnemy.mana > currentEnemy.damage
			) {
				currentEnemy.mana -= currentEnemy.damage;
				currentEnemy.health +=
					currentEnemy.damage + Math.round(currentEnemy.damage / 2);
			} else {
				currentEnemy.mana += Math.round(currentEnemy.damage / 2.3);
			}
			turn = true;
			s("#playerturn").style.visibility = "visible";
			show(s(".moves"), "inline-block");
			s("#enemyturn").style.visibility = "hidden";
			update();

			s(".player").classList.add("active");
			s(".enemy").classList.remove("active");
		}, randomInt(1700, 2500));
	}
}

function gameOver() {
	show(s(".gameover"), "inline-block");
}

function temp(text) {
	let temporary = makeElement("p", text, document.body, [], ["temp"]);
	setTimeout(() => {
		temporary.remove();
	}, 10000);
}
