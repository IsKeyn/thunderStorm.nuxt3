export function date() {
    const getFormattedDate = (format = 'd jp_mouths_name Y года', time = null) => {
        const currentTime = time ? new Date(time) : new Date();

        /*
         * Пояснение по входящему параметру format
         * d - день в формате 01, 02 ... 31
         * m - месяц в формате 01, 02 ... 31
         * Y - год в формате 2023
         *
         * ru_mouths_name - наименование месяца на русском языке в формате январь, февраль ... декабрь
         * jp_mouths_name - тоже самое но на японском
         */

        format = format.replace('ru_mouths_name', monthName(currentTime.getMonth(), 'ru'));
        format = format.replace('jp_mouths_name', monthName(currentTime.getMonth(), 'jp'));

        format = format.replace('d', twoDigits(currentTime.getDate()));
        format = format.replace('m', twoDigits(currentTime.getMonth() + 1));
        format = format.replace('Y', currentTime.getFullYear());
        format = format.replace('H', twoDigits(currentTime.getHours()));
        format = format.replace('i', twoDigits(currentTime.getMinutes()));
        format = format.replace('s', twoDigits(currentTime.getSeconds()));

        return format;
    };

    const monthName = (month, lang = 'ru', langCase = 'ro') => {

        /*
        * Русские падежи
        * im - именительный
        * ro - родительный
        */

        let months;

        switch(lang) {
            case 'ru':
                switch (langCase) {
                    case 'im':
                        months = [
                            'январь',
                            'февраль',
                            'март',
                            'апрель',
                            'май',
                            'июнь',
                            'июль',
                            'август',
                            'сентябрь',
                            'октябрь',
                            'ноябрь',
                            'декабрь'
                        ];
                        break;

                    case 'ro':
                        months = [
                            'января',
                            'февраля',
                            'марта',
                            'апреля',
                            'мая',
                            'июня',
                            'июля',
                            'августа',
                            'сентября',
                            'октября',
                            'ноября',
                            'декабря'
                        ];
                        break;
                }
                break;
            case 'jp':
                months = [
                    '一月',
                    '二月',
                    '三月',
                    '四月',
                    '五月',
                    '六月',
                    '七月',
                    '八月',
                    '九月',
                    '十月',
                    '十一月',
                    '十二月'
                ];
                break;
        }
        return months[month];
    };

    const weekDayName = (number, lang = 'ru') => {
        let weekDays;

        switch(lang) {
            case 'ru':
                weekDays = [
                    'пн',
                    'вт',
                    'ср',
                    'чт',
                    'пт',
                    'сб',
                    'вс',
                ];
                break;
        }
        return weekDays[number];
    };

    const twoDigits = (num) => {
        return ('0' + num).slice(-2);
    };

    return { getFormattedDate, monthName, weekDayName, twoDigits };
}
