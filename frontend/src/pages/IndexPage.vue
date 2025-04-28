<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div v-for="video in videos" :key="video.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="video-card" flat bordered>
          <q-img
            :src="getThumbnail(video.thumbnailUrl)"
            @click="$router.push(`/watch/${video.id}`)"
            style="cursor: pointer"
            :ratio="16/9"
          >
            <div class="absolute-bottom text-subtitle2 bg-transparent">
              <q-badge color="dark" class="q-pa-xs">
                {{ formatDuration(video.duration) }}
              </q-badge>
            </div>
          </q-img>
          
          <q-card-section>
            <div class="row no-wrap">
              <q-avatar
                size="40px"
                class="q-mr-sm cursor-pointer"
                @click="$router.push(`/user/${video.channel.url}`)"
              >
                <img :src="getAvatar(video.channel.avatar)">
              </q-avatar>
              
              <div>
                <div class="text-weight-bold ellipsis-2-lines">{{ video.title }}</div>
                <div class="text-grey">{{ video.channel.name }}</div>
                <div class="text-grey text-caption">
                  {{ video.views }} views • {{ formatDate(video.createdAt) }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-if="loading" class="row justify-center q-pa-md">
      <q-spinner color="primary" size="40px" />
    </div>

    <div v-if="error" class="row justify-center q-pa-md text-negative">
      {{ error }}
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { useVideo } from 'src/composable/useVideo'
import videoService from 'src/services/video'
import { getAvatar, getThumbnail } from '../utils/avatar'
import type { Video } from '../types'

const videos = ref<Video[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadVideos = async () => {
  loading.value = true
  error.value = null
  
  try {
    videos.value = await videoService.getVideos()
  } catch (err) {
    error.value = 'Не удалось загрузить видео'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('ru-RU')
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(async () => {
  await loadVideos()
})
</script>

<style scoped>
.video-card {
  transition: transform 0.2s;
}

.video-card:hover {
  transform: translateY(-2px);
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>