<template>
  <q-card class="video-card">
    <div class="video-thumbnail-container">
      <img :src="getThumbnail(video.thumbnailUrl)" class="video-thumbnail">
      <div class="video-overlay">
        <q-btn
          flat
          round
          color="white"
          icon="delete"
          class="delete-btn"
          @click.stop="confirmDelete(video)"
        />
      </div>
    </div>
    <q-card-section>
      <div class="text-h6 ellipsis">{{ video.title }}</div>
      <div class="text-subtitle2 text-grey">
        {{ video.views }} просмотров
      </div>
    </q-card-section>
  </q-card>

  <q-dialog v-model="deleteDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="warning" text-color="white" />
        <span class="q-ml-sm">Вы уверены, что хотите удалить это видео?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn flat label="Удалить" color="negative" @click="deleteVideo" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getThumbnail } from '../utils/avatar'
import type { Video } from 'src/types/video'

defineProps<{
  video: Video;
}>();

const deleteDialog = ref(false)
const videoToDelete = ref<Video | null>(null)

const confirmDelete = (video: Video) => {
  videoToDelete.value = video
  deleteDialog.value = true
}

const emit = defineEmits<{
  (e: 'delete-video', videoId: number): void;
}>();

const deleteVideo = () => {
  if(!videoToDelete.value) return
  emit('delete-video', videoToDelete.value.id)
}
</script>

<style lang="scss" scoped>
.video-card {
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.video-thumbnail-container {
  position: relative;
  
  .video-thumbnail {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  
  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .delete-btn {
      background: rgba(0, 0, 0, 0.7);
    }
  }
  
  &:hover {
    .video-overlay {
      opacity: 1;
    }
  }
}
</style>