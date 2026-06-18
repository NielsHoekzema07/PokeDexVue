<script setup>
//LikedPokemonView.vue
import { ref, computed, onMounted, inject } from "vue";
import PokemonCard from "@/components/PokemonCard.vue";
import PokemonDetailSheet from "@/components/PokemonDetailSheet.vue";
import Pagination from "@/components/Pagination.vue";

const likedPokemons = ref([]);
const selectedPokemon = ref(null);
const sheetVisible = ref(false);
const pageSize = ref(10);
const currentPage = ref(1);
function onPageSizeChange(size) {
  pageSize.value = size;
  currentPage.value = 1;
}
const searchQuery = inject("searchQuery");

onMounted(() => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("liked_")) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key));
        if (parsed && typeof parsed === "object" && parsed.url) {
          likedPokemons.value.push(parsed);
        } else {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
  }
});

const filteredPokemons = computed(() => {
  if (!searchQuery.value.trim()) return likedPokemons.value;
  return likedPokemons.value.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredPokemons.value.length / pageSize.value),
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
  setTimeout(() => {
    selectedPokemon.value = null;
  }, 300);
  document.body.style.overflow = "";
}

function unlikePokemon(pokemon) {
  localStorage.removeItem(`liked_${pokemon.name}`);
  likedPokemons.value = likedPokemons.value.filter(
    (p) => p.name !== pokemon.name,
  );

  if (selectedPokemon.value?.name === pokemon.name) {
    closeSheet();
  }
}
</script>

<template>
  <main class="liked-pokemon-view">
    <h1>Liked Pokémon</h1>

    <!-- Geen likes -->
    <div v-if="likedPokemons.length === 0" class="empty-state">
      <span class="material-icons empty-icon">favorite_border</span>
      <p>Je hebt nog geen Pokémon geliked.</p>
    </div>

    <!-- Zoekresultaten leeg maar wel likes -->
    <div v-else-if="filteredPokemons.length === 0" class="empty-state">
      <span class="material-icons empty-icon">search_off</span>
      <p>Geen liked Pokémon gevonden voor "{{ searchQuery }}"</p>
    </div>

    <div class="pokemon-grid">
      <PokemonCard
        v-for="pokemon in paginatedPokemons"
        :key="pokemon.name"
        :pokemon="pokemon"
        :liked="true"
        @click="openSheet(pokemon)"
        @like="unlikePokemon(pokemon)"
      />
    </div>
  </main>

  <Pagination
    :totalPages="totalPages"
    @pageChange="onPageChange"
    @pageSizeChange="onPageSizeChange"
  />

  <!-- Detail Sheet -->
  <PokemonDetailSheet
    :pokemon="selectedPokemon"
    :visible="sheetVisible"
    :liked="true"
    @close="closeSheet"
    @like="unlikePokemon"
  />
</template>

<style scoped>
.liked-pokemon-view {
  padding: 16px;
  margin-bottom: 80px;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
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
