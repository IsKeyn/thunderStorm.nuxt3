import { userFunctions } from '@/composables/userFunctions.js';

export function bgPlayer() {
    const { userStore } = userFunctions();

    const player = computed(() => {
        if (!userStore.player) return null;
        return userStore.player;
    });

    const isActivePlayer = () => {
        if (!userStore.player) return false;
        if (!userStore.player.active) return false;

        return true;
    };

    const avatarBorder = (player) => {
        if (!player) {
            return;
        }

        return player?.premium && player?.settings?.avatarBorder ? player.settings.avatarBorder : '';
    }

    return {
        player,
        isActivePlayer,
        avatarBorder,
    };
}
