<template>
  <q-page padding>
    <div v-if="video" class="row q-col-gutter-lg">
      <div class="col-12 col-lg-8">
        <video
          controls
          :poster="getThumbnail(video?.thumbnailUrl)"
          class="full-width"
          style="max-height: 70vh"
          :src="getVideo(video?.videoUrl)"
        ></video>

        <div class="q-mt-md">
          <div class="text-h5">{{ video?.title }}</div>
          
          <div class="row items-center justify-between q-mt-sm">
            <div class="text-grey">
              {{ video?.views }} views • {{ formatDate(video?.createdAt) }}
            </div>
            
            <div>
              <LikeButton :video-id="video.id" />
              <!-- <q-btn flat round icon="thumb_up" /> -->
              <!-- <q-btn flat round icon="thumb_down" /> -->
              <q-btn flat round icon="share" />
              <!-- <q-btn flat round icon="playlist_add" /> -->
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row items-center q-mb-md">
            <q-avatar size="48px" class="q-mr-md">
              <img :src="getAvatar(video?.user.avatar)">
            </q-avatar>
            
            <div class="col">
              <div class="text-weight-bold">{{ video?.user.firstName }} - {{ video?.user.lastName }}</div>
              <div class="text-grey">{{ video?.user.subscribers || 0 }} subscribers</div>
            </div>
            
            <q-btn color="red" label="Subscribe" />
          </div>

          <q-expansion-item
            expand-separator
            label="Description"
            :caption="video?.description"
          />
        </div>

        <!-- Comments section -->
        <CommentSection :video-id="video.id" />
      </div>

      <!-- Related videos -->
      <div class="col-12 col-lg-4">
        <div v-for="video in relatedVideos" :key="video.id" class="q-mb-md">
          <q-item clickable @click="$router.push(`/watch/${video.id}`)">
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// import { date } from 'quasar'
import type { Video } from '../types'
import { getAvatar, getThumbnail, getVideo } from '../utils/avatar'
import videoService from 'src/services/video'
import LikeButton from '../components/LikeButton.vue'
import CommentSection from 'components/CommentSection.vue';

const route = useRoute()
const video = ref<Video | null>(null)
const relatedVideos = ref<Video[]>([])

onMounted(async () => {
  const videoId = parseInt(route.params.id as string)
  try {
    // Here will be API call to fetch video data
    // Sample data for now
    video.value = await videoService.getVideo(videoId);
    console.log("video.value : ", video.value )
    // video.value = {
    //   id: videoId,
    //   title: 'Sample Video Title',
    //   description: 'Sample video description',
    //   thumbnailUrl: 'https://picsum.photos/1920/1080',
    //   videoUrl: '1745783912036-428186528.mp4',
    //   duration: 360, // Added duration in seconds
    //   views: 1.2,
    //   createdAt: new Date(),
    //   channel: {
    //     id: 1,
    //     name: 'Channel Name',
    //     avatar: 'https://cdn.quasar.dev/img/avatar.png',
    //     subscribers: 1000
    //   }
    // }
  } catch (err) {
    console.error('Error fetching video:', err)
  }
})

const formatDate = (date: Date | undefined): string => {
  if (!date) return ''
  // return date.fromNow()
  // return Date.now()
  return date.toString()
}
</script>