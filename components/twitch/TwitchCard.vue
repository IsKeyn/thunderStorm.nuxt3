<script setup>
import { onMounted } from "vue";

const props = defineProps({
	channel: {
		type: String,
		required: true,
	},
});

onMounted(() => {
	if (process.client && props.channel) {
		const players = document.querySelectorAll('.twitch-embed-' + props.channel);

		players.forEach((item) => {
			if (!item.querySelector('iframe')) {
				setTwitchPlayer(props.channel, item);
			}
		});
	}
});

const setTwitchPlayer = (channel, block) => {
	new Twitch.Player(block, {
		channel: channel,
		muted: true
	});
};

</script>

<template>
	<div :class="`twitch-embed-${channel} w-full`"></div>
</template>
