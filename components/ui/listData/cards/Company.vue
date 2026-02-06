<script setup>
const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	{{ item.name }}
	<template v-if="item?.company_role?.name">
		({{ item.company_role.name }})
	</template>
	<template v-if="item?.addInfo">
		({{ item.addInfo }})
	</template>
</template>
