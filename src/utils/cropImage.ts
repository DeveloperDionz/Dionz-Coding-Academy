// src/utils/cropImage.ts
export const getCroppedImg = async (imageSrc: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const size = Math.min(image.width, image.height);
      const startX = (image.width - size) / 2;
      const startY = (image.height - size) / 2;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No 2D context found');

      canvas.width = size;
      canvas.height = size;

      // Circle crop path
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(image, startX, startY, size, size, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) return reject('Canvas is empty');
        resolve(blob);
      }, 'image/png');
    };

    image.onerror = (err) => reject(err);
  });
};
