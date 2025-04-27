export function media() {
    const getResizeImg = (image, size) => {
        if (!image) {
            image = 300;
        }

        if (image.resized && Object.keys(image.resized).length > 0) {
            const key = size ? `r_${size}` : Object.keys(image.resized)[0];

            return image.resized[key];
        } else {
            return image.webp ? image.webp : image.src;
        }
    }

    return { getResizeImg };
}
