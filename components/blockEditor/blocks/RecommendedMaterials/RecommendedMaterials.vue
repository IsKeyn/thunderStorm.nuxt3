<script setup>
import { onMounted } from "vue";

import Repeater from '@/components/repeaters/Repeater.vue';
import ArticleCard from '@/components/articles/ArticleCard.vue';

const repeaterComponent = ref(null);

import { api } from '@/composables/api.js';
const {
	apiUrl,
	errorHandler
} = api();

const props = defineProps({
	blockStructure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	previewMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});

const defaultStructure = await import(`./defaultStructure.json`);

const requestInProgress = ref(false);
const responseErrors = ref({});

const fetchedData = ref([]);

onMounted(() => {
	getMaterialInit();
});

const getMaterialInit = () => {
	props.blockStructure.fields.recommended.forEach((repeaterItem, key) => {
		getMaterial(repeaterItem.id).then((element) => {
			fetchedData.value[key] = element;
		});
	});
}

const getMaterial = async (id) => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}article/get/id/${id}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		if (response) {
			requestInProgress.value = false;
			return props.hasResource ? response.data : response;
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div :class="[
			'video-list',
			sideIndent,
	]">
		<Repeater
				ref="repeaterComponent"
				:repeaterItem="defaultStructure.fields.recommended[0]"
				v-model="blockStructure.fields.recommended"
				#default="{repeaterItems}"
		>
			<div
					v-for="(item, index) in repeaterItems"
					:key="index"
					:class="['video-item', blockStructure.settings?.rowCount.value]"
			>
				<input
						v-if="!previewMode"
						v-model="repeaterItems[index].id"
						class="block"
						@change="getMaterialInit()"
						placeholder="ID рекомендуемой статьи"
				>

				<ArticleCard
						v-if="fetchedData[index]"
						:cardData="fetchedData[index]"
						:showTags="false"
				/>
				<button
						v-if="!previewMode && repeaterItems.length > 1"
						class="btn btn-primary"
						@click="repeaterComponent.deleteRepeaterItem(index)"
				>
					<font-awesome-icon :icon="['fas', 'xmark']" />
				</button>
			</div>
			<button
					v-if="!previewMode"
					class="btn btn-primary block"
					@click="repeaterComponent.addRepeaterItem()"
			>
				Добавить
			</button>
		</Repeater>
	</div>
</template>

<style lang="scss">
.video-list {
	@apply grid grid-cols-12 gap-x-[1rem] gap-y-[1rem];

	.video-item {
		@apply relative;

		&:hover button {
			@apply block;
		}

		button {
			@apply absolute top-0 right-0 hidden;
		}

		.video {
			@apply h-0 relative pb-[56.25%];

			&:hover {
				.sources-list {
					@apply block;
				}
			}

			.sources-list {
				@apply
				absolute top-[0.2rem] left-[0.2rem] z-[1]
				pt-[0.1rem] pr-[0.5rem] pb-[0.1rem] pl-[0.5rem]
				text-[1.8rem] hidden
				;

				background: rgba(0, 0, 0, 0.7);

				svg {
					&:not(:last-child) {
						@apply mr-[0.5rem];
					}

					@apply cursor-pointer;

					&:hover {
						@apply text-[var(--main-hover-color)];
					}
				}
			}

			iframe {
				@apply absolute top-0 left-0 w-full h-full;
			}
		}
	}
}
</style>
