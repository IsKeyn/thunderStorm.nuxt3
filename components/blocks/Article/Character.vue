<script setup>
import FragmentMedia from '@/components/blocks/fragments/FragmentMedia.vue';
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';

import { watch } from "vue";
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Array,
		default: {},
	},
	structure: {
		type: Object,
		default: null,
	},
	editMode: {
		type: Boolean,
		default: false,
	},
});

const blockStructure = ref({});
const defaultStructure = {
	fields: {
		engTitle: 'Person name',
		rusTitle: '(Имя персонажа)',
		work: 'Программист',
		age: '32',
		sex: 'Мужской',
		target: 'Шерил Мейсон (дочь)',
		description: 'Писатель, потерявший жену четыре года назад, ныне живет со своей семилетней дочерью Шерил. Решил отдохнуть с дочерью в курортном городке Сайлент Хилл, в районе которого некогда ее и обнаружил. Уже подъезжая к «тихому городу», попадают в аварию, после которой Шерил внезапно исчезает, а Гарри приходится в отчаянии бродить по туманному городу в поисках истины. Вскоре герой начинает понимать, что он лишь невольный наблюдатель чудовищного резонанса, вызванного появлением Шерил в городе. Но все это для него не важно, он мечтает лишь вернуть дочь и убраться от городка как можно дальше.',
		image: {},
	},
	settings: {},
};

const addNewFieldsToStructure = () => {
	for (let fieldName in defaultStructure.fields) {
		if (!blockStructure.value.fields[fieldName]) {
			blockStructure.value.fields[fieldName] = defaultStructure.fields[fieldName];
		}
	}

	for (let settingName in defaultStructure.settings) {
		if (!blockStructure.value.settings[settingName]) {
			blockStructure.value.settings[settingName] = defaultStructure.settings[settingName];
		}
	}
};

if (props.editMode) {
	if (Object.keys(props.modelValue).length > 0) {
		blockStructure.value = toRaw(props.modelValue);
		addNewFieldsToStructure();
	} else {
		blockStructure.value = defaultStructure;
	}
} else {
	if (Object.keys(props.structure).length > 0) {
		blockStructure.value = toRaw(props.structure);
		addNewFieldsToStructure();
	} else {
		blockStructure.value = defaultStructure;
	}
}

const hasFirstLoad = ref(false);

watch(() => props.modelValue, (newValue) => {
	if (!hasFirstLoad.value) {
		blockStructure.value = toRaw(newValue);
	}
}, { deep: true });

watch(() => blockStructure.value, () => {
	saveValues();
}, { deep: true });

const saveTimeout = ref(null);

const saveValues = () => {
	clearTimeout(saveTimeout.value);

	saveTimeout.value = setTimeout(() => {
		emit('update:modelValue', blockStructure.value);
	}, 500);
}

// Контроль блоков

</script>

<template>
	<div class="th-block character-block">
		<ControlPanel class="control-panel" />
		<p>
			<FragmentMedia
					v-model="blockStructure.fields.image"
					:editMode="editMode"
			/>
<!--			<img src="http://insilenthill.ru/wp-content/uploads/2010/02/harry.jpg" border="0" alt="Гарри Мейсон" width="100" align="right"/>-->
		</p>
		<p style="text-align: center">
			<strong>
				<span style="color: #ff0000">
					<template v-if="editMode">
						<input v-model="blockStructure.fields.engTitle">
					</template>
					<template v-else-if="blockStructure.fields.engTitle">
						{{ blockStructure.fields.engTitle }}
					</template>
				</span>
			</strong>
			<br/>
			<template v-if="editMode">
				<input v-model="blockStructure.fields.rusTitle">
			</template>
			<template v-else-if="blockStructure.fields.rusTitle">
				{{ blockStructure.fields.rusTitle }}
			</template>
		</p>
		<p>
			<strong>Возраст:</strong>
			<template v-if="editMode">
				<input v-model="blockStructure.fields.age">
			</template>
			<template v-else-if="blockStructure.fields.age">
				{{ blockStructure.fields.age }}
			</template>
			<br/>
			<strong>Пол:</strong>
			<template v-if="editMode">
				<input v-model="blockStructure.fields.sex">
			</template>
			<template v-else-if="blockStructure.fields.sex">
				{{ blockStructure.fields.sex }}
			</template>
			<br/>
			<strong>Профессия:</strong>
			<template v-if="editMode">
				<input v-model="blockStructure.fields.work">
			</template>
			<template v-else-if="blockStructure.fields.work">
				{{ blockStructure.fields.work }}
			</template>
			<br/>
			<strong>Искание:</strong>
			<template v-if="editMode">
				<input v-model="blockStructure.fields.target">
			</template>
			<template v-else-if="blockStructure.fields.target">
				{{ blockStructure.fields.target }}
			</template>
			<br/>
			<strong>Описание:</strong>
			<template v-if="editMode">
				<input v-model="blockStructure.fields.description">
			</template>
			<template v-else-if="blockStructure.fields.description">
				{{ blockStructure.fields.description }}
			</template>
		</p>
	</div>
</template>

<style lang="scss" scoped>
.th-block {
	@apply relative;

	&:hover {
		.control-panel {
			@apply block;
		}
	}

	.control-panel {
		@apply absolute hidden right-0 top-0;
	}
}
</style>

<style lang="scss">
.character-block {
	img {
		@apply w-[10rem];

		float: right;
	}
}
</style>
