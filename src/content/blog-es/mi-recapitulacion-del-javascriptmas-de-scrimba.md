---
title: "Mi recapitulación del #JavaScriptmas de Scrimba"
description: "¡Fue muy divertido!"
date: 2020-12-20
translationKey: "javascriptmas"
assetSlug: "my-recap-of-scrimbas-javascriptmas"
hero: "/blog/my-recap-of-scrimbas-javascriptmas/michael-hacker-OM5Zy3_7pGU-unsplash.jpg"
---

Este año [**Scrimba**](https://scrimba.com) ha organizado un [calendario de Adviento](https://scrimba.com/learn/adventcalendar) publicando retos de programación diarios del 1 al 24 de diciembre. Además, regalan **suscripciones anuales gratuitas** cada día y un **gran premio de 1.000 USD** al final.

Los he estado haciendo desde el primer día y tengo que decir que me lo estoy pasando genial. Son pequeños retos muy entretenidos que no llevan más de cinco minutos, y los veo como la forma perfecta de terminar mi día —de programación—. Lo que más me gusta es revisar las soluciones de otras personas después, porque algunas son bastante ingeniosas y siempre se aprende algo nuevo.

Así que, si todavía no te has unido, ¿a qué estás esperando? ¡Es muy divertido y podrías llevarte el gran premio! 🤑

### ¿Qué es Scrimba?

Por si no lo conocías, **Scrimba** es una plataforma de aprendizaje para desarrolladores que enseña programación y otras habilidades relacionadas mediante screencasts interactivos llamados "scrims" (son bastante chulos: puedes pausarlos en cualquier momento, editar el código y ejecutarlo directamente). La uso desde 2018 y se ha convertido en una de mis plataformas favoritas para aprender. Por cierto, tienen un montón de [**cursos gratuitos**](https://scrimba.com/topic/free) si quieres echarles un vistazo.

Bueno, sin más preámbulos, aquí están mis soluciones:

## Día 1: Caramelos

### Reto

`n` niños tienen `m` caramelos. Quieren comer todos los caramelos posibles, pero cada niño debe comer exactamente la misma cantidad que los demás. Determina cuántos caramelos se comerán en total. Los caramelos no se pueden partir.

### Mi solución ([🔗](https://scrimba.com/learn/adventcalendar/note-at-1-04-coe27449cbdbcdfa608f3b2e0))

```js
function candies(children, candy) {
  return Math.floor(candy / children) * children;
}
```

### Solución oficial ([🔗](https://scrimba.com/learn/adventcalendar/javascript-challenge-candies-solution-cGmMvmU6?a=613.347.8.L4_36))

```js
function candies(children, candy) {
  const candyPerChild = Math.floor(candy / children);

  return candyPerChild * children;
}
```

## Día 2: Beneficio del depósito

### Reto

Has depositado una cantidad de dinero en tu cuenta bancaria. Cada año tu saldo aumenta a la misma tasa de crecimiento. Averigua cuánto tiempo tardarías en superar un determinado umbral, asumiendo que no realizas ningún depósito adicional.

### Mi solución ([🔗](https://scrimba.com/scrim/coe4d49ac871b2d4e4338b2bc))

```js
function depositProfit(deposit, rate, threshold) {
  const COMPOUND_RATE = 1 + rate / 100;
  let years = 0;
  let holdings = deposit;

  while (holdings < threshold) {
    years++;
    holdings *= COMPOUND_RATE;
  }

  return years;
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co5324b9dacc7bba7b8cd2ebd))

```js
function depositProfit(deposit, rate, threshold) {
  let year = 0;
  let currentAccountValue = deposit;

  while (threshold > currentAccountValue) {
    currentAccountValue += currentAccountValue * (rate / 100);
    year++;
  }

  return year;
}
```

## Día 3: Chunky Monkey

### Reto

Escribe una función que divida un array (primer argumento) en grupos del tamaño indicado (segundo argumento) y los devuelva como un array multidimensional.

### Mi solución ([🔗](https://scrimba.com/learn/adventcalendar/note-at-0-50-co8a646d9b9a9108f60356b16))

```js
function chunkyMonkey(values, size) {
  let arr = [];
  let offset = 0;
  for (let i = 0; i < values.length / size; i++) {
    offset = size * i;
    arr.push(values.slice(offset, offset + size));
  }
  return arr;
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/codc845fc9d84a45730390a31))

```js
function chunkyMonkey(values, size) {
  const nested = [];
  let count = 0;

  while (count < values.length) {
    nested.push(values.slice(count, (count += size)));
  }

  return nested;
}
```

## Día 4: Siglo a partir del año

### Reto

Dado un año, devuelve el siglo al que pertenece. El primer siglo va del año 1 al 100 inclusive, el segundo del 101 al 200, etc.

### Mi solución ([🔗](https://scrimba.com/learn/adventcalendar/note-at-1-03-co3984e8f8c6d266ad876e22c))

```js
function centuryFromYear(num) {
  const rest = num % 100;

  let century = Math.floor(num / 100);
  century += rest > 0 ? 1 : 0;

  return century;
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co0294451a881cd3a2dcbedf6))

```js
function centuryFromYear(year) {
  const century = year / 100;

  if (year % 100 === 0) {
    return century;
  }

  return Math.floor(century) + 1;
}
```

## Día 5: Invertir una cadena

### Reto

Invierte la cadena de texto proporcionada. Puede que necesites convertirla en un array antes de invertirla. El resultado debe ser una cadena.

### Mi solución ([🔗](https://scrimba.com/scrim/coab24925bb2d8fe8248d809f))

```js
function reverseAString(str) {
  return str
    .split('')
    .reverse()
    .join('');
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co29e4357b8ef128ad176480c))

