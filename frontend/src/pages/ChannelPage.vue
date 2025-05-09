<template>
  <q-page class="q-pa-md">
    <div class="profile-header">
      <div class="cover-photo">
        <img 
          :src="getBanner(channel?.banner)" 
          alt="Cover photo"
          class="cover-image"
        />
      </div>

      <div class="profile-info q-px-md">
        <div class="profile-main">
          <div class="q-mr-xl">
            <q-avatar size="180px">
              <img :src="getAvatar(channel?.avatar)" />
            </q-avatar>
          </div>

          <div class="channel-details q-ml-md">
            <h1 class="text-h4 q-mb-sm">{{ channel?.username }}</h1>
            <div class="channel-stats">
              <span class="stat-item">
                <span class="stat-value">{{ channel?.totalViews || 0 }}</span>
                <span class="stat-label">видео</span>
              </span>
              <span class="stat-separator">•</span>
              <span class="stat-item">
                <span class="stat-value">{{ subscribersCount || 0 }}</span>
                <span class="stat-label">подписчиков</span>
              </span>
            </div>
            <p class="channel-bio q-mt-sm">{{ 'Нет описания' }}</p>
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
              <template v-if="videos.length">
                <div v-for="video in videos" :key="video.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <VideoCarTwo
                    :video="video"
                  />
                </div>
              </template>
        
              <div v-else class="col-12 text-center q-pa-lg">
                <q-icon name="videocam_off" size="48px" color="grey-6" />
                <div class="text-h6 text-grey-6 q-mt-sm">Нет загруженных видео</div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="about">
            <div class="text-h6">О пользователе</div>
            <p>Дата регистрации: {{ formatDate(channel?.createdAt || '') }}</p>
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
import { useChannelStore } from '../stores/channel'
import { subscriptionService } from 'src/services/subscription'
import SubscribeButton from 'components/SubscribeButton.vue';
import VideoCarTwo from 'components/VideoCarTwo.vue';
import videoService from 'src/services/video'
import type { Channel, Video } from 'src/types'

const route = useRoute()
const authStore = useAuthStore()
const channelStore = useChannelStore()
const tab = ref('videos')
const channel: Ref<Channel | null> = ref(null)
const isSubscribed = ref(false);
const subscribersCount = ref(0);
const videoUrl = computed(() => route.params.id)
const videos = ref<Video[]>([])

const isOwnProfile = computed(() => {
  return channel.value?.id === authStore.channel?.id;
});

onMounted(async () => {
  const channelId = route.params.id
  try {
    if(typeof channelId === 'string') {
      channel.value = await channelStore.fetchChannelById(channelId)
      isSubscribed.value = await subscriptionService.checkSubscription(channelId);
      const subscribers = await subscriptionService.getSubscribers(channelId);
      const result = await videoService.getChannelVideos(channel.value!.id)
      videos.value = result.videosChannel
      subscribersCount.value = subscribers.length;
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных пользователя:', error);
  }
})
</script>

<style lang="scss" scoped>
.profile-header {
  background: white;
}

.cover-photo {
  height: 300px;
  overflow: hidden;
  position: relative;
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

.channel-details {
  flex-grow: 1;
  padding-bottom: 8px;
}

.channel-stats {
  display: flex;
  align-items: center;
  color: #666;
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    
    .stat-value {
      font-weight: bold;
    }
  }
  
  .stat-separator {
    margin: 0 12px;
  }
}

.channel-bio {
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

  .channel-details {
    margin-top: 16px;
    margin-left: 0 !important;
  }

  .profile-actions {
    margin-top: 16px;
    padding-bottom: 0;
  }

  .channel-stats {
    justify-content: center;
  }
}
</style>