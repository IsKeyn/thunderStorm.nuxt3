<script setup>
const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<nuxt-link :to="`/company/${item?.slug}`" target="_blank">
		{{ item.name }}
		<template v-if="item?.company_role?.name">
			({{ item.company_role.name }})
		</template>
		<template v-if="item?.addInfo">
			({{ item.addInfo }})
		</template>
	</nuxt-link>
</template>

<style lang="scss" scoped>
a {
	@apply text-[var(--main-text-color)];
}
</style>
