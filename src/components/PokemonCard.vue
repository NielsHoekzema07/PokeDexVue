<template>
  <!-- Pokemon Card -->
  <div class="mdc-card mdc-card--outlined">
    <div class="mdc-card__primary-action">
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

<script>
export default {
  props: {
    pokemon: {
      type: Object,
      required: true,
    },
  },
  computed: {
    pokemonId() {
      const urlParts = this.pokemon.url.split("/");
      return urlParts[urlParts.length - 2];
    },
    pokemonSpriteUrl() {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemonId}.png`;
    },
  },
};
</script>

<style scoped>
.mdc-card {
  border-radius: 4px;
  overflow: hidden;
}

.mdc-card__primary-action {
  padding: 0;
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