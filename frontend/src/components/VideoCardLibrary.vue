<template>
  <q-card flat bordered class="library-video-card">
    <div class="row no-wrap">
      <div class="col-12 col-sm-4">
        <q-img
          :src="getThumbnail(video.thumbnailUrl)"
          :ratio="16/9"
          class="cursor-pointer"
          @click="$router.push(`/watch/${video.id}`)"
        >
          <div class="absolute-bottom text-subtitle2 bg-transparent">
            <q-badge color="dark" class="q-pa-xs">
              {{ formatDuration(video.duration || 0) }}
            </q-badge>
          </div>
        </q-img>
      </div>

      <div class="col q-pa-md">
        <div class="row items-start justify-between">
          <div class="col">
            <div 
              class="text-h6 ellipsis-2-lines cursor-pointer" 
              @click="$router.push(`/watch/${video.id}`)"
            >
              {{ video.title }}
            </div>
            
            <div class="row items-center q-mt-sm">
              <q-avatar size="24px" class="q-mr-sm">
                <img :src="getAvatar(video.channel.avatar)">
              </q-avatar>
              <span class="text-subtitle2">{{ video.channel.username }}</span>
            </div>

            <div class="text-grey q-mt-sm">
              {{ video.views }} views • {{ formatDate(video.createdAt) }}
            </div>

            <div v-if="video.watchedAt" class="text-grey q-mt-sm">
              Watched {{ formatDate(video.watchedAt) }}
            </div>
            <div v-if="video.addedAt" class="text-grey q-mt-sm">
              Added {{ formatDate(video.addedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { getAvatar, getThumbnail } from '../utils/avatar'
import { formatDate } from '../utils/date'
import type { LibraryVideo } from '../types/video'

defineProps<{
  video: LibraryVideo
}>()

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

<style lang="scss" scoped>
.library-video-card {
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.ellipsis-2-lines {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>