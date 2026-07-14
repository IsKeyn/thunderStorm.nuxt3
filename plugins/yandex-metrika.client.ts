import { userFunctions } from '@/composables/userFunctions.js';
import { useYandexMetrika } from '@/composables/Analytics/useYandexMetrika';


export default defineNuxtPlugin(() => {
    const { init: initMetrika } = useYandexMetrika();
    const cookieConsent = useCookie('user-use-cookie-lvl');
    const { isAuth } = userFunctions();

    // Если пользователь УЖЕ давал согласие ранее, инициализируем сразу
    if (cookieConsent.value === 1 || isAuth.value) {
        const { init } = useYandexMetrika();
        init();
    }
});
