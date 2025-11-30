export function browserDetector() {
    const isTelegramBrowser = () => {
        if (typeof window === 'undefined') return false;

        const userAgent = navigator.userAgent.toLowerCase();
        const isTelegramWebApp = userAgent.includes('telegram') || userAgent.includes('webview');

        // Дополнительная проверка через Telegram Web App API
        const isTelegramEnv = typeof window.Telegram !== 'undefined' && typeof window.Telegram.WebApp !== 'undefined';

        return isTelegramWebApp || isTelegramEnv;
    }

    return {
        isTelegramBrowser,
    };
}
