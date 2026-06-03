<script setup>
import draggable from "vuedraggable";

import OpeningBox from '@/components/ui/OpeningBox.vue';
import RepeaterV2 from '@/components/repeaters/RepeaterV2.vue';
import Modal from '@/components/modals/Modal.vue';
import MultiSelectFromGallery from "@/components/multiSelects/MultiSelectFromGallery.vue";
import FileFromGallery from "@/components/forms/FormGenerator/fragments/FileFromGallery_v0.1.vue";

import { ref, watch } from "vue";

const emit = defineEmits(['update:modelValue']);

const repeaterComponent = ref(null);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
	/*
	 * Дополнительные данные для построения, например списки из сущности.
	 * Пример селектор для игровых платформ (PS1, PS2, XBOX ... PC)
	 */
	additionalData: {
		type: Object,
		default: {},
	},
	params: {
		type: Object,
		default: {
			title: 'Обложки',
		},
	}
});

const repeaterItem = {
	name: 'Изображение',
	value: '',
	keyValueFromObject: 'id',
	objectValue: null,
	type: 'fileFromGallery',
	validateRules: '',
	classes: ['w-full', 'mt-[5px]'],
};

const value = ref([ ...props.modelValue ]);

watch(() => value.value, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });

const activeGalleryModal = ref(false);

const toggleGalleryModal = () => {
	activeGalleryModal.value = !activeGalleryModal.value;
}

const setRepeatorItems = (event) => {
	value.value = event;
	repeaterComponent.value.updateItems(value.value);
}

const calcSort = (event, repeaterItems) => {
	repeaterItems.forEach((item, key) => {
		item.sort = key;
	});
}
</script>

<template>
	<OpeningBox :title="params?.title">
		<button @click="toggleGalleryModal" class="btn btn-primary">Добавить несколько элементов</button>

		<div class="media-box">
			<span class="form-title">Медиа в данной галерии</span>

			<RepeaterV2
					ref="repeaterComponent"
					:repeaterItem="{}"
					v-model="value"
					:setSort="true"
					#default="{ repeaterItems, reload }"
			>
				<draggable
						tag="div"
						:list="repeaterItems"
						handle=".handle"
						item-key="name"
						@end="(event) => calcSort(event, repeaterItems)"
				>
					<template #item="{ element, index }">
						<div :class="['form']">
							<div class="input-box">
								<FileFromGallery
										v-model="repeaterItems[index]"
								/>
							</div>
							<div class="buttons-box">
								<button
										v-if="repeaterItems.length > 1"
										class="btn btn-primary"
										@click="repeaterComponent.deleteRepeaterItem(index)"
								>
									<font-awesome-icon :icon="['fas', 'xmark']" />
								</button>
								<button class="btn btn-primary handle">
									<font-awesome-icon :icon="['fas', 'bars']" />
								</button>
							</div>
						</div>
					</template>
				</draggable>

				<button
						class="btn btn-primary block"
						@click="repeaterComponent.addRepeaterItem()"
				>
					Добавить
				</button>

				<Modal
						:showOpenModal="activeGalleryModal"
						size="full-width"
						modal-id="gallery-modal"
						:fullCloseModal="true"
						@toggleModal="toggleGalleryModal"
				>
					<MultiSelectFromGallery
							:modelValue="repeaterItems"
							@update:modelValue="setRepeatorItems"
					/>
				</Modal>
			</RepeaterV2>
		</div>
	</OpeningBox>
</template>

<style lang="scss" scoped>
.media-box {
	@apply mt-[25px] mb-[25px];

	.form-title {
		@apply pb-[15px] block;
	}

	.form {
		@apply grid grid-cols-12 mb-[15px];

		.input-box {
			@apply col-span-10  mr-[15px];
		}

		.buttons-box {
			@apply col-span-2;

			.btn {
				@apply mt-0 mr-[3px] mb-0;
			}
		}
	}
}
</style>
