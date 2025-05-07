<template>
    <q-page padding>
    <!-- Добавляем поисковую строку -->
    <div class="row justify-center q-mb-lg">
      <div class="col-12 col-sm-8 col-md-6">
        <q-input
          v-model="searchQuery"
          outlined
          placeholder="Поиск видео"
          class="full-width"
          @update:model-value="handleSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append v-if="searchQuery">
            <q-icon
              name="close"
              class="cursor-pointer"
              @click="clearSearch"
            />
          </template>
        </q-input>
      </div>
    </div>
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
              <UserAvatar
                :avatar="video.channel.avatar"
                :url="video.channel.url"
                :username="video.channel.firstName || 'Test'"
                size="40px"
                class="q-mr-sm"
              />
              
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
import { getThumbnail } from '../utils/avatar'
import type { Video } from '../types'
import UserAvatar from 'components/UserAvatar.vue';
import { formatDate } from '../utils/date'

const videos = ref<Video[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const allVideos = ref<Video[]>([])

const loadVideos = async () => {  
  try {
    loading.value = true
    error.value = null
    const response = await videoService.getVideos()
    allVideos.value = response
    videos.value = response
  } catch (err) {
    error.value = 'Не удалось загрузить видео'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSearch = (query: string | null | number) => {
  query = String(query)

  if (!query.trim()) {
    videos.value = allVideos.value
    return
  }
  
  const searchTerm = query.toLowerCase()
  videos.value = allVideos.value.filter(video => 
    video.title.toLowerCase().includes(searchTerm) ||
    video.description?.toLowerCase().includes(searchTerm) ||
    video.channel.name.toLowerCase().includes(searchTerm)
  )
}

const clearSearch = () => {
  searchQuery.value = ''
  videos.value = allVideos.value
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