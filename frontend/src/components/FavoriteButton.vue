<template>
  <div class="favorite-button">
    <q-btn
      flat
      round
      :icon="isInFavorites ? 'bookmark' : 'bookmark_border'"
      :color="isInFavorites ? 'primary' : 'grey'"
      @click="toggleFavorite"
      :loading="loading"
    >
      <q-tooltip>
        {{ isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное' }}
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/auth';
import { favoritesService } from '../services/favorites';

const props = defineProps<{
  videoId: number;
}>();

const $q = useQuasar();
const authStore = useAuthStore();
const isInFavorites = ref(false);
const loading = ref(false);

const checkFavoriteStatus = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    const { isInFavorites: status } = await favoritesService.checkFavorite(props.videoId);
    isInFavorites.value = status;
  } catch (error) {
    console.error('Ошибка при проверке избранного:', error);
  }
};

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    $q.notify({
      type: 'warning',
      message: 'Войдите, чтобы добавлять видео в избранное'
    });
    return;
  }

  try {
    loading.value = true;
    if (isInFavorites.value) {
      await favoritesService.removeFromFavorites(props.videoId);
      $q.notify({
        type: 'positive',
        message: 'Видео удалено из избранного'
      });
    } else {
      await favoritesService.addToFavorites(props.videoId);
      $q.notify({
        type: 'positive',
        message: 'Видео добавлено в избранное'
      });
    }
    isInFavorites.value = !isInFavorites.value;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при обновлении избранного'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await checkFavoriteStatus();
});
</script>

<style scoped>
.favorite-button {
  display: inline-flex;
  align-items: center;
}

.q-btn {
  transition: transform 0.2s ease;
}

.q-btn:hover {
  transform: scale(1.1);
}
</style>