import { api } from '@/composables/api.js';

export function boardGameLog() {
    const { sendApiRequest } = api();

    const setLog = async (body) => {
        try {
            return await sendApiRequest('board-game/log/add', 'POST', body);
        } catch (e) {
            error(e);
        }
    }

    return { setLog };
}
