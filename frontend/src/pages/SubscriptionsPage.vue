<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Subscriptions</div>

    <!-- Channels List -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="channel in subscribedChannels" :key="channel.id" class="col-auto">
        <q-avatar size="64px" class="cursor-pointer" @click="selectChannel(channel.id)">
          <img :src="getAvatar(channel.avatar)">
          <q-tooltip>{{ channel.name }}</q-tooltip>
        </q-avatar>
      </div>
    </div>

    <q-separator class="q-mb-lg" />

    <!-- Videos Grid -->
    <div class="row q-col-gutter-md">
      <template v-for="video in channelVideos" :key="video.id">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
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
                <q-avatar size="40px" class="q-mr-sm">
                  <img :src="getAvatar(video.channel.avatar)">
                </q-avatar>

                <div>
                  <div class="text-weight-bold ellipsis-2-lines">{{ video.title }}</div>
                  <div class="text-grey">{{ video.channel.username }}</div>
                  <div class="text-grey text-caption">
                    {{ video.views || 0 }} views • {{ formatDate(video.createdAt) }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>

    <!-- Empty State -->
    <div v-if="!subscribedChannels.length" class="column items-center q-pa-xl">
      <q-icon name="subscriptions" size="64px" color="grey" />
      <div class="text-h6 q-mt-md">No subscriptions yet</div>
      <div class="text-grey">Subscribe to channels to see their latest videos here</div>
      <q-btn
        color="primary"
        label="Browse Channels"
        class="q-mt-md"
        @click="$router.push('/')"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Video } from '../types'
import videoService from 'src/services/video';
import { getAvatar, getThumbnail } from '../utils/avatar'
import { subscriptionService } from 'src/services/subscription';
import { formatDate } from '../utils/date'

interface Channel {
  id: number;
  name: string;
  avatar: string;
  subscribers: number;
}

const subscribedChannels = ref<Channel[]>([])
const channelVideos = ref<Video[]>([])
const selectedChannelId = ref<number | null>(null)

const loadChannelVideos = async (channelId: number) => {
  try {
    // Получаем видео канала
    const response = await videoService.getChannelVideos(channelId);
    channelVideos.value = response.videosChannel;
  } catch (error) {
    console.error('Ошибка при загрузке видео:', error);
    channelVideos.value = [];
  }
};

const selectChannel = async (channelId: number) => {
  selectedChannelId.value = channelId;
  await loadChannelVideos(channelId);
};

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
  try {
    // Получаем список подписок
    const subscriptions = await subscriptionService.getSubscriptions();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribedChannels.value = subscriptions.map((sub: any) => ({
      id: sub.channel.id,
      name: sub.channel.username,
      avatar: sub.channel.avatar,
      subscribers: sub.channel.subscribersCount
    }));

    if(subscribedChannels.value[0]) {
      await loadChannelVideos(subscribedChannels.value[0].id); 
    }
  } catch (error) {
    console.error('Ошибка при загрузке подписок:', error);
  }
});
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