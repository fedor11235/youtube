<template>
  <q-btn
    flat
    round
    class="avatar-btn"
    @click="handlerOpenProfile"
  >
    <q-avatar :size="size" class="avatar">
      <img :src="getAvatar(avatar)"/>
      <q-tooltip v-if="username">
        {{ username }}
      </q-tooltip>
    </q-avatar>
  </q-btn>
</template>

<script setup lang="ts">
import { getAvatar } from '../utils/avatar'
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps<{
  avatar?: string | undefined;
  size?: string;
  username?: string;
  url: string;
}>();

const handlerOpenProfile =  async() => {
  await router.push(`/user/${props.url}`);
};
</script>

<style scoped>
.avatar-btn {
  /* border: 2px solid transparent; */
  transition: all 0.2s ease;
  height: fit-content;
  width: fit-content;
}

.avatar-btn:hover {
  transform: scale(1.1);
  /* border-color: var(--q-primary); */
  box-shadow: 0 0 10px rgba(0, 0, 0, .3);
}
</style>