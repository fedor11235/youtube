<template>
  <video
    controls
    :poster="getThumbnail(video?.thumbnailUrl)"
    :ref="videoRef"
    class="full-width"
    style="max-height: 70vh"
    :src="getVideo(video?.videoUrl)"
    @play="handlePlay"
    @timeupdate="handleTimeUpdate"
  ></video>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getThumbnail, getVideo } from '../utils/avatar'
import videoService from 'src/services/video'
import type { Video } from 'src/types';

defineProps<{
  video: Video;
}>();

const route = useRoute()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const videoRef = ref<any>(null);
const viewAdded = ref(false);

const handlePlay = async () => {
  if (!viewAdded.value) {
    await addView();
  }
};

const handleTimeUpdate = async () => {
  const video = videoRef.value;
  if (!video || viewAdded.value) return;

  // Добавляем просмотр после 5 секунд воспроизведения
  if (video.currentTime >= 5) {
    await addView();
  }
};

const addView = async () => {
  const videoId = parseInt(route.params.id as string)
  try {
    await videoService.addView(videoId);
    viewAdded.value = true;
  } catch (error) {
    console.error('Ошибка при добавлении просмотра:', error);
  }
};
</script>

<style lang="scss">
video {
  background: black;
}
</style>
