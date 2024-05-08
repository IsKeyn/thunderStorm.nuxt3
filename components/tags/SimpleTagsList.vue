<script setup>
const props = defineProps({
	tags: {
		type: Array,
		default: [],
	},
	parentClasses: {
		type: String,
		default: '',
	},
	theme: {
		type: String,
		default: 'button', // button, string
	},
});

const tagsList = computed(() => {
	let returnData = '';

	props.tags.forEach((item, key) => {
		if (key === 0) {
			returnData += item.name;
		} else {
			returnData += ', ' + item.name;
		}
	});

	return returnData;
});
</script>

<template>
	<div>
		<template v-if="theme === 'button'">
			<div
					v-if="tags.length > 0"
					:class="parentClasses"
			>
				<span
						class="tag"
						v-for="tag in tags"
				>
					{{ tag.name }}
				</span>
			</div>
		</template>

		<template
				v-if="theme === 'string' && tags.length > 0"
		>
			Теги: {{ tagsList }}
		</template>
	</div>
</template>

<style lang="scss" scoped></style>
