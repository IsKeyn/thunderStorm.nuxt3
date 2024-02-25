<script setup>
const emit = defineEmits(['sendForm']);

const props = defineProps({
	buttonName: {
		type: String,
		default: '',
	},
	requestInProgress: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<button
			@click="emit('sendForm')"
			:disabled="requestInProgress"
			class="min-w-24"
	>
		<template v-if="!requestInProgress">
			{{ buttonName }}
		</template>
		<font-awesome-icon
				v-else
				:icon="['fas', 'spinner']"
				spin-pulse
		/>
	</button>
</template>
