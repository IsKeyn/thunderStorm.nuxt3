export function lightBox() {
    const openedImage = ref(null);

    const setOpenedImage = (item = null) => {
        openedImage.value = item;
    }

    return {
        openedImage,
        setOpenedImage
    };
}
