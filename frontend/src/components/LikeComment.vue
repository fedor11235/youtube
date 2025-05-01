<template>
  <div class="like-comment">
    <q-btn
      flat
      dense
      round
      :icon="isLiked ? 'thumb_up' : 'thumb_up_off_alt'"
      :color="isLiked ? 'primary' : 'grey'"
      @click.stop="toggleLike"
      :loading="loading"
    >
      <q-tooltip>{{ isLiked ? 'Убрать лайк' : 'Нравится' }}</q-tooltip>
    </q-btn>
    <span class="q-ml-sm text-caption">{{ likesCount }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'
import { commentLikesService } from 'src/services/comment-likes';

const props = defineProps<{
  commentId: number
  isAuthorLike?: boolean;
}>()

const $q = useQuasar()
const authStore = useAuthStore()
const isLiked = ref(false)
const likesCount = ref(0)
const loading = ref(false)

const loadLikeStatus = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    isLiked.value = await commentLikesService.hasUserLiked(props.commentId);
    likesCount.value = await commentLikesService.getLikesCount(props.commentId);
  } catch (error) {
    console.error('Ошибка при проверке лайка:', error);
  }
};

const toggleLike = async () => {
  if (!authStore.isAuthenticated) {
    $q.notify({
      type: 'warning',
      message: 'Войдите, чтобы оценивать комментарии'
    });
    return;
  }

  try {
    loading.value = true;
    if (isLiked.value) {
      await commentLikesService.unlikeComment(props.commentId);
      likesCount.value--;
    } else {
      await commentLikesService.likeComment(props.commentId);
      likesCount.value++;
    }
    isLiked.value = !isLiked.value;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при оценке комментария'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadLikeStatus();
});
</script>

<style scoped>
.like-comment {
  display: inline-flex;
  align-items: center;
}
</style>