export function animate() {
    const scrollToElement = (elementId, offset = 150) => {
        const element = document.getElementById(elementId)
        if (element) {
            const elementRect = element.getBoundingClientRect()
            const absoluteElementTop = elementRect.top + window.pageYOffset
            const scrollTo = absoluteElementTop - offset

            window.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            })
        }
    }

    return {
        scrollToElement,
    };
}
