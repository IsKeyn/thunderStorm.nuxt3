<script setup>
const emit = defineEmits(['startAction']);

const props = defineProps({
	buttonName: {
		type: String,
		default: '',
	},
	buttonClasses: {
		type: String,
		default: 'btn btn-simple min-w-24',
	},
	actionInProgress: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<button
			@click="emit('startAction')"
			:disabled="actionInProgress || disabled"
			:class="[buttonClasses]"
	>
		<template v-if="!actionInProgress">
			<slot />
			{{ buttonName }}
		</template>
		<font-awesome-icon
				v-else
				:icon="['fas', 'spinner']"
				spin-pulse
		/>
	</button>
</template>

<style lang="scss" scoped>
.accept {
	@apply border-l-4 border-[var(--accept-color)];
}

.denied {
	@apply border-l-4 border-[var(--denied-color)];
}
</style>
