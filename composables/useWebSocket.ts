import { onUnmounted } from 'vue';

interface Subscription {
    channel: any;
    event: string;
    handler: (payload: any) => void;
    unsubscribe: () => void;
    id: string; // 🔥 уникальный идентификатор
}

export function useWebSocket() {
    const { $echo } = useNuxtApp();
    // channelName -> Map<subscriptionId, Subscription>
    const activeChannels = new Map<string, Map<string, Subscription>>();
    let nextId = 0;

    const generateId = () => `sub_${++nextId}_${Date.now()}`;

    const subscribe = (
        channelName: string,
        event: string,
        handler: (payload: any) => void,
        type: 'private' | 'public' | 'encrypted' | 'presence' = 'private'
    ) => {
        if (!import.meta.client) return;

        let channel = activeChannels.get(channelName)?.values().next().value?.channel;

        if (!channel) {
            switch (type) {
                case 'presence': channel = $echo.join(channelName); break;
                case 'encrypted': channel = $echo.encryptedPrivate(channelName); break;
                case 'private': channel = $echo.private(channelName); break;
                default: channel = $echo.channel(channelName); break;
            }
            activeChannels.set(channelName, new Map());
        }

        const unsubFn = () => channel.stopListening(event, handler);
        channel.listen(event, handler);

        const subscriptionId = generateId();
        const subscription: Subscription = {
            channel,
            event,
            handler,
            unsubscribe: unsubFn,
            id: subscriptionId
        };

        activeChannels.get(channelName)!.set(subscriptionId, subscription);
        console.log(`✅ Subscribed: ${channelName} — ${event} [${subscriptionId}]`);

        // 🔥 Возвращаем ID для удобной отписки
        return {
            unsubscribe: () => unsubscribeById(subscriptionId),
            subscriptionId,
            channel
        };
    };

    const unsubscribeById = (subscriptionId: string) => {
        for (const [channelName, subs] of activeChannels.entries()) {
            const sub = subs.get(subscriptionId);
            if (sub) {
                sub.unsubscribe();
                console.log(`❌ Unsubscribed: ${channelName} — ${sub.event} [${subscriptionId}]`);

                subs.delete(subscriptionId);

                // Если подписок на канал не осталось — закрываем его
                if (subs.size === 0) {
                    $echo.leaveChannel(channelName);
                    activeChannels.delete(channelName);
                    console.log(`🚪 Channel closed: ${channelName}`);
                }
                return true;
            }
        }
        console.warn(`⚠️ Subscription not found: ${subscriptionId}`);
        return false;
    };

    const unsubscribeFromChannel = (channelName: string) => {
        const subs = activeChannels.get(channelName);

        if (!subs) return;

        for (const [id, sub] of subs.entries()) {
            sub.unsubscribe();
            console.log(`❌ Unsubscribed: ${channelName} — ${sub.event} [${id}]`);
        }

        $echo.leaveChannel(channelName);
        activeChannels.delete(channelName);
        console.log(`🚪 Channel closed: ${channelName}`);
    };

    onUnmounted(() => {
        for (const channelName of activeChannels.keys()) {
            unsubscribeFromChannel(channelName);
        }
    });

    return {
        subscribe,
        unsubscribe: unsubscribeById, // отписка по ID
        unsubscribeAll: unsubscribeFromChannel,
        echo: $echo
    };
}
