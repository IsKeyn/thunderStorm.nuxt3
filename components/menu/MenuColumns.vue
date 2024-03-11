<script setup>
const props = defineProps({
	menuElements: {
		type: Object,
		default: null,
	},
	showTitles: {
		type: Boolean,
		default: false,
	},
	parentClass: {
		type: String,
		default: 'menu-block',
	},
});
</script>

<template>
	<div
			:class="parentClass"
			v-for="(menuCategory, index) in menuElements"
			:key="index"
	>
		<span v-if="showTitles" class="menu-category-title">{{ menuCategory.name }}</span>
		<template v-for="(element, elIndex) in menuCategory.elements" :key="elIndex">
			<template v-if="element.link_type === 'router'">
				<router-link :to="element.url" :target="(element.target === 'blank' ? '_blank' : '_self')">
					<span>{{ element.name }}</span>
				</router-link>
			</template>
			<template v-else>
				<a :href="element.url" :target="( element.target === 'blank' ? '_blank' : '_self' )">
					<span>{{ element.name }}</span>
				</a>
			</template>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.admin-menu {
	a {
		color: var(--main-text-color);

		@apply
		bg-gradient-to-r from-[var(--main-href-color)] to-[var(--second-href-color)]
		block
		pt-[5px] pr-[20px] pb-[5px] pl-[20px]
		mb-[1px]
		;

		&:hover {
			@apply
			no-underline
			bg-gradient-to-r from-[var(--main-hover-color)] to-[var(--second-hover-color)]
			;
		}
	}
}

.menu-block {
	width: 25%;

	span {
		&.menu-category-title {
			display: block;

			padding-bottom: 1rem;

			font-size: 18px;
			font-weight: 600;
			text-transform: uppercase;
		}
	}

	a {
		display: block;

		//color: var(--second-href-color);
		font-size: 16px;

		margin-bottom: 10px;
	}
}
</style>
