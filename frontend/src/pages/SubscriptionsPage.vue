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
          <VideoCardMain
            :video="video"
          />
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
import type { Video } from '../types/video'
import type { Channel } from '../types/channel'
import videoService from 'src/services/video';
import { getAvatar } from '../utils/avatar'
import { subscriptionService } from 'src/services/subscription';
import VideoCardMain from 'components/VideoCardMain.vue';

interface Subscription {
  channel: Channel
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

onMounted(async () => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions();
    subscribedChannels.value = subscriptions.map((sub: Subscription) => ({
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
