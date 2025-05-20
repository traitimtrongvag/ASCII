document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      // Tính toán kích thước mới để giữ tỷ lệ và giảm kích thước ảnh
      const maxWidth = 100;
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let ascii = '';
      const chars = '@%#*+=-:. '; // Dãy ký tự từ đậm đến nhạt

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const brightness = (r + g + b) / 3;
          const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
          ascii += chars[charIndex];
        }
        ascii += '\n';
      }
      document.getElementById('asciiOutput').textContent = ascii;
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});