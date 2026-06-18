<script setup>
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import TopAppBar from './components/TopAppBar.vue'
import TabList from './components/TabList.vue'
import InstallPrompt from './components/InstallPrompt.vue'

const searchOpen = ref(false)
const searchQuery = ref('')

// Beide refs beschikbaar maken voor alle nakomelingen
provide('searchOpen', searchOpen)
provide('searchQuery', searchQuery)
</script>

<template>
  <header>
    <TopAppBar />
    <TabList />
  </header>
  
  <RouterView />
  <InstallPrompt />
</template>

<style scoped></style>