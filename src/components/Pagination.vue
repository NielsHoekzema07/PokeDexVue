<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  totalPages: Number,
});

const emit = defineEmits(["pageChange", "pageSizeChange"]);

const currentPage = ref(1);
const inputValue = ref("1");
const pageSize = ref(10);
const pageSizeOptions = [5, 10, 20, 50];
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

watch(
  () => props.totalPages,
  () => {
    currentPage.value = 1;
    inputValue.value = "1";
  },
);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToPage(page) {
  page = Math.max(1, Math.min(page, props.totalPages));
  currentPage.value = page;
  inputValue.value = String(page);
  scrollToTop();
  emit("pageChange", page);
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

function selectPageSize(option) {
  pageSize.value = option;
  dropdownOpen.value = false;
  currentPage.value = 1;
  inputValue.value = "1";
  emit("pageSizeChange", option);
  scrollToTop();
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div v-if="totalPages > 0" class="pagination">
    <button
      class="pagination__btn"
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      aria-label="Vorige pagina"
    >
      <span class="material-icons">chevron_left</span>
    </button>

    <input
      class="pagination__input"
      type="number"
      inputmode="numeric"
      :min="1"
      :max="totalPages"
      v-model="inputValue"
      @input="onInput"
      @blur="onBlur"
      aria-label="Paginanummer"
    />

    <span class="pagination__label">/ {{ totalPages }}</span>

    <button
      class="pagination__btn"
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      aria-label="Volgende pagina"
    >
      <span class="material-icons">chevron_right</span>
    </button>

    <span class="pagination__label pagination__label--hide-sm">Per pagina</span>

    <div class="pagination__select-wrap" ref="dropdownRef">
      <button
        class="pagination__select-btn"
        @click="dropdownOpen = !dropdownOpen"
        :aria-expanded="dropdownOpen"
        aria-label="Rijen per pagina"
      >
        {{ pageSize }}
        <span class="material-icons">{{ dropdownOpen ? 'expand_less' : 'expand_more' }}</span>
      </button>

      <ul
        v-if="dropdownOpen"
        class="pagination__menu"
        role="listbox"
        aria-label="Per pagina opties"
      >
        <li
          v-for="option in pageSizeOptions"
          :key="option"
          class="pagination__menu-item"
          :class="{ 'pagination__menu-item--active': option === pageSize }"
          role="option"
          :aria-selected="option === pageSize"
          @click="selectPageSize(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 8px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
  z-index: 4;
}

.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.7);
  transition: background 0.15s;
}

.pagination__btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.06);
}

.pagination__btn:disabled {
  color: rgba(0, 0, 0, 0.26);
  cursor: default;
}

.pagination__input {
  width: 48px;
  height: 36px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.875rem;
  padding: 0;
  outline: none;
}

.pagination__input:focus {
  border-color: #6200ee;
}

.pagination__input::-webkit-inner-spin-button,
.pagination__input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.pagination__label {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  margin: 0 2px;
}

.pagination__select-wrap {
  position: relative;
}

.pagination__select-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  background: transparent;
  font-size: 0.875rem;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.87);
  transition: border-color 0.15s;
}

.pagination__select-btn:hover {
  border-color: rgba(0, 0, 0, 0.6);
}

.pagination__menu {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 10;
}

.pagination__menu-item {
  padding: 8px 16px;
  font-size: 0.875rem;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.87);
}

.pagination__menu-item:hover {
  background: rgba(0, 0, 0, 0.06);
}

.pagination__menu-item--active {
  color: #6200ee;
  font-weight: 500;
}

@media (max-width: 360px) {
  .pagination__label--hide-sm {
    display: none;
  }

  .pagination {
    gap: 2px;
  }
}
</style>