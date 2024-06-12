<script setup>

const props = defineProps({
	showTimeSelector: {
		type: Boolean,
		default: false,
	},
});

import { date } from '@/composables/date.js';
const {
	getFormattedDate,
	monthName,
	weekDayName,
	twoDigits,
} = date();

import { validate } from '@/composables/validate.js';
const {
	validateElement,
} = validate();

import { notifications } from '@/composables/notifications.js';
const {
	error,
} = notifications();

const selectedDateObj = ref(null); // Объект выбранной даты

const selectedDay = ref(null); // Номер выбранного дня
const selectedMonth = ref(null); // Номер выбранного месяца
const selectedYear = ref(null); // Номер выбранного года

const selectedHour = ref(twoDigits(0)); // Номер выбранного часа
const selectedMinut = ref(twoDigits(0)); // Номер выбранной минуты

const positionedMonth = ref(null); // Номер текущего отображаемого в календаре месяца
const positionedYear = ref(null); // Номер текущего отображаемого в календаре года

const {
	changeMinut,
	changeHour,
	selectDay,
	changeMonth,
	changeYear,
} = setValuesFromInterface();

const {
	setSelectedValues,
	setMinutValue,
	setHourValue,
	setMonthValues,
	setYearValues,
} = setValues();

const {
	setMonthListDays,
	currentMonthDaysArray,
} = calendarMonth();

const init = () => {
	/*
	* Функция инициализации календаря, устанавливает выбранную, текущую и старуые значения, как текущие
	*/

	selectedDateObj.value = new Date();

	setMonthValues(selectedDateObj.value.getMonth());
	setYearValues(selectedDateObj.value.getFullYear());
	setSelectedValues(selectedDateObj.value);
	setMonthListDays(positionedYear.value, positionedMonth.value);
}

init();

function setValuesFromInterface () {
	const changeMinut = (direction) => {
		const selectedMinutNumber = Number(selectedMinut.value);

		if (direction === 'prev') {
			if (selectedMinutNumber === 0) {
				setMinutValue(59);
				changeHour('prev');
			} else {
				setMinutValue(selectedMinutNumber - 1);
			}
		}

		if (direction === 'next') {
			if (selectedMinutNumber === 59) {
				setMinutValue(0);
				changeHour('next');
			} else {
				setMinutValue(selectedMinutNumber + 1);
			}
		}
	}

	const changeHour = (direction) => {
		const selectedHourNumber = Number(selectedHour.value);

		if (direction === 'prev') {
			if (selectedHourNumber === 0) {
				setHourValue(23);
			} else {
				setHourValue(selectedHourNumber - 1);
			}
		}

		if (direction === 'next') {
			if (selectedHourNumber === 23) {
				setHourValue(0);
			} else {
				setHourValue(selectedHourNumber + 1);
			}
		}
	}

	const selectDay = (date) => {
		let needRefreshMonth = false;

		if (date.getMonth() !== positionedMonth.value) {
			needRefreshMonth = true;
		}

		setMonthValues(date.getMonth());
		setYearValues(date.getFullYear());
		setSelectedValues(date);

		if (needRefreshMonth) {
			setMonthListDays(positionedYear.value, positionedMonth.value);
		}
	}

	const changeMonth = (direction) => {
		if (direction === 'prev') {
			if (positionedMonth.value === 0) {
				setYearValues(positionedYear.value - 1);
				setMonthValues(11);
			} else {
				setMonthValues(positionedMonth.value - 1);
			}
		}

		if (direction === 'next') {
			if (positionedMonth.value === 11) {
				setYearValues(positionedYear.value + 1);
				setMonthValues(0);
			} else {
				setMonthValues(positionedMonth.value + 1);
			}
		}

		setMonthListDays(positionedYear.value, positionedMonth.value);
	}

	const changeYear = (direction) => {
		if (direction === 'prev') {
			setYearValues(positionedYear.value - 1);
		} else if (direction === 'next') {
			setYearValues(positionedYear.value + 1);
		}
	}

	return {
		changeMinut,
		changeHour,
		selectDay,
		changeMonth,
		changeYear,
	};
}

