<script setup>
import RepeaterV2 from '@/components/repeaters/RepeaterV2.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref, watch } from "vue";
const emit = defineEmits(['update:modelValue']);

const repeaterComponent = ref(null);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
	name: {
		type: String,
		default: 'Имя'
	},
	/* Один элемент репитора */
	repeaterItem: {
		type: Object,
		default: {
			itemName: {
				name: 'itemName',
				type: 'select-with-search',
				options: [
					{
						name: 'Не выбрано',
						value: null,
					},
				],
				value: null,
				placeholder: 'Имя',
			},
		}
	},
	/*
	 * Дополнительные данные для построения, например по списку из сущности.
	 * Пример селектор для игровых платформ (PS1, PS2, XBOX ... PC)
	 */
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
	fieldClasses: {
		type: String,
		default: 'col-span-2',
	},
	onlyValue: {
		type: Boolean,
		default: false,
	}
});

const value = ref([ ...props.modelValue ]);

watch(() => value.value, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });
</script>

<template>
	<RepeaterV2
			ref="repeaterComponent"
			:repeaterItem="repeaterItem"
			:additionalData="additionalData"
			:params="params"
			:defaultValues="defaultValues"
			:onlyValue="onlyValue"
			v-model="value"
			#default="{ repeaterItems }"
	>
		<div class="main-data-block">
			<span class="form-title">{{ name }}</span>
			<div
					v-for="(item, index) in repeaterItems"
					:key="index"
					class="form"
			>
				<div
						v-for="(field, ind) in item"
						:key="ind"
						:class="[ field.type === 'hidden' ? 'hidden' : 'input-box', fieldClasses ]"
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
	</RepeaterV2>
</template>

<style lang="scss" scoped>
.main-data-block {
	@apply mt-[25px] mb-[25px];

	.form-title {
		@apply pb-[15px] block;
	}

	.form {
		@apply grid grid-cols-12 mb-[15px];

		.input-box {
			@apply mr-[15px];
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
