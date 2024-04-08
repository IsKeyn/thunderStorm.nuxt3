<script setup>
const emit = defineEmits(['startAction']);

const props = defineProps({
	buttonName: {
		type: String,
		default: '',
	},
	actionInProgress: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<button
			@click="emit('startAction')"
			:disabled="actionInProgress"
			class="min-w-24"
	>
		<template v-if="!actionInProgress">
			{{ buttonName }}
		</template>
		<font-awesome-icon
				v-else
				:icon="['fas', 'spinner']"
				spin-pulse
		/>
	</button>
</template>
