<template>
  <q-page padding>
    <div class="profile-header">
      <div class="cover-photo avatar-upload-container">
        <img 
          :src="getBanner(profile?.banner)"
          alt="Cover photo"
          class="cover-image"
        />
        <div class="banner-upload-overlay">
          <q-icon name="add_a_photo" size="32px" />
          <div class="upload-text">Изменить фото</div>
          <q-file
            v-model="newBanner"
            class="absolute-full cursor-pointer"
            style="opacity: 0"
            accept=".jpg,.png,.jpeg"
            @update:model-value="updateBanner"
          />
        </div>
      </div>

      <div class="profile-info q-px-md">
        <div class="profile-main">
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

          <div class="channel-details q-ml-md">
            <h1 class="text-h4 q-mb-sm">{{ profile?.username }}</h1>
            <div class="channel-stats">
              <span class="stat-item">
                <span class="stat-value">{{ profile?.totalVideo || 0 }}</span>
                <span class="stat-label">видео</span>
              </span>
              <span class="stat-separator">•</span>
              <span class="stat-item">
                <span class="stat-value">{{ profile?.subscribers || 0 }}</span>
                <span class="stat-label">подписчиков</span>
              </span>
            </div>
            <p class="channel-bio q-mt-sm">{{ profile?.description }}</p>
          </div>
        </div>

        <q-tabs
          v-model="tab"
          class="q-mt-md"
          dense
          align="left"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="videos" icon="video_library" label="Видео" />
          <q-tab name="about" icon="info" label="О канале" />
          <q-tab name="settings" icon="settings"  label="Settings" />
        </q-tabs>
      </div>
    </div>
    
    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="videos">
            <div  v-if="profile?.videos.length"  class="row q-col-gutter-md">
              <div v-for="video in profile?.videos" :key="video.id" class="col-12 col-sm-6 col-md-4">
                <VideoCardProfile
                  :video="video"
                  @delete-video="videoId => deleteVideo(videoId)"
                />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="about">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Details</div>
                <div class="row q-mt-md">
                  <div class="col-12 col-md-6">
                    <div>{{ profileForm.description }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="settings">
            <q-form @submit="updateProfile" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.username"
                    label="First Name"
                    outlined
                    :rules="[val => !!val || 'First name is required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.username"
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
                    v-model="profileForm.url"
                    label="Url"
                    outlined
                    :rules="[val => !!val || 'Email is required']"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="profileForm.description"
                    label="Описание канала"
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
            <q-card v-if="!profile?.isModel" class="q-mt-md">
              <q-card-section>
                <div class="text-h6">Настройки студии</div>
                
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Включить режим студии</q-item-label>
                    <q-item-label caption>
                      Активируйте для доступа к расширенным функциям студии
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="studioMode" @update:model-value="handleStudioModeChange" />
                  </q-item-section>
                </q-item>

                <div v-if="studioMode" class="q-mt-md">
                  <div class="text-subtitle2 q-mb-sm">Подтверждение возраста</div>

                  <div v-if="!hasPassportPhoto" class="passport-upload q-pa-md">
                    <q-uploader
                      label="Загрузите фото паспорта"
                      accept=".jpg,.jpeg,.png"
                      :max-files="1"
                      @added="handlePassportUpload"
                      class="full-width"
                      flat
                      bordered
                      :disable="isUploading"
                    >
                      <template>
                        <div class="row no-wrap items-center q-pa-sm">
                          <q-icon name="add_photo_alternate" size="24px" class="q-mr-sm" />
                          <div class="col">Загрузите фото паспорта для подтверждения возраста</div>
                        </div>
                      </template>
                    </q-uploader>
                    <div class="text-caption q-mt-sm text-grey-7">
                      Загружая изображение паспорта, вы подтверждаете, что документ принадлежит вам, и даёте согласие на обработку персональных данных в целях верификации возраста.
                    </div>
                  </div>
                  
                  <div v-else class="passport-verified q-pa-sm">
                    <q-icon name="check_circle" color="positive" size="24px" class="q-mr-sm" />
                    <span class="text-positive">Паспорт загружен и ожидает проверки</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card v-else class="q-mt-md">
              <q-card-section>
                <div class="text-h6">Ваш аккаунт подтвержденый</div>    
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Profile } from '../types/profile'
import profileService from '../services/profile'
import { useQuasar } from 'quasar'
import { getAvatar, getBanner } from '../utils/avatar'
import videoService from 'src/services/video'
import studioService from '../services/studio'

