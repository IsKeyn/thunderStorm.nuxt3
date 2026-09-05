export function animate() {
    const scrollToElement = (target, offset = 150) => {
        let element = null;

        if (typeof target === 'string') {
            // 1. Пытаемся найти по ID (полная поддержка легаси-кода)
            element = document.getElementById(target);

            // 2. Если не нашли, пробуем найти как CSS-селектор (класс, id с #, data-атрибут и т.д.)
            if (!element) {
                try {
                    element = document.querySelector(target);
                } catch (e) {
                    // Если передана строка, которая не является валидным селектором,
                    // querySelector выбросит ошибку. Мы её перехватываем, чтобы не ломать приложение.
                    console.warn(`scrollToElement: невалидный селектор "${target}"`);
                }
            }
        } else if (target instanceof Element) {
            // 3. Бонус: поддержка передачи самого DOM-элемента (если он уже найден в коде)
            element = target;
        }

        if (element) {
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const scrollTo = absoluteElementTop - offset;

            window.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            });
        } else if (typeof target === 'string') {
            // Опциональное уведомление, если элемент вообще не найден
            console.warn(`scrollToElement: элемент не найден для target "${target}"`);
        }
    }

    return {
        scrollToElement,
    };
}
