"use strict";
/*menu*/
const menuControlBtn = document.querySelectorAll('.menuControl')
const gameScreen = document.querySelector('.wrapper-game');
const recordsScreen = document.querySelector('.records-screen');
const mainScreen = document.querySelector('.main-screen');
const aboutScreen = document.querySelector('.aboutScreen');
const inputName = document.querySelector('#name');
const modalSetting = document.querySelector('.modalSetting');
const openSetting = document.querySelectorAll('.openSetting');
const closeModal = document.querySelector('#closeModal');

const playerData = {
    name: '',
    scores: ''
};

let currentScreen;
let nextScreen;
let translate;


//перключение между экранами
menuControlBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        switch (btn.dataset.m) {
            case 'startGame':
                if (inputName.value) {
                    translate = true;
                    currentScreen = mainScreen;
                    nextScreen = gameScreen;
                    playerData.name = inputName.value;
                    inputName = '';
                } else {
                    inputName.placeholder = 'Обязательное поле';
                    return;
                }
                break;

            case 'openRecords':
                translate = true;
                currentScreen = mainScreen;
                nextScreen = recordsScreen;
                break;

            case 'openAbout':
                translate = true;
                currentScreen = mainScreen;
                nextScreen = aboutScreen;
                break;

            case 'back':
                translate = false;
                break;
        }
        changeScreen(currentScreen, nextScreen, translate);
    });
});

//модальное окно настроек
openSetting.forEach(btn => {
    btn.addEventListener('click', () => {
        modalSetting.classList.add('modalSetting-active');
        modalSetting.style.display = 'block';
        setTimeout(() => modalSetting.modalSetting.classList.add('modalSetting-active'), 500);
    });

});

closeModal.addEventListener('click', () => {
    modalSetting.classList.remove('modalSetting-active');
    setTimeout(() => modalSetting.style.display = 'none', 1000);
})




function changeScreen(curPg, nextPg, trans = true) {
    if (trans) {
        nextPg.style.cssText = `
        transform: translateX(0);
        `;
        curPg.style.cssText = `
        transform: translateX(-100%);
        `;
    } else {
        nextPg.style.cssText = `
        transform: translateX(100%);
        `;
        curPg.style.cssText = `
        transform: translateX(0);
        `;
    }
}


/*menu*/






const restart = document.getElementById('restart');
const infoBlock = document.querySelector('.info');
const infoSteps = infoBlock.querySelector('.steps');
const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');
cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight;



const stepSound = new Audio('./sound/step.mp3');




const sound = {
    step: new Audio('./sound/step.mp3'),
    lvlmus: new Audio('./sound/lvlmus.mp3'),
};
///src картинок
const srcImgData = {
    pD1: './img/Player/player_06.png',
    pD2: './img/Player/player_07.png',
    pU1: './img/Player/player_09.png',
    pU2: './img/Player/player_10.png',
    pR1: './img/Player/player_17.png',
    pR2: './img/Player/player_18.png',
    pL1: './img/Player/player_20.png',
    pL2: './img/Player/player_21.png',
    box: './img/Crates/crate_04.png',
    brick: './img/Blocks/block_01.png',
    floor: './img/Ground/ground_06.png',
    place: './img/Environment/environment_09.png',
    success: './img/Crates/crate_05.png'
};
//info
let steps = 0;
//номер уровня n+1
let n = 0;

// колтчество  ящиков уровне
const boxLvlInfo = [1, 3, 4, 6];
//размер одног блока
let sz = cvs.width / 28;
infoBlock.style.height = sz + 'px';
//p - player данные о персе
const p = {
    name: '',
    x: 0,
    y: 0,
    life: 3,
    view: {
        right: true,
        left: false,
        up: false,
        down: false,
    },
};


