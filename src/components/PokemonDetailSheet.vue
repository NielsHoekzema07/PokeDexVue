<script setup>
// PokemonDetailSheet.vue
import { ref, watch } from "vue";
import { typeColors } from "@/data/TypeColors.js";

const props = defineProps({
  pokemon: {
    type: Object,
    default: null,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  liked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "like", "type-selected"]);
const details = ref(null);
const loading = ref(false);

function getPokemonId(url) {
  const parts = url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1];
}

function getPokemonImage(url) {
  const id = getPokemonId(url);
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function getTypeColor(type) {
  return typeColors[type] || "#A8A878";
}

function formatStatName(name) {
  const map = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };
  return map[name] || name;
}

function getStatColor(value) {
  if (value >= 100) return "#4CAF50";
  if (value >= 60) return "#FFC107";
  return "#F44336";
}

watch(
  () => [props.pokemon, props.visible],
  async ([newPokemon, visible]) => {
    if (!newPokemon || !visible) return;

    loading.value = true;
    details.value = null;
    console.log("Fetching details for", newPokemon.name);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${newPokemon.name}`,
      );
      details.value = await res.json();
    } finally {
      loading.value = false;
    }
  },
);
</script>

<template>
  <section
    :class="['sheet', visible ? 'sheet--visible' : '']"
    role="dialog"
    aria-modal="true"
    :aria-label="pokemon ? pokemon.name : 'Pokémon detail'"
  >
    <!-- Top App Bar -->
    <header class="mdc-top-app-bar sheet__app-bar">
      <div class="mdc-top-app-bar__row">
        <section
          class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start"
        >
          <button
            class="mdc-icon-button mdc-top-app-bar__navigation-icon"
            @click="emit('close')"
            aria-label="Sluiten"
          >
            <span class="material-icons">arrow_back</span>
          </button>
          <span class="mdc-top-app-bar__title" v-if="pokemon">
            #{{ getPokemonId(pokemon.url) }}
            {{ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}
          </span>
        </section>
      </div>
    </header>

    <!-- Content -->
    <main class="sheet__content">
      <!-- Loading -->
      <div v-if="loading" class="sheet__loading">
        <span class="material-icons loading-icon">catching_pokemon</span>
        <p>Laden...</p>
      </div>

      <div v-else-if="details && pokemon" class="sheet__body">
        <!-- Afbeelding -->
        <div class="sheet__image-container">
          <img
            :src="getPokemonImage(pokemon.url)"
            :alt="pokemon.name"
            class="sheet__image"
          />
        </div>

        <!-- Types -->
        <div class="detail-section">
          <div class="type-chips">
            <span
              v-for="t in details.types"
              :key="t.type.name"
              class="type-chip"
              :style="{ backgroundColor: getTypeColor(t.type.name) }"
              @click="emit('type-selected', t.type.name)"
            >
              {{ t.type.name }}
            </span>
          </div>
        </div>

        <!-- Basis info -->
        <div class="detail-section info-row">
          <div class="info-block">
            <span class="material-icons info-icon">straighten</span>
            <span class="info-label">Hoogte</span>
            <span class="info-value"
              >{{ (details.height / 10).toFixed(1) }} m</span
            >
          </div>
          <div class="info-block">
            <span class="material-icons info-icon">monitor_weight</span>
            <span class="info-label">Gewicht</span>
            <span class="info-value"
              >{{ (details.weight / 10).toFixed(1) }} kg</span
            >
          </div>
          <div class="info-block">
            <span class="material-icons info-icon">star</span>
            <span class="info-label">Basis EXP</span>
            <span class="info-value">{{ details.base_experience }}</span>
          </div>
        </div>

        <!-- Abilities -->
        <div class="detail-section">
          <h3 class="section-title">Abilities</h3>
          <div class="ability-list">
            <span
              v-for="a in details.abilities"
              :key="a.ability.name"
              class="ability-chip"
              :class="{ 'ability-chip--hidden': a.is_hidden }"
            >
              {{ a.ability.name }}
              <span v-if="a.is_hidden" class="hidden-label">(hidden)</span>
            </span>
          </div>
        </div>

        <!-- Stats -->
        <div class="detail-section">
          <h3 class="section-title">Base Stats</h3>
          <div class="stat-list">
            <div
              v-for="stat in details.stats"
              :key="stat.stat.name"
              class="stat-row"
            >
              <span class="stat-name">{{
                formatStatName(stat.stat.name)
              }}</span>
              <span class="stat-value">{{ stat.base_stat }}</span>
              <div class="stat-bar-bg">
                <div
                  class="stat-bar-fill"
                  :style="{
                    width: Math.min((stat.base_stat / 255) * 100, 100) + '%',
                    backgroundColor: getStatColor(stat.base_stat),
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Bar -->
    <footer class="sheet__bottom-bar">
      <button
        class="mdc-button mdc-button--unelevated like-btn"
        :class="{ 'like-btn--liked': liked }"
        @click="emit('like', pokemon)"
      >
        <span class="mdc-button__ripple"></span>
        <span class="material-icons mdc-button__icon">{{
          liked ? "favorite" : "favorite_border"
        }}</span>
        <span class="mdc-button__label">{{ liked ? "Geliked" : "Like" }}</span>
      </button>
    </footer>
  </section>
</template>

<style scoped>
.sheet {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.sheet--visible {
  transform: translateX(0);
}

.sheet__app-bar {
  position: static;
}

/* ─── Content ──────────────────────────────────────────────────── */
.sheet__content {
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
}

.sheet__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: rgba(0, 0, 0, 0.38);
}

.loading-icon {
  font-size: 48px;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ─── Body ─────────────────────────────────────────────────────── */
.sheet__body {
  padding-bottom: 16px;
}

.sheet__image-container {
  display: flex;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 24px;
}

.sheet__image {
  width: 180px;
  height: 180px;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.18));
}

/* ─── Sections ─────────────────────────────────────────────────── */
.detail-section {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(0, 0, 0, 0.54);
  margin: 0 0 10px;
}

/* ─── Types ────────────────────────────────────────────────────── */
.type-chips {
  display: flex;
  gap: 8px;
}

.type-chip {
  padding: 4px 14px;
  border-radius: 12px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  text-transform: capitalize;
}

/* ─── Info Row ─────────────────────────────────────────────────── */
.info-row {
  display: flex;
  justify-content: space-around;
}

.info-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.info-icon {
  font-size: 20px;
  color: #1565c0;
}

.info-label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.54);
}

.info-value {
  font-size: 14px;
  font-weight: 500;
}

/* ─── Abilities ────────────────────────────────────────────────── */
.ability-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ability-chip {
  padding: 4px 12px;
  border-radius: 12px;
  background-color: #e3f2fd;
  color: #1565c0;
  font-size: 13px;
  text-transform: capitalize;
}

.ability-chip--hidden {
  background-color: #f3e5f5;
  color: #6a1b9a;
}

.hidden-label {
  font-size: 11px;
  opacity: 0.8;
}

/* ─── Stats ────────────────────────────────────────────────────── */
.stat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: grid;
  grid-template-columns: 64px 36px 1fr;
  align-items: center;
  gap: 8px;
}

.stat-name {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  text-align: right;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  text-align: right;
}

.stat-bar-bg {
  height: 6px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

/* ─── Bottom Bar ───────────────────────────────────────────────── */
.sheet__bottom-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background-color: #1565c0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2);
}

.like-btn {
  background-color: white !important;
  color: #1565c0 !important;
  min-width: 160px;
}
.like-btn--liked {
  color: #e53935 !important;
}
</style>
