<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Trending</div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="now" label="Now" />
          <q-tab name="music" label="Music" />
          <q-tab name="gaming" label="Gaming" />
          <q-tab name="movies" label="Movies" />
        </q-tabs>

        <q-separator />
      </div>

      <template v-for="(video, index) in trendingVideos" :key="video.id">
        <div class="col-12">
          <q-card flat bordered class="trending-card q-pa-sm">
            <div class="row items-start no-wrap">
              <div class="col-12 col-sm-4">
                <q-img
                  :src="video.thumbnailUrl"
                  :ratio="16/9"
                  class="cursor-pointer"
                  @click="$router.push(`/watch/${video.id}`)"
                >
                  <div class="absolute-bottom text-subtitle2 bg-transparent">
                    <q-badge color="dark" class="q-pa-xs">
                      {{ formatDuration(video.duration) }}
                    </q-badge>
                  </div>
                </q-img>
              </div>

              <div class="col q-pl-md">
                <div class="text-h6 ellipsis-2-lines cursor-pointer" @click="$router.push(`/watch/${video.id}`)">
                  {{ index + 1 }}. {{ video.title }}
                </div>
                
                <div class="row items-center q-mt-sm">
                  <q-avatar size="24px" class="q-mr-sm">
                    <img :src="getAvatar(video.channel.avatar)">
                  </q-avatar>
                  <span class="text-subtitle2">{{ video.channel.name }}</span>
                </div>

                <div class="text-grey q-mt-sm">
                  {{ video.views }} views • {{ formatDate(video.createdAt) }}
                </div>

                <div class="text-grey q-mt-sm ellipsis-2-lines">
                  {{ video.description }}
                </div>

                <div class="row items-center q-mt-sm">
                  <q-chip
                    v-if="video.trending"
                    icon="trending_up"
                    color="red"
                    text-color="white"
                    size="sm"
                  >
                    Trending #{{ video.trendingRank }}
                  </q-chip>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAvatar } from '../utils/avatar'
// import { date } from 'quasar'

interface TrendingVideo {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  views: string;
  createdAt: Date;
  trending: boolean;
  trendingRank: number;
  channel: {
    id: number;
    name: string;
    avatar: string;
  };
}

const tab = ref('now')
const trendingVideos = ref<TrendingVideo[]>([])

onMounted(() => {
  // Replace with actual API call
  trendingVideos.value = [
    {
      id: 1,
      title: 'Most Popular Video of the Day',
      description: 'This is a trending video that everyone is watching right now.',
      thumbnailUrl: 'https://picsum.photos/1920/1080',
      duration: 845, // in seconds
      views: '2.5M',
      createdAt: new Date(),
      trending: true,
      trendingRank: 1,
      channel: {
        id: 1,
        name: 'Popular Channel',
        avatar: 'https://cdn.quasar.dev/img/avatar.png'
      }
    },
    // Add more sample videos
  ]
})

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
</script>

<style scoped>
.trending-card {
  transition: transform 0.2s;
}

.trending-card:hover {
  transform: translateY(-2px);
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>