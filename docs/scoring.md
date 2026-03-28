# Скоринг

## Single-select
Полные `points` при совпадении 1-в-1, иначе `0`.

## Multi-select (частичные баллы, без штрафа за лишние ответы)

```
correctSelected = кол-во выбранных вариантов из correctOptionIds
correctTotal    = correctOptionIds.length
questionScore   = points * (correctSelected / correctTotal)
```
