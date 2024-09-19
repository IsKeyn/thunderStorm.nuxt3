<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import TagsList from '@/components/tags/TagsList.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { watch } from "vue";

const files = ref([]);
const formSample = ref(
		{
			name: {
				name: 'Наименование',
				value: '',
				type: 'text',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			description: {
				name: 'Описание',
				value: '',
				type: 'text',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			type: {
				name: 'Тип',
				value: '',
				type: 'text',
				validateRules: '',
				classes: ['w-full', 'mt-[5px]'],
			},
			tags: {
				name: 'Теги',
				value: [],
				type: 'array',
			},
		}
);

const fileKeyName = ref('src');
const fileSample = ref(
		{
			name: 'Файл',
			value: '',
			type: 'file',
			validateRules: 'mime_1, size_10',
			classes: ['w-full', 'mt-[5px]'],
			showFile: true,
			fileType: 'src',
		}
);

const form = ref([]);

watch(files, async () => {
	if (files._value.length > 0) {
		form.value = [];
		const rawSampleObj = toRaw(formSample.value);
		for (var i = 0; i < files._value.length; i++) {
			const newObj = {};

			Object.keys(rawSampleObj).forEach((key) => {
				newObj[key] = {...rawSampleObj[key]};
			});

			newObj[fileKeyName.value] = {...fileSample.value};
			newObj[fileKeyName.value].value = [ files._value[i] ];

			newObj['preview'] = URL.createObjectURL(files._value[i]);

			form.value.push(newObj);
		}
	}
});

const deleteElement = (index) => {
	form.value = form.value.filter((item, i) => i !== index);
}

import { math } from '@/composables/math.js'
const { bytesToMb } = math();

const matchMbCount = (bytes) => {
	return bytesToMb(bytes).toFixed(3) + ' mb';
}

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const getFormattedData = (date) => {
	return getFormattedDate('d.m.Y H:i:s', date);
}

import { validate } from '@/composables/validate.js';
const { validateElement, validateForm  } = validate();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const sendData = async () => {
	let hasErrors = false;

	form.value.forEach((item) => {
		for (const formKey in item) {
			if (formKey !== 'preview') {
				item[formKey].validateResult = '';
			}
		}

		const { status, key, validateResult } = validateForm(item);

		if (!status) {
			item[key].validateResult = validateResult;
			hasErrors = true;
		}
	});

	if (hasErrors) {
		alert(
				'Проверьте ошибки в форме',
				10000,
				'#004d42',
		);
	} else {
		await sendRequest();
	}
}

const responseErrors = ref({});
const requestInProgress = ref(false);

import { api } from '@/composables/api.js';
const { apiUrl, backendUrl, errorHandler } = api();

const Authorization = useCookie('Authorization');

const sendRequest = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		// TODO сделать проверку на время жизни csrf токена
		await $fetch(
				`${backendUrl.value}/sanctum/csrf-cookie`,
				{
					withCredentials: true,
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		const XsrfToken = useCookie('XSRF-TOKEN');

		const body = preparedRequestBody();

		let request = '';
		let opts = {};

		request = `${apiUrl.value}admin/media/multi-store`;
		opts = {
			method: 'post',
			credentials: 'include',
			headers: {
				Authorization: Authorization.value,
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
				'X-XSRF-TOKEN': XsrfToken.value,
			},
			body,
		};

		const response = await $fetch(request, opts);

		if (response) {
			requestInProgress.value = false;
			form.value = [];
			alert(
					'Файлы успешно добавлены',
					10000,
					'#004d42',
			);
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const preparedRequestBody = () => {
	const formData = new FormData();

	form.value.forEach((item, key) => {
		const rawData = toRaw(item);
		for (let formKey in rawData) {
			if (rawData[formKey].type === 'file') {
				formData.append(`multiFiles[${key}][${formKey}]`, rawData[formKey].value[0]);
			} else if (rawData[formKey].type === 'array') {
				rawData[formKey].value.forEach((item, arrKey) => {
					formData.append(`multiFiles[${key}][${formKey}][${arrKey}]`, item);
				});
			} else {
				formData.append(`multiFiles[${key}][${formKey}]`, rawData[formKey].value);
			}
		}
	});

	return formData;
}

const setAllElementsFromThis = (index) => {
	form.value.forEach((element, key) => {
		if (key !== index) {

			for (const key in element) {
				if (key !== 'src' && key !== 'preview') {
					element[key].value = form.value[index][key].value;
				}
			};
		}
	});
}
</script>

<template>
	<div>
		<label>
			<div class="multi-upload-block">
				Выберите несколько файлов для загрузки
			</div>
			<input
					@change="files = $event.target.files"
					type="file"
					multiple
			>
		</label>

		<div
				v-if="form.length > 0"
				class="upload-file-block"
		>
			<div
					v-for="(element, inx) in form"
					class="mb-5"
			>
				<h3>Файл для загрузки {{ inx + 1 }}</h3>
				<div class="wrapper">
					<div class="col-span-8">
						<button
								v-if="inx === 0"
								class="btn btn-primary"
								@click="setAllElementsFromThis(inx)"
						>
							Заполнить все медия, значениями из данной формы
						</button>
						<FormGenerator
								v-for="(field, index) in element"
								:key="index"
								:name="index"
								:element="field"
								:showValidateError=true
								validateErrorPosition="bottom"
								:labelClasses="['block', 'mb-[10px]']"
								:fieldClasses="field.classes"
						/>
						<TagsList
								v-model="element.tags.value"
						/>
					</div>
					<div class="info-block">
						<img v-if="element.preview" :src="element.preview">
						<div class="mb-2 font-bold">Информация о файле</div>
						<div>Название файла: {{ element[fileKeyName].value[0].name }}</div>
						<div>Размер: {{ matchMbCount(element[fileKeyName].value[0].size) }}</div>
						<div>Тип: {{ element[fileKeyName].value[0].type }}</div>
						<div>Последнее изменение: {{ getFormattedData(element[fileKeyName].value[0].lastModified) }}</div>
						<button class="btn btn-primary" @click="deleteElement(inx)">Удалить файл</button>
					</div>
				</div>
			</div>
			<ActionButton
					buttonName="Отправить"
					:actionInProgress="requestInProgress"
					@startAction="sendData()"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
label {
	.multi-upload-block {
		@apply max-w-[500px]
		pt-[50px] pr-[100px] pb-[50px] pl-[100px]
		text-center text-[18px]
		cursor-pointer
		;

		border: 1px solid var(--second-border-color);

		&:hover {
			@apply text-[var(--main-hover-color)];

			border: 1px solid var(--main-hover-color);
		}
	}

	input[type="file"] {
		display: none;
	}
}

.upload-file-block {
	@apply mt-8;

	h3 {
		@apply mb-2;
		font-size: var(--main-title-font-size);
	}

	.wrapper {
		@apply grid grid-cols-12;

		.info-block {
			@apply col-span-4 pl-[30px] text-left;
		}
	}
}
</style>
