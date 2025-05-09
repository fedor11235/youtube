<template>
  <div class="col-12 col-lg-4">
    <div
      v-for="video in relatedVideos"
      :key="video.id"
      class="related-videos q-mb-md"
      @click="$router.push(`/watch/${video.id}`)"
    >
      <q-item clickable>
        <q-item-section side>
          <q-img
            :src="getThumbnail(video?.thumbnailUrl)"
            :ratio="16/9"
            style="width: 168px"
          />
        </q-item-section>
        
        <q-item-section>
          <q-item-label lines="2">{{ video.title }}</q-item-label>
          <q-item-label caption>{{ video.channel.name }}</q-item-label>
          <q-item-label caption>
            {{ video.views }} views • {{ formatDate(video.createdAt) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Video } from 'src/types/video';
import { getThumbnail } from '../utils/avatar'
import { formatDate } from '../utils/date'

defineProps<{
  relatedVideos: Video[];
}>();
</script>

<style lang="scss" scoped>
.related-videos {
  background: rgba(0, 0, 0, 0.02);
  margin-left: 4px;
}
</style>