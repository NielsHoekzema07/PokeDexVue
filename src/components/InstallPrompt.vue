<script setup>
import { ref, onMounted } from "vue";

const showPrompt = ref(false);
const dismissed = ref(false);

function isAppInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

onMounted(() => {
  // Check of het event al gevangen was vóór mounting
  if (window.__deferredPrompt && !isAppInstalled() && !dismissed.value) {
    showPrompt.value = true;
  }

  // Luister ook voor toekomstige events
  window.addEventListener("beforeinstallprompt", (event) => {
    console.log("beforeinstallprompt fired in component");
    event.preventDefault();
    window.__deferredPrompt = event;
    if (!isAppInstalled() && !dismissed.value) {
      showPrompt.value = true;
    }
  });

  window.addEventListener("appinstalled", () => {
    window.__deferredPrompt = null;
    showPrompt.value = false;
  });
});

async function install() {
  if (!window.__deferredPrompt) return;
  window.__deferredPrompt.prompt();
  await window.__deferredPrompt.userChoice;
  window.__deferredPrompt = null;
  showPrompt.value = false;
}

function dismiss() {
  dismissed.value = true;
  showPrompt.value = false;
}
</script>

<template>
  <div v-if="showPrompt" class="install-snackbar">
    <span class="install-snackbar__label">Installeer deze app</span>
    <div class="install-snackbar__actions">
      <button class="install-snackbar__action" @click="install">
        Installeer
      </button>
      <button
        class="install-snackbar__dismiss"
        @click="dismiss"
        aria-label="Sluit installatiemelding"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
.install-snackbar {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: #2e2e2e;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}

.install-snackbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.install-snackbar__action {
  background: none;
  border: none;
  color: #8936ff;
  font-weight: 600;
  cursor: pointer;
}

.install-snackbar__dismiss {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 16px;
}
</style>