import VideoCardProfile from '../components/VideoCardProfile.vue'

interface ProfileForm {
  username: string;
  email: string;
  url: string;
  description: string;
}

const $q = useQuasar()

const tab = ref('videos')
const profile = ref<Profile | null>(null)
const newAvatar = ref<File | null>(null)
const hasPassportPhoto = ref<boolean>(false)
const studioMode = ref(false)
const isUploading = ref(false)

const profileForm = ref<ProfileForm>({
  email: '',
  username: '',
  url: '',
  description: ''
})

const newBanner = ref<File | null>(null)

const handleStudioModeChange = (value: boolean) => {
  if (value && !hasPassportPhoto.value) {
    $q.notify({
      type: 'warning',
      message: 'Для активации режима студии необходимо подтвердить возраст'
    })
  }
}

const handlePassportUpload = async (files: readonly File[]) => {
  if (!files.length) return
  
  const file = files[0]
  if(!file) return
  isUploading.value = true

  try {
    await studioService.uploadPassport(file)
    hasPassportPhoto.value = true
    $q.notify({
      type: 'positive',
      message: 'Паспорт успешно загружен и отправлен на проверку'
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при загрузке паспорта. Пожалуйста, попробуйте снова.'
    })
  }
}

const deleteVideo = async (videoId: number) => {
  try {  
    await videoService.deleteVideo(videoId)
    if(profile.value) {
      profile.value.videos = profile.value.videos.filter(video => video.id !== videoId)
    }
    $q.notify({
      type: 'positive',
      message: 'Видео успешно удалено'
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при удалении видео'
    })
  }
}

const updateBanner = async () => {
  if (!newBanner.value) return
  try {
    const updatedProfile = await profileService.updateBanner(newBanner.value)
    profile.value = updatedProfile
    $q.notify({
      type: 'positive',
      message: 'Баннер успешно обновлен'
    })
  } catch (err) {
    console.error('Error updating banner:', err)
    $q.notify({
      type: 'negative',
      message: 'Не удалось обновить баннер'
    })
  }
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
        username: profile.value.username,
        email: profile.value.email,
        url: profile.value.url,
        description: profile.value.description
      }
      studioMode.value = !!profile.value.hasPassportPhoto
      isUploading.value = !!profile.value.hasPassportPhoto

      // const passportUrl = getPassport(profile.value.hasPassportPhoto)

      // const response = await fetch(passportUrl);
      // const blob = await response.blob();

      // const file = new File([blob], 'passport-example.jpg', {
      //   type: blob.type,
      // });

      // uploader.value.addFiles([file]); // Добавить файл в q-uploader вручную
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
.avatar-upload-container {
  position: relative;
  cursor: pointer;

  .banner-upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
  
  .avatar-upload-overlay {
    @extend .banner-upload-overlay;
    border-radius: 50%;
  }
  
  &:hover {
    .avatar-upload-overlay,
    .banner-upload-overlay {
      opacity: 1;
    }
  }
}

.profile-header {
  background: white;
}

.cover-photo {
  height: 300px;
  overflow: hidden;
  position: relative;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  position: relative;
  margin-top: -60px;
  padding-bottom: 16px;
}

.profile-main {
  display: flex;
  align-items: flex-end;
  padding: 0 16px;
}

.channel-details {
  flex-grow: 1;
  padding-bottom: 8px;
}

.channel-stats {
  display: flex;
  align-items: center;
  color: #666;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-weight: bold;
}

.stat-separator {
  margin: 0 12px;
}

.channel-bio {
  color: #666;
  max-width: 600px;
}

@media (max-width: 600px) {
  .profile-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .channel-details {
    margin-top: 16px;
    margin-left: 0 !important;
  }

  .channel-stats {
    justify-content: center;
  }
}
</style>