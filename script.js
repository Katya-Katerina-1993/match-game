(() => {
  //  Создание и возврат формы для ввода количества карточек
  function createFormForNumberOfCards() {
    const form = document.createElement('form');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const formButton = document.createElement('button');

    form.classList.add('form');
    label.classList.add('form__label');
    label.innerText = 'Кол-во карточек по вертикали/горизонтали';
    input.classList.add('form__input');
    input.type = 'text';
    input.placeholder = 'Введите четное число от 2 до 10';
    formButton.classList.add('form__btn');
    formButton.textContent = 'Начать игру';

    form.append(label);
    form.append(input);
    form.append(formButton);

    return {
      form,
      label,
      input,
      formButton,
    };
  }

  // Функция для таймера
  const timerValue = setTimeout(() => {
    alert('Игра закончена');
    window.location.reload();
  }, 60000);

  // Отрисовка формы и получение количества карточек
  function getNumberOfCards() {
    const container = document.querySelector('.container');
    const formForNumberOfCards = createFormForNumberOfCards();

    container.append(formForNumberOfCards.form);

    formForNumberOfCards.form.addEventListener('submit', (ev) => { // проверка input на наличие значения и проверка значения на соответствие условиям
      ev.preventDefault();
      const inputValue = formForNumberOfCards.input.value;
      if (!inputValue) {
        return;
      }

      const validValue = checkNumber(inputValue);
      if (!validValue) {
        formForNumberOfCards.input.value = '4';
      } else {
        formForNumberOfCards.input.value = '';
        formForNumberOfCards.formButton.setAttribute('disabled', 'true');
        timerValue;
        startingGame(Math.pow(validValue, 2));
      }
    });
  }

  function checkNumber(number) {
    if (number > 1 && number < 11 && (!(number % 2))) {
      return number;
    }
  }

  // Функция перемешивания массива чисел Фишера-Йетса
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Создание списка карточек (игрового поля)
  function createGameLayout() {
    const cards = document.createElement('ul');
    cards.classList.add('cards');
    return cards;
  }

  // Создание и возврат карточки списка
  function createCard(valueId, numberOfCards) {
    const containerWidth = document.querySelector('.container').offsetWidth;
    const cardWidth = containerWidth * 0.65 / (Math.sqrt(numberOfCards));

    const card = document.createElement('li');
    card.classList.add('cards__item');
    card.setAttribute('style', `width: ${cardWidth}px; height: ${cardWidth}px;`);

    const button = document.createElement('button');
    button.classList.add('card__btn');
    button.id = valueId;

    card.append(button);

    return {
      card,
      button,
    };
  }

  // Начало игры
  let counterOfMatchingPair = 0; // Счетчик количества совпавших пар
  function startingGame(numberOfCards) {
    // Создание массива парных цифр, расположенных в случайном порядке
    const arrayOfCards = [];
    let valueOfCards = numberOfCards / 2;
    for (let i = 0; i < numberOfCards; i++) {
      arrayOfCards.push(valueOfCards);
      if (i % 2) {
        --valueOfCards;
      }
    }

    // Перемешиваю полученный массив
    const shuffledArrayOfNumbers = shuffle(arrayOfCards);

    // Создаю карточки
    createListOfCards(numberOfCards, shuffledArrayOfNumbers);
  }

  // Создаю список карточек
  function createListOfCards(numberOfCards, shuffledArrayOfNumbers) {
    const container = document.querySelector('.container');
    const gameLayout = createGameLayout();

    // Обработчик события нажатия на карточку
    for (let i = 0; i < numberOfCards; i++) {
      let currentCard = createCard(i, numberOfCards);
      gameLayout.append(currentCard.card);

      currentCard.button.addEventListener('click', () => {
        // Получаю случайное число из массива
        let valueOfCard = shuffledArrayOfNumbers[currentCard.button.id];
        // Присваиваю это число в id кнопки карточки
        currentCard.button.innerHTML = valueOfCard;
        // Сравниваю 2 открытых карточки
        compareNumbers(currentCard, valueOfCard);
        // Проверка достижения конца игры
        if (numberOfCards === counterOfMatchingPair * 2) {
          playAgain();
        }
      });
    }
    container.appendChild(gameLayout);
  }

  // Функция сравнения открытых карточек
  let firstCard = {};
  let secondCard = {};
  let isEqual = false;

  function compareNumbers(card, value) {
    // Проверка на наличие значения в первой карточке и присвоения ей значения, если она пустая
    if (!Object.keys(firstCard).length) {
      firstCard = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
      // Проверка на наличие значения во второй карточке и присвоения ей значения, если она пустая
    } else if (!Object.keys(secondCard).length) {
      secondCard = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
      if (firstCard.value === secondCard.value) {
        isEqual = true;
        ++counterOfMatchingPair;
        return;
      }
      // Если есть значения и первой и второй карточки
    } else {
      if (!isEqual) {
        firstCard.card.button.innerHTML = '';
        secondCard.card.button.innerHTML = '';
        firstCard.card.button.removeAttribute('disabled');
        secondCard.card.button.removeAttribute('disabled');
      } else {
        isEqual = false;
      }

      firstCard = {
        card: card,
        value: value,
      };

      card.button.setAttribute('disabled', 'true');
      secondCard = {};
    }
  }

  // Функция повтора игры
  function playAgain() {
    const container = document.querySelector('.container');
    const playButton = document.createElement('button');
    playButton.classList.add('play__again');
    playButton.textContent = 'Сыграть еще';
    container.append(playButton);

    playButton.addEventListener('click', () => {
      window.location.reload();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    getNumberOfCards();
  });

})();
