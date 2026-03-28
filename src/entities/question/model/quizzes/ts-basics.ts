import type { Quiz } from '../types';

export const tsBasicsQuiz: Quiz = {
  id: 'ts-basics',
  title: 'Основы TypeScript',
  description: 'Типы, интерфейсы, дженерики, утилиты',
  questions: [
    {
      id: 'ts-q1',
      promptMd:
        'Что произойдёт при компиляции?\n\n```ts\nconst greet = (name: string): string => {\n  return 42;\n};\n```',
      mode: 'single',
      options: [
        { id: 'a', labelMd: 'Ошибка компиляции: тип `number` не совместим с `string`' },
        { id: 'b', labelMd: 'Компилируется без ошибок, TypeScript приведёт `42` к строке' },
        { id: 'c', labelMd: 'Runtime-ошибка при вызове функции' },
        { id: 'd', labelMd: 'Функция вернёт `"42"`' },
      ],
      correctOptionIds: ['a'],
      points: 10,
      explainMd:
        'TypeScript проверяет тип возвращаемого значения при компиляции. `42` имеет тип `number`, но функция объявлена как возвращающая `string` — это ошибка типов.',
    },
    {
      id: 'ts-q2',
      promptMd:
        'Какой из следующих объектов корректно соответствует интерфейсу?\n\n```ts\ninterface Config {\n  host: string;\n  port?: number;\n}\n```',
      mode: 'multi',
      options: [
        { id: 'a', labelMd: '`{ host: "localhost" }`' },
        { id: 'b', labelMd: '`{ host: "localhost", port: 8080 }`' },
        { id: 'c', labelMd: '`{ port: 8080 }`' },
        { id: 'd', labelMd: '`{ host: "localhost", port: "8080" }`' },
      ],
      correctOptionIds: ['a', 'b'],
      points: 15,
      explainMd:
        '`port` помечен как необязательный (`?`), поэтому объект без `port` корректен. Вариант `c` не подходит — `host` обязателен. Вариант `d` не подходит — `port` должен быть `number`, а не `string`.',
    },
    {
      id: 'ts-q3',
      promptMd:
        'Что такое `keyof` в TypeScript?\n\n```ts\ninterface User { id: number; name: string; email: string; }\ntype UserKey = keyof User;\n```',
      mode: 'single',
      options: [
        { id: 'a', labelMd: '`UserKey` равно `"id" | "name" | "email"`' },
        { id: 'b', labelMd: '`UserKey` равно `number | string`' },
        { id: 'c', labelMd: '`UserKey` равно типу `User`' },
        { id: 'd', labelMd: '`UserKey` равно `object`' },
      ],
      correctOptionIds: ['a'],
      points: 10,
      explainMd:
        '`keyof T` возвращает union-тип из имён всех ключей интерфейса `T`. Для `User` это `"id" | "name" | "email"`. Это позволяет писать типобезопасные функции, принимающие ключ объекта.',
    },
    {
      id: 'ts-q4',
      promptMd:
        'Какие вызовы корректны для этой функции?\n\n```ts\nfunction getLength<T extends { length: number }>(arg: T): number {\n  return arg.length;\n}\n```',
      mode: 'multi',
      options: [
        { id: 'a', labelMd: '`getLength("hello")`' },
        { id: 'b', labelMd: '`getLength([1, 2, 3])`' },
        { id: 'c', labelMd: '`getLength(42)`' },
        { id: 'd', labelMd: '`getLength({ length: 5, value: "test" })`' },
      ],
      correctOptionIds: ['a', 'b', 'd'],
      points: 15,
      explainMd:
        'Ограничение `T extends { length: number }` означает: тип `T` должен иметь свойство `length: number`. Строки и массивы имеют `length`. `42` — нет. Объект `{ length: 5, value: "test" }` имеет `length` — подходит.',
    },
    {
      id: 'ts-q5',
      promptMd: 'Что означает тип `never` в TypeScript?',
      mode: 'single',
      options: [
        { id: 'a', labelMd: 'Значение, которое может быть `null` или `undefined`' },
        { id: 'b', labelMd: 'Функция, которая никогда не возвращает значение (бросает исключение или зависает)' },
        { id: 'c', labelMd: 'Синоним `void` — функция ничего не возвращает явно' },
        { id: 'd', labelMd: 'Тип для необязательных параметров' },
      ],
      correctOptionIds: ['b'],
      points: 10,
      explainMd:
        '`never` — тип значений, которые никогда не существуют. Функция с возвращаемым типом `never` либо бросает исключение, либо уходит в бесконечный цикл. Отличие от `void`: `void` означает «возвращает `undefined`», `never` — «не возвращает вообще».',
    },
    {
      id: 'ts-q6',
      promptMd:
        'Какие утверждения про `interface` и `type` верны?',
      mode: 'multi',
      options: [
        { id: 'a', labelMd: '`interface` поддерживает declaration merging (слияние объявлений)' },
        { id: 'b', labelMd: '`type` может описывать union и intersection типы' },
        { id: 'c', labelMd: '`interface` нельзя расширить через `extends`' },
        { id: 'd', labelMd: '`type` и `interface` полностью взаимозаменяемы в любом случае' },
      ],
      correctOptionIds: ['a', 'b'],
      points: 15,
      explainMd:
        'Declaration merging позволяет дважды объявить одноимённый `interface` — TypeScript сольёт их в один. `type` не поддерживает это. `type` гибче для union/intersection. Оба поддерживают `extends`. Они не взаимозаменяемы: `type` не участвует в merging, `interface` не может быть union.',
    },
  ],
};
