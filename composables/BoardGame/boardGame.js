import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

export function boardGame() {
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

    return {
        getStatusName,
        getDateString,
    };
}
