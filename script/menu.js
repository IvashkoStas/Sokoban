/*menu*/
'use strict';
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
                    inputName.value = '';
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