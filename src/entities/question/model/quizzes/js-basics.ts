import type { Quiz } from '../types';

export const jsBasicsQuiz: Quiz = {
  id: 'js-basics',
  title: 'Основы JavaScript',
  description: 'Замыкания, типы, массивы, промисы',
  questions: [
    {
      id: 'js-q1',
      promptMd: 'Что выведет следующий код?\n\n```js\nconsole.log(typeof null);\n```',
      mode: 'single',
      options: [
        { id: 'a', labelMd: '`"null"`' },
        { id: 'b', labelMd: '`"object"`' },
        { id: 'c', labelMd: '`"undefined"`' },
        { id: 'd', labelMd: '`"number"`' },
      ],
      correctOptionIds: ['b'],
      points: 10,
      explainMd:
        '`typeof null === "object"` — историческая ошибка в JavaScript, сохранённая для обратной совместимости.',
    },
    {
      id: 'js-q2',
      promptMd: 'Какие из следующих значений являются **falsy** в JavaScript?',
      mode: 'multi',
      options: [
        { id: 'a', labelMd: '`0`' },
        { id: 'b', labelMd: '`""`' },
        { id: 'c', labelMd: '`[]`' },
        { id: 'd', labelMd: '`null`' },
        { id: 'e', labelMd: '`"false"`' },
      ],
      correctOptionIds: ['a', 'b', 'd'],
      points: 15,
      explainMd:
        'Пустой массив `[]` — truthy. Строка `"false"` — непустая строка, тоже truthy.',
    },
    {
      id: 'js-q3',
      promptMd:
        'Что такое замыкание (closure) в JavaScript?\n\nРассмотрите пример:\n\n```js\nfunction makeCounter() {\n  let count = 0;\n  return function () {\n    return ++count;\n  };\n}\nconst counter = makeCounter();\nconsole.log(counter()); // ?\nconsole.log(counter()); // ?\n```',
      mode: 'single',
      options: [
        { id: 'a', labelMd: 'Выведет `1` и `1` — каждый вызов создаёт новый `count`' },
        { id: 'b', labelMd: 'Выведет `1` и `2` — функция сохраняет доступ к `count`' },
        { id: 'c', labelMd: 'Выведет ошибку — `count` недоступен снаружи' },
        { id: 'd', labelMd: 'Выведет `undefined` и `undefined`' },
      ],
      correctOptionIds: ['b'],
      points: 10,
      explainMd:
        '**Замыкание** — это функция, которая «помнит» переменные из внешней области видимости даже после того, как внешняя функция завершила выполнение.\n\n`makeCounter()` создаёт переменную `count` и возвращает функцию, которая имеет доступ к этой переменной. Каждый вызов `counter()` инкрементирует **один и тот же** `count`, поэтому результат: `1`, затем `2`.',
    },
    {
      id: 'js-q4',
      promptMd:
        'Какие методы массива **не мутируют** исходный массив?\n\n```js\nconst arr = [3, 1, 2];\n```',
      mode: 'multi',
      options: [
        { id: 'a', labelMd: '`arr.map(x => x * 2)`' },
        { id: 'b', labelMd: '`arr.sort()`' },
        { id: 'c', labelMd: '`arr.filter(x => x > 1)`' },
        { id: 'd', labelMd: '`arr.push(4)`' },
        { id: 'e', labelMd: '`arr.slice(1)`' },
      ],
      correctOptionIds: ['a', 'c', 'e'],
      points: 15,
      explainMd:
        '`sort()` и `push()` мутируют исходный массив. `map()`, `filter()`, `slice()` — возвращают новый.',
    },
    {
      id: 'js-q5',
      promptMd:
        'Чему равен результат выражения?\n\n```js\n[1, 2, 3].reduce((acc, x) => acc + x, 0)\n```',
      mode: 'single',
      options: [
        { id: 'a', labelMd: '`0`' },
        { id: 'b', labelMd: '`3`' },
        { id: 'c', labelMd: '`6`' },
        { id: 'd', labelMd: '`"123"`' },
      ],
      correctOptionIds: ['c'],
      points: 10,
      explainMd:
        '`reduce` проходит по массиву, накапливая результат в `acc`. Начальное значение аккумулятора — `0`:\n\n```\nacc=0, x=1 → 0+1=1\nacc=1, x=2 → 1+2=3\nacc=3, x=3 → 3+3=6\n```\n\nИтог: `6`.',
    },
    {
      id: 'js-q6',
      promptMd: 'Какие утверждения про `Promise` верны?',
      mode: 'multi',
      options: [
        { id: 'a', labelMd: 'Promise может находиться в состоянии `pending`, `fulfilled` или `rejected`' },
        { id: 'b', labelMd: '`async/await` — это синтаксический сахар над промисами' },
        { id: 'c', labelMd: 'Промис можно отменить встроенными методами' },
        { id: 'd', labelMd: '`Promise.all` завершается, когда выполнен хотя бы один промис' },
      ],
      correctOptionIds: ['a', 'b'],
      points: 15,
      explainMd:
        'Промисы нельзя отменить нативно. `Promise.all` ждёт **все** промисы — для первого используют `Promise.race`.',
    },
  ],
};
