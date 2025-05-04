<template>
  <q-page padding>
    <div v-if="video" class="row q-col-gutter-lg">
      <div class="col-12 col-lg-8">
        <VideoPlayer
          :video="video"
        />

        <div class="q-mt-md">
          <div class="text-h5">{{ video?.title }}</div>
          
          <div class="row items-center justify-between q-mt-sm">
            <div class="text-grey">
              {{ video?.views }} views • {{ formatDate(video?.createdAt) }}
            </div>
            
            <div class="row items-center q-gutter-x-md">
              <LikeButton :video-id="video.id" />

              <FavoriteButton
                :video-id="video.id"
              />

              <ShareVideo
                :video-id="video.id"
                :title="video.title"
              />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="video-info q-mt-md">
              <div class="row items-center justify-between">
                <div class="col-auto">
                  <div class="row items-center">
                    <UserAvatar
                      :avatar="video.user.avatar"
                      :url="video.user.url"
                      :username="video.user.username"
                      size="40px"
                      class="q-mr-md"
                    />
                    <div>
                      <div class="text-weight-bold">{{ video.user.username }}</div>
                      <div class="text-caption text-grey">{{ subscribersCount }} подписчиков</div>
                    </div>
                  </div>
                </div>
                
                <div class="col-auto">
                  <SubscribeButton
                    :channel-url="video.user.url"
                    v-model:subscribers-count="subscribersCount"
                  />
                </div>
              </div>
            </div>

          <q-expansion-item
            class="description"
            expand-separator
            label="Description"
            :caption="video?.description"
          />
        </div>

        <CommentSection
          :video-id="video.id"
          :video-author-id="video.user.id"
        />
      </div>

      <RelatedVideos
        :relatedVideos="relatedVideos"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// import { date } from 'quasar'
import type { Video } from '../types'
import videoService from 'src/services/video'
import LikeButton from '../components/LikeButton.vue'
import CommentSection from 'components/CommentSection.vue';
import { subscriptionService } from 'src/services/subscription'
import SubscribeButton from 'components/SubscribeButton.vue';
import UserAvatar from 'components/UserAvatar.vue';
import ShareVideo from 'components/ShareVideo.vue'
import FavoriteButton from 'components/FavoriteButton.vue';
import VideoPlayer from 'components/VideoPlayer.vue';
import RelatedVideos from 'components/RelatedVideos.vue';

const route = useRoute()
const video = ref<Video | null>(null)
const relatedVideos = ref<Video[]>([])
const subscribersCount = ref(0);

const formatDate = (date: Date | undefined): string => {
  if (!date) return ''
  // return date.fromNow()
  // return Date.now()
  return date.toString()
}

onMounted(async () => {
  const videoId = parseInt(route.params.id as string)
    try {
      // Проверяем статус подписки
      video.value = await videoService.getVideo(videoId);
      relatedVideos.value = await videoService.getRelatedVideos(videoId);
      // Получаем количество подписчиков
      const subscribers = await subscriptionService.getSubscribers(video.value.user.url);
      subscribersCount.value = subscribers.length;
    } catch (error) {
      console.error('Ошибка при загрузке данных о подписке:', error);
    }
});
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