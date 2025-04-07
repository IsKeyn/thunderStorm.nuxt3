<script setup>
import { onMounted } from "vue";

const props = defineProps({
	iconName: String,
	stroke: {
		type: String,
		default: '#015278'
	},
	size: {
		type: String,
		default: null
	},
	width: {
		type: String,
		default: '24'
	},
	height: {
		type: String,
		default: '24'
	},
	strokeWidth: {
		type: String,
		default: '1.5'
	},
});

const svgBody = ref('');
const svgClass = ref('');

const getSvgCode = async () => {

	const response = await $fetch(
			`/images/icons/svg/${props.iconName}.svg`,
			{
				method: 'GET',
			},
	);

	const text = await response.text();
	svgBody.value = extractSvgBody(text);
};

const extractSvgBody = (svgString) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgString, 'image/svg+xml');
	const svg = doc.querySelector('svg');
	svgClass.value = svg.getAttribute('class');

	let result = '';

	for (const child of svg.children) {
		const tag = child.tagName.toLowerCase();
		let attrs = '';
		for (const attr of child.attributes) {
			attrs += ` ${attr.name}="${attr.value}"`;
		}
		result += `\t\t<${tag}${attrs}></${tag}>\n`;
	}

	return result;
}

// const viewBox = computed(() => {
// 	return `0 0 ${props.size ? props.size : props.width} ${props.size ? props.size : props.height}`;
// });

onMounted(() => {
	getSvgCode();
});
</script>

<template>
	<svg
			v-if="svgBody"
			xmlns="http://www.w3.org/2000/svg"
			:class="svgClass"
			:width="size ? size : width"
			:height="size ? size : height"
			viewbox="0 0 24 24"
			:stroke-width="strokeWidth"
			:stroke="stroke"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
			v-html="svgBody"
	/>
</template>

<style lang="scss" scoped></style>
