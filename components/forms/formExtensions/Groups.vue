<script setup>
import RepeaterOld from '@/components/repeaters/RepeaterOld.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { watch } from "vue";
const emit = defineEmits(['update:modelValue']);

const repeaterComponent = ref(null);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
	// Дополнительные данные для построения, например списку из сущности. Пример селектор для игровых платформ (PS1, PS2, XBOX ... PC)
	additionalData: {
		type: Object,
		default: {},
	},
	params: {
		type: Object,
		default: {},
	},
	defaultValues: {
		type: Array,
		default: [],
	},
});

const repeaterItem = { // Один элемент репитора
	group: {
		name: 'group',
		type: 'select',
		options: [
			{
				name: 'Не выбрано',
				value: null,
			},
		],
		value: null,
		placeholder: 'Группа',
	},
};

const value = ref({});
const hasFirstLoad = ref(false);

watch(() => props.modelValue, (newValue) => {
	if (!hasFirstLoad.value) {
		value.value = toRaw(newValue);
		hasFirstLoad.value = true;
	}
}, { deep: true });

watch(() => value, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });
</script>

<template>
	<div>
		<RepeaterOld
				ref="repeaterComponent"
				:repeaterItem="repeaterItem"
				:additionalData="additionalData"
				:params="params"
				:defaultValues="defaultValues"
				v-model="value"
				#default="{repeaterItems}"
		>
			<div class="release-date">
				<span class="form-title">Группы</span>
				<div
						v-for="(item, index) in repeaterItems"
						:key="index"
						class="form"
				>
					<div
							v-for="(field, ind) in item"
							:key="ind"
							:class="field.type === 'hidden' ? 'hidden' : 'input-box'"
					>
						<FormGenerator
								v-if="field"
								:name="field.name"
								:element="field"
								:form="item"
								:showTitle="false"
								validateErrorPosition="bottom"
								fieldClasses="w-full"
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
					</div>
				</div>
				<button
						class="btn btn-primary"
						@click="repeaterComponent.addRepeaterItem()"
				>
					Добавить
				</button>
			</div>
		</RepeaterOld>
	</div>
</template>

<style lang="scss" scoped>
.release-date {
	@apply mt-[25px] mb-[25px];

	.form-title {
		@apply pb-[15px] block;
	}

	.form {
		@apply grid grid-cols-12 mb-[15px];

		.input-box {
			@apply col-span-2  mr-[15px];
		}

		.buttons-box {
			@apply col-span-1;

			.btn {
				@apply mt-0 mr-[3px] mb-0;
			}
		}
	}
}
</style>
