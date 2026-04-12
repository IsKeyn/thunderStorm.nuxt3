<script setup>
const emit = defineEmits(['deleteElement', 'recoveryElement', 'forceDeleteElement']);

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import { file } from '@/composables/file.js'
const { getFileType } = file();

import { helper } from '@/composables/helper.js'
const { cutText } = helper();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

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
	entities: {
		type: Object,
		required: true,
	},
	entityId: {
		type: Number,
		default: null,
	},
	doTypes: {
		type: Array,
		default: ['edit'],
	},
	/* url страницы в публичной части сайта */
	previewUrl: {
		type: String,
		default: null,
	},
});

const fileType = computed(() => {
	if (typeof props.item[props.keyName] === 'object') {
		return getFileType(props.item[props.keyName].src);
	}

	if (typeof props.item[props.keyName] === 'string') {
		return getFileType(props.item[props.keyName]);
	}
});

const fileSrc = computed(() => {
	if (typeof props.item[props.keyName] === 'object') {
		return props.item[props.keyName].src;
	}

	if (typeof props.item[props.keyName] === 'string') {
		return props.item[props.keyName];
	}
});

const entityValue = computed(() => {
	if (props.titleEl.type
			&& props.titleEl.apiUrl
			&& props.titleEl.type === 'EntityList'
			&& props.item[props.keyName]
			&& props.entities
			&& props.entities[props.titleEl.apiUrl]
	) {
		const item = props.entities[props.titleEl.apiUrl].find(item => item.id === props.item[props.keyName]);

		if (item.name) {
			return item.name;
		} else {
			return item;
		}
	} else {
		return props.item[props.keyName];
	}
});

const viewResult = () => {
		if (!props.previewUrl) {
			return false;
		}

		let newTabUrl = '';

		if (props.previewUrl.includes('{id}') && props.item.id) {
			newTabUrl = props.previewUrl.replace('{id}', props.item.id);
		}

		if (props.previewUrl.includes('{slug}')) {
			newTabUrl = props.previewUrl.replace('{slug}', props.item.slug);
		}

		if (newTabUrl) {
			window.open(newTabUrl + '?preview=true', '_blank', 'noopener,noreferrer');
		}

		return true;
}
</script>

<template>
	<div
			:class="titleEl.type === 'image' ? 'text-center' : ''"
	>
		<template
				v-if="keyName === 'doTypes'"
		>
			<div class="text-center">
				<slot name="doTypes">
					<a
							v-if="doTypes.includes('recovery') && entityId"
							:href='`${pageUrl.replace(":slug()", entityId)}/?version_id=${item.id}`'
							class="btn btn-simple !mt-0 !mb-0"
					>Восстановить данные</a>
					<template v-if="doTypes.includes('edit')">
						<template v-if="item.deleted_at">
							<font-awesome-icon
									:icon="['fa-solid', 'fa-trash-arrow-up']"
									class="cursor-pointer text-[var(--main-href-color)]"
									title="Восстановить"
									@click="$emit('recoveryElement', item)"
							/>
							<font-awesome-icon
									:icon="['fa-solid', 'fa-trash-can']"
									class="cursor-pointer text-[var(--main-href-color)]"
									title="Удалить окончательно"
									@click="$emit('forceDeleteElement', item)"
							/>
						</template>
						<template v-else>
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
							<font-awesome-icon
									v-if="previewUrl"
									:icon="['fa-solid', 'fa-eye']"
									class="cursor-pointer text-[var(--main-href-color)]"
									@click="viewResult"
							/>
						</template>
					</template>
				</slot>
			</div>
		</template>
		<template
				v-else-if="
				(
						keyName === 'created_at'
						|| keyName === 'updated_at'
						|| keyName === 'deleted_at'
				) && item[keyName]"
		>
			{{ getFormattedDate('d.m.Y H:i:s', item[keyName]) }}
		</template>
		<template
				v-else-if="
					titleEl.type
					&& titleEl.type === 'media'
					&& item[keyName]"
		>
			<img
					v-if="fileType === 'image'"
					:src="typeof item[keyName] === 'object' ? getResizeImg(item[keyName], 300) : item[keyName]"
					:media-id="typeof item[keyName] === 'object' ? item[keyName].id : item.id"
					class="media-obj"
			>
			<audio v-if="fileType === 'audio'" controls>
				<source
						:src="typeof item[keyName] === 'object' ? item[keyName].src : item[keyName]" type="audio/mpeg"
				>
				Ваш браузер не поддерживает аудио элемент.
			</audio>
			<a
					v-if="fileType === 'video'"
					:href="typeof item[keyName] === 'object' ? item[keyName].src : item[keyName]"
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
		</template>
		<template
				v-else-if="titleEl.type && titleEl.type === 'boolean'"
		>
			<span v-if="item[keyName]" class="text-rounded-box true">Да</span>
			<span v-else class="text-rounded-box false">Нет</span>
		</template>
		<template
				v-else-if="titleEl.type && titleEl.type === 'cutText' && item[keyName]"
		>
			{{ cutText(item[keyName], 15) }}
		</template>
		<template
				v-else-if="titleEl.type && titleEl.type === 'EntityList' && item[keyName]"
		>
			<span :class="[titleEl.classes ?? 'entity', 'text-rounded-box']">{{ entityValue }}</span>
		</template>
		<template
				v-else-if="titleEl.type && titleEl.type === 'rounded-box' && item[keyName]"
		>
			<span :class="[titleEl.classes ? titleEl.classes : 'simple', 'text-rounded-box']">{{ item[keyName] }}</span>
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

.text-rounded-box {
	@apply block w-full p-1 text-center;

	&.simple {
		@apply bg-[var(--epic-color-2)];
	}

	&.true {
		@apply bg-[var(--success-color)];
	}

	&.false {
		@apply bg-[var(--error-color)];
	}

	&.entity {
		@apply bg-[var(--epic-color-2)];
	}
}
</style>
