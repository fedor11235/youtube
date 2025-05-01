<template>
  <q-page class="search-page q-pa-md">
    <div class="search-container">
      <h1 class="text-h4 text-center q-mb-lg">Поиск пользователей</h1>
      
      <q-input
        v-model="searchQuery"
        outlined
        class="search-input"
        placeholder="Введите имя пользователя или email"
        @update:model-value="() => handleSearch"
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
        <div v-if="loading" class="text-center">
          <q-spinner-dots color="primary" size="40px" />
        </div>

        <div v-else-if="searchResults.length > 0" class="row q-col-gutter-md">
          <div v-for="user in searchResults" :key="user.id" class="col-12 col-sm-6 col-md-4">
            <q-card class="user-card" v-ripple>
              <q-item clickable :to="`/channel/${user.url}`">
                <q-item-section avatar>
                  <UserAvatar
                    :avatar="user.avatar"
                    :username="user.firstName"
                    :url="user.url"
                    size="56px"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    {{ user.firstName }} {{ user.lastName }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ user.email }}
                  </q-item-label>
                  <div class="row items-center q-gutter-x-sm q-mt-sm">
                    <q-chip
                      dense
                      size="sm"
                      icon="people"
                    >
                      {{ user.subscribersCount }} подписчиков
                    </q-chip>
                    <q-chip
                      dense
                      size="sm"
                      icon="video_library"
                    >
                      {{ user.videosCount }} видео
                    </q-chip>
                  </div>
                </q-item-section>
              </q-item>

              <q-card-actions align="right">
                <SubscribeButton
                  v-if="authStore.user?.id !== user.id"
                  :channel-url="user.url"
                  :subscribers-count="user.subscribersCount"
                />
              </q-card-actions>
            </q-card>
          </div>
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
      const results = await userStore.searchUsers(query)
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
</style>