```js
function reverseAString(str) {
  let reversedStr = '';

  for (let i = str.length - 1; i >= 0; i--) {
    reversedStr += str[i];
  }

  return reversedStr;
}
```

## Día 6: Ordenar por longitud

### Reto

Dado un array de cadenas, ordénalas de menor a mayor longitud. Si dos cadenas tienen la misma longitud, su orden relativo debe ser el mismo que en el array original.

### Mi solución ([🔗](https://scrimba.com/learn/adventcalendar/note-at-0-44-co8224dac94a7ab3f0b9c1f26))

```js
function sortByLength(strs) {
  return strs.sort((a, b) => a.length - b.length);
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co8764ca48d38e57cd814a9cf))

```js
function sortByLength(strs) {
  return strs.sort((str1, str2) => str1.length - str2.length);
}
```

## Día 7: Contar vocales y consonantes

### Reto

Se te da una cadena `s` compuesta únicamente por letras minúsculas del inglés. Si las vocales ('a', 'e', 'i', 'o', 'u') valen 1 y las consonantes valen 2, devuelve la suma de todas las letras de la cadena.

### Mi solución ([🔗](https://scrimba.com/learn/adventcalendar/note-at-1-11-coa0f45b1bde9f4a4d292a5a6))

```js
function countVowelConsonant(str) {
  const counter = (count, char) => {
    const isVowel = 'aeiou'.indexOf(char) !== -1;
    return count + (isVowel ? 1 : 2);
  };

  return str.split('').reduce(counter, 0);
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co2e747a2b78b050870fcdf87))

```js
function countVowelConsonant(str) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const chars = str.split('');
  const total = chars.reduce((acc, char) => {
    if (vowels.includes(char)) {
      return acc + 1;
    }

    return acc + 2;
  }, 0);

  return total;
}
```

## Día 8: Tirar el dado

**Nota:** Este reto incluye HTML y CSS adicional, por lo que recomiendo ver las soluciones directamente en Scrimba.

### Reto

En este reto, un casino te ha pedido que hagas un dado online que funcione igual que uno real. Usando la cara del dado que representa el 'uno' ya hecha, crea las caras para el 'dos', 'tres', 'cuatro', 'cinco' y 'seis'. Cuando el usuario haga clic en el dado en pantalla, éste debe mostrar una de las caras de forma aleatoria.

### Mi solución ([🔗](https://scrimba.com/scrim/co49f43f4b775ebce95adae72))

```js
const dice = document.querySelector('.dice');
const face = dice.querySelector('.face');
const message = document.querySelector('.message');

const roll = () => Math.ceil(Math.random() * 6);

dice.addEventListener('click', (e) => {
  const number = roll();
  face.className = `face dot-${number}`;
  message.innerHTML = `You got a ${number}!`;
});
```

