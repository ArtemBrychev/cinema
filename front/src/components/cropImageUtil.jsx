/*
Функция getCroppedImg - утилита для обрезки изображения по заданным координатам.
Основной функционал:
- Создание обрезанной версии изображения
- Возвращение результата в виде Blob объекта

Аргументы:
- imageSrc - исходное изображение (URL или base64)
- crop - объект с параметрами обрезки {x, y, width, height}

Возвращает:
- Promise, который резолвится с Blob объектом обрезанного изображения
*/

export default function getCroppedImg(imageSrc, crop) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    };
  });
}