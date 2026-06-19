export function bgGames() {
    const getLongPlayLink = (game) => {
        const queryParts = [game.game?.name];

        if (game.platform) {
            queryParts.push(game.platform.name);
        }

        queryParts.push('longplay');

        const searchQuery = queryParts.filter(Boolean).join(' ');

        return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(searchQuery);
    }

    const getStatusName = (status) => {
        switch (status) {
            case 0: return 'Текущая';
            case 1: return 'Рерольнута';
            case 2: return 'Пройдена';
            case 3: return 'Отдана';
            case 4: return 'В очереди';
        }
    }

    const getStatusClass = (status, theme) => {
        if (theme === 'CurrentGame') return;

        switch (status) {
            case 0: return 'violet';
            case 1: return 'red';
            case 2: return 'green';
            case 3: return 'blue';
            case 4: return 'yellow';
        }
    }

    const getDifficultName = (difficult) => {
        if (Number(difficult) === 0) {
            return 'Никакая';
        } else if (Number(difficult) <= 30) {
            return 'Легкая';
        } else if (Number(difficult) <= 45) {
            return 'Нормальная';
        } else if (Number(difficult) <= 65) {
            return 'Повышенная'
        } else if (Number(difficult) <= 80) {
            return 'Сложная';
        } else if (Number(difficult) <= 100) {
            return 'Очень сложная';
        }
    }

    return {
        getLongPlayLink,
        getStatusName,
        getStatusClass,
        getDifficultName,
    };
}
