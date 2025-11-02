import { userFunctions } from '@/composables/userFunctions.js';

export function players() {
    const { userStore } = userFunctions();

    const getPlayersForItem = (target, players) => {
        if (players) {
            if (target === 'other' || target === 'fromTo') {
                return players.filter((item) => item.user_id !== userStore.user.id);
            }

            if (target === 'nearestPlayer') {
                const currentPlayerPosition = players.filter((item) => item.user_id === userStore.user.id)[0].position;

                const otherPlayersPositions = [];

                players.filter((item) => item.user_id !== userStore.user.id).forEach((item) => {
                    otherPlayersPositions[item.user_id] = item.position;
                });

                /* Сравнение позиций */
                let minDiff = Infinity;
                const closestIndexes = [];

                otherPlayersPositions.forEach((num, index) => {
                    const diff = Math.abs(num - currentPlayerPosition);

                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIndexes.length = 0; // Очищаем массив, если нашли новый минимум
                        closestIndexes.push(index);
                    } else if (diff === minDiff) {
                        closestIndexes.push(index); // Добавляем, если разница такая же
                    }
                });

                return players.filter((item) => closestIndexes.includes(item.user_id));
            }

            if (target.includes('noFurther')) {
                const maxDistance = Number(target.split('_')[1]);

                const currentPlayerPosition = Number(players.filter((item) => item.user_id === userStore.user.id)[0].position);

                return players.filter((item) => {
                    if (item.position > currentPlayerPosition && item.position - currentPlayerPosition <= maxDistance) {
                        return true;
                    }

                    if (item.position < currentPlayerPosition && currentPlayerPosition - item.position <= maxDistance) {
                        return true;
                    }
                });
            }
        }
    }

    return {
        getPlayersForItem,
    };
}
