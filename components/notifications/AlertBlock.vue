<script setup>
const props = defineProps({
	errorsMessages: {
		type: [String, Array],
		default: '',
	},
});

const showBlock = computed(() => {
	if (typeof props.errorsMessages === 'String' && props.errorsMessages) {
		return true;
	} else if (typeof props.errorsMessages === 'object' && props.errorsMessages.length > 0) {
		return true;
	} else {
		return false;
	}
});
</script>

<template>
	<div
			v-show="showBlock"
			class="alert-block"
	>
		<template v-if="typeof errorsMessages === 'String'">
			{{ errorsMessages }}
		</template>
		<template v-else-if="typeof errorsMessages === 'object' && errorsMessages.length > 0">
			<span
					v-for="(error, key) in errorsMessages"
					:key="key"
			>
				{{ error }}
			</span>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.alert-block {
	@apply
		bg-[var(--error-color)]
		text-[var(--second-text-color)]
		pt-[10px] pr-[10px] pb-[10px] pl-[20px]
	;
}
</style>