function setValues() {
	// Для input'ов сохраняю старые значения, чтобы вернуть значения в случае не правильного ввода
	const oldYear = ref(null);

	const oldHour = ref(twoDigits(0));
	const oldMinut = ref(twoDigits(0));

	const setSelectedValues = (date) => {
		selectedDay.value = date.getDate();
		selectedMonth.value = date.getMonth();
		selectedYear.value = date.getFullYear();
	}

	const setMinutValue = (newValue) => {
		const validateResult = validateElement(newValue, 'integer, minNumber_0, maxNumber_59');

		if (!validateResult) {
			selectedMinut.value = twoDigits(Number(newValue));
			oldMinut.value = twoDigits(Number(newValue));
		} else {
			selectedMinut.value = oldMinut.value;
			error(validateResult);
		}
	}

	const setHourValue = (newValue) => {
		const validateResult = validateElement(newValue, 'integer, minNumber_0, maxNumber_23');

		if (!validateResult) {
			selectedHour.value = twoDigits(Number(newValue));
		} else {
			selectedHour.value = oldHour.value;

			error(validateResult);
		}
	}

	const setMonthValues = (value) => {
		positionedMonth.value = Number(value);
		setMonthListDays(positionedYear.value, positionedMonth.value);
	}

	const setYearValues = (newValue) => {
		const validateResult = validateElement(newValue, 'integer');

		if (!validateResult) {
			positionedYear.value = Number(newValue);
			oldYear.value = Number(newValue);
			setMonthListDays(positionedYear.value, positionedMonth.value);
		} else {
			positionedYear.value = oldYear.value;
			error(validateResult);
		}
	}

	return {
		setSelectedValues,
		setMinutValue,
		setHourValue,
		setMonthValues,
		setYearValues,
	};
}

function calendarMonth() {
	const currentMonthDaysArray = ref([]); // Массив с днями месяца отобажаемого в данный момент

	const setMonthListDays = (year, month) => {
		currentMonthDaysArray.value = [];

		const lastDateOfMonth = getDaysInMonthCount(year, month);

		const firstDayOfMonth = new Date(year, month,1).getDay();
		const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();

		if (firstDayOfMonth > 1) {
			const prevMonthObj = {
				year,
				month: month,
				daysCount: null,
			};

			if (month === 0) {
				prevMonthObj.year = year - 1;
				prevMonthObj.month = 11;
				prevMonthObj.daysCount = getDaysInMonthCount(prevMonthObj.year, prevMonthObj.month);
			} else {
				prevMonthObj.month = month - 1;
				prevMonthObj.daysCount = getDaysInMonthCount(prevMonthObj.year, prevMonthObj.month);
			}

			const firstData = prevMonthObj.daysCount - (firstDayOfMonth - 2);

			for (let i = firstData; i <= prevMonthObj.daysCount; i++) {
				currentMonthDaysArray.value.push(new Date(prevMonthObj.year, prevMonthObj.month, i));
			}
		}

		for (let i = 1; i <= lastDateOfMonth; i++) {
			currentMonthDaysArray.value.push(new Date(year, month, i));
		}

		if (lastDayOfMonth < 6 && lastDayOfMonth !== 0) {
			const nextMonthObj = {
				year,
				month: null,
				daysCount: null,
			};

			if (month === 11) {
				nextMonthObj.year = year + 1;
				nextMonthObj.month = 0;
				nextMonthObj.daysCount = getDaysInMonthCount(nextMonthObj.year, nextMonthObj.month);
			} else {
				nextMonthObj.month = month + 1;
				nextMonthObj.daysCount =  getDaysInMonthCount(nextMonthObj.year, nextMonthObj.month);
			}

			const lastData = 7 - lastDayOfMonth;

			for (let i = 1; i <= lastData; i++) {
				currentMonthDaysArray.value.push(new Date(nextMonthObj.year, nextMonthObj.month, i));
			}
		}
	}

	const getDaysInMonthCount = (year, month) => {
		return new Date(year, month + 1, 0).getDate();
	}

	return {
		setMonthListDays,
		currentMonthDaysArray,
	};
}
</script>

