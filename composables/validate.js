import { math } from '@/composables/math.js'
const { mbToByte } = math();

export function validate() {
    const lang = 'ru';
    const errorMessages = {
        ru: {
            required: 'Поле "{fieldName}" обязательно для заполнения',
            email: 'Ваш email адрес не корректен, проверьте правильность ввода',
        },
    };

    const validateElement = (value, rules) => {
        const arRules = rules.replaceAll(' ', '').split(',');
        let error = null;

        for (let item of arRules) {
            if (error) {
                break;
            }

            if (item === 'required') {
                if (!validateRequired(value)) {
                    error = errorMessages[lang].required;
                }
            }

            if (item === 'email') {
                if (!validateEmail(value)) {
                    error = errorMessages[lang].email;
                }
            }

            if (item === 'phone') {

            }

            const sizeRegex = /size_[0-9]{1,6}/i;
            if (sizeRegex.test(item)) { // example size_10
                const errors = [];
                const mbCount = Number(item.split('_')[1]);

                for (var i = 0; i < value.length; i++) {
                    let file = value[i];
                    if (!validateSize(file.size, mbToByte(mbCount))) {
                        // TODO текст ошибки в errorMessages и замена переменных
                        errors.push(`Вы не можете выбрать файлы больше ${mbCount} мб, файл "${file.name}" больше ${mbCount} мб.`);
                    }
                }

                error = errors.join(', ');
            }

            const mimeRegex = /mime_[0-9]{1,6}/i;
            if (mimeRegex.test(item)) { // example mime_1
                const errors = [];
                const mimeCollectionNumber = item.split('_')[1];
                const mimes = {
                    1: {
                        arSupported: [
                            'video/webm',
                            'image/gif',
                            'image/jpeg',
                            'image/pjpeg',
                            'image/png',
                            'image/tiff',
                            'image/vnd.microsoft.icon',
                            'image/vnd.wap.wbmp',
                            'image/webp',
                        ],
                        list: 'webm, gif, jpeg, png, tiff, bmp',
                    },
                    2: {},
                };

                for (var i = 0; i < value.length; i++) {
                    let file = value[i];
                    if (!validateMime(file.type, mimes[mimeCollectionNumber].arSupported)) {
                        // TODO текст ошибки в errorMessages и замена переменных
                        errors.push(`Вы не можете выбрать файл данного расширения, доступные типы файлов для загрузки: ${ mimes[mimeCollectionNumber].list}`);
                    }
                }

                error = errors.join(', ');
            }
        }

        return error;
    }

    const validateRequired = (value) => {
        return !!value;
    }

    const validateEmail = (value) => {
        const emailCheck = /^[a-z_0-9\-\.]+@[a-z_0-9\-\.]+\.[a-z]{2,6}$/i;
        return emailCheck.test(value);
    }

    const validateNumber = (value) => {

    }

    const validateSize = (size, maxFileSize) => {
        return size < maxFileSize;
    }

    const validateMime = (fileType, supportedMimes) => {
        return supportedMimes.includes(fileType);
    }

    return { validateElement };
}
