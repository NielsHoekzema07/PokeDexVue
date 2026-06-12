<script setup>
import PokemonCard from "@/components/PokemonCard.vue";
import PokemonDetailSheet from "@/components/PokemonDetailSheet.vue";
import Pagination from "@/components/Pagination.vue";
import { pokemonData } from "@/data/Pokemon.js";
import { ref, computed, onMounted, inject } from "vue";

const pokemons = ref([]);
const pageSize = ref(10);
const currentPage = ref(1);

const searchQuery = inject("searchQuery");

const selectedPokemon = ref(null);
const sheetVisible = ref(false);

onMounted(async () => {
  pokemons.value = await pokemonData;
});

function likePokemon(pokemon) {
  localStorage.setItem(`liked_${pokemon.name}`, JSON.stringify(pokemon));
  alert(`${pokemon.name} is toegevoegd aan je favorieten!`);
}

const filteredPokemons = computed(() => {
  if (!searchQuery.value.trim()) {
    return pokemons.value;
  }
  return pokemons.value.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredPokemons.value.length / pageSize.value);
});

const paginatedPokemons = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredPokemons.value.slice(start, end);
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
  setTimeout(() => {
    selectedPokemon.value = null;
  }, 300);
  document.body.style.overflow = "";
}
</script>

<template>
  <!-- Pokemon List -->
  <div class="pokemon-list">
    <PokemonCard
      v-for="pokemon in paginatedPokemons"
      :key="pokemon.url"
      :pokemon="pokemon"
      @click="openSheet(pokemon)"
    />
  </div>

  <!-- Empty State -->
  <div v-if="filteredPokemons.length === 0" class="empty-state">
    <span class="material-icons empty-icon">search_off</span>
    <p class="mdc-typography--body1">
      Geen Pokémon gevonden voor "{{ searchQuery }}"
    </p>
  </div>

  <!-- Pagination -->
  <Pagination
    :totalPages="totalPages"
    @pageChange="onPageChange"
  />

  <!-- Detail Sheet -->
  <PokemonDetailSheet
    :pokemon="selectedPokemon"
    :visible="sheetVisible"
    @close="closeSheet"
    @like="likePokemon"
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 64px 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.38);
}

.empty-icon {
  font-size: 48px;
}
</style>