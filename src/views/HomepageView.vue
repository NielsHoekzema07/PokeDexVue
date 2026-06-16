<script setup>
import PokemonCard from "@/components/PokemonCard.vue";
import PokemonDetailSheet from "@/components/PokemonDetailSheet.vue";
import TypeDetailSheet from "@/components/TypeDetailSheet.vue";
import Pagination from "@/components/Pagination.vue";
import { pokemonData } from "@/data/Pokemon.js";
import { ref, computed, onMounted, inject } from "vue";

const pokemons = ref([]);
const pageSize = ref(10);

function onPageSizeChange(size) {
  pageSize.value = size;
  currentPage.value = 1;
}
const currentPage = ref(1);
const likedPokemons = ref({});

const searchQuery = inject("searchQuery");

const selectedPokemon = ref(null);
const sheetVisible = ref(false);

const selectedType = ref(null);
const typeSheetVisible = ref(false);

onMounted(async () => {
  pokemons.value = await pokemonData;
  loadLikedFromStorage();
});

function loadLikedFromStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("liked_")) {
      const name = key.replace("liked_", "");
      likedPokemons.value[name] = true;
    }
  }
}

function isLiked(pokemon) {
  return !!likedPokemons.value[pokemon.name];
}

function likePokemon(pokemon) {
  if (isLiked(pokemon)) {
    localStorage.removeItem(`liked_${pokemon.name}`);
    delete likedPokemons.value[pokemon.name];
  } else {
    localStorage.setItem(`liked_${pokemon.name}`, JSON.stringify(pokemon));
    likedPokemons.value[pokemon.name] = true;
  }
}

const filteredPokemons = computed(() => {
  if (!searchQuery.value.trim()) return pokemons.value;
  return pokemons.value.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredPokemons.value.length / pageSize.value)
);

const paginatedPokemons = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPokemons.value.slice(start, start + pageSize.value);
});

function onPageChange(page) {
  currentPage.value = page;
}

function openSheet(pokemon) {
  selectedPokemon.value = pokemon;
  sheetVisible.value = true;
  document.body.style.overflow = "hidden";
}

function closeSheet() {
  sheetVisible.value = false;
  setTimeout(() => { selectedPokemon.value = null; }, 300);
  document.body.style.overflow = "";
}

function openTypeSheet(typeName) {
  selectedType.value = typeName;
  typeSheetVisible.value = true;
}

function closeTypeSheet() {
  typeSheetVisible.value = false;
  setTimeout(() => { selectedType.value = null; }, 300);
}
</script>

<template>
  <div class="pokemon-list">
    <PokemonCard
      v-for="pokemon in paginatedPokemons"
      :key="pokemon.url"
      :pokemon="pokemon"
      :liked="isLiked(pokemon)"
      @click="openSheet(pokemon)"
      @like="likePokemon(pokemon)"
    />
  </div>

  <div v-if="filteredPokemons.length === 0" class="empty-state">
    <span class="material-icons empty-icon">search_off</span>
    <p class="mdc-typography--body1">
      Geen Pokémon gevonden voor "{{ searchQuery }}"
    </p>
  </div>

  <Pagination
    :totalPages="totalPages"
    @pageChange="onPageChange"
    @pageSizeChange="onPageSizeChange"
  />

  <PokemonDetailSheet
    :pokemon="selectedPokemon"
    :visible="sheetVisible"
    :liked="selectedPokemon ? isLiked(selectedPokemon) : false"
    @close="closeSheet"
    @like="likePokemon"
    @type-selected="openTypeSheet"
  />

  <TypeDetailSheet
    :typeName="selectedType"
    :visible="typeSheetVisible"
    @close="closeTypeSheet"
  />
</template>

<style scoped>
.pokemon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  padding: 16px;
  min-height: 200px;
  margin-bottom: 80px;
}
.empty-state {
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  gap: 12px; padding: 64px 16px;
  text-align: center; color: rgba(0,0,0,.38);
}
.empty-icon { font-size: 48px; }
</style>