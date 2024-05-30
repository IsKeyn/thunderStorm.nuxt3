<script setup>
import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import { file } from '@/composables/file.js'
const {
	getFileType,
} = file();

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

const emit = defineEmits(['deleteElement']);

const fileType = computed(() => {
	return getFileType(props.item[props.keyName]);
});
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
		<template v-else-if="titleEl.type && titleEl.type === 'media' && item[keyName]">
			<a
					v-if="fileType === 'video'"
					:href="item[keyName]"
					target="_blank"
			>
				Открыть видео
			</a>
<!--			<video-->
<!--					v-if="fileType === 'video'"-->
<!--					:src="item[keyName]"-->
<!--					muted autoplay loop-->
<!--			>-->
<!--				Sorry, your browser doesn't support embedded videos-->
<!--			</video>-->
			<img
					v-if="fileType === 'image'"
					:src="item[keyName]"
					@click="$emit('openImage', item)"
			>
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
	@apply
		inline-block
		max-w-[220px] max-h-[220px]
		cursor-pointer
	;
}
</style>
