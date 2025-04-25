<template>
  <q-card flat bordered class="library-video-card">
    <div class="row no-wrap">
      <div class="col-12 col-sm-4">
        <q-img
          :src="video.thumbnailUrl"
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
              <span class="text-subtitle2">{{ video.channel.name }}</span>
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

          <div>
            <q-btn
              flat
              round
              icon="more_vert"
              class="q-ml-sm"
            >
              <q-menu>
                <q-list style="min-width: 150px">
                  <q-item clickable @click="$emit('remove')">
                    <q-item-section avatar>
                      <q-icon name="delete" />
                    </q-item-section>
                    <q-item-section>Remove</q-item-section>
                  </q-item>
                  <q-item clickable @click="addToPlaylist">
                    <q-item-section avatar>
                      <q-icon name="playlist_add" />
                    </q-item-section>
                    <q-item-section>Save to playlist</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import { getAvatar } from '../utils/avatar'
import type { LibraryVideo } from '../types'

defineProps<{
  video: LibraryVideo
}>()

defineEmits<{
  (e: 'remove'): void
}>()

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

const addToPlaylist = () => {
  // Implement playlist functionality
}
</script>

<style scoped>
.library-video-card {
  transition: transform 0.2s;
}

.library-video-card:hover {
  transform: translateY(-2px);
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>