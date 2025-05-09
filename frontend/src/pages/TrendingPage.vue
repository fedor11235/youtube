<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Trending</div>

    <div class="row q-col-gutter-md">
      <template v-for="video in trendingVideos" :key="video.id">
        <VideoCardTrending
          :video="video"
        />
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VideoCardTrending from '../components/VideoCardTrending.vue'
import videoService from 'src/services/video';
import type { Video } from 'src/types';

const trendingVideos = ref<Video[]>([])
const loading = ref(false)
const error = ref('')

const loadTrendingVideos = async () => {
  loading.value = true;
  error.value = '';

  try {
    trendingVideos.value = await videoService.getTrendingVideos();
  } catch (err) {
    console.error('Ошибка при загрузке трендовых видео:', err);
    error.value = 'Не удалось загрузить трендовые видео';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadTrendingVideos();
});
</script>