const imgSprite = {};
loadImage(imgSprite, srcImgData);
const dataLvl = [
    [
        "....................",
        "....................",
        ".........########...",
        ".........#     x#...",
        ".........# @  * #...",
        ".........#      #...",
        ".........########...",
        "...................."
    ],

    [
        "....................",
        "....................",
        ".........########...",
        ".........#     x#...",
        ".........# * **x#...",
        ".........#x  # @#...",
        ".........########...",
        "...................."
    ],
    [
        "........................",
        ".........###########....",
        ".........#         #....",
        ".........# *       #....",
        ".........# @  *## ##....",
        ".........#     #   #....",
        ".........# **  #  x#....",
        ".........#     #xxx#....",
        ".........###########....",
        "........................",
    ],

    [
        "........................",
        "........#####...........",
        "........#   #...........",
        "........#*  #...........",
        "......###  *##..........",
        "......#  * * #..........",
        "....### # ## #...######.",
        "....#   # ## #####  xx#.",
        "....# *  *          xx#.",
        "....##### ### #@##  xx#.",
        "........#     #########.",
        "........#######.........",
        "........................",
    ],


];

//деструктуризирую ключи к картинкам для доступности
const {
    pD1,
    pD2,
    pU1,
    pU2,
    pR1,
    pR2,
    pL1,
    pL2,
    brick,
    box,
    floor,
    place,
    success,
} = imgSprite;
//запускаю игру по загрузки ресурсов
let pers = pR1;
//делаю многомерный массив
let currentLvl = dataLvl[n].map(str => [...str]);

//ресайз
window.addEventListener('resize', resizeScreen);

//первый запуск
window.addEventListener('load', () => {
    start(n, currentLvl)

});

//restart
restart.addEventListener('click', restartLvl);

function game(lvl) {
    infoSteps.textContent = ` ${steps}`;
    render(lvl);
    window.addEventListener('keydown', logic);
};

//основная логика игры
function logic(e) {
    let lvl = currentLvl;
    //сохроняю данные кнопки для будущего изменения динамичесеих координат
    const route = e.key;
    //динамические координаты
    let dx = 0;
    let dy = 0;
    //переменная для хранение данных о возможности передвижения
    let move = 0;
    //переменная для храненияя
    let nextLvl = false;

    //проверяю кнопку и меняю координаты
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {

        stepSound.load();
        stepSound.volume = 0.05
        stepSound.addEventListener('canplaythrough', () => stepSound.play())
            //audio step
    };

    if (route === 'ArrowRight') {
        dx = 1
        dy = 0
        steps % 2 ? pers = pR1 : pers = pR2;
    };
    if (route === 'ArrowLeft') {
        dx = -1;
        dy = 0
        steps % 2 ? pers = pL1 : pers = pL2;
    };
    if (route === 'ArrowUp') {
        dx = 0;
        dy = -1;
        steps % 2 ? pers = pU1 : pers = pU2;
    };
    if (route === 'ArrowDown') {
        dx = 0;
        dy = 1;
        steps % 2 ? pers = pD1 : pers = pD2;
    };
    //получаю данные о передвижении
    move = canMove(dx, dy, lvl);
    //если перс сдвинуся перерисоваю его предыдущую позицию
    if (move) {
        //координата изменялась, добавляю шаг
        if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            steps++;
            //audio step
        };

        infoSteps.textContent = ` ${steps}`;
        //заново отрисовываю пол за персом
        if (lvl[p.y][p.x] === ' ' || lvl[p.y][p.x] === '@') {
            ctx.clearRect(p.x * sz, p.y * sz, sz, sz);
            ctx.drawImage(floor, p.x * sz, p.y * sz, sz, sz);
        };
        if (lvl[p.y][p.x] === 'x') {
            ctx.clearRect(p.x * sz, p.y * sz, sz, sz);
            ctx.drawImage(place, p.x * sz, p.y * sz, sz, sz);
        };
        //меняю координаты перса
        p.x += dx;
        p.y += dy;
        //заново отрисовываю элемент под персом
        draw(lvl[p.y][p.x], p.x, p.y, sz);
        //отрисовываю перса в новом месте
        ctx.drawImage(pers, p.x * sz, p.y * sz, sz, sz);
    };

    nextLvl = winOrNo(lvl);

    if (nextLvl) {
        n++;
        cvsMess('Stage complete')
        setTimeout(() => clearLvl(), 1000);
    };

};

