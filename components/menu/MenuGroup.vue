<script setup>
import OpeningBox from '@/components/ui/OpeningBox.vue';

const props = defineProps({
	group: {
		type: Object,
		default: null,
	},
});
</script>

<template>
	<OpeningBox
			v-if="group.elements && group.elements.length > 0"
			:title="group.name"
			classes="mb-1"
	>
		<template
				v-for="(element, key) in group.elements"
				:key="key"
		>
			<template v-if="element.link_type === 'router'">
				<router-link
						:to="element.url"
						:target="(element.target === 'blank' ? '_blank' : '_self')"
				>
					<span>{{ element.name }}</span>
				</router-link>
			</template>
			<template v-else>
				<a
						:href="element.url"
						:target="( element.target === 'blank' ? '_blank' : '_self' )"
				>
					<span>{{ element.name }}</span>
				</a>
			</template>
		</template>
	</OpeningBox>
</template>


<style lang="scss" scoped>
a {
	@apply block;
}
</style>
