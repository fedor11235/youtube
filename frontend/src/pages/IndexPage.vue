<template>
    <q-page padding>
    <!-- Добавляем поисковую строку -->
    <div class="col-12 col-sm-8 col-md-6 q-mb-lg q-mt-sm">
      <div class="row q-col-gutter-md">
          <!-- Поисковая строка -->
          <div class="col-12 col-sm-6">
            <q-input
              v-model="searchQuery"
              outlined
              dense
              placeholder="Поиск видео"
              class="search-input"
              bg-color="white"
              @update:model-value="handleSearch"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              <template v-slot:append v-if="searchQuery">
                <q-icon
                  name="close"
                  class="cursor-pointer"
                  color="grey-6"
                  @click="clearSearch"
                />
              </template>
            </q-input>
          </div>

          <!-- Выбор тегов -->
          <div class="col-12 col-sm-6">
            <q-select
              v-model="selectedTags"
              outlined
              dense
              multiple
              use-chips
              use-input
              input-debounce="0"
              class="tag-select"
              label="Выберите теги"
              bg-color="white"
              :options="availableTags"
              @update:model-value="handleSearch"
            >
              <template v-slot:selected-item="scope">
                <q-chip
                  removable
                  dense
                  @remove="scope.removeAtIndex(scope.index)"
                  :tabindex="scope.tabindex"
                  class="tag-chip"
                  color="primary"
                  text-color="white"
                >
                  {{ scope.opt }}
                </q-chip>
              </template>
            </q-select>
          </div>
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
const selectedTags = ref([])
const allVideos = ref<Video[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const availableTags = ref<any>([])

const loadVideos = async () => {  
  try {
    loading.value = true
    error.value = null
    const [videosResponse, tagsResponse] = await Promise.all([
      videoService.getVideos(),
      videoService.getTags()
    ])
    allVideos.value = videosResponse
    videos.value = videosResponse
    availableTags.value = tagsResponse.map(tag => tag.name)
  } catch (err) {
    error.value = 'Не удалось загрузить видео'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  let filteredVideos = [...allVideos.value]

  // Фильтрация по поисковому запросу
  if (searchQuery.value.trim()) {
    const searchTerm = searchQuery.value.toLowerCase()
    filteredVideos = filteredVideos.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      video.description?.toLowerCase().includes(searchTerm) ||
      video.channel.name.toLowerCase().includes(searchTerm)
    )
  }

  // Фильтрация по тегам
  // if (selectedTags.value.length > 0) {
  //   filteredVideos = filteredVideos.filter(video => 
  //     selectedTags.value.every(tag => 
  //       video.tags?.some(videoTag => videoTag.name === tag)
  //     )
  //   )
  // }

  videos.value = filteredVideos
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
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>