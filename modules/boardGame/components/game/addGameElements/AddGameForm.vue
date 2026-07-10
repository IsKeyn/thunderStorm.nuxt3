<script setup>
import RepeaterV2 from '@/components/repeaters/RepeaterV2.vue';
import OpeningBox from '@/components/ui/OpeningBox.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { ref, watch } from "vue";
const emit = defineEmits(['update:modelValue']);

import { helper } from '@/composables/helper.js'
const { route, findElementById } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue } = boardGame();

const repeaterComponent = ref(null);

const props = defineProps({
	modelValue: {
		type: Array,
		default: [],
	},
	name: {
		type: String,
		default: 'Добавление игры'
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
		default: '',
	},
	onlyValue: {
		type: Boolean,
		default: true,
	},
	// Максимальное количество элементов репитора
	maxElements: {
		type: Number,
		default: null,
	},
});

const repeaterItem = {
	id: {
		name: 'ID',
		value: '',
		type: 'hidden',
		validateRules: '',
		classes: ['w-full', 'mt-[5px]'],
	},
	status: {
		name: 'status',
		value: '',
		type: 'hidden',
		validateRules: '',
		classes: ['w-full', 'mt-[5px]'],
	},
	moderator_comment: {
		name: 'status',
		value: '',
		type: 'hidden',
		validateRules: '',
		classes: ['w-full', 'mt-[5px]'],
	},
	name: {
		name: 'Наименование игры*',
		value: '',
		type: 'text',
		placeholder: 'Введите название игры',
		validateRules: 'required, minLength_1, maxLength_100',
		parentClasses: 'col-span-4',
		classes: 'w-full',
		description: 'Введите полное название игры',
	},
	gaming_platform_id: {
		name: 'Платформа игры*',
		value: null,
		type: 'select-with-search',
		valueKey: 'id',
		options: JSON.parse(getSettingValue('eventGamePlatforms')),
		placeholder: 'Выберите платформу',
		parentClasses: 'col-span-4',
		classes: 'w-full',
	},
	coop: {
		name: 'Есть ли в игре кооп?',
		value: false,
		type: 'checkbox',
		parentClasses: 'col-span-4',
		classes: 'w-full',
	},
	game_completion_time: {
		name: 'Время прохождения (HLTB)*',
		value: '',
		type: 'text',
		placeholder: 'Введите время прохождения',
		validateRules: 'required, minLength_1, maxLength_50',
		parentClasses: 'col-span-4',
		classes: 'w-full',
		description: 'Время прохождения с сайта howlongtobeat.com',
	},
	difficulty: {
		name: 'Сложность игры в процентах от 0 до 100*',
		value: '',
		type: 'number',
		min: 0,
		max: 100,
		placeholder: 'Введите сложность игры',
		validateRules: 'required, minLength_1, maxLength_50',
		parentClasses: 'col-span-4',
		classes: 'w-full',
		description: 'Сложность игры от 0 до 100, учитывайте критерии оценки сложности! Корректная оценка сложности - обязательный параметр для прохождения модерации',
	},
	description: {
		name: 'Условие прохождения игры',
		value: '',
		type: 'text',
		placeholder: 'Опишите условие прохождения игры',
		validateRules: 'minLength_1, maxLength_1000',
		parentClasses: 'col-span-4',
		classes: 'w-full',
		description: 'Данное поле необходимо заполнить, если у игры нет явной концовки или когда титры не означают конец игры, как например Blood',
	},
	comment_for_moderator: {
		name: 'Комментарий для модераторатора',
		value: '',
		type: 'textarea',
		placeholder: 'Вы можете оставить комментарий для модератора для объяснения спорных моментов, связанных с данной игрой',
		validateRules: 'required, minLength_1, maxLength_5000',
		parentClasses: 'col-span-12',
		classes: 'w-full',
	},
};

const value = ref([ ...props.modelValue ]);

watch(() => value.value, (newValue) => {
	emit('update:modelValue', newValue);
}, { deep: true });

const getStatusClass = (status) => {
	switch (status) {
		case 0: return 'draft';
		case 1: return 'sent';
		case 2: return 'under_consideration';
		case 3: return 'added';
		case 4: return 'denied';
		case 5: return 'returned';
	}
}

