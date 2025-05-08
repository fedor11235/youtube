<template>
  <q-page class="search-page q-pa-md">
    <div class="search-container">
      <h1 class="text-h4 text-center q-mb-lg">Поиск пользователей {{ searchQuery }}</h1>
      <q-input
        v-model="searchQuery"
        outlined
        class="search-input"
        placeholder="Введите имя пользователя или email"
        @update:model-value="(event: any) => handleSearch(event)"
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

      <div class="search-results q-mt-lg">
        <div class="search-results q-mt-lg">
        <div v-if="loading" class="text-center">
          <q-spinner-dots color="primary" size="40px" />
        </div>

        <div v-else-if="searchResults.length > 0">
          <q-card v-for="channel in searchResults" :key="channel.id" class="user-card q-mb-md">
            <!-- Баннер пользователя -->
            <div class="channel-banner">
              <img 
                :src="channel.banner || 'https://picsum.photos/1200/300'" 
                class="banner-image"
                alt="Channel banner"
              >
            </div>

            <q-card-section class="user-info-section">
              <div class="row items-center q-col-gutter-md">
                <!-- Аватар и основная информация -->
                <div class="col-12 col-sm-8">
                  <div class="row items-center">
                    <div class="col-auto avatar-container">
                      <UserAvatar
                        :avatar="channel.avatar"
                        :username="channel.username"
                        :user-id="channel.id"
                        :url="channel.url"
                        size="80px"
                        clickable
                      />
                    </div>
                    <div class="col q-ml-md q-mt-lg">
                      <div class="text-h6">{{ channel.username }}</div>
                      <div class="text-subtitle2 text-grey-7">{{ channel.email }}</div>
                      <div class="row items-center q-gutter-x-md q-mt-sm">
                        <div class="text-caption">
                          <q-icon name="people" size="16px" class="q-mr-xs" />
                          {{ channel.subscribersCount }} подписчиков
                        </div>
                        <div class="text-caption">
                          <q-icon name="video_library" size="16px" class="q-mr-xs" />
                          {{ channel.videosCount }} видео
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Кнопка подписки -->
                <div class="col-12 col-sm-4 text-right">
                  <SubscribeButton
                    v-if="authStore.channel?.id !== channel.id"
                    :channel-url="channel.url"
                    :subscribers-count="channel.subscribersCount"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>


        <div v-else-if="searchQuery && !loading" class="text-center q-pa-xl">
          <q-icon name="search_off" size="64px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">Ничего не найдено</div>
          <div class="text-body2 text-grey-6">
            Попробуйте изменить параметры поиска
          </div>
        </div>

        <div v-else class="text-center q-pa-xl">
          <q-icon name="manage_search" size="64px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">Начните поиск</div>
          <div class="text-body2 text-grey-6">
            Введите имя пользователя или email для поиска
          </div>
        </div>
      </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useAuthStore } from 'src/stores/auth'
// import { useDebounce } from '@vueuse/core'
import UserAvatar from '../components/UserAvatar.vue'
import SubscribeButton from '../components/SubscribeButton.vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const searchQuery = ref('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchResults: any = ref([])
const loading = ref(false)
//useDebounce?
const handleSearch = async (query: string) => {
  if (query.length >= 2) {
    try {
      loading.value = true
      const results = await userStore.searchChannels(query)
      searchResults.value = results
    } catch (error) {
      console.error('Ошибка поиска:', error)
    } finally {
      loading.value = false
    }
  } else {
    searchResults.value = []
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
}

.user-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-banner {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info-section {
  position: relative;
  margin-top: -40px;
}

.avatar-container {
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-card {
  overflow: hidden;
}
</style>