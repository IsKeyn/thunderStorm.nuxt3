import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { onMounted, onUnmounted, markRaw } from 'vue';
import { authToken } from '@/composables/authToken.js';

// 🔥 ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ МОДУЛЯ (синглтоны)
// Они общие для всех вызовов useWebSocket в приложении
let globalPublicEcho = null;
let globalPrivateEcho = null;

export function useWebSocket(type = 'public') {
    const config = useRuntimeConfig();
    const { getSanctumToken } = authToken();

    // Локальный Map для отслеживания подписок конкретного экземпляра компосабла
    const activeChannels = new Map();

    const initEchoInstance = async () => {
        // Проверяем глобальные переменные
        if (type === 'public' && globalPublicEcho) return globalPublicEcho;
        if (type === 'private' && globalPrivateEcho) return globalPrivateEcho;

        if (import.meta.client) window.Pusher = Pusher;

        const echoConfig = {
            broadcaster: 'reverb',
            key: config.public.reverbKey,
            wsHost: config.public.reverbHost,
            wsPort: Number(config.public.reverbPort) ?? 8080,
            wssPort: Number(config.public.reverbPort) ?? 443,
            forceTLS: config.public.reverbScheme === 'https',
            enabledTransports: ['ws', 'wss'],
        };

        if (type === 'private') {
            const sanctumToken = await getSanctumToken();
            echoConfig.authEndpoint = `${config.public.apiUrl}/broadcasting/auth`;
            echoConfig.auth = {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${sanctumToken.token}`,
                },
            };
        }

        const echoInstance = new Echo(echoConfig);

        // Глобальные обработчики
        echoInstance.connector.pusher.connection.bind('connected', () => {
            console.log('🔗 WebSocket connected');
        });
        echoInstance.connector.pusher.connection.bind('error', (err) => {
            console.error('⚡ WebSocket error:', err);
        });

        // 🔥 Сохраняем в глобальную переменную
        const rawInstance = markRaw(echoInstance);
        if (type === 'public') {
            globalPublicEcho = rawInstance;
        } else {
            globalPrivateEcho = rawInstance;
        }

        return rawInstance;
    };

    const initEcho = async () => {
        if (type === 'public' && !globalPublicEcho) {
            globalPublicEcho = await initEchoInstance();
        }
        if (type === 'private' && !globalPrivateEcho) {
            globalPrivateEcho = await initEchoInstance();
        }
    };

    const subscribeToChannel = async (channelName, channelType = 'private', handler, eventName, events = []) => {
        if (!import.meta.client) return;

        // Проверка: если канал уже есть в активном списке этого экземпляра
        if (activeChannels.has(channelName)) {
            console.log(`♻️ Already subscribed to ${channelName}`);
            return;
        }

        await initEcho();

        // 🔥 Используем глобальные переменные для доступа к соединению
        const echo = type === 'public' ? globalPublicEcho : globalPrivateEcho;
        if (!echo) {
            console.error('Echo instance not initialized');
            return;
        }

        let channel;
        switch (channelType) {
            case 'presence':
                channel = echo.join(channelName);
                break;
            case 'encrypted':
                channel = echo.encryptedPrivate(channelName);
                break;
            case 'private':
            default:
                channel = echo.private(channelName);
                break;
        }

        if (handler) channel.listen(eventName, handler);
        if (Array.isArray(events)) {
            events.forEach(({ event, handler: h }) => {
                if (event && h) channel.listen(event, h);
            });
        }

        activeChannels.set(channelName, { instance: channel });
        console.log(`✅ Subscribed to ${channelType} channel: ${channelName}`);
        return channel;
    };

    const unsubscribeFromChannel = (channelName) => {
        if (!activeChannels.has(channelName)) return;

        const echo = type === 'public' ? globalPublicEcho : globalPrivateEcho;
        if (echo) {
            echo.leaveChannel(channelName);
            activeChannels.delete(channelName);
            console.log(`❌ Unsubscribed from ${channelName}`);
        }
    };

    const init = async (channelsConfig = []) => {
        if (!import.meta.client) return;
        await initEcho();
        if (Array.isArray(channelsConfig) && channelsConfig.length > 0) {
            for (const cfg of channelsConfig) {
                await subscribeToChannel(cfg.name, cfg.type || 'private', cfg.handler, cfg.eventName, cfg.events || []);
            }
        }
    };

    const stop = () => {
        if (!import.meta.client) return;

        // Отписка от каналов, отслеживаемых этим экземпляром
        for (const [name] of activeChannels) {
            const echo = type === 'public' ? globalPublicEcho : globalPrivateEcho;
            echo?.leaveChannel(name);
        }
        activeChannels.clear();

        // 🔥 ВАЖНО: Не делаем disconnect() и не обнуляем глобальные переменные,
        // если компонент уничтожен, но другие компоненты все еще используют WebSocket.
        // Отключать сокет нужно только при полном выходе из приложения (logout)
        // или используя отдельную функцию destroy().

        console.log(`🛑 Component stopped tracking channels for ${type}`);
    };

    onUnmounted(() => { stop(); });

    return {
        init,
        stop,
        subscribeToChannel,
        unsubscribeFromChannel
    };
}
