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
import { getThumbnail } from '../utils/avatar'

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedVideos: any;
}>();

const formatDate = (date: Date | undefined): string => {
  if (!date) return ''
  // return date.fromNow()
  // return Date.now()
  return date.toString()
}
</script>

<style lang="scss" scoped>
.description {
  background: rgba(0, 0, 0, 0.02);
  margin-top: 16px;
}

.q-expansion-item {
  border-radius: 12px;
}

.q-expansion-item :deep(.q-expansion-item__container) {
  border-radius: 12px;
}

.q-expansion-item :deep(.q-item) {
  border-radius: 12px;
}

.related-videos {
  background: rgba(0, 0, 0, 0.02);
  margin-left: 4px;
}
</style>