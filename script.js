const canvas = document.getElementById('canvas'); const fileInput = document.getElementById('imageInput'); const asciiImage = document.getElementById('asciiOutput');

const context = canvas.getContext('2d');

const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

const getFontRatio = () => { const pre = document.createElement('pre'); pre.style.display = 'inline'; pre.textContent = ' '; document.body.appendChild(pre); const { width, height } = pre.getBoundingClientRect(); document.body.removeChild(pre); return height / width; };

const fontRatio = getFontRatio();

const convertToGrayScales = (context, width, height) => { const imageData = context.getImageData(0, 0, width, height); const grayScales = [];

for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const grayScale = toGrayScale(r, g, b);
    imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = grayScale;
    grayScales.push(grayScale);
}

context.putImageData(imageData, 0, 0);
return grayScales;

};

const MAXIMUM_WIDTH = 100; const MAXIMUM_HEIGHT = 60;

const clampDimensions = (width, height) => { const rectifiedWidth = Math.floor(getFontRatio() * width);

if (height > MAXIMUM_HEIGHT) {
    const reducedWidth = Math.floor(rectifiedWidth * MAXIMUM_HEIGHT / height);
    return [reducedWidth, MAXIMUM_HEIGHT];
}

if (width > MAXIMUM_WIDTH) {
    const reducedHeight = Math.floor(height * MAXIMUM_WIDTH / rectifiedWidth);
    return [MAXIMUM_WIDTH, reducedHeight];
}

return [rectifiedWidth, height];

};

fileInput.onchange = (e) => { const file = e.target.files[0]; if (!file) return;

const reader = new FileReader();
reader.onload = (event) => {
    const image = new Image();
    image.onload = () => {
        const [width, height] = clampDimensions(image.width, image.height);

        canvas.width = width;
        canvas.height = height;

        context.drawImage(image, 0, 0, width, height);
        const grayScales = convertToGrayScales(context, width, height);

        drawAscii(grayScales, width);
    };
    image.src = event.target.result;
};
reader.readAsDataURL(file);

};

const grayRamp = '@#%*=+:-. '; const rampLength = grayRamp.length;

const getCharacterForGrayScale = grayScale => grayRamp[Math.floor((grayScale / 255) * (rampLength - 1))];

const drawAscii = (grayScales, width) => { const ascii = grayScales.reduce((asciiImage, grayScale, index) => { let nextChars = getCharacterForGrayScale(grayScale); if ((index + 1) % width === 0) { nextChars += '\n'; } return asciiImage + nextChars; }, '');

asciiImage.textContent = ascii;
const copyButton = document.getElementById('copyButton');

copyButton.addEventListener('click', () => {
    const asciiText = asciiImage.textContent;

    navigator.clipboard.writeText(asciiText).then(() => {
        copyButton.textContent = 'Đã sao chép!';
        setTimeout(() => copyButton.textContent = 'Sao chép', 2000);
    }).catch(err => {
        console.error('Lỗi khi sao chép:', err);
        copyButton.textContent = 'Lỗi sao chép';
    });
});
};

