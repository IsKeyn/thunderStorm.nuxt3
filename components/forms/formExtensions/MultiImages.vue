<script setup>
import draggable from "vuedraggable";

import Repeater from '@/components/repeaters/Repeater.vue';
import OpeningBox from '@/components/ui/OpeningBox.vue';
import Modal from '@/components/modals/Modal.vue';
import MultiSelectFromGallery from "@/components/multiSelects/MultiSelectFromGallery.vue";
import FileFromGallery from "@/components/forms/FormGenerator/fragments/FileFromGallery_v0.1.vue";

import { watch } from "vue";

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

const selectedData = ref([]);
selectedData.value = props.modelValue;

watch(() => props.modelValue, (newValue, oldValue) => {
	if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
		selectedData.value = newValue;
	}
}, { deep: true });

watch(() => selectedData.value, (newValue, oldValue) => {
	/*
	 * TODO
	 * фигня какая-то
	 * Пример console.log(1, newValue, oldValue) имеет отличные от данные console.log(2, JSON.stringify(newValue), JSON.stringify(oldValue));
	 * Пример 2 structuredClone(toRaw(newValue)) и structuredClone(toRaw(oldValue)) также отличаются от newValue, oldValue
	 */

	/* Костыль на обработку сортировки, причина рождения в TO DO выше */

	if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
		emit('update:modelValue', newValue);
	}
}, { deep: true });

const activeGalleryModal = ref(false);

const toggleGalleryModal = () => {
	activeGalleryModal.value = !activeGalleryModal.value;
}

const setRepeatorItems = (event) => {
	selectedData.value = event;
}

const calcSort = (event) => {
	selectedData.value.forEach((item, key) => {
		item.sort = key;
	});


	emit('update:modelValue', selectedData);

	console.log(selectedData.value);
	// console.log(111, event);
}
</script>

<template>
	<OpeningBox
			:title="params?.title"
	>
		<button @click="toggleGalleryModal" class="btn btn-primary">Добавить несколько элементов</button>

		<div class="media-box">
			<span class="form-title">Медиа в данной галерии</span>

			<Repeater
					ref="repeaterComponent"
					:repeaterItem="{}"
					v-model="selectedData"
					#default="{ repeaterItems, reload }"
			>
				<draggable
						tag="div"
						:list="repeaterItems"
						handle=".handle"
						item-key="name"
						@end="calcSort"
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

					<!--	Старое решение		-->
<!--					<div-->
<!--							v-for="(item, index) in repeaterItems"-->
<!--							:key="index"-->
<!--							:class="['form']"-->
<!--					>-->
<!--						<div class="input-box">-->
<!--							<FileFromGallery-->
<!--									v-model="repeaterItems[index]"-->
<!--							/>-->
<!--						</div>-->
<!--						<div class="buttons-box">-->
<!--							<button-->
<!--									v-if="repeaterItems.length > 1"-->
<!--									class="btn btn-primary"-->
<!--									@click="repeaterComponent.deleteRepeaterItem(index)"-->
<!--							>-->
<!--								<font-awesome-icon :icon="['fas', 'xmark']" />-->
<!--							</button>-->
<!--						</div>-->
<!--					</div>-->

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
			</Repeater>
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
