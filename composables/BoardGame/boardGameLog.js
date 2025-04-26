import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

export function boardGameLog() {
    const setLog = async (body) => {
        try {
            return await sendApiRequest('board-game/log/add', 'POST', body);
        } catch (e) {
            error(e);
        }
    }

    return { setLog };
}
