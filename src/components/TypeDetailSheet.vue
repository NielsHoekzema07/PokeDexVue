<script setup>
import { ref, watch } from "vue";
import { typeColors } from "@/data/TypeColors.js";

const props = defineProps({
  typeName: { type: String, default: null },
  visible: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);

const typeData = ref(null);
const loading = ref(false);

const damageGroups = [
  { key: "double_damage_to",   label: "2× schade aan",      icon: "arrow_upward",   color: "#4CAF50" },
  { key: "half_damage_to",     label: "0.5× schade aan",      icon: "arrow_downward", color: "#FF9800" },
  { key: "no_damage_to",       label: "0× schade aan",      icon: "block",          color: "#F44336" },
  { key: "double_damage_from", label: "2× schade van",      icon: "arrow_upward",   color: "#F44336" },
  { key: "half_damage_from",   label: "0.5× schade van",      icon: "arrow_downward", color: "#4CAF50" },
  { key: "no_damage_from",     label: "0× schade van",      icon: "block",          color: "#9E9E9E" },
];

function getTypeColor(type) {
  return typeColors[type] || "#A8A878";
}

watch(
  () => props.typeName,
  async (name) => {
    if (!name) return;
    loading.value = true;
    typeData.value = null;
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${name}`);
      typeData.value = await res.json();
      console.log("Fetched type details:", typeData.value);
    } catch (e) {
      console.error("Fout bij ophalen type details:", e);
    } finally {
      loading.value = false;
    }
  }
);
</script>

<template>
  <section
    :class="['sheet', visible ? 'sheet--visible' : '']"
    role="dialog"
    aria-modal="true"
    :aria-label="typeName ? `Type: ${typeName}` : 'Type detail'"
  >
    <!-- Top App Bar -->
    <header
      class="mdc-top-app-bar sheet__app-bar"
      :style="typeName ? { backgroundColor: getTypeColor(typeName) } : {}"
    >
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <button
            class="mdc-icon-button mdc-top-app-bar__navigation-icon"
            @click="emit('close')"
            aria-label="Sluiten"
          >
            <span class="material-icons">arrow_back</span>
          </button>
          <span class="mdc-top-app-bar__title" v-if="typeName">
            Type: {{ typeName.charAt(0).toUpperCase() + typeName.slice(1) }}
          </span>
        </section>
      </div>
    </header>

    <!-- Content -->
    <main class="sheet__content">
      <div v-if="loading" class="sheet__loading">
        <span class="material-icons loading-icon">catching_pokemon</span>
        <p>Laden...</p>
      </div>

      <div v-else-if="typeData && typeName" class="sheet__body">

        <!-- Type badge -->
        <div class="type-hero" :style="{ backgroundColor: getTypeColor(typeName) }">
          <span class="type-hero__name">
            {{ typeName.charAt(0).toUpperCase() + typeName.slice(1) }}
          </span>
        </div>

        <!-- Damage relations -->
        <div
          v-for="group in damageGroups"
          :key="group.key"
          class="detail-section"
        >
          <h3 class="section-title">
            <span class="material-icons section-icon" :style="{ color: group.color }">
              {{ group.icon }}
            </span>
            {{ group.label }}
          </h3>

          <div
            v-if="typeData.damage_relations[group.key].length"
            class="type-chips"
          >
            <span
              v-for="t in typeData.damage_relations[group.key]"
              :key="t.name"
              class="type-chip"
              :style="{ backgroundColor: getTypeColor(t.name) }"
            >
              {{ t.name }}
            </span>
          </div>
          <p v-else class="empty-label">Geen</p>
        </div>
      </div>
    </main>
  </section>
</template>

<style scoped>
.sheet {
  position: fixed; inset: 0; z-index: 300;
  display: flex; flex-direction: column;
  background-color: #fafafa;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
.sheet--visible { transform: translateX(0); }
.sheet__app-bar { position: static; transition: background-color 0.3s ease; }
.sheet__content { flex: 1; overflow-y: auto; background-color: #ffffff; }
.sheet__loading {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%; gap: 12px; color: rgba(0,0,0,.38);
}
.loading-icon { font-size: 48px; animation: spin 1.2s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Hero */
.type-hero {
  display: flex; align-items: center; justify-content: center;
  padding: 32px 16px;
}
.type-hero__name {
  font-size: 32px; font-weight: 700; color: white; text-transform: capitalize;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Sections */
.detail-section { padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,.08); }
.section-title {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; text-transform: uppercase;
  letter-spacing: .08em; color: rgba(0,0,0,.54); margin: 0 0 10px;
}
.section-icon { font-size: 16px; }

/* Type chips */
.type-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.type-chip {
  padding: 4px 14px; border-radius: 12px; color: white;
  font-size: 13px; font-weight: 500; text-transform: capitalize;
}
.empty-label { font-size: 13px; color: rgba(0,0,0,.38); margin: 0; }
</style>