### Solución oficial ([🔗](https://scrimba.com/scrim/cob2040579afbc1f3f3642272))

```js
const dice = document.querySelector('.dice');
const allDots = Array.from(document.querySelectorAll('.dice div'));

function rollDice() {
  let randomNumber = 1 + Math.floor(Math.random() * 6);
  console.log(randomNumber);

  allDots.forEach((dot) => dot.classList.remove(...dot.classList));

  if (randomNumber === 1) {
    allDots[4].classList.add('dot');
  }

  if (randomNumber === 2) {
    allDots[0].classList.add('dot');
    allDots[8].classList.add('dot');
  }
  if (randomNumber === 3) {
    allDots[0].classList.add('dot');
    allDots[4].classList.add('dot');
    allDots[8].classList.add('dot');
  }
  if (randomNumber === 4) {
    allDots[0].classList.add('dot');
    allDots[2].classList.add('dot');
    allDots[6].classList.add('dot');
    allDots[8].classList.add('dot');
  }
  if (randomNumber === 5) {
    allDots[0].classList.add('dot');
    allDots[2].classList.add('dot');
    allDots[4].classList.add('dot');
    allDots[6].classList.add('dot');
    allDots[8].classList.add('dot');
  }
  if (randomNumber === 6) {
    allDots[0].classList.add('dot');
    allDots[2].classList.add('dot');
    allDots[3].classList.add('dot');
    allDots[5].classList.add('dot');
    allDots[6].classList.add('dot');
    allDots[8].classList.add('dot');
  }
}
dice.addEventListener('click', rollDice);
```

## Día 9: Suma de números de Fibonacci impares

### Reto

Dado un entero positivo `num`, devuelve la suma de todos los números de Fibonacci impares menores o iguales a `num`. Los dos primeros números de la secuencia de Fibonacci son 1 y 1. Cada número adicional es la suma de los dos anteriores. Los seis primeros son 1, 1, 2, 3, 5 y 8. Por ejemplo, sumFibs(10) debe devolver 10 porque todos los Fibonacci impares menores o iguales a 10 son 1, 1, 3 y 5.

### Mi solución ([🔗](https://scrimba.com/scrim/cof644d16996ae275c88bb200))

```js
function sumOddFibonacciNumbers(num) {
  let a = 1,
    b = 1,
    sum = a,
    tmp;
  while (sum < num) {
    sum += b % 2 === 0 ? 0 : b;
    tmp = a;
    a = b;
    b += tmp;
  }
  return sum;
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co1c7479ab799481dfd8a3cd4))

```js
function sumOddFibonacciNumbers(num) {
  let sum = 0;
  let previous = 0;
  let current = 1;

  while (current <= num) {
    if (current % 2 === 1) {
      sum += current;
    }

    const nextValue = current + previous;
    previous = current;
    current = nextValue;
  }

  return sum;
}
```

## Día 10: Producto de elementos adyacentes

### Reto

Dado un array de enteros, encuentra el par de elementos adyacentes con el mayor producto y devuelve ese producto.

### Mi solución ([🔗](https://scrimba.com/scrim/co060435d87af0c11b4bf4620))

```js
function adjacentElementsProduct(nums) {
  const products = nums.map((num, i, nums) => num * (nums[i + 1] ?? 1));
  return Math.max(...products);
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co93f4a82bb211a995c761055))

```js
function adjacentElementsProduct(nums) {
  let largestProduct = nums[0] * nums[1];

  for (let i = 1; i < nums.length - 1; i++) {
    const adjacentProduct = nums[i] * nums[i + 1];

    if (largestProduct < adjacentProduct) {
      largestProduct = adjacentProduct;
    }
  }

  return largestProduct;
}
```

## Día 11: Evitar obstáculos

### Reto

Se te da un array de enteros que representan las coordenadas de obstáculos en una línea recta.

Imagina que saltas desde la coordenada 0 hacia la derecha. Solo puedes hacer saltos de la misma longitud, representada por un entero.

Encuentra la longitud mínima del salto para evitar todos los obstáculos.

