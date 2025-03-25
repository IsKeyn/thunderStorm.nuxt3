export function mobile() {
    const isMobile = ref(false);

    const onWindowResize = () => {
        isMobile.value = window.innerWidth <= 768;
    };

    return {
        isMobile,
        onWindowResize,
    };
}
