<script setup>
import FileFromGallery from './fragments/FileFromGallery.vue';
import EntityList from './fragments/EntityList.vue';
import EntityBind from './fragments/EntityBind.vue';
import SelectWithSearch from '@/components/forms/fragments/SelectWithSearch.vue';

import { watch } from 'vue'

const emit = defineEmits(['update:modelValue']);

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { file } from '@/composables/file.js'
const {
	getFileType,
} = file();

import { developerTools } from '@/composables/developerTools.js';
const {
	devErrorLog,
} = developerTools();

import { stringActions } from '@/composables/stringActions.js';
const {
	toSlug,
} = stringActions();

const props = defineProps({

	modelValue: {},

	/*
	* Тип работы формы
	*
	* 0 - дефолтное значение, value находится в элементе
	* 1 - новый формат работы, value отдельный пропс
	* 2
	*
	*/
	formHandlerType: {
		type: Number,
		default: 0,
	},
	// Ключ value
	valueKey: {
		type: String,
		default: null,
	},

	// Отображаемое имя поля
	name: {
		type: [String, Number],
		required: true,
	},
	// Объект с данными поля
	element: {
		type: Object,
		default: {},
	},
	// Вся форма, используется при автозаполнении
	form: {
		type: Object,
		default: {},
	},
	// Отображать или скрывать заголовок
	showTitle: {
		type: Boolean,
		default: true,
	},
	// Отображать или скрывать максимальное допустимое количество символов в поле
	showMaxLength: {
		type: Boolean,
		default: false,
	},
	// Отображать или скрывать кнопку очистки формы
	clearButton: {
		type: Boolean,
		default: false,
	},
	// Отображать или скрывать кнопку копирования значения поля
	showCopyButton: {
		type: Boolean,
		default: false,
	},
	// Отображать ошибки или нет
	showValidateError: {
		type: Boolean,
		default: false,
	},
	// Место отображения ошибок (над формой или под ней)
	validateErrorPosition: {
		type: String,
		default: 'top',
	},
	// Отображение смены типы поля с password на text и обратно, в данный момент работает только для password
	showChangeTypeButton: {
		type: Boolean,
		default: false,
	},
	// Дополнительные классы для тега <label>
	labelClasses: {
		type: [String, Array],
		default: '',
	},
	wrapClasses: {
		type: [String, Array],
		default: '',
	},
	// Дополнительные классы для поля
	fieldClasses: {
		type: [String, Array],
		default: '',
	},
});

const label = ref(null);

const previewImage = ref('');

watch(() => props.element.value, (newValue) => {
	if (newValue && props.name === 'phone') {
		props.element.value = newValue.replace(/[^+\(\)\d]/g, '');
	}

	if (props.element.type === 'file' && newValue && typeof newValue === 'object') {
		previewImage.value = URL.createObjectURL(newValue[0]);
	}

	if (props.element.type === 'EntityBind') {
		bindValues.value.entity = props.element.value;

		if (props.element.bindField && props.form[props.element.bindField]) {
			bindValues.value.id = props.form[props.element.bindField].value;
		}
	}
}, { deep: true });

watch(() => props.element.validateResult, (newValue) => {
	if (newValue && newValue.length > 0) {
		label.value.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth', });
	}
}, { deep: true });

const getLabelClasses = computed(() => {
	const classes = [];

	if (props.labelClasses) {
		classes.push(props.labelClasses);
	}

	return classes;
});

const getFieldClasses = computed(() => {
	const classes = [];

	if (props.fieldClasses) {
		classes.push(props.fieldClasses);
	}

	return classes;
});

const showPassword = () => {
	if (props.element.type === 'password') {
		props.element.type = 'text'
	} else if (props.element.type === 'text') {
		props.element.type = 'password'
	}
};

const fillField = () => {
	if (props.element.autoFill.sourceFieldKey) {
		const key = props.element.autoFill.sourceFieldKey;
		const rule = props.element.autoFill?.rule;

		if (props.form) {
			if (props.form[key]) {
				if (rule === 'slug') {
					props.element.value = toSlug(props.form[key].value);
				} else {
					props.element.value = props.form[key].value;
				}
			}
		} else {
			devErrorLog({
				message: 'Передайте props form в компонент FormGenerator',
				fileName: 'FormGenerator.vue',
			});
		}
	} else {
		devErrorLog({
			message: 'sourceFieldKey должен быть заполнен',
			fileName: 'FormGenerator.vue',
		});
	}
}

const fileType = computed(() => {
	return getFileType(props.element.value);
});

const formValue = ref(null);

