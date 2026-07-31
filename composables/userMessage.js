import { ref } from "vue";

import { notifications } from '@/composables/notifications.js';

import { api } from '@/composables/api.js';

import { useNotificationsStore } from '@/stores/notifications';

export function userMessage() {
    const { sendApiRequest } = api();
    const useNotifications = useNotificationsStore();
    const userMessagesModalRef = ref(null);
    const { error } = notifications();

    const getUserMessageCount = async () => {
        const response = await sendApiRequest('auth/message/getCount', 'GET');
        setUserNotificationMessageCount(response);
    }

    const showUserMessagesModal = (user = null) => {
        userMessagesModalRef.value.showModal(user);
    }

    const setUserNotificationMessageCount = (count) => {
        const sessionStorageName = 'messagesCount';

        const messagesCount = sessionStorage.getItem(sessionStorageName);
        useNotifications.currentUserMessagesCount = count;

        if (messagesCount === null) {
            sessionStorage.setItem(sessionStorageName, count);
        }

        if (count > 0 && messagesCount < count) {
            sessionStorage.setItem(sessionStorageName, count);

            let text = '';

            if (count === 1) {
                text = 'У вас одно не прочитанное сообщение';
            } else {
                text = 'У вас ' + count + ' не прочитанных сообщений';
            }

            const func = showUserMessagesModal;

            error(text, 60000, '#004d42', false, null, null, true, func);
        }
    }

    return {
        useNotifications,
        userMessagesModalRef,
        showUserMessagesModal,
        setUserNotificationMessageCount,
        getUserMessageCount,
    };
}
