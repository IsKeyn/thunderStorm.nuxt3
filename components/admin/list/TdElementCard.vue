<script setup>
const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
	titleEl: {
		type: Object,
		required: true,
	},
	keyName: {
		type: String,
		required: true,
	},
	pageUrl: {
		type: String,
		required: true,
	},
});

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const emit = defineEmits(['deleteElement']);
</script>

<template>
	<div :class="titleEl.type === 'image' ? 'text-center' : ''">
		<template v-if="keyName === 'doTypes'">
			<div class="text-center">
				<router-link :to='`${pageUrl}/${item.id}`'>
					<font-awesome-icon
							:icon="['fas', 'pen']"
					/>
				</router-link>
				<font-awesome-icon
						:icon="['fas', 'xmark']"
						class="cursor-pointer text-[var(--main-href-color)]"
						@click="$emit('deleteElement', item)"
				/>
			</div>
		</template>
		<template v-else-if="keyName === 'created_at' && item[keyName]">
			{{ getFormattedDate('d.m.Y H:i:s', item[keyName]) }}
		</template>
		<template v-else-if="keyName === 'updated_at' && item[keyName]">
			{{ getFormattedDate('d.m.Y H:i:s', item[keyName]) }}
		</template>
		<template v-else-if="keyName === 'deleted_at' && item[keyName]">
			{{ getFormattedDate('d.m.Y H:i:s', item[keyName]) }}
		</template>
		<template v-else-if="titleEl.type && titleEl.type === 'image' && item[keyName]">
			<img :src="item[keyName]">
		</template>
		<template v-else>
			{{ item[keyName] }}
		</template>
	</div>
</template>

<style lang="scss" scoped>
.svg-inline--fa {
	@apply mr-[5px] text-[18px];
}

img {
	@apply max-w-[220px] max-h-[220px] inline-block;
}
</style>
