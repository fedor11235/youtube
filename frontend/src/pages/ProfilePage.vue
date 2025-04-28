<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <!-- Profile Header -->
      <div class="col-12 ">
        <div class="row items-center">
          <div class="avatar-upload-container q-mr-xl">
            <q-avatar size="180px">
              <img :src="getAvatar(profile?.avatar)" />
            </q-avatar>
            
            <div class="avatar-upload-overlay">
              <q-icon name="add_a_photo" size="32px" />
              <div class="upload-text">Изменить фото</div>
              <q-file
                v-model="newAvatar"
                class="absolute-full cursor-pointer"
                style="opacity: 0"
                accept=".jpg,.png,.jpeg"
                @update:model-value="updateAvatar"
              />
            </div>
          </div>
            
          <div>
            <div class="text-h4">{{ profile?.firstName }} {{ profile?.lastName }}</div>
            <div class="text-grey q-mt-sm">
              {{ profile?.subscribers }} subscribers • {{ profile?.totalViews }} total views
            </div>
            <div class="text-grey">Joined {{ formatDate(profile?.joinDate) }}</div>
          </div>
        </div>
      </div>

      <!-- Profile Tabs -->
      <div class="col-12">
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="videos" label="Videos" />
          <q-tab name="about" label="About" />
          <q-tab name="settings" label="Settings" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <!-- Videos Tab -->
          <q-tab-panel name="videos">
            <div  v-if="profile?.videos.length"  class="row q-col-gutter-md">
              <div v-for="video in profile?.videos" :key="video.id" class="col-12 col-sm-6 col-md-4">
                <q-card class="video-card">
                  <div class="video-thumbnail-container">
                    <img :src="getThumbnail(video.thumbnailUrl)" class="video-thumbnail">
                    <div class="video-overlay">
                      <q-btn
                        flat
                        round
                        color="white"
                        icon="delete"
                        class="delete-btn"
                        @click.stop="confirmDelete(video)"
                      />
                    </div>
                  </div>
                  <q-card-section>
                    <div class="text-h6 ellipsis">{{ video.title }}</div>
                    <div class="text-subtitle2 text-grey">
                      {{ video.views }} просмотров
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- About Tab -->
          <q-tab-panel name="about">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Details</div>
                <div class="row q-mt-md">
                  <div class="col-12 col-md-6">
                    <div class="text-grey">Location</div>
                    <div>{{ profile?.city }}, {{ profile?.country }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <!-- Settings Tab -->
          <q-tab-panel name="settings">
            <q-form @submit="updateProfile" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.firstName"
                    label="First Name"
                    outlined
                    :rules="[val => !!val || 'First name is required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.lastName"
                    label="Last Name"
                    outlined
                    :rules="[val => !!val || 'Last name is required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.email"
                    label="Email"
                    outlined
                    type="email"
                    :rules="[val => !!val || 'Email is required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.country"
                    label="Country"
                    outlined
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.city"
                    label="City"
                    outlined
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.url"
                    label="Url"
                    outlined
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-md">
                <q-btn
                  color="primary"
                  label="Save Changes"
                  type="submit"
                />
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
  <q-dialog v-model="deleteDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="warning" text-color="white" />
        <span class="q-ml-sm">Вы уверены, что хотите удалить это видео?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn flat label="Удалить" color="negative" @click="deleteVideo" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { date } from 'quasar'
import type { Profile } from '../types/profile'
import profileService from '../services/profile'
import { useQuasar } from 'quasar'
import { getAvatar, getThumbnail } from '../utils/avatar'
import videoService from 'src/services/video'

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  url: string;
}

const $q = useQuasar()

const tab = ref('videos')
const profile = ref<Profile | null>(null)
const newAvatar = ref<File | null>(null)
const deleteDialog = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const videoToDelete: any = ref(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const confirmDelete = (video: any) => {
  videoToDelete.value = video
  deleteDialog.value = true
}

const deleteVideo = async () => {
  try {
    if(videoToDelete.value) {      
      await videoService.deleteVideo(videoToDelete.value.id)
      if(profile.value) {
        profile.value.videos = profile.value?.videos.filter(video => video.id !== videoToDelete.value.id)
      }
      // userVideos.value = userVideos.value.filter(v => v.id !== videoToDelete.value.id)
      $q.notify({
        type: 'positive',
        message: 'Видео успешно удалено'
      })
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при удалении видео'
    })
  }
}

const profileForm = ref<ProfileForm>({
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  city: '',
  url: ''
})


const formatDate = (date: Date | undefined): string => {
  if (!date) return ''
  // return date.fromNow()
  return date.toString()
}

const updateProfile = async () => {
  try {
    const updatedProfile = await profileService.updateProfile(profileForm.value)
    profile.value = updatedProfile
    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully'
    })
  } catch (err) {
    console.error('Error updating profile:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile'
    })
  }
}

const updateAvatar = async () => {
  if (!newAvatar.value) return
  try {
    const updatedProfile = await profileService.updateAvatar(newAvatar.value)
    profile.value = updatedProfile
    $q.notify({
      type: 'positive',
      message: 'Avatar updated successfully'
    })
  } catch (err) {
    console.error('Error updating avatar:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to update avatar'
    })
  }
}

onMounted(async () => {
  try {
    profile.value = await profileService.getProfile()
    if (profile.value) {
      profileForm.value = {
        firstName: profile.value.firstName,
        lastName: profile.value.lastName,
        email: profile.value.email,
        country: profile.value.country,
        city: profile.value.city,
        url: profile.value.url
      }
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load profile'
    })
  }
})

</script>

<style lang="scss" scoped>
.video-card {
  transition: transform 0.2s;
}

.video-card:hover {
  transform: translateY(-2px);
}

.avatar-upload-container {
  position: relative;
  cursor: pointer;
  
  .avatar-upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .upload-text {
      margin-top: 8px;
      font-size: 14px;
    }
  }
  
  &:hover {
    .avatar-upload-overlay {
      opacity: 1;
    }
  }
}
.video-thumbnail-container {
  position: relative;
  
  .video-thumbnail {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  
  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .delete-btn {
      background: rgba(0, 0, 0, 0.7);
    }
  }
  
  &:hover {
    .video-overlay {
      opacity: 1;
    }
  }
}
</style>