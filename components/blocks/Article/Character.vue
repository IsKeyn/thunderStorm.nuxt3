<script setup>
import ControlPanel from '@/components/blocks/extensions/ControlPanel.vue';
import FragmentMedia from '@/components/blocks/fragments/FragmentMedia.vue';

import { blocks } from '@/composables/blocks.js';

const props = defineProps({
	structure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	editMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});

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

const {
	blockStructure,
	setBlockStructure,
} = blocks(defaultStructure, props.structure, props.blockIndex, props.editMode);

setBlockStructure();
</script>

<template>
	<div class="th-block character-block">
		<ControlPanel
				v-if="editMode"
				:blockIndex="blockIndex"
		/>
		<FragmentMedia
				v-model="blockStructure.fields.image"
				:editMode="editMode"
		/>
		<div class="header">
			<span class="eng-title">
				<template v-if="editMode">
					<input v-model="blockStructure.fields.engTitle">
				</template>
				<template v-else-if="blockStructure.fields.engTitle">
					{{ blockStructure.fields.engTitle }}
				</template>
			</span>
			<span class="rus-title">
				<template v-if="editMode">
					<input v-model="blockStructure.fields.rusTitle">
				</template>
				<template v-else-if="blockStructure.fields.rusTitle">
					{{ blockStructure.fields.rusTitle }}
				</template>
			</span>
		</div>
		<div>
			<div>
				<span class="field-title">Возраст: </span>
				<template v-if="editMode">
					<input v-model="blockStructure.fields.age">
				</template>
				<template v-else-if="blockStructure.fields.age">
					{{ blockStructure.fields.age }}
				</template>
			</div>
			<div>
				<span class="field-title">Пол: </span>
				<template v-if="editMode">
					<input v-model="blockStructure.fields.sex">
				</template>
				<template v-else-if="blockStructure.fields.sex">
					{{ blockStructure.fields.sex }}
				</template>
			</div>
			<div>
				<span class="field-title">Профессия: </span>
				<template v-if="editMode">
					<input v-model="blockStructure.fields.work">
				</template>
				<template v-else-if="blockStructure.fields.work">
					{{ blockStructure.fields.work }}
				</template>
			</div>
			<div>
				<span class="field-title">Искание: </span>
				<template v-if="editMode">
					<input v-model="blockStructure.fields.target">
				</template>
				<template v-else-if="blockStructure.fields.target">
					{{ blockStructure.fields.target }}
				</template>
			</div>
			<div>
				<span class="field-title">Описание: </span>
				<template v-if="editMode">
					<textarea v-model="blockStructure.fields.description" />
				</template>
				<template v-else-if="blockStructure.fields.description">
					{{ blockStructure.fields.description }}
				</template>
			</div>

		</div>
	</div>
</template>

<style lang="scss">
.character-block {
	@apply mt-4 mb-4 overflow-auto;

	img {
		@apply float-right w-[10rem];
	}

	.header {
		@apply text-center;

		.eng-title,
		.rus-title {
			@apply block;
		}

		.eng-title {
			@apply font-bold text-[1.2rem];

			color: var(--main-title-color);
		}
	}

	.field-title {
		@apply font-bold;
	}
}
</style>
