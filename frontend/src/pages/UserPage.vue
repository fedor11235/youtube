<template>
  <q-page class="q-pa-md">
    <div class="profile-header">
      <div class="cover-photo">
        <img 
          :src="getBanner(user?.banner)" 
          alt="Cover photo"
          class="cover-image"
        />
      </div>

      <div class="profile-info q-px-md">
        <div class="profile-main">
          <div class="q-mr-xl">
            <q-avatar size="180px">
              <img :src="getAvatar(user?.avatar)" />
            </q-avatar>
          </div>

          <div class="user-details q-ml-md">
            <h1 class="text-h4 q-mb-sm">{{ user?.firstName }} {{ user?.lastName }}</h1>
            <div class="user-stats">
              <span class="stat-item">
                <span class="stat-value">{{ user?.totalViews || 0 }}</span>
                <span class="stat-label">видео</span>
              </span>
              <span class="stat-separator">•</span>
              <span class="stat-item">
                <span class="stat-value">{{ subscribersCount || 0 }}</span>
                <span class="stat-label">подписчиков</span>
              </span>
            </div>
            <p class="user-bio q-mt-sm">{{ 'Нет описания' }}</p>
          </div>

          <div class="profile-actions">
            <q-btn
              v-if="isOwnProfile"
              color="primary"
              label="Редактировать профиль"
              icon="edit"
              @click="$router.push('/profile')"
              flat
            />
            <SubscribeButton
              v-else-if="typeof videoUrl === 'string'"
              :channel-url="videoUrl"
              v-model:subscribers-count="subscribersCount"
            />
          </div>
        </div>

        <q-tabs
          v-model="tab"
          class="q-mt-md"
          dense
          align="left"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="videos" icon="video_library" label="Видео" />
          <q-tab name="about" icon="info" label="О канале" />
        </q-tabs>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <!-- Контент пользователя -->
      <div class="col-12 col-md-9">

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="videos">
            <div class="row q-col-gutter-md">
              <!-- Здесь будет список видео -->
            </div>
          </q-tab-panel>

          <q-tab-panel name="about">
            <div class="text-h6">О пользователе</div>
            <p>Дата регистрации: {{ formatDate(user?.createdAt || '') }}</p>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { getAvatar, getBanner } from '../utils/avatar'
import { ref, onMounted, computed } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '../utils/date'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { subscriptionService } from 'src/services/subscription'
import SubscribeButton from 'components/SubscribeButton.vue';

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  country: string
  city: string
  avatar?: string
  createdAt: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalViews: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribers: any
  url: string
  banner: string
}

const route = useRoute()
const authStore = useAuthStore()
const userStore = useUserStore()
const tab = ref('videos')
const user: Ref<User | null> = ref(null)
const isSubscribed = ref(false);
const subscribersCount = ref(0);
const videoUrl = computed(() => route.params.id)

const isOwnProfile = computed(() => {
  return user.value?.id === authStore.user?.id;
});

onMounted(async () => {
  const userId = route.params.id
  try {
    if(typeof userId === 'string') {
      user.value = await userStore.fetchUserById(userId)
      isSubscribed.value = await subscriptionService.checkSubscription(userId);
      const subscribers = await subscriptionService.getSubscribers(userId);
      subscribersCount.value = subscribers.length;
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных пользователя:', error);
  }
})
</script>

<style lang="scss">
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

.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-header {
  background: white;
}

.cover-photo {
  height: 300px;
  overflow: hidden;
  position: relative;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  position: relative;
  margin-top: -60px;
  padding-bottom: 16px;
}

.profile-main {
  display: flex;
  align-items: flex-end;
  padding: 0 16px;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-details {
  flex-grow: 1;
  padding-bottom: 8px;
}

.user-stats {
  display: flex;
  align-items: center;
  color: #666;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-weight: bold;
}

.stat-separator {
  margin: 0 12px;
}

.user-bio {
  color: #666;
  max-width: 600px;
}

.profile-actions {
  display: flex;
  align-items: flex-end;
  padding-bottom: 16px;
}

@media (max-width: 600px) {
  .profile-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-details {
    margin-top: 16px;
    margin-left: 0 !important;
  }

  .profile-actions {
    margin-top: 16px;
    padding-bottom: 0;
  }

  .user-stats {
    justify-content: center;
  }
}</style>