<template>
	<div>
		<div class="year-box">
			<font-awesome-icon :icon="['fas', 'angle-left']" @click="changeYear('prev')" />
			<span class="input-wrap">
				<input
						v-model="positionedYear"
						@change="setYearValues(positionedYear)"
				>
				<span class="additional-action-wrap">
					<font-awesome-icon :icon="['fas', 'check']" class="additional-action-icon" />
				</span>
			</span>
			<font-awesome-icon :icon="['fas', 'angle-right']" @click="changeYear('next')" />
		</div>

		<div class="month-box">
			<font-awesome-icon :icon="['fas', 'angle-left']" @click="changeMonth('prev')" />
			<select v-model="positionedMonth" @change="setMonthValues(positionedMonth)">
				<option v-for="n in 12" :value="n - 1">
					{{ monthName(n - 1, 'ru', 'im') }}
				</option>
			</select>
			<font-awesome-icon :icon="['fas', 'angle-right']" @click="changeMonth('next')" />
		</div>

		<div>
			<ol class="week-days">
				<li v-for="n in 7">
					<span>{{ weekDayName(n - 1) }}</span>
				</li>
			</ol>
			<ol class="days">
				<li
						v-for="(day, index) in currentMonthDaysArray"
						:key="index"
						:class="[
								selectedDay === day.getDate() && selectedMonth === day.getMonth() && selectedYear === day.getFullYear() ? 'selected-day' : '',
								positionedMonth === day.getMonth() ? 'selected-month' : '',
						]"
						@click="selectDay(day)"
				>
					<span>{{ day.getDate() }}</span>
				</li>
			</ol>
		</div>

		<div v-if="showTimeSelector" class="time-box">
			Выбор времени
			<div class="select-box">
				<div class="time-selector">
					<div class="button-plus">
						<font-awesome-icon :icon="['fas', 'angle-up']" @click="changeHour('next')" />
					</div>
					<div>
						<span class="input-wrap">
							<input
									v-model="selectedHour"
									type="number"
									min="0" max="23"
									@input="setHourValue(selectedHour)"
							>
						</span>
					</div>
					<div class="button-minus">
						<font-awesome-icon :icon="['fas', 'angle-down']" @click="changeHour('prev')" />
					</div>
				</div>
				<span>:</span>
				<div class="time-selector">
					<div class="button-plus">
						<font-awesome-icon :icon="['fas', 'angle-up']" @click="changeMinut('next')" />
					</div>
					<div>
						<span class="input-wrap">
							<input
									v-model="selectedMinut"
									type="number"
									min="0" max="59"
									@input="setMinutValue(selectedMinut)"
							>
						</span>
					</div>
					<div class="button-minus">
						<font-awesome-icon :icon="['fas', 'angle-down']" @click="changeMinut('prev')" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.year-box,
.month-box {
	@apply
		flex justify-between justify-center items-center
		text-[20px] bg-[var(--second-bg-color)]
		mb-[4px]
		pt-[5px] pr-[15px] pb-[5px] pl-[15px]
	;

	svg {
		@apply cursor-pointer;

		&:hover {
			@apply text-[var(--main-hover-color)];
		}
	}
}

ol {
	@apply grid grid-cols-7 gap-1 mb-[4px];

	li {
		@apply bg-[var(--third-bg-color)];

		span {
			@apply pt-[5px] pl-[5px];
		}
	}

	&.week-days {
	}

	&.days {
		li {
			@apply relative w-full h-0 pb-[100%];

			span {
				@apply absolute top-0 left-0 text-[#393939];
			}

			&.selected-day {
				@apply bg-[var(--second-bg-color)];
			}

			&.selected-month {
				span {
					@apply text-[var(--main-text-color)];
				}
			}

			&:hover {
				@apply cursor-pointer bg-[var(--second-bg-color)];
			}
		}
	}
}

.time-box {
	.select-box {
		@apply flex items-center text-[20px];

		svg {
			@apply cursor-pointer;

			&:hover {
				@apply text-[var(--main-hover-color)];
			}
		}

		span {
			@apply pr-[5px] pl-[5px];
		}

		div {
			@apply text-center;

			&.button-plus {
				@apply mb-[-5px];
			}

			&.button-minus {
				@apply mt-[-5px];
			}
		}
	}
}

// input'ы для ввода собственных значений
span.input-wrap {
	input {
		@apply text-center pt-0 pb-0;

		&:hover {
			border-bottom: 1px solid var(--second-border-color);

			.additional-action-wrap {
				@apply block;
			}
		}

		&:focus {
			border-bottom: 1px solid var(--second-border-color);
		}
	}

	input[type=number] {
		-moz-appearance:textfield;
	}

	input[type=number]::-webkit-inner-spin-button,
	input[type=number]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		appearance: none;
		margin: 0;
	}

	&:hover {
		.additional-action-wrap {
			@apply block;
		}
	}

	.additional-action-wrap {
		@apply hidden;
	}
}

.year-box {
	span.input-wrap {
		input {
			@apply bg-[var(--second-bg-color)];
			border-bottom: 1px solid var(--second-bg-color);

			&:hover {
				border-bottom: 1px solid var(--second-border-color);

				.additional-action-wrap {
					@apply block;
				}
			}
		}
	}
}

.time-box {
	span.input-wrap {
		input {
			@apply bg-[var(--main-bg-color)] w-[2rem];
			border-bottom: 1px solid var(--main-bg-color);

			&:hover {
				border-bottom: 1px solid var(--second-border-color);
			}
		}
	}
}

select {
	@apply bg-[var(--second-bg-color)] text-center;

	border-bottom: 1px solid var(--second-bg-color);
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;

	&:hover {
		border-bottom: 1px solid var(--second-border-color);

		.additional-action-wrap {
			@apply block;
		}
	}
}
</style>
