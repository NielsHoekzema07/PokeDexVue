<script setup>
//LikedPokemonView.vue
import { ref, onMounted } from "vue";
import PokemonCard from "@/components/PokemonCard.vue";
import PokemonDetailSheet from "@/components/PokemonDetailSheet.vue";

const likedPokemons = ref([]);
const selectedPokemon = ref(null);
const sheetVisible = ref(false);

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

function likePokemon(pokemon) {
  localStorage.setItem(`liked_${pokemon.name}`, JSON.stringify(pokemon));
  alert(`${pokemon.name} is al in je favorieten!`);
}
</script>

<template>
  <main class="liked-pokemon-view">
    <h1>Liked Pokémon</h1>
    <div v-if="likedPokemons.length === 0" class="empty-state">
      <p>Je hebt nog geen Pokémon geliked.</p>
    </div>
    <div class="pokemon-grid">
      <PokemonCard
        v-for="pokemon in likedPokemons"
        :key="pokemon.name"
        :pokemon="pokemon"
        @click="openSheet(pokemon)"
      />
    </div>
  </main>

  <!-- Detail Sheet (component) -->
  <PokemonDetailSheet
    :pokemon="selectedPokemon"
    :visible="sheetVisible"
    @close="closeSheet"
    @like="likePokemon"
  />
</template>

<style scoped>
.liked-pokemon-view {
  padding: 16px;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 64px 16px;
  color: rgba(0, 0, 0, 0.38);
}
</style>