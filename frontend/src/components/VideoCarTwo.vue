<template>
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
        <UserAvatar
          :avatar="video.channel.avatar"
          :url="video.channel.url"
          :username="video.channel.username || 'Test'"
          size="40px"
          class="q-mr-sm"
        />
        
        <div>
          <div class="text-weight-bold ellipsis-2-lines">{{ video.title }}</div>
          <div class="text-grey">{{ video.channel.name }}</div>
          <div class="text-grey text-caption">
            {{ video.views }} views • {{ formatDate(video.createdAt) }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { getThumbnail } from '../utils/avatar'
import UserAvatar from 'components/UserAvatar.vue';
import { formatDate } from '../utils/date'

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  video: any;
}>();

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
.video-card {
transition: transform 0.2s;
}

.video-card:hover {
transform: translateY(-2px);
}

.ellipsis-2-lines {
display: -webkit-box;
line-clamp: 2;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
}
</style>