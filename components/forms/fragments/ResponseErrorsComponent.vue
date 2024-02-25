<script setup>
const props = defineProps({
	responseErrors: {
		type: Object,
		default: {},
		required: true,
	},
});
</script>

<template>
	<template v-if="Object.keys(responseErrors).length > 0">
		<template v-for="fieldErrors in responseErrors">
			<div
					class="field-error-message small-text mb-[10px]"
					v-for="error in fieldErrors"
			>
				{{ error }}
			</div>
		</template>
	</template>
</template>
