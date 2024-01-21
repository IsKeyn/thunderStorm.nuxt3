import { useNotificationsStore } from '@/stores/notifications';
import { api } from '@/composables/api.js';
import { date } from '@/composables/date.js';

const { apiUrl } = api();
const { getFormattedDate } = date();


export function notifications() {
    const useNotifications = useNotificationsStore();

    const alert = (message, time = null, color = null) => {
        if (message) {
            const params = {
                type: 'alert',
                message,
                time: time ? time : 3000,
                color: color,
            };

            useNotifications.addNotification(params);
        }
    };

    const error = async(message, time = null, color = null, saveError = false, from = null) => {
        if (message) {
            const currentTime = getFormattedDate('d.m.Y H:i:s');
            const params = {
                type: 'error',
                message,
                time,
                color: color,
                currentTime,
            };

            if (saveError) {
                const response = await $fetch(
                    `${apiUrl.value}error/set`,
                    {
                        method: 'POST',
                        body: {
                            message,
                            from
                        }
                    },
                );

                params.saveErrorResult = !!response.data;
            }

            console.log('THUNDER ERROR!', message);
            useNotifications.addNotification(params);
        }
    };

    return { alert, error };
}