// Проверка на возможность сдвинуться
function canMove(dx, dy, lvl) {
    // Проверяю что впереди
    let res = lvl[p.y + dy][p.x + dx];
    // Если впереди стена, то не двигаюсь
    if (res === '#') return 0;
    // Есть ящик, проверить возможности сдвинуть его
    if (res === '*' || res === '%') {
        let res1 = lvl[p.y + 2 * dy][p.x + 2 * dx];
        // Впереди ящика стена или другой ящик, нельзя двинуться
        if (['#', '%', '*'].includes(res1)) return 0;
        // Иначе сдвигаю ящик
        lvl[p.y + dy][p.x + dx] = (res == '%' ? 'x' : ' ');
        //занимаюсь перерисовками
        ctx.clearRect((p.x + dx) * sz, (p.y + dy) * sz, sz, sz);
        //если ящик на конечной позиции то, меняю его на  succes
        lvl[p.y + 2 * dy][p.x + 2 * dx] = (res1 == 'x' ? '%' : '*');
        let sym;
        //ящик вышел наконечную позицию?
        res === '%' ? sym = 'x' : sym = ' ';
        //ящик попал на конечную позицию?
        res1 === 'x' ? sym = '%' : sym = '*';
        //отрисовываю результат
        draw(sym, (p.x + 2 * dx), (p.y + 2 * dy), sz);
        return 2;
    }
    return 1;
}
//по вызову перебираю lvl и отрисовываю его в канвас
function render(lvl) {
    for (let y = 0; y < lvl.length; y++) {
        for (let x = 0; x < lvl[y].length; x++) {
            ///отрисовываю под полем сервй цвет
            if (lvl[y][x] !== '.') {
                ctx.fillStyle = 'gray';
                ctx.fillRect(x * sz, y * sz, sz, sz);
            }
            //отрисовываю пол под персом и получаю его координаты
            if (lvl[y][x] === '@') {
                ctx.drawImage(floor, x * sz, y * sz, sz, sz);
                p.x = x;
                p.y = y;
            };
            draw(lvl[y][x], x, y, sz);
        };
    };
};

function start(n, lvl) {
    splashScreen(n);
    setTimeout(() => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        game(lvl);
    }, 2000);
}
//Заставка
function splashScreen(n) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.width, ctx.height);
    cvsMess(`Stage ${n + 1}`);
};

function cvsMess(mess) {
    ctx.font = "30px Arial";
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(mess, cvs.width / 2, cvs.height / 2 - 30);
}

function resizeScreen() {
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    cvs.width = document.documentElement.clientWidth;
    cvs.height = document.documentElement.clientHeight;
    sz = cvs.width / 28;
    infoBlock.style.height = sz + 'px';
    game(currentLvl);
};

//функция отрисовки одного элемента
function draw(sym, x, y, sz) {
    let img;
    switch (sym) {
        case '*':
            img = box;
            break;
        case '#':
            img = brick;
            break;
        case ' ':
            img = floor;
            break;
        case '%':
            img = success;
            break;
        case 'x':
            img = place;
            break;
        case '@':
            img = pers;
            break;
        default:
            return;
    }
    return ctx.drawImage(img, x * sz, y * sz, sz, sz);
}


//проверка выйграл ли игроркs
function winOrNo() {
    //количество площадок на уровне
    let xPlace = 0;
    currentLvl.forEach(lvlArr => lvlArr.forEach(
        el => {
            el === '%' && xPlace++
        }));
    if (xPlace === boxLvlInfo[n]) {
        return true;
    }
    return false;
}

function restartLvl() {
    p.life -= 1;
    if (p.life < 0) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        cvsMess('Game Over');
        p.x = 0;
        p.y = 0;
        p.life = 3;
        n = 0;
        currentLvl = dataLvl[n].map(str => [...str]);
        setTimeout(() => {
            changeScreen(mainScreen, gameScreen, false);
            start(n, currentLvl);
        }, 2000);
    } else {
        clearLvl();
    }
}

function clearLvl() {
    window.removeEventListener('keydown', logic);
    steps = 0;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    p.x = 0;
    p.y = 0;
    currentLvl = dataLvl[n].map(str => [...str]);
    start(n, currentLvl);
}


function loadImage(coll, data) {
    for (let name in data) {
        let img = new Image();
        img.src = data[name];
        coll[name] = img;
    }
};

function loadedResourse() {
    /*возврщаем замкнутую переменную переменную  со значением true после загрузки всех ресурсов*/
}

function loadedLvl(v) {
    fetch('./maps.json')
        .then(response => response.json())
        .then(data => data);
}

function gameInfo() {}