<script setup>
import { watch } from 'vue'

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	name: {
		type: String,
		required: true,
	},
	showValidateError: {
		type: Boolean,
		default: false,
	},
	validateErrorPosition: {
		type: String,
		default: 'top',
	},
	showTitle: {
		type: Boolean,
		default: true,
	},
	showChangeTypeButton: {
		type: Boolean,
		default: false,
	},
	labelClasses: {
		type: String,
		default: '',
	},
	fieldClasses: {
		type: String,
		default: '',
	},
});

const label = ref(null);

watch(props.element, async (newValue) => {
	// TODO не удается наблидать за props.element.value и props.element.validateResult, наблюдаю за всем объектом, что не совсем корректно
	if (newValue) {
		if (newValue.value && props.name === 'phone') {
			props.element.value = newValue.value.replace(/[^+\(\)\d]/g, '');
		}

		if (newValue.validateResult && newValue.validateResult.length > 0) {
			label.value.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth', });
		}
	}
})

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
</script>

<template>
	<label
			ref="label"
			:class="getLabelClasses"
	>
		<span
				v-if="validateErrorPosition === 'top' && element.validateResult && showValidateError"
		>
			{{ element.validateResult }}
		</span>
		<span v-if="showTitle && element.name">{{ element.name }}</span>
		<template v-if="element.type === 'text' || element.type === 'number' || element.type === 'password'"">
			<span class="input-wrap">
			<!--	Выбор значения из сущности (отдельный компонент) // медиабиблиотека			-->
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
						class="password-eye-wrap"
				>
					<font-awesome-icon
							v-if="element.type === 'password'"
							:icon="['far', 'eye-slash']"
							class="password-eye-icon"
					/>
					<font-awesome-icon
							v-if="element.type === 'text'"
							:icon="['far', 'eye']"
							class="password-eye-icon"
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
						<input
								type="file"
								class="col-span-2"
								:accept="element.accept"
								:name="name"
								:friendly-name="element.name"
								:placeholder="element.placeholder"
								:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
								@change="element.value = $event.target.files"
						/>
						<div class="col-span-2 text-center">
							<img :src="element.value" class="inline-block max-w-[500px] max-h-[500px]">
						</div>
					</div>
				</template>
				<template v-else>
					<input
							type="file"
							:accept="element.accept"
							:name="name"
							:friendly-name="element.name"
							:placeholder="element.placeholder"
							:class="[getFieldClasses, (element.validateResult ? 'error' : '')]"
							@change="element.value = $event.target.files"
					/>
				</template>
			</template>
		</template>
		<span
			v-if="validateErrorPosition === 'bottom' && element.validateResult && showValidateError"
			class="field-error-message small-text"
		>
			{{ element.validateResult }}
		</span>
	</label>
</template>