### Mi solución ([🔗](https://scrimba.com/scrim/cobf54396b86fe97b55b00046))

```js
function avoidObstacles(nums) {
  let min = 1;
  while (nums.some((num) => num % min === 0)) {
    min++;
  }
  return min;
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co31c40f387bf0f984dc7a893))

```js
function avoidObstacles(nums) {
  const largestNum = nums.sort((a, b) => a - b)[nums.length - 1];

  for (let i = 1; i <= largestNum + 1; i++) {
    if (nums.every((value) => value % i !== 0)) {
      return i;
    }
  }
}
```

## Día 12: Hora válida

### Reto

Comprueba si la cadena dada es una representación de hora válida en formato de 24 horas.

### Mi solución ([🔗](https://scrimba.com/scrim/codee494c94137c46bb5434e4))

```js
function validTime(str) {
  const [hour, minute] = str.split(':').map((x) => parseInt(x, 10));

  return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co32941feaed0a92639e65ee3))

```js
function validTime(str) {
  const [hours, minutes] = str.split(':');

  if (parseInt(hours) > 23 || parseInt(hours) < 0) {
    return false;
  }

  if (parseInt(minutes) > 59 || parseInt(minutes) < 0) {
    return false;
  }

  return true;
}
```

## Día 13: Extraer cada K-ésimo

### Reto

Dado un array de enteros, elimina cada K-ésimo elemento.

### Mi solución ([🔗](https://scrimba.com/scrim/co55a459fbd4e155596f12dbe))

```js
function extractEachKth(nums, index) {
  return nums.filter((num) => num % index !== 0);
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co095422ebfd362d9a8441303))

```js
function extractEachKth(nums, index) {
  return nums.filter((value, i) => (i + 1) % index !== 0);
}
```

## Día 14: Diferencia adyacente máxima

### Reto

Dado un array de enteros, encuentra la diferencia absoluta máxima entre dos elementos adyacentes cualesquiera.

### Mi solución ([🔗](https://scrimba.com/scrim/co44743c890a8038a8bc2242a))

```js
function arrayMaximalAdjacentDifference(nums) {
  const diffs = nums.map((num, i, nums) =>
    i ? Math.abs(num - nums[i - 1]) : 0
  );

  return Math.max(...diffs);
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co3fa430188d7c9254d88f38c))

```js
function arrayMaximalAdjacentDifference(nums) {
  let maxDifference = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    const absoluteDifference = Math.abs(nums[i] - nums[i + 1]);

    if (maxDifference < absoluteDifference) {
      maxDifference = absoluteDifference;
    }
  }

  return maxDifference;
}
```

## Día 15: Carrusel en JavaScript

**Nota:** Este reto incluye HTML y CSS adicional, por lo que recomiendo ver las soluciones directamente en Scrimba.

### Reto

Crea un carrusel con JavaScript.

### Mi solución ([🔗](https://scrimba.com/scrim/co83944a0825c858480e73f09))

```js
const prevButton = document.querySelector('.previous');
const nextButton = document.querySelector('.next');
const gallery = document.querySelector('.gallery');
const cards = document.querySelectorAll('.card');

let currentCard = 0;
const lastCard = cards.length - 1;

const slide = (num) => {
  const prevCard = currentCard;
  const nextCard = currentCard + num;

  currentCard = Math.max(nextCard, 0);
  currentCard = Math.min(currentCard, lastCard);

  gallery.style = `transform: translateX(-${currentCard * 220}px);`;
  cards[prevCard].classList.remove('current');
  cards[currentCard].classList.add('current');

  prevButton.style = 'opacity: 1';
  nextButton.style = 'opacity: 1';
  if (currentCard === 0) {
    prevButton.style = 'opacity: .3';
  } else if (currentCard === lastCard) {
    nextButton.style = 'opacity: .3';
  }
};

nextButton.addEventListener('click', () => slide(1));
prevButton.addEventListener('click', () => slide(-1));
```

### Solución oficial ([🔗](https://scrimba.com/scrim/cobad4d3fb2d3f06ef4cf12f3))

