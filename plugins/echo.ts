import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { authToken } from '@/composables/authToken.js';

export default defineNuxtPlugin(async (nuxtApp) => {
    // Инициализируем только на клиенте
    if (!import.meta.client) return;

    const config = useRuntimeConfig();
    const { getSanctumToken } = authToken();

    // Получаем токен для первоначальной настройки (если нужно)
    // Важно: для private каналов Echo сам будет делать запросы на authEndpoint,
    // поэтому нам нужно настроить заголовки через авторизационный коллбэк
    const initEcho = async (type: 'public' | 'private' = 'private') => {
        if (import.meta.client) window.Pusher = Pusher;

        const echoConfig: any = {
            broadcaster: 'reverb',
            key: config.public.reverbKey,
            wsHost: config.public.reverbHost,
            wsPort: config.public.reverbPort ?? 8080,
            wssPort: config.public.reverbPort ?? 443,
            forceTLS: config.public.reverbScheme === 'https',
            enabledTransports: ['ws', 'wss'],
        };

        // Настройка авторизации для приватных каналов
        if (type === 'private') {
            echoConfig.authorizer = (channel: any, options: any) => {
                return {
                    authorize: (socketId: any, callback: any) => {
                        getSanctumToken().then(({ token }) => {
                            fetch(`${config.public.apiUrl}/broadcasting/auth`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    socket_id: socketId,
                                    channel_name: channel.name
                                })
                            })
                                .then(response => response.json())
                                .then(data => callback(false, data))
                                .catch(error => callback(true, error));
                        });
                    }
                };
            };
        }

        const echoInstance = new Echo(echoConfig);

        echoInstance.connector.pusher.connection.bind('connected', () => {
            console.log('🔗 Echo connected');
        });

        echoInstance.connector.pusher.connection.bind('error', (err: any) => {
            console.error('⚡ Echo error:', err);
        });

        return echoInstance;
    };

    // Создаем инстанс (лениво или сразу)
    // Для простоты создаем один инстанс, который умеет работать и с public и с private
    const echo = await initEcho('private');

    // Предоставляем глобальный доступ
    return {
        provide: {
            echo: echo
        }
    };
});
