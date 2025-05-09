<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Library</div>

    <div class="row q-col-gutter-lg">
      <!-- Quick Access Section -->
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-card flat bordered class="cursor-pointer" @click="tab = 'liked'">
              <q-card-section class="row items-center">
                <q-icon name="thumb_up" size="md" class="q-mr-md" />
                <div>
                  <div class="text-h6">Liked Videos</div>
                  <div class="text-grey">{{ likedCount }} videos</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6">
            <q-card flat bordered class="cursor-pointer" @click="tab = 'favorites'">
              <q-card-section class="row items-center">
                <q-icon name="favorite" size="md" class="q-mr-md" />
                <div>
                  <div class="text-h6">Favorites</div>
                  <div class="text-grey">{{ favoritesCount }} videos</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="col-12">
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="liked" label="Liked Videos" />
          <q-tab name="favorites" label="Favorites" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>

          <q-tab-panel name="liked">
            <div class="row q-col-gutter-md">
              <template v-for="video in likedVideos" :key="video.id">
                <div class="col-12">
                  <VideoCardLibrary 
                    :video="video" 
                    @remove="removeFromLiked(video.id)"
                  />
                </div>
              </template>
            </div>
          </q-tab-panel>

          <q-tab-panel name="favorites">
            <div class="row q-col-gutter-md">
              <template v-for="video in favoriteVideos" :key="video.id">
                <div class="col-12">
                  <VideoCardLibrary
                    :video="video" 
                    @remove="removeFromFavorites(video.id)"
                  />
                </div>
              </template>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import VideoCardLibrary from '../components/VideoCardLibrary.vue'
import type { Video } from '../types/video'
import { favoritesService } from 'src/services/favorites';
import { useQuasar } from 'quasar';
import videoService from 'src/services/video';

interface LibraryVideo extends Video {
  watchedAt?: string;
  addedAt?: string;
}

const $q = useQuasar();
const tab = ref('liked')
const likedVideos = ref<LibraryVideo[]>([])
const favoriteVideos = ref<LibraryVideo[]>([])
const loadingFavorites = ref(true);
const loadingLiked = ref(true);

const likedCount = computed(() => likedVideos.value.length)
const favoritesCount = computed(() => favoriteVideos.value.length)

const removeFromLiked = (videoId: number) => {
  likedVideos.value = likedVideos.value.filter(v => v.id !== videoId)
}

const removeFromFavorites = (videoId: number) => {
  favoriteVideos.value = favoriteVideos.value.filter(v => v.id !== videoId)
}

const loadFavorites = async () => {
  try {
    loadingFavorites.value = true;
    favoriteVideos.value = await favoritesService.getFavorites();
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при загрузке избранных видео'
    });
  } finally {
    loadingFavorites.value = false;
  }
};

const loadLikedVideos = async () => {
  try {
    loadingLiked.value = true;
    likedVideos.value = await videoService.getLikedVideos();
    console.log(likedVideos.value)
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при загрузке понравившихся видео'
    });
  } finally {
    loadingLiked.value = false;
  }
};

onMounted(async () => {
  await loadFavorites();
  await loadLikedVideos();
});
</script>