<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <!-- Profile Header -->
      <div class="col-12">
        <div class="row items-center q-mb-lg">
          <q-avatar size="150px" class="q-mr-lg">
            <img :src="profile?.avatar || 'https://cdn.quasar.dev/img/avatar.png'">
            <q-file
              v-model="newAvatar"
              class="absolute-full cursor-pointer"
              style="opacity: 0"
              accept=".jpg,.png,.jpeg"
              @update:model-value="updateAvatar"
            />
          </q-avatar>
          
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
            <div class="row q-col-gutter-md">
              <div v-for="video in profile?.videos" :key="video.id" class="col-12 col-sm-6 col-md-4">
                <q-card class="video-card" flat bordered>
                  <q-img
                    :src="video.thumbnailUrl"
                    @click="$router.push(`/watch/${video.id}`)"
                    style="cursor: pointer"
                    :ratio="16/9"
                  />
                  <q-card-section>
                    <div class="text-weight-bold ellipsis">{{ video.title }}</div>
                    <div class="text-grey text-caption">
                      {{ video.views }} views • {{ formatDate(video.createdAt) }}
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { date } from 'quasar'
import type { Profile } from '../types/profile'
import profileService from '../services/profile'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const tab = ref('videos')
const profile = ref<Profile | null>(null)
const newAvatar = ref<File | null>(null)

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
}

const profileForm = ref<ProfileForm>({
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  city: ''
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
        city: profile.value.city
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

<style scoped>
.video-card {
  transition: transform 0.2s;
}

.video-card:hover {
  transform: translateY(-2px);
}
</style>