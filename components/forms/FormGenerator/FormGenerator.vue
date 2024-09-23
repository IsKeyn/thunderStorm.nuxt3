<script setup>
import { watch } from 'vue'

import FileFromGallery from '@/composables/forms/FormGenerator/fragments/FileFromGallery.vue';

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
	// Отображать или скрывать кнопку очистки формы
	clearButtom: {
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

	if (props.element.type === 'file' && typeof newValue === 'object') {
		previewImage.value = URL.createObjectURL(newValue[0]);
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
</script>

<template>
	<label
			ref="label"
			:class="[element.type === 'hidden' ? 'hidden' : getLabelClasses]"
	>
		<span
				v-if="validateErrorPosition === 'top' && element.validateResult && showValidateError"
		>
			{{ element.validateResult }}
		</span>
		<span v-if="showTitle && element.name">{{ element.name }}</span>
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
						v-model="element.value"
						:type="element.type"
						:name="name"
						:friendly-name="element.name"
						:placeholder="element.placeholder"
						:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
				/>
				<span
						v-if="element.showChangeTypeButton"
						@click="showPassword"
						class="additional-action-wrap"
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
						class="additional-action-wrap"
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
						v-if="clearButtom"
						class="additional-action-wrap"
						@click="element.value = null"
				>
					<font-awesome-icon
							:icon="['fas', 'circle-xmark']"
							class="additional-action-icon"
							title="Очистить поле"
					/>
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
							<img v-if="fileType === 'image'" :src="element.value" class="inline-block max-w-[500px] max-h-[500px]" />
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
							<img v-if="previewImage" :src="previewImage" class="inline-block max-w-[500px] max-h-[500px]" />
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
		<template v-else-if="element.type === 'fileFromGallery'">
			<FileFromGallery
					:name="name"
					:element="element"
					:getFieldClasses="getFieldClasses"
			/>
		</template>
		<template v-else-if="element.type === 'checkbox'">
			<span class="input-wrap">
			<input
					v-model="element.value"
					:type="element.type"
			> {{ element.name }}
			</span>
		</template>
		<span
			v-if="validateErrorPosition === 'bottom' && element.validateResult && showValidateError"
			class="field-error-message small-text"
		>
			{{ element.validateResult }}
		</span>
	</label>
</template>
