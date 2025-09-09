import { useUserStore } from '@/stores/user';
import { notifications } from '@/composables/notifications.js';
import { api } from '@/composables/api.js'

export function userFunctions() {
    const userStore = useUserStore();
    const { choiceAlert } = notifications();
    const { sendApiRequest, errorHandler } = api();

    const isAuth = computed(() => {
        return userStore.user && Object.keys(userStore.user).length > 0;
    });

    const logout = () => {
        choiceAlert(
            {
                title: 'Выход',
                message: 'Вы уверены, что хотите разлогиниться?',
                buttons: [
                    {
                        name: 'Да',
                        func: () => {
                            sendLogoutRequest();
                        },
                        additionalKeywordFunc: 'close',
                    },
                    {
                        name: 'Нет',
                        additionalKeywordFunc: 'close',
                    },
                ],
            }
        );
    }

    const requestInProgress = ref(false);
    const responseErrors = ref({});

    const sendLogoutRequest = async () => {
        requestInProgress.value = true;

        try {
            const response = await sendApiRequest('auth/logout', 'GET', {});

            if (response) {
                userStore.user = {};

                requestInProgress.value = false;
            }
        } catch (e) {
            const errorsPromise = errorHandler(e);

            errorsPromise.then((element) => {
                responseErrors.value = element;
            });
            requestInProgress.value = false;
        }
    }

    return {
        sendLogoutRequest,
        isAuth,
        logout,
    };
}