```js
const gallery = document.getElementsByClassName('gallery')[0];
const prevBtn = document.getElementsByClassName('previous')[0];
const nextBtn = document.getElementsByClassName('next')[0];
const galleryCardCount = document.getElementsByClassName('card').length;

let currentGalleryXOffset = 0;
const endGalleryXOffset = (galleryCardCount - 1) * -220;

prevBtn.addEventListener('click', galleryClickHandler);
nextBtn.addEventListener('click', galleryClickHandler);

function galleryClickHandler(event) {
  let targetBtn = event.target.className;
  if (targetBtn == 'previous' && currentGalleryXOffset < 0) {
    currentGalleryXOffset += 220;
  } else if (targetBtn == 'next' && currentGalleryXOffset > endGalleryXOffset) {
    currentGalleryXOffset -= 220;
  }

  if (currentGalleryXOffset == 0) {
    prevBtn.style.opacity = 0.3;
    prevBtn.style.cursor = 'default';
  } else {
    prevBtn.style.opacity = 1; //disabled
    prevBtn.style.cursor = 'pointer';
  }

  if (currentGalleryXOffset == endGalleryXOffset) {
    nextBtn.style.opacity = 0.3;
    nextBtn.style.cursor = 'default';
  } else {
    nextBtn.style.opacity = 1;
    nextBtn.style.cursor = 'pointer';
  }

  gallery.style.transform = `translateX(${currentGalleryXOffset}px)`;
}
```

## Día 16: Insertar guiones

### Reto

Transforma una frase dada en una nueva donde haya guiones entre cada dos letras consecutivas.

### Mi solución ([🔗](https://scrimba.com/scrim/cob9e41f6825a596cde72c2be))

```js
function insertDashes(arr) {
  return arr
    .split('')
    .join('-')
    .replace('- -', ' ');
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co13a435c9bcd067fcb72cce0))

```js
function insertDashes(str) {
  const words = str.split(' ');
  const dashedWords = words.map((word) => {
    const chars = word.split('');

    return chars.join('-');
  });

  return dashedWords.join(' ');
}
```

## Día 17: Símbolos diferentes (naive)

### Reto

Dada una cadena, encuentra el número de caracteres distintos que contiene.

### Mi solución ([🔗](https://scrimba.com/scrim/co3da4d45bf8193ecddbe85d8))

```js
function differentSymbolsNaive(str) {
  return new Set(str.split('')).size;
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co8d44f3ca6dcb38828a7a014))

```js
function differentSymbolsNaive(str) {
  const chars = str.split('');

  return new Set(chars).size;
}
```

## Día 18: Elemento previo menor en el array

### Reto

Dado un array de enteros, para cada posición `i`, busca entre las posiciones anteriores la última (desde la izquierda) que contenga un valor menor. Guarda ese valor en la posición `i` del resultado. Si no existe ninguno, guarda -1.

### Mi solución ([🔗](https://scrimba.com/scrim/co39143659b16c7e834157219))

```js
function arrayPreviousLess(nums) {
  return nums.map((num, i) => {
    const prevNum = nums[i - 1] ?? -1;
    return prevNum < num ? prevNum : -1;
  });
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/cobe04a8a9b7115311ee775cf))

```js
function arrayPreviousLess(nums) {
  const previousLess = [];

  for (let i = nums.length - 1; i >= 0; i--) {
    for (let j = i; j >= 0; j--) {
      if (nums[i] > nums[j]) {
        previousLess.unshift(nums[j]);
        break;
      } else if (j === 0) {
        previousLess.unshift(-1);
      }
    }
  }

  return previousLess;
}
```

## Día 19: Subsecuencia del alfabeto

### Reto

Comprueba si la cadena dada es una subsecuencia del alfabeto en texto plano.

### Mi solución ([🔗](https://scrimba.com/scrim/co04f4940ba8c88e9479175a7))

```js
function alphabetSubsequence(str) {
  const expectedStr = [...new Set(str.split(''))].sort().join('');
  return str === expectedStr;
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/coa0146cbb5b839828a496942))

```js
function alphabetSubsequence(str) {
  const chars = str.split('');
  const charCodes = chars.map((char) => char.charCodeAt(0));

  if (new Set(charCodes).size !== charCodes.length) {
    return false;
  }

  for (let i = 0; i < charCodes.length - 1; i++) {
    if (charCodes[i] > charCodes[i + 1]) {
      return false;
    }
  }

  return true;
}
```

