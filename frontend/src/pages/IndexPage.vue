<template>
    <q-page padding>
    <!-- Добавляем поисковую строку -->
    <div class="col-12 col-sm-8 col-md-6 q-mb-lg q-mt-sm">
      <div class="row q-col-gutter-md">
          <!-- Поисковая строка -->
          <div class="col-12 col-sm-4">
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

          <div class="col-12 col-sm-4">
            <q-select
              v-model="sortBy"
              :options="sortOptions"
              label="Сортировка"
              outlined
              dense
              @update:model-value="handleSearch"
            >
              <template v-slot:append>
                <q-icon name="sort" />
              </template>
            </q-select>
          </div>
        
          
          <!-- Выбор тегов -->
          <div class="col-12 col-sm-4">
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
      <div
        v-for="video in videos"
        :key="video.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <VideoCardMain
          :video="video"
        />
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
import type { Video } from '../types/video'
import VideoCardMain from 'components/VideoCardMain.vue';

const videos = ref<Video[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortBy: any = ref('')
const sortOptions = [
  { label: 'Новые', value: 'newest' },
  { label: 'Старые', value: 'oldest' },
  { label: 'Популярные', value: 'most_viewed' },
  { label: 'Менее популярные', value: 'least_viewed' }
]
const selectedTags = ref([])
const allVideos = ref<Video[]>([])
const availableTags = ref<string[]>([])

const loadVideos = async () => {  
  try {
    loading.value = true
    error.value = null
    const [videosResponse, tagsResponse] = await Promise.all([
      videoService.searchVideos('', [], ''),
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

const handleSearch = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const searchResults = await videoService.searchVideos(
      searchQuery.value,
      selectedTags.value,
      sortBy.value?.value
    );
    
    videos.value = searchResults;
  } catch (err) {
    console.error('Ошибка при поиске видео:', err);
    error.value = 'Не удалось выполнить поиск';
  } finally {
    loading.value = false;
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  videos.value = allVideos.value
}

onMounted(async () => {
  await loadVideos()
})
</script>

<style lang="scss" scoped>
.video-card {
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
}
</style>