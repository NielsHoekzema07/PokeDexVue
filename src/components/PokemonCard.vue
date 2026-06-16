<script setup>
const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["like"]);

const pokemonId = props.pokemon.url.split("/").at(-2);
const pokemonSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
</script>

<template>
  <!-- Pokemon Card -->
  <div class="mdc-card mdc-card--outlined">
    <div class="mdc-card__primary-action">
      <!-- Hartje -->
      <button
        class="like-btn mdc-icon-button"
        @click.stop="$emit('like')"
        :aria-label="
          liked ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'
        "
      >
        <span class="material-icons like-icon" :class="{ liked: liked }">
          {{ liked ? "favorite" : "favorite_border" }}
        </span>
      </button>

      <div class="mdc-card__media mdc-card__media--square">
        <img :src="pokemonSpriteUrl" :alt="pokemon.name" class="pokemon-img" />
      </div>
      <div class="mdc-card__content">
        <div class="pokemon-id">#{{ pokemonId }}</div>
        <h2 class="pokemon-name">{{ pokemon.name }}</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mdc-card {
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.mdc-card__primary-action {
  padding: 0;
}

/* Hartje rechts bovenin */
.like-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.like-btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.like-icon {
  font-size: 22px;
  color: rgba(0, 0, 0, 0.3);
  transition:
    color 0.2s,
    transform 0.15s;
}

.like-icon.liked {
  color: #e53935;
}

.like-btn:active .like-icon {
  transform: scale(1.25);
}

.mdc-card__media {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f5f5f5;
  padding: 8px 0;
}

.pokemon-img {
  width: 180px;
  height: 180px;
  object-fit: contain;
}

.mdc-card__content {
  padding: 8px 16px 12px;
  text-align: center;
}

.pokemon-id {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.pokemon-name {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  text-transform: capitalize;
}

.mdc-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
</style>