## Día 20: Tipo de dominio

### Reto

GoDaddy ofrece a sus clientes muchos dominios de nivel superior distintos. Un dominio de nivel superior es el que aparece directamente después del último punto ('.') en el nombre de dominio, por ejemplo .com en example.com. Para ayudar a los usuarios a elegir entre los dominios disponibles, GoDaddy introduce una nueva función que muestra el tipo del dominio elegido. Debes etiquetar los dominios como "commercial", "organization", "network" o "information" para .com, .org, .net o .info respectivamente. Para la lista de dominios dada, devuelve la lista de sus etiquetas.

### Mi solución ([🔗](https://scrimba.com/scrim/cobf9470496535112dfadcae8))

```js
function domainType(domains) {
  const types = new Map([
    ['org', 'organization'],
    ['com', 'commercial'],
    ['net', 'network'],
    ['info', 'information'],
  ]);

  return domains.map((domain) => {
    const tld = domain
      .split('.')
      .pop()
      .toLowerCase();
    return types.has(tld) ? types.get(tld) : 'unknown';
  });
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co4b94f019e17b4f43ea59095))

```js
function domainType(domains) {
  const domainTypes = [];

  for (let i = 0; i < domains.length; i++) {
    const urlPieces = domains[i].split('.');
    const domain = urlPieces[urlPieces.length - 1];

    if (domain === 'org') {
      domainTypes.push('organization');
    } else if (domain === 'com') {
      domainTypes.push('commercial');
    } else if (domain === 'net') {
      domainTypes.push('network');
    } else if (domain === 'info') {
      domainTypes.push('information');
    }
  }

  return domainTypes;
}
```

## Día 21: Suma de dos

### Reto

Tienes dos arrays de enteros, `a` y `b`, y un valor entero objetivo `v`. Determina si existe un par de números —uno de `a` y otro de `b`— cuya suma sea `v`. Devuelve `true` si existe dicho par, `false` en caso contrario.

### Mi solución ([🔗](https://scrimba.com/scrim/coad04d9e9c250a097f0ba542))

```js
function sumOfTwo(nums1, nums2, value) {
  return nums1.some((num1) => nums2.includes(value - num1));
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co72347e49afa5a04bd990906))

```js
function sumOfTwo(nums1, nums2, value) {
  const map = {};

  for (let num of nums1) {
    const difference = value - num;
    map[difference] = difference;
  }

  for (let num of nums2) {
    if (map.hasOwnProperty(num)) {
      return true;
    }
  }

  return false;
}
```

## Día 22: Extraer columna de una matriz

### Reto

Dada una matriz rectangular y un entero `column`, devuelve un array con los elementos de la columna indicada (la columna más a la izquierda es la 0).

### Mi solución ([🔗](https://scrimba.com/scrim/co2c547abb03b9db3767c6ec0))

```js
function extractMatrixColumn(matrix, column) {
  return matrix.map((rect) => rect[column]);
}
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co93b44658f476cf0f6f93278))

```js
function extractMatrixColumn(matrix, column) {
  return matrix.map((row) => row[column]);
}
```

## Día 23: Contador para redes sociales

**Nota:** Este reto incluye HTML y CSS adicional, por lo que recomiendo ver las soluciones directamente en Scrimba.

### Reto

¡Vamos a hacer un contador de caracteres para redes sociales! Queremos mostrar los caracteres RESTANTES disponibles. El evento `keydown` debería ayudarte aquí. Cuando queden 20 caracteres o menos, queremos que el contador se ponga en rojo. Si los caracteres caen por debajo de 0, el botón debe desactivarse. Pero si quedan exactamente 0 caracteres, aún debe ser posible publicar.

`keydown`, `addEventListener`, añadir y eliminar clases.

### Mi solución ([🔗](https://scrimba.com/scrim/coacc463194b0a48086530fe9))

```js
const string = document.querySelector('#string');
const btn = document.querySelector('#btn');
const counter = document.querySelector('#counterFooter');
const MAX_LENGTH = 140;

