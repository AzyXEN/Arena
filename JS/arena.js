let bossHp = 100;
let bossName = "TrisScary";
let bosslvl = 1;
let bossmaxhp = 100;
let wins = 0;

let totalwinsSpan = document.getElementById("win");
let bossNameSpan = document.getElementById("boss-name");
let bossHpSpan = document.getElementById("boss-hp");
let hpBar = document.getElementById("hp-bar");
let attackButton = document.getElementById("atck-btn");
let skillButton = document.getElementById("skill");
let battleLog = document.getElementById("battle-log");
const victoryMusic = new Audio('audio/Gunship.mp3');
let avatrBox = document.getElementById("avatar");
let avaBox = document.getElementById("ava-hero");
let heroHP = 100;
let heroName = "AzyXEN";
let herolvl = 1;
let heromaxhp = 100;
let heroHPspan = document.getElementById("hero-hp");
let heronameSpan = document.getElementById("hero-name");
let herolvlSpan = document.getElementById("hero-lvl");
let rainContainer = document.getElementById("rain");

const atck = new Audio('Audio/hit.mp3');
const spell = new Audio('Audio/spell.mp3');
const back = new Audio('Audio/song.mp3');
const rainsound = new Audio('Audio/rain.mp3');

back.loop = true;
rainsound.loop = true;
back.volume = 0.3;
rainsound.volume = 1.0;

// Функция для первого запуска звука (поддерживается Safari на iOS, Chrome и Opera)
function startBackgroundAudio() {
    back.play().catch(e => console.log("Audio play blocked:", e));
    rainsound.play().catch(e => console.log("Rain play blocked:", e));
    document.removeEventListener("click", startBackgroundAudio);
    document.removeEventListener("touchstart", startBackgroundAudio);
}

// Слушаем и клик (ПК), и касание экрана (iPhone Safari)
document.addEventListener("click", startBackgroundAudio);
document.addEventListener("touchstart", startBackgroundAudio);

// Функция непрерывного создания капель дождя
function startRain() {
    setInterval(function() {
        let drop = document.createElement("div");
        drop.classList.add("rain");
        drop.style.left = Math.random() * 100 + "vw";
        rainContainer.appendChild(drop);
        setTimeout(function() {
            drop.remove();
        }, 700);
    }, 100);
}

startRain();

// Универсальная функция проверки состояния босса (победа / переход на новый уровень)
function checkBossDeath() {
    if (bossHp <= 0) {
        wins += 1;
        totalwinsSpan.textContent = wins;

        if (wins === 10) {
            battleLog.textContent = `Вы одержали 10 побед подряд, данная композиция для Вас. Насладитесь мелодией победителя, и отдохните от боев.`;
            victoryMusic.play();
            attackButton.disabled = true;
            skillButton.disabled = true;
        } else {
            battleLog.textContent = `Босс повержен! Уровень ${bosslvl} пройден. Новый монстр вступает в бой!`;
            bosslvl += 1;
            herolvl += 1;
            bossmaxhp += 50;
            heromaxhp += 35;
            heroHP = heromaxhp;
            bossHp = bossmaxhp;

            bossHpSpan.textContent = bossHp + "hp";
            heroHPspan.textContent = heroHP + "hp";
            herolvlSpan.textContent = "Уровень героя: " + herolvl;
        }
    }

    hpBar.max = bossmaxhp;
    hpBar.value = bossHp;
}

// Функция обычной атаки
function attackBoss() {
    let damage = Math.floor(Math.random() * 21) + 10;
    let isCrit = Math.random() < 0.2;

    if (isCrit) {
        damage *= 2;
    }

    bossHp -= damage;
    if (bossHp < 0) bossHp = 0;

    bossHpSpan.textContent = bossHp + "hp";

    // Безопасный перезапуск звука удара для Safari/Chrome
    atck.currentTime = 0;
    atck.play().catch(e => {});

    avatrBox.classList.add("shake");
    setTimeout(function() {
        avatrBox.classList.remove("shake");
    }, 300);

    if (bossHp > 0) {
        if (isCrit) {
            battleLog.textContent = `🔥 КРИТИЧЕСКИЙ УДАР! Нанесено ${damage} урона!`;
        } else {
            battleLog.textContent = `Отличный удар! Нанесено ${damage} единиц урона.`;
        }
        attackHero();
    }

    checkBossDeath();
}

// Функция специального навыка («Огненный шар»)
function useSkill() {
    let skillDamage = Math.floor(Math.random() * 16) + 25;

    bossHp -= skillDamage;
    if (bossHp < 0) bossHp = 0;

    bossHpSpan.textContent = bossHp + "hp";

    // Безопасный перезапуск звука спелла
    spell.currentTime = 0;
    spell.play().catch(e => {});

    avatrBox.classList.add("shake");
    setTimeout(function() {
        avatrBox.classList.remove("shake");
    }, 300);

    if (bossHp > 0) {
        battleLog.textContent = `⚡ ОГНЕННЫЙ ШАР! Нанесено ${skillDamage} сокрушительного урона!`;
        attackHero();
    }

    checkBossDeath();
}

// Функция ответной атаки босса
function attackHero() {
    let damage1 = Math.floor(Math.random() * 15) + 10;
    let isCrit = Math.random() < 0.3;

    if (isCrit) {
        damage1 *= 2;
    }

    heroHP -= damage1;

    if (heroHP < 0) {
        heroHP = 0;
    }

    heroHPspan.textContent = heroHP + "hp";

    avaBox.classList.add("shake");
    setTimeout(function() {
        avaBox.classList.remove("shake");
    }, 300);

    if (heroHP > 0) {
        if (isCrit) {
            battleLog.textContent += ` ⚠️ КРИТИЧЕСКИЙ УДАР БОССА! Нанесено ${damage1} урона!`;
        } else {
            battleLog.textContent += ` ⚠️ Босс отвечает и наносит ${damage1} урона.`;
        }
    } else {
        battleLog.textContent = ` 💀 Вы пали в бою... Поражение!`;
        attackButton.disabled = true;
        skillButton.disabled = true;
    }
}

attackButton.addEventListener("click", attackBoss);
skillButton.addEventListener("click", useSkill);
