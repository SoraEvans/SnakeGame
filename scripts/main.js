let scoreBlock; // отображение очков на странице
let score = 0; // сами очки

const config = { //  основные настройки игры
    step: 0,
    maxStep: 6,
    sizeCell: 16, // размер одной ячейкми
    sizeBerry: 16 / 4 // размер ягоды
}

const snake = {
    x: 16,
    y: 16,
    dx: config.sizeCell, // скорость змейки по вертикали и горизонтали
    dy: 0,
    tail: [], // массив ячеек, которые занимает змейка
    maxTail: 3 // количество этих ячеек?
}

const berry = {
    x: 0,
    y: 0
}

let canvas = document.querySelector('#game-canvas'); // получаем canvas
let context = canvas.getContext('2d');
scoreBlock = document.querySelector('.game-score .score-count');
drawScore();

function gameLoop() { // игровой цикл

    requestAnimationFrame(gameLoop); // бесконечный вызов gameLoop
    if (++config.step < config.maxStep) {
        return; // прекращает работу функции, т.о. можно контролировать скорость отрисовки
    }
    config.step = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);// каждый кадр очищаем canvas
    drawBerry(); // и заново отрисовываем змейку и ягоду
    drawSnake();
}

requestAnimationFrame(gameLoop);


// функция отображения на экране змейки
function drawSnake() {
// меняем координаты змейки согласно ее скорости
    snake.x += snake.dx;
    snake.y += snake.dy;

    collisionBorder();

    snake.tail.unshift({x: snake.x, y: snake.y}); // добавляем в начало массива объект с координатами

    if (snake.tail.length > snake.maxTail) { // если количество дочерних элементов у змейки больше, чем разрешено
        snake.tail.pop() // то удаляем последний элемент
    }

    /*
    перебираем все дочерние элементы змейки и отрисовываем их,
    проверяя на соприкосновение друг с другом и с ягодой
    */
    snake.tail.forEach(function (el, index) {
        if (index === 0) {
            context.fillStyle = '#FA0556'; // красим голову змеи
        } else {
            context.fillStyle = '#A00034'; // красим тело
        }
        context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

        if (el.x === berry.x && el.y === berry.y) { // проверяем координаты ягоды и змейки
            snake.maxTail++; // если они совпадают - 1.увеличиваем хвост змейки
            incScore(); // 2.увеличиваем очки
            randomPositionBerry() // 3.создаем новую ягоду
        }

        // проверяем на соприкосновение змейки с хвостом
        for (let i = index + 1; i < snake.tail.length; i++) {
            // если координаты совпали - запускаем игру заново
            if (el.x === snake.tail[i].x && el.y === snake.tail[i].y) {
                refreshGame();
            }
        }
    });
}


// проверка координат змейки для столкновления с границами поля
function collisionBorder() {
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    } else if (snake.x >= canvas.width) { // если к.змейки выходят за границу canvas
        snake.x = 0; // то меняем координаты
    }

    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
}

// функция перезапуска игры (обнуление значений)
function refreshGame() {
    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tail = [];
    snake.maxTail = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();
}

// функция отрисовки ягоды
function drawBerry() {
    context.beginPath();
    context.fillStyle = '#A00034'; // назначаем цвет
    // рисуем окружность на основе координат ягоды
    context.arc(
        berry.x + (config.sizeCell / 2),
        berry.y + (config.sizeCell / 2),
        config.sizeBerry,
        0,
        2 * Math.PI);
    context.fill();
}

// функция для задания рандомных значений координат появления ягоды на поле
function randomPositionBerry() {
    /*получаем количество ячеек путем деления ширины/высоты canvas
    на размер ячейки и умножения полученного рез-та на размер ячейки*/
    berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
    berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}

// функции для обработки очков
function incScore() { // увеличивает текущее значение очков на 1
    score++;
    drawScore();
}

function drawScore() { // отображает измененное значение очков на странице
    scoreBlock.innerHTML = score;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
    /*
    функция принимает диапазон чисел и
    возвращает рандомное значение в заданном диапазоне
     */
}

document.addEventListener('keydown', function (e) {
        if (e.code === "KeyW" && snake.dy === 0) {
            snake.dy = -config.sizeCell;
            snake.dx = 0;
        } else if (e.code === "KeyA" && snake.dx === 0) {
            snake.dx = -config.sizeCell;
            snake.dy = 0;
        } else if (e.code === "KeyS" && snake.dy === 0) {
            snake.dy = config.sizeCell;
            snake.dx = 0;
        } else if (e.code === "KeyD" && snake.dx === 0) {
            snake.dx = config.sizeCell;
            snake.dy = 0;
        }
    }
)


