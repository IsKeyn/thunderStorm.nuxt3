<script setup>
const props = defineProps({
	breadCrumbs: {
		type: Array,
		default: null,
	},
});

</script>

<template>
	<div class="mb-3">
		<span v-for="(breadCrumb, key) in breadCrumbs">
			<template v-if="breadCrumbs.length - 1  > key">
				<router-link
						class="text-[var(--main-text-color)]"
					:to="breadCrumb.href"
				>
				{{ breadCrumb.name }}
			</router-link> /
			</template>
			<template v-else>
				{{ breadCrumb.name }}
			</template>
		</span>
	</div>
</template>
