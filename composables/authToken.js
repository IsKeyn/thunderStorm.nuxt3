import { computed } from "vue";
import { useUserStore } from '@/stores/user';
import { api } from '@/composables/api.js';
import { cryptoFunctions } from '@/composables/cryptoFunctions.js';

export function authToken() {
    const userStore = useUserStore();
    const { sendApiRequest } = api();
    const { encrypt, decrypt } = cryptoFunctions();

    const runtimeConfig = useRuntimeConfig();

    const isAuth = computed(() => {
        return userStore.user && Object.keys(userStore.user).length > 0;
    });

    const getSanctumToken = async () => {
        if (!isAuth) return;

        // Проверям наличие в store
        if (
            Object.keys(userStore.token).length
            && userStore.token.token
            && userStore.token.expires_at
            && Date.now() < Date.parse(userStore.token.expires_at) - 60000
        ) {
            if (!sessionStorage.getItem('sanctumToken')) {
                saveTokenToSession(userStore.token.token);
            }

            return userStore.token.token;
        }

        // Проверяем наличие в сесии
        const sanctumTokenInSessionStorage = sessionStorage.getItem('sanctumToken');

        // Если есть токен в сесии, проверяем его не беке, не истек ли он
        if (sanctumTokenInSessionStorage) {
            const parsedToken = JSON.parse(sanctumTokenInSessionStorage);
            const decrypted = await decrypt(parsedToken, runtimeConfig.public.cryptoPass);

            const checkResult = await checkToken(decrypted);

            if (checkResult?.valid) {
                saveTokenToStorage({
                    token: decrypted,
                    expires_at: checkResult?.expires_at,
                });

                return {
                    token: decrypted,
                };
            }
        }

        // Проверяем не истек ли токен
        return getToken('web-socket-token');
    }

    const checkToken = async (token) => {
        return await sendApiRequest(
            'auth/verify-token',
            'POST',
            { token },
            'verifyToken',
            '',
            'fetch',
            false,
            false,
            null,
            false
        );
    }

    const getToken = async (name) => {
        const token = await sendApiRequest(
            'auth/get-sanctum-token',
            'POST',
            { name },
            getSanctumToken
        );

        if (token?.token) {
            saveTokenToSession(token.token);
            saveTokenToStorage(token);
        }

        return token;
    }

    const saveTokenToSession = async (token) => {
        const encryptedToken = await encrypt(token, runtimeConfig.public.cryptoPass);
        sessionStorage.setItem('sanctumToken', JSON.stringify(encryptedToken));
    }

    const saveTokenToStorage = (tokenData) => {
        userStore.token = tokenData;
    }

    return {
        getSanctumToken,
        checkToken,
    }
}
