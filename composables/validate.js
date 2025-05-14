import { math } from '@/composables/math.js'
const { mbToByte } = math();

export function validate() {
    const lang = 'ru';
    const errorMessages = {
        ru: {
            required: 'Поле "{fieldName}" обязательно для заполнения',
            email: 'Ваш email адрес не корректен, проверьте правильность ввода',
            isInteger: 'Число должно быть целым числом'
        },
    };

    const validateForm = (form, validateType = 'singError') => {

        /*
         * validateType:string
         * singError - при нахождении ошибки в форме возвращается ошибка
         */

        let currentElValidateResult,
            validateResult,
            status = true;

        const rawData = toRaw(form)._rawValue ? toRaw(form)._rawValue : toRaw(form);
        for (var key in rawData) {
            currentElValidateResult = validateElement(rawData[key].value, rawData[key].validateRules, rawData);

            if (validateType === 'singError') {
                if (typeof currentElValidateResult === 'string')
                    return {
                        status: false,
                        key,
                        validateResult: currentElValidateResult.replaceAll('{fieldName}', rawData[key].name)
                    };
            } else if (validateType === 'allError') {
                if (typeof currentElValidateResult === 'string') {
                    validateResult[key].validateResult = currentElValidateResult.replaceAll('{fieldName}', rawData[key].name);
                }
            }
        }

        return { status, validateResult };
    }

    const validateElement = (value, rules, allElements = {}) => {
        if (rules) {
            const arRules = rules.replaceAll(' ', '').split(',');
            let error = null;

            for (let item of arRules) {
                if (error) {
                    break;
                }

                // Стандартные правила валидации
                if (item === 'required') {
                    if (!validateRequired(value)) {
                        error = errorMessages[lang].required;
                    }
                }

                // Валидация особых полей
                if (item === 'email') {
                    if (!validateEmail(value)) {
                        error = errorMessages[lang].email;
                    }
                }

                if (item === 'phone') {

                }

                // Валидация цифр
                if (item === 'integer') {
                    if (!Number.isInteger(Number(value))) {
                        error = errorMessages[lang].isInteger;
                    }
                }

                const minNumberRegex = /minNumber_[0-9]{1,6}/i;
                if (minNumberRegex.test(item)) { // example minNumber_0
                    const minNumber = Number(item.split('_')[1]);

                    if (value < minNumber) {
                        error = `Значение не может быть меньше ${minNumber}`;
                    }
                }


                const maxNumberRegex = /maxNumber_[0-9]{1,6}/i;
                if (maxNumberRegex.test(item)) { // example maxNumber_60
                    const maxNumber = Number(item.split('_')[1]);

                    if (value > maxNumber) {
                        error = `Значение не может быть больше ${maxNumber}`;
                    }
                }

                // Валидация строк
                const minLengthRegex = /minLength_[0-9]{1,6}/i;
                if (minLengthRegex.test(item)) { // example minLength_10
                    const minLength = Number(item.split('_')[1]);

                    if (value.length < minLength) {
                        error = `Длина строки должна быть не меньше ${minLength} символов`;
                    }
                }

                const maxLengthRegex = /maxLength_[0-9]{1,6}/i;
                if (maxLengthRegex.test(item)) { // example minLength_10
                    const maxLength = Number(item.split('_')[1]);

                    if (value.length > maxLength) {
                        error = `Длина строки должна быть не больше ${maxLength} символов`;
                    }
                }


                // Валидация файлов
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

                    if (errors.length > 0) {
                        error = errors.join(', ');
                    }
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
                            errors.push(`Вы не можете выбрать файл данного расширения, доступные типы файлов для загрузки: ${mimes[mimeCollectionNumber].list}`);
                        }
                    }

                    if (errors.length > 0) {
                        error = errors.join(', ');
                    }
                }

                // Правило валидации, при котором для поля должны быть равны
                const sameFieldsRegex = /sameFields_[a-z0-9]{1,50}/i;
                if (sameFieldsRegex.test(item)) {
                    const fieldForCompare = item.split('_')[1];

                    if (fieldForCompare && Object.keys(allElements).length > 0) {
                        if (!allElements[fieldForCompare]) {
                            error = 'Отсутсвтует поле для сравнения';
                        } else {
                            if (value !== allElements[fieldForCompare].value) {
                                error = `Поле "{fieldName}" должно соотвествовать полю "${allElements[fieldForCompare].name}"`;
                            }
                        }
                    }
                }

                // Правило валидации, при котором два поля не должны быть равны
                const isNotSameFieldsRegex = /isNotSameFields_[a-z0-9]{1,50}/i;
                if (isNotSameFieldsRegex.test(item)) {

                    console.log('isNotSameFieldsRegex');
                }
            }

            return error;
        }
    }

    const validateRequired = (value) => {
        return value !== null && value !== false && value !== undefined && value !== '';
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

    return { validateForm, validateElement };
}
