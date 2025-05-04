<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Trending</div>

    <div class="row q-col-gutter-md">
      <!-- <div class="col-12">
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
      </div> -->

      <template v-for="video in trendingVideos" :key="video.id">
        <VideoCard
          :video="video"
        />
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VideoCard from '../components/VideoCard.vue'

// const tab = ref('now')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const trendingVideos = ref<any[]>([])

onMounted(() => {
  // Replace with actual API call
  trendingVideos.value = [
    {
      id: 1,
      title: 'Most Popular Video of the Day',
      description: 'This is a trending video that everyone is watching right now.',
      thumbnailUrl: '',
      duration: 845, // in seconds
      views: 2,
      createdAt: new Date(),
      user: {
        id: 1,
        firstName: 'Popular Channel',
        lastName: 'Popular Channel',
        avatar: ''
      }
    },
    // Add more sample videos
  ]
})
</script>

<style scoped>
.trending-card {
  transition: transform 0.2s;
}

.trending-card:hover {
  transform: translateY(-2px);
}
</style>