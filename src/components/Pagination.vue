<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  totalPages: Number,
});

const emit = defineEmits(["pageChange", "pageSizeChange"]);

const currentPage = ref(1);
const inputValue = ref("1");
const pageSize = ref(10);
const pageSizeOptions = [5, 10, 20, 50];

watch(
  () => props.totalPages,
  () => {
    currentPage.value = 1;
    inputValue.value = "1";
  }
);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToPage(page) {
  if (page < 1) page = 1;
  if (page > props.totalPages) page = props.totalPages;

  currentPage.value = page;
  inputValue.value = String(page);
  scrollToTop();
  emit("pageChange", page);
}

function nextPage() {
  if (currentPage.value < props.totalPages) goToPage(currentPage.value + 1);
}

function prevPage() {
  if (currentPage.value > 1) goToPage(currentPage.value - 1);
}

function onInput() {
  const parsed = parseInt(inputValue.value);
  if (!isNaN(parsed) && parsed >= 1 && parsed <= props.totalPages) {
    goToPage(parsed);
  }
}

function onBlur() {
  inputValue.value = String(currentPage.value);
}

function onPageSizeChange() {
  currentPage.value = 1;
  inputValue.value = "1";
  emit("pageSizeChange", pageSize.value);
  scrollToTop();
}
</script>

<template>
  <div v-if="totalPages > 0" class="pagination">
    <!-- Vorige knop -->
    <button
      class="mdc-button mdc-button--outlined"
      @click="prevPage"
      :disabled="currentPage === 1"
    >
      <span class="mdc-button__ripple"></span>
      <span class="material-icons mdc-button__icon">chevron_left</span>
      <span class="mdc-button__label">Vorige</span>
    </button>

    <!-- Pagina input -->
    <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label pagination__input">
      <span class="mdc-notched-outline">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__trailing"></span>
      </span>
      <input
        class="mdc-text-field__input"
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        :min="1"
        :max="totalPages"
        v-model="inputValue"
        @input="onInput"
        @blur="onBlur"
        aria-label="Paginanummer"
      />
    </label>

    <span class="mdc-typography--body2 pagination__label">
      / {{ totalPages }}
    </span>

    <!-- Volgende knop -->
    <button
      class="mdc-button mdc-button--outlined"
      @click="nextPage"
      :disabled="currentPage === totalPages"
    >
      <span class="mdc-button__ripple"></span>
      <span class="mdc-button__label">Volgende</span>
      <span class="material-icons mdc-button__icon mdc-button__icon--trailing">chevron_right</span>
    </button>

    <!-- Page size dropdown -->
    <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label pagination__select">
      <span class="mdc-notched-outline">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__trailing"></span>
      </span>
      <select
        class="mdc-text-field__input"
        v-model="pageSize"
        @change="onPageSizeChange"
        aria-label="Pokémon per pagina"
      >
        <option v-for="option in pageSizeOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.pagination {
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 24px;
  bottom: env(safe-area-inset-bottom, 0);
}

.pagination__label {
  color: rgba(0, 0, 0, 0.6);
  white-space: nowrap;
}

@media (max-width: 480px) {
  .mdc-button__label {
    display: none;
  }

  .mdc-button {
    min-width: 36px;
    padding: 0 8px;
  }
}

.pagination__input {
  width: 64px;
  height: 40px;
}

.pagination__input input[type="number"]::-webkit-inner-spin-button,
.pagination__input input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.pagination__input input[type="number"] {
  text-align: center;
  font-size: 16px;
}

.pagination__select {
  width: 72px;
  height: 40px;
}

.pagination__select select {
  font-size: 16px;
  cursor: pointer;
  padding: 0 8px;
  appearance: none;
  text-align: center;
}
</style>