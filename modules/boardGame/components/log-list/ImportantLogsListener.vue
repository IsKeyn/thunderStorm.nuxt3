<script setup>
import { onMounted } from "vue";

const { subscribe, unsubscribe } = useWebSocket();
const runtimeConfig = useRuntimeConfig();

import { helper } from '@/composables/helper.js'
const { route, router, hasWebSocked } = helper();

import { notifications } from '@/composables/notifications.js';
const { error } = notifications();

onMounted(() => {
	if (!runtimeConfig.public.hasWebSockedServer) {
		return
	}

	let channelName = 'logs';

	channelName += `.${route.params.slug}`;

	const { unsubscribe: stop, subscriptionId } = subscribe(
			channelName,
			'BoardGame.ImportantLogs',
			(data) => {
				const text = (data.user.public_name ? data.user.public_name : data.user.name) + ': ' + data.message;
				error(text, 60000, '#004d42', false, null, null, false, () => { router.push({path: `/e/${route.params.slug}/log-list/`}); });
			},
			'public'
	);
});
</script>

<template>

</template>

<style lang="scss" scoped>

</style>