string.addEventListener('keyup', (event) => {
  const length = event.target.value.length;
  const remaining = MAX_LENGTH - length;

  counter.innerText = `${remaining}/${MAX_LENGTH}`;
  counter.style.color = remaining <= 20 ? 'red' : 'white';

  if (remaining < 0) {
    btn.setAttribute('disabled', 'disabled');
    btn.className = 'buttonDisabled';
  } else {
    btn.setAttribute('disabled', '');
    btn.className = '';
  }
});
```

### Solución oficial

N/A

# Día 24: Pon a prueba tu agilidad

**Nota:** Este reto incluye HTML y CSS adicional, por lo que recomiendo ver las soluciones directamente en Scrimba.

### Reto

Crea un contador que se incremente cada 75 milisegundos en la función `spin()` y muestra si el jugador gana o pierde en la función `stop()`.

### Mi solución ([🔗](https://scrimba.com/scrim/co89c4c789b44186c1a4e08a2))

```js
// Globals
let targetInt; // The target number to stop the wheel on
let pushed = false; // Has the stop button been pushed - false is default

// DOM Elements
const spinningElem = document.getElementById('spinning'); // The spinning number
const buttonElem = document.getElementById('buttonPressed');
const targetElem = document.getElementById('targetNum');
const resultElem = document.getElementById('result'); // Display your result message here

// Functions
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buttonPressed = () => (pushed = true);

const setTargetInt = () => {
  targetInt = Math.floor(Math.random() * 101);
  targetElem.innerText = targetInt;
};

const spin = async () => {
  let i = 0;
  while (!pushed) {
    i = i >= 100 ? 0 : i + 1;
    spinningElem.innerText = i;
    await sleep(75); // Paste this wherever you need to sleep the incrimentor
  }

  stop(i); // Trigger this function when the STOP button has been pushed
};

const stop = (i) => {
  const diff = Math.abs(i - targetInt);

  if (diff === 0) {
    resultElem.innerText = `Yay! You did it!`;
  } else {
    resultElem.innerText = `Oh no, you lose! Off by ${diff}`;
  }
};

// Event listeners
buttonElem.addEventListener('click', buttonPressed);

// Init
setTargetInt();
spin();
```

### Solución oficial ([🔗](https://scrimba.com/scrim/co088427fb17f3f8ff74259e2))

```js
// javascript

//globals
var pushed = false; //Has the stop button been pushed - false is default
var targetInt; //The target number to stop the wheel on
var spinningElem = document.getElementById('spinning'); //The spinning number

//event listener
document
  .getElementById('buttonPressed')
  .addEventListener('click', buttonPressed);

//When the stop button is pushed
function buttonPressed() {
  pushed = true;
}

//set the target Int
function setTargetInt() {
  var targetElem = document.getElementById('targetNum');
  targetInt = Math.floor(Math.random() * 101);
  targetElem.innerHTML = targetInt;
}

//sleep const
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

//number spinner
const spin = async () => {
  for (var i = 0; i < 101; i++) {
    if (i == 100) {
      i = 0;
    }
    if (pushed == true) {
      stop(i); //Trigger this function when the STOP button has been pushed
      break;
    } else {
      spinningElem.innerHTML = i;
      await sleep(75); //Paste this
    }
  }
};

function stop(i) {
  var offBy = Math.abs(targetInt - (i - 1));
  var message;

  if (offBy == 0) {
    message = 'You Win!';
  } else {
    message = 'Oh no, you lose! Off by ' + offBy.toString();
  }
  var result = document.getElementById('result');
  result.innerHTML = message;
}

setTargetInt();
spin();
```

¡Y eso es todo!

Me gustaría agradecer a [**Scrimba**](https://scrimba.com) por organizar esto (¡fue muy divertido!). Y enhorabuena a [**@bhagwan_gb**](https://twitter.com/bhagwan_gb), ¡que se llevó el gran premio!

¡Nos vemos en el [**\#JavaScriptmas**](https://twitter.com/hashtag/JavaScriptmas) de 2021!

Foto de [Michael Hacker](https://unsplash.com/@michael_hacker) en [Unsplash](https://unsplash.com/photos/OM5Zy3_7pGU)
