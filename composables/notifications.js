import { useNotificationsStore } from '@/stores/notifications';
import { api } from '@/composables/api.js';
import { date } from '@/composables/date.js';

const { apiUrl } = api();
const { getFormattedDate } = date();

export function notifications() {
    const useNotifications = useNotificationsStore();

    const alert = (
        message,
        time = null,
        color = null,
        func = null,
        sound = false,          // Воспроизводить или нет звук уведомления
        onClickFunc = null,        // Фнукция, которая срабатывает при нажатии на
    ) => {
        if (message) {
            const params = {
                type: 'alert',
                message,
                time: time ? time : 3000,
                color: color,
                func,
                sound,
                onClickFunc,
            };

            useNotifications.addNotification(params);
        }
    };

    const error = async(
        message,                        // Сообщение
        time = null,               // Время отображения сообщения
        color = null,              // Цвет блока отображения
        saveError = false,      // Сохранить сообщение в лог ошибок
        from = null,               // Источник сообщения
        func = null,               // Функция, выполняемая вместе с
        sound = false,          // Воспроизводить или нет звук уведомления
        onClickFunc = null,        // Фнукция, которая срабатывает при нажатии на
    ) => {
        if (message) {
            const currentTime = getFormattedDate('d.m.Y H:i:s');
            const params = {
                type: 'error',
                message,
                time,
                color: color,
                currentTime,
                func,
                sound,
                onClickFunc,
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

    const choiceAlert = (choiceAlertParams) => {
        if (choiceAlertParams) {
            const params = {
                type: 'choiceAlert',
                card: choiceAlertParams.card ? choiceAlertParams.card : 'ChoiceAlertCard1',
                title: choiceAlertParams.title,
                message: choiceAlertParams.message,
                buttons: choiceAlertParams.buttons,
            };

            useNotifications.addNotification(params);
        }
    }

    return {
        alert,
        error,
        choiceAlert
    };
}