if (props.formHandlerType === 1) {
	formValue.value = props.modelValue;

	watch(() => props.modelValue, (newValue, oldValue) => {
		if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
			formValue.value = newValue;
		}
	}, { deep: true });

	watch(() => formValue, (newValue, oldValue) => {
		if (JSON.stringify(newValue.value) !== JSON.stringify(oldValue.value)) {
			emit('update:modelValue', newValue);
		}
	}, { deep: true });
}

const maxLength = computed(() => {
	const maxLengthRegex = /maxLength_[0-9]{1,6}/i;
	const arRules = props.element.validateRules.replaceAll(' ', '').split(',');

	for (let item of arRules) {
		if (maxLengthRegex.test(item)) { // example minLength_10

			return Number(item.split('_')[1]);
		}
	}
});

const currentLength = computed(() => {
	return typeof props.element.value === 'string' ? props.element.value.length : 0;
});

/* НАЧАЛО: Laravel привязка сущности тип EntityBind */
const bindValues = ref({});

watch(() => bindValues.value, () => {
	if (props.element.type === 'EntityBind') {
		props.element.value = bindValues.value.entity;

		if (props.element.bindField && props.form[props.element.bindField]) {
			props.form[props.element.bindField].value = bindValues.value.id;
		}
	}
}, { deep: true });

/* КОНЕЦ: Laravel привязка сущности тип EntityBind */

const copyValue = () => {
	navigator.clipboard.writeText(props.element.value)
			.then(() => {
				alert('Значение поля скопированно в буфер обмена');
			})
			.catch(err => {
				alert('Ошибка копирования:', err);
			});
}
</script>

