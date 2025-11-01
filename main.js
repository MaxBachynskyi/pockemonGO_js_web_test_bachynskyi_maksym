const $btn = document.getElementById('btn-kick');
const enemyName = document.getElementById('name-enemy');
const enemyImg = document.querySelector('.enemy .sprite');
const enemyLvl = document.querySelector('.enemy .lvl');
const enemyHP = document.getElementById('health-enemy');
const enemyBar = document.getElementById('progressbar-enemy');
const $btn_health = document.getElementById('btn-heal');
const $btn_stun = document.getElementById('btn-stun');

const character = {
    name: 'Pikachu',
    defaultHP: 100,
    damageHP: 100,
    dmg: 25,
    elHP: document.getElementById('health-character'),
    elProgressbar: document.getElementById('progressbar-character'),
}

const enemies = [
    {
        name: 'Charmander',
        defaultHP: 100,
        damageHP: 100,
        dmg: 20,
        isStunned: false,
        level: 1,
        img: './assets/charmander_card_logo.png',
        elHP: document.getElementById('health-enemy'),
        elProgressbar: document.getElementById('progressbar-enemy'),
    },
    {
        name: 'Bisasam',
        defaultHP: 150,
        damageHP: 150,
        dmg: 5,
        isStunned: false,
        level: 2,
        img: './assets/bisasam_card_logo.png',
        elHP: document.getElementById('health-enemy'),
        elProgressbar: document.getElementById('progressbar-enemy'),
    }
]

let currentEnemyIndex = 0;
let enemy = enemies[currentEnemyIndex];

$btn.addEventListener('click', function (){
    console.log('Kick');
    $btn.disabled = true;
    $btn_health.disabled = true;
    $btn_stun.disabled = true;
    const dmg_character = random(character.dmg);
    changeHP(dmg_character, enemy);
    console.log('Врагу был нанесён урон: ', dmg_character)
    setTimeout(() => {
        if(!enemy.isStunned){
            const dmg_enemy = random(enemy.dmg);
            changeHP(dmg_enemy, character); 
            console.log('Был получен урон: ', dmg_enemy);
        } else{
            console.log('Враг был оглушен ...');
            enemy.isStunned = false;
        }
        $btn.disabled = false;
        $btn_health.disabled = false;
        $btn_stun.disabled = false;      
    }, 1000);
});

$btn_health.addEventListener('click', function(){
    console.log('Healing Process...');
    $btn_health.disabled = true;
    $btn_stun.disabled = true;
    $btn.disabled = true;

    const healing_chance = random(2);
    if(healing_chance == 1){
        let d = 0;
        if(character.defaultHP - character.damageHP >= 30){
            d = 30;
        } else{
            d = character.defaultHP - character.damageHP;
        }
        character.damageHP += d;
        console.log('Успешное лечение на: ', d);
        renderHP(character);
    } else {
        console.log('Лечение не получилось :(');
    }
    setTimeout(() => {
        const dmg_enemy = random(enemy.dmg);
        changeHP(dmg_enemy, character); 
        $btn.disabled = false;
        $btn_health.disabled = false;
        $btn_stun.disabled = false;
        console.log('Был получен урон во время попытки лечения: ', dmg_enemy)
    }, 1000);
});
$btn_stun.addEventListener('click', function(){
    console.log('Stun Process...');
    $btn_stun.disabled = true;
    $btn_health.disabled = true;
    const stuning_chance = random(2);

    
    if(stuning_chance == 1){
        enemy.isStunned = true;
        console.log('Оглушение удалось! Враг пропустит ход!');
    } else {
        console.log('Оглушение не сработало!');
    }

    console.log('Kick with Stun');
    $btn.disabled = true;
    const dmg_character = random(character.dmg * 0.25);
    changeHP(dmg_character, enemy);
    console.log('Врагу был нанесён урон: ', dmg_character)

    setTimeout(() => {
        if (!enemy.isStunned) {
            const dmg_enemy = random(enemy.dmg);
            changeHP(dmg_enemy, character); 
            console.log('Был получен урон во время попытки оглушения: ', dmg_enemy);
        } else {
            console.log('Враг оглушён и не атакует!');
            enemy.isStunned = false;
        }
        $btn.disabled = false;
        $btn_health.disabled = false;
        $btn_stun.disabled = false;
    }, 1000);
});


function init(){
    console.log('Start Game!');
    renderHP(character);
    initEnemy(enemy);
    loadEnemy(enemies[currentEnemyIndex]);
}

function renderHP(person){
    renderHPLife(person);
    renderProgressbarHP(person);
}

function renderHPLife(person){
    person.elHP.innerText = person.damageHP + ' / ' + person.defaultHP;
}

function renderProgressbarHP(person){
    person.elProgressbar.style.width = person.damageHP + '%';
}

function changeHP(count, person){
    if(person.damageHP < count){
        person.damageHP = 0;
        renderHP(person);

        if (person === character) {
            alert('Бедный ' + person.name + ' проиграл бой!');
            $btn.disabled = true;
        } else {
            alert(person.name + ' повержен!');
            

            currentEnemyIndex++;
            if (currentEnemyIndex < enemies.length) {
                 loadEnemy(enemies[currentEnemyIndex]);
            } else {
                alert('Все враги побеждены! Ты победил в игре!');
                $btn.disabled = true;
            }
        }
        return;
    }
    
    person.damageHP -= count;
    renderHP(person);
}

function initEnemy(enemy){
    enemy.damageHP = enemy.defaultHP;
    renderHP(enemy);
}

function loadEnemy(enemyData){
    enemy.name = enemyData.name;
    enemy.defaultHP = enemyData.defaultHP;
    enemy.damageHP = enemyData.damageHP;
    enemy.dmg = enemyData.dmg;
    enemy.isStunned = false;

    enemyName.innerText = enemyData.name;
    enemyImg.src = enemyData.img;
    enemyLvl.innerText = 'Lv. ' + enemyData.level;

    renderHP(enemy)
}

function random(num){
    return Math.ceil(Math.random() * num);
}

init();