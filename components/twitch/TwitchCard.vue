<script setup>
import { onMounted } from "vue";

const props = defineProps({
	channel: {
		type: String,
		required: true,
	},
});

const playerIsSet = ref(false);

onMounted(() => {
	console.log(1111);

	if (process.client && props.channel && !playerIsSet.value) {
		setTwitchPlayer(props.channel);
	}
});

const setTwitchPlayer = (channel) => {
	const script = document.createElement('script');
	script.src = 'https://player.twitch.tv/js/embed/v1.js';

	script.onload = () => {
		new Twitch.Player('twitch-embed-' + channel, {
			channel: channel,
			muted: true
		});
	};
	document.body.appendChild(script);
	playerIsSet.value = true;
};

</script>

<template>
	<div :id="`twitch-embed-${channel}`"></div>
</template>
