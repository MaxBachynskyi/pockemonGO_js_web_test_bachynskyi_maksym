class Pokemon {
    constructor({ name, defaultHP, damageHP, dmg, level = 1, img, elHP, elProgressbar }) {
        this.name = name;
        this.defaultHP = defaultHP;
        this.damageHP = damageHP;
        this.dmg = dmg;
        this.level = level;
        this.img = img;
        this.isStunned = false;

        this.elHP = elHP;
        this.elProgressbar = elProgressbar;
    }

    renderHP() {
        this.renderHPLife();
        this.renderProgressbarHP();
    }

    renderHPLife() {
        this.elHP.innerText = `${this.damageHP} / ${this.defaultHP}`;
    }

    renderProgressbarHP() {
        this.elProgressbar.style.width = `${(this.damageHP / this.defaultHP) * 100}%`;
    }

    changeHP(count) {
        if (this.damageHP <= count) {
            this.damageHP = 0;
            this.renderHP();
            return true;
        }

        this.damageHP -= count;
        this.renderHP();
        return false;
    }

    resetHP() {
        this.damageHP = this.defaultHP;
        this.renderHP();
    }
};

const character = new Pokemon({
    name: 'Pikachu',
    defaultHP: 100,
    damageHP: 100,
    dmg: 25,
    elHP: document.getElementById('health-character'),
    elProgressbar: document.getElementById('progressbar-character')
});

const enemies = [
    new Pokemon({
        name: 'Charmander',
        defaultHP: 100,
        damageHP: 100,
        dmg: 20,
        level: 1,
        img: './assets/charmander_card_logo.png',
        elHP: document.getElementById('health-enemy'),
        elProgressbar: document.getElementById('progressbar-enemy')
    }),
    new Pokemon({
        name: 'Bisasam',
        defaultHP: 150,
        damageHP: 150,
        dmg: 5,
        level: 2,
        img: './assets/bisasam_card_logo.png',
        elHP: document.getElementById('health-enemy'),
        elProgressbar: document.getElementById('progressbar-enemy')
    })]

const $btnKick = document.getElementById('btn-kick');
const $btnHeal = document.getElementById('btn-heal');
const $btnStun = document.getElementById('btn-stun');

const enemyName = document.getElementById('name-enemy');
const enemyImg = document.querySelector('.enemy .sprite');
const enemyLvl = document.querySelector('.enemy .lvl');

let currentEnemyIndex = 0;
let enemy = enemies[currentEnemyIndex];

function random(num) {
    return Math.ceil(Math.random() * num);
}

function loadEnemy(pokemon) {
    enemyName.innerText = pokemon.name;
    enemyImg.src = pokemon.img;
    enemyLvl.innerText = 'Lv. ' + pokemon.level;

    pokemon.resetHP();
}


$btnKick.addEventListener('click', () => {
    console.log('Kick!');
    disableButtons(true);

    const dmgCharacter = random(character.dmg);
    const enemyIsDead = enemy.changeHP(dmgCharacter);

    console.log('Ворог отримав урон:', dmgCharacter);

    if (enemyIsDead) {
        alert(enemy.name + ' повержен!');

        currentEnemyIndex++;
        if (currentEnemyIndex < enemies.length) {
            enemy = enemies[currentEnemyIndex];
            loadEnemy(enemy);
        } else {
            alert('Всі вороги переможені! Ти виграв!');
            disableButtons(true);
            return;
        }
    }

    setTimeout(() => {
        if (!enemy.isStunned) {
            const dmgEnemy = random(enemy.dmg);
            const characterIsDead = character.changeHP(dmgEnemy);
            console.log('Отримано урон:', dmgEnemy);

            if (characterIsDead) {
                alert('Бідний ' + character.name + ' програв бій!');
                disableButtons(true);
                return;
            }
        } else {
            console.log('Ворог був оглушений і пропустив хід!');
            enemy.isStunned = false;
        }
        disableButtons(false);
    }, 800);
});

$btnHeal.addEventListener('click', () => {
    console.log('Heal...');
    disableButtons(true);

    const healChance = random(2);
    if (healChance === 1) {
        let healAmount = Math.min(30, character.defaultHP - character.damageHP);
        character.damageHP += healAmount;
        character.renderHP();
        console.log('Успішне лікування на:', healAmount);
    } else {
        console.log('Лікування не вдалось!');
    }

    setTimeout(() => {
        const dmgEnemy = random(enemy.dmg);
        const characterIsDead = character.changeHP(dmgEnemy);
        console.log('Отримано урон під час лікування:', dmgEnemy);

        if (characterIsDead) {
            alert('Бідний ' + character.name + ' програв бій!');
            disableButtons(true);
            return;
        }
        disableButtons(false);
    }, 800);
});

$btnStun.addEventListener('click', () => {
    console.log('Stun attempt...');
    disableButtons(true);

    const stunChance = random(2);
    if (stunChance === 1) {
        enemy.isStunned = true;
        console.log('Оглушення успішне! Ворог пропустить хід.');
    } else {
        console.log('Оглушення не спрацювало.');
    }

    const dmgCharacter = random(character.dmg * 0.25);
    const enemyIsDead = enemy.changeHP(dmgCharacter);
    console.log('Ворогу нанесено урон під час стану Stun:', dmgCharacter);

    if (enemyIsDead) {
        alert(enemy.name + ' повержен!');
        currentEnemyIndex++;
        if (currentEnemyIndex < enemies.length) {
            enemy = enemies[currentEnemyIndex];
            loadEnemy(enemy);
        } else {
            alert('Всі вороги переможені! Ти виграв!');
            disableButtons(true);
            return;
        }
    }

    setTimeout(() => {
        if (!enemy.isStunned) {
            const dmgEnemy = random(enemy.dmg);
            const characterIsDead = character.changeHP(dmgEnemy);
            console.log('Отримано урон під час оглушення:', dmgEnemy);

            if (characterIsDead) {
                alert('Бідний ' + character.name + ' програв бій!');
                disableButtons(true);
                return;
            }
        } else {
            console.log('Ворог оглушений і не атакує!');
            enemy.isStunned = false;
        }
        disableButtons(false);
    }, 800);
});


function disableButtons(state) {
    $btnKick.disabled = state;
    $btnHeal.disabled = state;
    $btnStun.disabled = state;
}

function init() {
    console.log('Start Game!');
    character.renderHP();
    loadEnemy(enemy);
}

init();
