<template>
  <div class="col-12">
    <q-card flat bordered class="trending-card q-pa-sm" @click="navigateToVideo(video.id)">
      <div class="row items-start no-wrap">
        <div class="col-12 col-sm-4">
          <q-img
            :src="getThumbnail(video.thumbnailUrl)"
            :ratio="16/9"
            class="cursor-pointer"
          >
            <div class="absolute-bottom text-subtitle2 bg-transparent">
              <q-badge color="dark" class="q-pa-xs">
                {{ formatDuration(video.duration) }}
              </q-badge>
            </div>
          </q-img>
        </div>

        <div class="col q-pl-md">
          <div class="text-h6 ellipsis-2-lines cursor-pointer">
            {{ video.title }}
          </div>

          <div class="row items-center q-mt-sm">
            <ChannelAvatar
              :avatar="video.channel.avatar"
              :url="video.channel.url"
              :username="video.channel.username"
              size="40px"
              class="q-mr-md"
            />
            <span class="text-subtitle2">{{ video.channel.username }}</span>
          </div>

          <div class="text-grey q-mt-sm">
            {{ video.views }} views • {{ formatDate(video.createdAt) }}
          </div>

          <div class="text-grey q-mt-sm ellipsis-2-lines">
            {{ video.description }}
          </div>
        </div>
      </div>
    </q-card>
    
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getThumbnail } from '../utils/avatar'
import type { Video } from 'src/types/video';
import { formatDate } from '../utils/date'
import ChannelAvatar from '../components/ChannelAvatar.vue'

defineProps<{
  video: Video;
}>();

const router = useRouter();

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
};

const navigateToVideo = async (videoId: number) => {
  await router.push(`/watch/${videoId}`);
};
</script>

<style lang="scss" scoped>
.ellipsis-2-lines {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>