const getStatusName = (status) => {
	switch (status) {
		case 0: return 'Черновик';
		case 1: return 'Отправлен на рассмотрение';
		case 2: return 'Рассматривается';
		case 3: return 'Добавлена';
		case 4: return 'Отказана';
		case 5: return 'Возвращена';
	}
}

const getTitle = (item) => {
	let title = 'Новая игра';

	if (item.name.value) {
		title = item.name.value;
	}

	if (item.gaming_platform_id.value) {
		const platform = findElementById(item.gaming_platform_id.options, item.gaming_platform_id.value);
		title += ` (${platform.name})`;
	}

	return title;
}
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
			>
				<OpeningBox
						:title="getTitle(item)"
						openIconPosition="left"
				>
					<ui-itemBox
							v-if="item.status.value === 2 || item.status.value === 3"
							classes="red"
							message="Вы не можете менять данные этой игры"
					/>
					<div class="form wrapper">
						<div
								v-for="(field, ind) in item"
								:key="ind"
								:class="[ field.type === 'hidden' ? 'hidden' : 'input-box', fieldClasses, field.parentClasses ]"
						>
							<FormGenerator
									v-if="field"
									:key="field.name"
									:name="field.name"
									:showTitle="field.showTitle ?? true"
									:element="field"
									:showValidateError=true
									:form="item"
									validateErrorPosition="bottom"
									:labelClasses="['block', 'mb-[10px]', field.labelClasses]"
									:fieldClasses="field.classes"
									:disabled="item.status.value === 2 || item.status.value === 3"
							/>
						</div>
						<div class="col-span-12">
							* - поля обязательные для заполнения
						</div>
						<div class="buttons-box">
							<button
									v-if="repeaterItems.length > 1 && (item.status.value !== 2 && item.status.value !== 3)"
									class="btn btn-primary"
									@click="repeaterComponent.deleteRepeaterItem(index)"
							>
								Удалить данную игру <font-awesome-icon :icon="['fas', 'xmark']" />
							</button>
						</div>
					</div>
				</OpeningBox>
				<div :class="['status-box', getStatusClass(item.status.value)]">
					{{ getStatusName(item.status.value) }}
					<div v-if="item.moderator_comment.value" class="comment-box">
						<div class="comment-title">Комментарий модератора:</div>
						{{ item.moderator_comment.value }}
					</div>
				</div>
			</div>
			<button
					v-if="!maxElements || (maxElements && (repeaterItems.length < maxElements))"
					class="btn btn-primary"
					@click="repeaterComponent.addRepeaterItem()"
			>
				Добавить
			</button>
		</div>
	</RepeaterV2>


	<div class="wrapper">
		<FormGenerator
				v-for="(field, index) in form"
				:key="index"
				:name="index"
				:showTitle="field.showTitle ?? true"
				:element="field"
				:showValidateError=true
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]', field.labelClasses]"
				:fieldClasses="field.classes"
		/>
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply grid grid-cols-12 gap-4;
}

.main-data-block {
	@apply mt-[25px] mb-[10px];

	.form-title {
		@apply pb-[15px] block;
	}

	.form {
		@apply grid grid-cols-12 mb-[15px];

		.input-box {
			@apply mr-[15px];
		}

		.buttons-box {
			@apply col-span-6;

			.btn {
				@apply mt-0 mr-[3px] mb-0;
			}
		}
	}

	.status-box {
		@apply
			w-full
			pt-[10px] pr-[15px] pb-[10px] pl-[15px]
			text-[18px] text-[#CECECE]
			mt-[-1rem] mb-[1rem]
		;

		&.draft {
			background-color: #ab9e03;
		}

		&.sent {
			background-color: #03aba5;
		}

		&.under_consideration {
			background-color: #0362ab;
		}

		&.added {
			background-color: #1cab03;
		}

		&.denied {
			background-color: #ab0309;
		}

		&.returned {
			background-color: #a503ab;
		}

		.comment-box {
			@apply mt-2 p-[1rem] bg-[var(--second-block-color)] text-[16px];

			.comment-title {
				@apply mb-2;
			}
		}
	}
}
</style>
