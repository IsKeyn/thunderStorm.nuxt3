import { useUserStore } from '@/stores/user';

export function userFunctions() {
    const userStore = useUserStore();

    const isAuth = computed(() => {
        return userStore.user && Object.keys(userStore.user).length > 0;
    });

    return {
        isAuth,
    };
}
