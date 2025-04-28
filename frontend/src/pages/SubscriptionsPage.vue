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
              :src="video.thumbnailUrl"
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
                  <div class="text-grey">{{ video.channel.name }}</div>
                  <div class="text-grey text-caption">
                    {{ video.views }} views • {{ formatDate(video.createdAt) }}
                  </div>
                </div>

                <q-btn
                  flat
                  round
                  icon="more_vert"
                  class="q-ml-sm"
                >
                  <q-menu>
                    <q-list style="min-width: 150px">
                      <q-item clickable v-close-popup @click="addToWatchLater(video.id)">
                        <q-item-section avatar>
                          <q-icon name="watch_later" />
                        </q-item-section>
                        <q-item-section>Watch later</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="addToPlaylist(video.id)">
                        <q-item-section avatar>
                          <q-icon name="playlist_add" />
                        </q-item-section>
                        <q-item-section>Add to playlist</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
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
import { getAvatar } from '../utils/avatar'

interface Channel {
  id: number;
  name: string;
  avatar: string;
  subscribers: number;
}

const subscribedChannels = ref<Channel[]>([])
const channelVideos = ref<Video[]>([])
const selectedChannelId = ref<number | null>(null)

onMounted(() => {
  // Sample data - replace with API calls
  subscribedChannels.value = [
    {
      id: 1,
      name: 'Tech Channel',
      avatar: '',
      subscribers: 100000
    },
    {
      id: 2,
      name: 'Music Channel',
      avatar: '',
      subscribers: 200000
    }
  ]

  loadChannelVideos()
})

const loadChannelVideos = () => {
  // Sample data - replace with API call
  channelVideos.value = [
    {
      id: 1,
      title: 'Latest Video from Subscribed Channel',
      description: 'Video description',
      thumbnailUrl: 'https://picsum.photos/1920/1080',
      duration: 360,
      views: 10,
      createdAt: new Date(),
      channel: subscribedChannels.value[0] as Channel,
      user: subscribedChannels.value[0] as Channel
    }
  ]
}

const selectChannel = (channelId: number) => {
  selectedChannelId.value = channelId
  loadChannelVideos()
}

const formatDate = (date: Date): string => {
  // return date.fromNow()
  return date.toString()
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

const addToWatchLater = (videoId: number) => {
  console.log(videoId)
  // Implement watch later functionality
}

const addToPlaylist = (videoId: number) => {
  console.log(videoId)
  // Implement playlist functionality
}
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