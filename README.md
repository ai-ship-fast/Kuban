# Kuban Gallery

Статическая веб-галерея для GitHub Pages.

## Как добавить фотографии

1. Положи изображения в `assets/photos/`.
2. Добавь записи в `assets/gallery-data.js`:

```js
{
  src: "assets/photos/photo-name.jpg",
  title: "Название фотографии",
  alt: "Описание для доступности",
  location: "Краснодарский край",
  date: "2026",
  tags: ["природа", "город"]
}
```

3. Открой `index.html` или опубликуй репозиторий через GitHub Pages.

## GitHub Pages

В репозитории на GitHub открой `Settings -> Pages`, выбери `Deploy from a branch`, затем ветку `main` и папку `/root`.

## Локальный просмотр

Страница работает без сборки. Можно открыть `index.html` напрямую в браузере.
