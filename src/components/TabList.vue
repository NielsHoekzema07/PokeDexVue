<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="mdc-tab-bar" role="tablist">
    <div class="mdc-tab-scroller">
      <div class="mdc-tab-scroller__scroll-area">
        <div class="mdc-tab-scroller__scroll-content">

          <RouterLink to="/" custom v-slot="{ navigate, isActive }">
            <button
              :class="['mdc-tab', { 'mdc-tab--active': isActive }]"
              role="tab"
              :aria-selected="isActive"
              @click="navigate"
            >
              <span class="mdc-tab__content">
                <span class="mdc-tab__icon material-icons" aria-hidden="true">home</span>
                <span class="mdc-tab__text-label">All Pokemons</span>
              </span>
              <span :class="['mdc-tab-indicator', { 'mdc-tab-indicator--active': isActive }]">
                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
              </span>
              <span class="mdc-tab__ripple"></span>
            </button>
          </RouterLink>

          <RouterLink to="/Favorieten" custom v-slot="{ navigate, isActive }">
            <button
              :class="['mdc-tab', { 'mdc-tab--active': isActive }]"
              role="tab"
              :aria-selected="isActive"
              @click="navigate"
            >
              <span class="mdc-tab__content">
                <span class="mdc-tab__icon material-icons" aria-hidden="true">favorite</span>
                <span class="mdc-tab__text-label">Favorites</span>
              </span>
              <span :class="['mdc-tab-indicator', { 'mdc-tab-indicator--active': isActive }]">
                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
              </span>
              <span class="mdc-tab__ripple"></span>
            </button>
          </RouterLink>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>