<script setup>
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

const editableStructure = ref({
	fields: {
		engTitle: 'Person name',
		rusTitle: '(Имя персонажа)',
		work: 'Программист',
		age: '32',
		sex: 'Мужской',
		target: 'Шерил Мейсон (дочь)',
		description: 'Писатель, потерявший жену четыре года назад, ныне живет со своей семилетней дочерью Шерил. Решил отдохнуть с дочерью в курортном городке Сайлент Хилл, в районе которого некогда ее и обнаружил. Уже подъезжая к «тихому городу», попадают в аварию, после которой Шерил внезапно исчезает, а Гарри приходится в отчаянии бродить по туманному городу в поисках истины. Вскоре герой начинает понимать, что он лишь невольный наблюдатель чудовищного резонанса, вызванного появлением Шерил в городе. Но все это для него не важно, он мечтает лишь вернуть дочь и убраться от городка как можно дальше.',
	},
	settings: {},
});

if (Object.keys(props.modelValue).length > 0) {
	editableStructure.value = toRaw(props.modelValue);
}

const hasFirstLoad = ref(false);

watch(() => props.modelValue, (newValue) => {
	if (!hasFirstLoad.value) {
		editableStructure.value = toRaw(newValue);
	}
}, { deep: true });

watch(() => editableStructure.value, () => {
	saveValues();
}, { deep: true });

const saveTimeout = ref(null);

const saveValues = () => {
	clearTimeout(saveTimeout.value);

	saveTimeout.value = setTimeout(() => {
		emit('update:modelValue', editableStructure.value);
	}, 500);
}
</script>

<template>
	<div>
		<p>
			<img src="http://insilenthill.ru/wp-content/uploads/2010/02/harry.jpg" border="0" alt="Гарри Мейсон" width="100" align="right"/>
		</p>
		<p style="text-align: center">
			<strong>
				<span style="color: #ff0000">
					<template v-if="editMode">
						<input v-model="editableStructure.fields.engTitle">
					</template>
					<template v-else-if="editableStructure.fields.engTitle">
						{{ structure.fields.engTitle }}
					</template>
				</span>
			</strong>
			<br/>
			<template v-if="editMode">
				<input v-model="editableStructure.fields.rusTitle">
			</template>
			<template v-else-if="editableStructure.fields.rusTitle">
				{{ structure.fields.rusTitle }}
			</template>
		</p>
		<p>
			<strong>Возраст:</strong>
			<template v-if="editMode">
				<input v-model="editableStructure.fields.age">
			</template>
			<template v-else-if="editableStructure.fields.age">
				{{ structure.fields.age }}
			</template>
			<br/>
			<strong>Пол:</strong>
			<template v-if="editMode">
				<input v-model="editableStructure.fields.sex">
			</template>
			<template v-else-if="editableStructure.fields.sex">
				{{ structure.fields.sex }}
			</template>
			<br/>
			<strong>Профессия:</strong>
			<template v-if="editMode">
				<input v-model="editableStructure.fields.work">
			</template>
			<template v-else-if="editableStructure.fields.work">
				{{ structure.fields.work }}
			</template>
			<br/>
			<strong>Искание:</strong>
			<template v-if="editMode">
				<input v-model="editableStructure.fields.target">
			</template>
			<template v-else-if="editableStructure.fields.target">
				{{ structure.fields.target }}
			</template>
			<br/>
			<strong>Описание:</strong>
			<template v-if="editMode">
				<input v-model="editableStructure.fields.description">
			</template>
			<template v-else-if="editableStructure.fields.description">
				{{ structure.fields.description }}
			</template>
		</p>
	</div>
</template>
