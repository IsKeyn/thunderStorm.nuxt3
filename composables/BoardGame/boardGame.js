import { date } from '@/composables/date.js';
const { getFormattedDate } = date();
import { helper } from '@/composables/helper.js'
import { useBoardGameStore } from '@/stores/boardGame';

export function boardGame() {
    const { route } = helper();
    const boardGameStore = useBoardGameStore();

    const getStatusName = (boardGameData) => {
        switch (boardGameData.status) {
            case 0: return 'Окончено';
            case 1: return 'Проводится';
            case 2: return 'Скоро начнется';
        }
    }

    const getDateString = (boardGameData) => {
        let returnData = '';

        if (boardGameData.started_at || boardGameData.ended_at) {
            returnData += '(';
        }

        if (boardGameData.started_at) {
            returnData += getFormattedDate('d ru_mouths_name Y', boardGameData.started_at);
        }

        if (boardGameData.started_at && boardGameData.ended_at) {
            returnData += ' - ';
        }

        if (boardGameData.ended_at) {
            returnData += getFormattedDate('d ru_mouths_name Y', boardGameData.ended_at);
        }

        if (boardGameData.started_at || boardGameData.ended_at) {
            returnData += ')';
        }

        return returnData;
    }

    const addTextToPoints = (points) => {
        const cases = ['очко', 'очка', 'очков'];
        const remainder10 = points % 10;
        const remainder100 = points % 100;

        if (remainder10 === 1 && remainder100 !== 11) {
            return points + ' ' + cases[0];
        } else if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 10 || remainder100 >= 20)) {
            return points + ' ' + cases[1];
        } else {
            return points + ' ' + cases[2];
        }
    }

    const refreshLayoutData = () => {
        const requestName = 'get_bg_layout_data_' + route.params.slug;
        refreshNuxtData(requestName);
    }

    const getSettingValue = (settingName) => {
        if (!settingName) return null;

        const settings = boardGameStore?.boardGameInfo?.settings;

        // Проверяем, что settings существует и является именно массивом
        if (!Array.isArray(settings)) return null;

        const setting = settings.find((item) => item.code === settingName);

        return setting?.value ?? null;
    }

    return {
        boardGameStore,
        getStatusName,
        getDateString,
        addTextToPoints,
        refreshLayoutData,
        getSettingValue,
    };
}
