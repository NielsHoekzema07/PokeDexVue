<script setup>
import { ref, inject, onMounted, watch, nextTick } from "vue";
import { MDCTopAppBar } from "@material/top-app-bar";
import { RouterLink } from "vue-router";

const topAppBarRef = ref(null);
const searchOpen = inject("searchOpen");
const searchQuery = inject("searchQuery");
const searchInputRef = ref(null);

onMounted(() => {
  new MDCTopAppBar(topAppBarRef.value);
});

// Zodra searchbar opent, focus direct het input veld
watch(searchOpen, async (val) => {
  if (val) {
    await nextTick();
    searchInputRef.value?.focus();
  }
});

function closeSearch() {
  searchOpen.value = false;
  searchQuery.value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function titleClick() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <header ref="topAppBarRef" class="mdc-top-app-bar mdc-top-app-bar--fixed">
    <div class="mdc-top-app-bar__row">
      <!-- Standaard appbar inhoud -->
      <Transition name="bar-swap">
        <template v-if="!searchOpen">
          <div class="bar-default">
            <section
              class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start"
            >              
              <RouterLink to="/" custom v-slot="{ navigate }">
                <span class="mdc-top-app-bar__title" @click="navigate"
                  >Pokédex</span
                >
              </RouterLink>
            </section>

            <section
              class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
            >
              <button
                class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
                @click="searchOpen = true"
                aria-label="Zoeken openen"
              >
                search
              </button>
              <button
                class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
              >
                more_vert
              </button>
            </section>
          </div>
        </template>
      </Transition>

      <!-- Search modus — vervangt de volledige appbar -->
      <Transition name="bar-swap">
        <template v-if="searchOpen">
          <div class="bar-search">
            <!-- Terug knop -->
            <button
              class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
              @click="closeSearch"
              aria-label="Zoeken sluiten"
            >
              arrow_back
            </button>

            <!-- Zoekinput -->
            <input
              ref="searchInputRef"
              class="search-input"
              type="text"
              :value="searchQuery"
              @input="searchQuery = $event.target.value"
              placeholder="Zoek Pokémon..."
              aria-label="Zoeken naar Pokémon"
            />

            <!-- Wis knop, alleen zichtbaar als er tekst is -->
            <button
              v-if="searchQuery"
              class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
              @click="searchQuery = ''"
              aria-label="Zoekopdracht wissen"
            >
              close
            </button>
          </div>
        </template>
      </Transition>
    </div>
  </header>

  <main class="mdc-top-app-bar--fixed-adjust"></main>
</template>

<style scoped>
/* Zorg dat beide bars de volledige breedte vullen */
.bar-default,
.bar-search {
  display: flex;
  align-items: center;
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0 4px;
}

/* Zoekinput — vult alle ruimte tussen de twee knoppen */
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 18px;
  font-family: inherit;
  padding: 0 8px;
  height: 100%;
  caret-color: #ffffff;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

/* Transitie animatie — standaard bar schuift links uit, search bar schuift rechts in */
.bar-swap-enter-active,
.bar-swap-leave-active {
  transition: all 0.2s ease-out;
  position: absolute;
  width: 100%;
}

.bar-swap-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.bar-swap-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