<template>
	<label
			v-if="element.type !== 'disable'"
			ref="label"
			:class="[element.type === 'hidden' ? 'hidden' : getLabelClasses]"
	>
		<span
				v-if="validateErrorPosition === 'top' && element.validateResult && showValidateError"
		>
			{{ element.validateResult }}
		</span>
		<span v-if="showTitle && (element.title || element.name)">{{ element.title ? element.title : element.name }}</span>
		<template
				v-if="
					element.type === 'text' ||
					element.type === 'number' ||
					element.type === 'password' ||
					element.type === 'hidden' ||
					element.type === 'date' ||
					element.type === 'datetime-local'
				"
		>
			<span :class="['input-wrap', wrapClasses]">
				<input
						v-if="element.type === 'number' && (element.min || element.max)"
						v-model="element.value"
						:type="element.type"
						:name="name"
						:min="element.min"
						:max="element.max"
						:friendly-name="element.name"
						:placeholder="element.placeholder"
						:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
						@input="onInput"
				/>
				<input
						v-else
						v-model="element.value"
						:type="element.type"
						:name="name"
						:friendly-name="element.name"
						:placeholder="element.placeholder"
						:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
						@input="onInput"
				/>
				<span class="additional-action-wrap">
					<span
							v-if="showCopyButton && element.value"
							@click="copyValue"
					>
						<font-awesome-icon
								:icon="['fa-solid', 'fa-copy']"
								class="additional-action-icon"
								title="Скопировать значение поля"
						/>
					</span>
					<span
							v-if="element.showChangeTypeButton"
							@click="showPassword"
					>
						<font-awesome-icon
								v-if="element.type === 'password'"
								:icon="['far', 'eye-slash']"
								class="additional-action-icon"
						/>
						<font-awesome-icon
								v-if="element.type === 'text'"
								:icon="['far', 'eye']"
								class="additional-action-icon"
						/>
					</span>
					<span
							v-if="element.autoFill"
							@click="fillField()"
					>
						<font-awesome-icon
								:icon="['fas', 'arrow-right-to-bracket']"
								rotation=90
								class="additional-action-icon"
								:title='`Заполнить поле "${element.name ? element.name : name}" значением из поля "${element.autoFill.sourceFieldKey && form[element.autoFill.sourceFieldKey].name ? form[element.autoFill.sourceFieldKey].name : element.autoFill.sourceFieldKey}" ${element.autoFill.rule ? " по правилу " + element.autoFill.rule : ""}`'
						/>
					</span>
					<span
							v-if="clearButton && element.value"
							@click="element.value = null"
					>
						<font-awesome-icon
								:icon="['fas', 'circle-xmark']"
								class="additional-action-icon"
								title="Очистить поле"
						/>
					</span>
				</span>
			</span>
		</template>
		<template v-else-if="element.type === 'textarea'">
			<textarea
					v-model="element.value"
					:name="name"
					:friendly-name="element.name"
					:placeholder="element.placeholder"
					:class="getFieldClasses"
			/>
		</template>
		<template v-else-if="element.type === 'file'">
			<template v-if="element.multiple">
				<input
						type="file"
						multiple="multiple"
						:accept="element.accept"
						:name="name"
						:friendly-name="element.name"
						:placeholder="element.placeholder"
						:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
						@change="element.value = $event.target.files"
				/>
			</template>
			<template v-else>
				<template v-if="element.showFile && element.value && typeof element.value === 'string'">
					<div class="grid grid-cols-4">
						<div class="col-span-2">
							<input
									type="file"
									:accept="element.accept"
									:name="name"
									:friendly-name="element.name"
									:placeholder="element.placeholder"
									class="hidden"
									@change="element.value = $event.target.files"
							/>
							<div
									class="choice-file-block"
									:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
							>
								<div class="button btn-primary choice-btn">Обзор...</div> {{ element.value ? element.value[0].name : '' }}
							</div>
						</div>
						<div class="col-span-2 text-center">
							<video
									v-if="fileType === 'video'"
									:src="element.value"
									muted autoplay loop
							>
								Sorry, your browser doesn't support embedded videos
							</video>
							<img
									v-if="fileType === 'image'"
									:src="element.value"
									:class="`inline-block ${element.imagePreviewClasses ? element.imagePreviewClasses : 'max-w-[500px] max-h-[500px]'}`"
							/>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="grid grid-cols-4">
						<div class="col-span-2">
							<input
									type="file"
									:accept="element.accept"
									:name="name"
									:friendly-name="element.name"
									:placeholder="element.placeholder"
									class="hidden"
									@change="element.value = $event.target.files"
							/>
							<div
									class="choice-file-block"
									:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
							>
								<div class="button btn-primary choice-btn">Обзор...</div> {{ element.value ? element.value[0].name : '' }}
							</div>
						</div>
						<div class="col-span-2 text-center">
							<img
									v-if="previewImage"
									:src="previewImage"
									:class="`inline-block ${element.imagePreviewClasses ? element.imagePreviewClasses : 'max-w-[500px] max-h-[500px]'}`"
							/>
						</div>
					</div>
				</template>
			</template>
		</template>
		<template v-else-if="element.type === 'select'">
			<select
					:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
					v-model="element.value"
			>
				<option
						v-if="element.defaultOption"
						:value="element.defaultOption.value"
				>
					{{ element.defaultOption.name }}
				</option>
				<option
						v-for="(option, key) in element.options"
						:key="key"
						:value="option.value"
				>
					{{ option.name }}
				</option>
			</select>
		</template>
		<template v-else-if="element.type === 'select-with-search'">
			<SelectWithSearch
					:options="element.options"
					v-model="element.value"
			/>
		</template>
		<template v-else-if="element.type === 'fileFromGallery'">
			<FileFromGallery
					:name="name"
					:element="element"
					:getFieldClasses="getFieldClasses"
					:formHandlerType="formHandlerType"
					v-model="formValue"
					:valueKey="valueKey"
			/>
		</template>
		<template v-else-if="element.type === 'checkbox'">
			<span class="input-wrap">
			<input
					v-model="element.value"
					:type="element.type"
			/>
				<span class="checkbox-name" v-if="element.html" v-html="element.html" />
				<span class="checkbox-name" v-else>{{ element.title ? element.title : element.name }}</span>
			</span>
		</template>
		<template v-else-if="element.type === 'range'">
			<input
					v-model="element.value"
					:type="element.type"
					:min="element.min ? element.min : 0"
					:max="element.max ? element.max : 1"
					:step="element.step ? element.step : 0.1"
					:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
			/>
		</template>
		<EntityList
				v-else-if="element.type === 'EntityList'"
				v-model="element.value"
				:apiUrl="element.apiUrl"
				:body="element.body ? element.body : {}"
		/>
		<EntityBind
				v-else-if="element.type === 'EntityBind'"
				v-model="bindValues"
		/>
		<template v-else-if="element.type === 'notEditable'">
			<div class="pt-2 pb-2">
				{{ element.value }}
			</div>
		</template>
		<span
				v-if="showMaxLength && maxLength"
				:class="['length-line', currentLength > maxLength ? 'max-length-exceeded' : '']"
		>
			{{ currentLength }}/{{ maxLength }}
		</span>
		<span
			v-if="validateErrorPosition === 'bottom' && element.validateResult && showValidateError"
			class="field-error-message small-text"
		>
			{{ element.validateResult }}
		</span>
	</label>
</template>

<style lang="scss" scoped>
.length-line {
	@apply block w-full text-right;

	&.max-length-exceeded {
		@apply text-[var(--error-color)];
	}
}
</style>
