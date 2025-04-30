<template>
  <q-btn
    :color="isLiked ? 'red' : 'black'"
    icon="thumb_up"
    flat
    round
    @click="toggleLike"
  >
    <q-tooltip>{{ isLiked ? 'Убрать лайк' : 'Поставить лайк' }}</q-tooltip>
  </q-btn>
  <span class="q-ml-sm">{{ likesCount }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { videoLikesService } from 'src/services/video-likes';
import { useAuthStore } from 'src/stores/auth';

const props = defineProps<{
  videoId: number;
}>();

const $q = useQuasar();
const authStore = useAuthStore();
const isLiked = ref(false);
const likesCount = ref(0);

const loadLikeStatus = async () => {
  try {
    if (authStore.isAuthenticated) {
      isLiked.value = await videoLikesService.hasUserLiked(props.videoId);
    }
    likesCount.value = await videoLikesService.getLikesCount(props.videoId);
  } catch (error) {
    console.error('Ошибка при загрузке статуса лайка:', error);
  }
};

const toggleLike = async () => {
  if (!authStore.isAuthenticated) {
    $q.notify({
      type: 'warning',
      message: 'Войдите, чтобы поставить лайк'
    });
    return;
  }

  try {
    if (isLiked.value) {
      await videoLikesService.unlikeVideo(props.videoId);
      likesCount.value--;
    } else {
      await videoLikesService.likeVideo(props.videoId);
      likesCount.value++;
    }
    isLiked.value = !isLiked.value;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при изменении лайка'
    });
  }
};

onMounted(async() => {
  await loadLikeStatus();
});
</script>