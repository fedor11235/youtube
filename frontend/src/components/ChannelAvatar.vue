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
  url?: string;
}>();

const handlerOpenProfile =  async() => {
  await router.push(`/channels/${props.url}`);
};
</script>

<style lang="scss" scoped>
.avatar-btn {
  height: fit-content;
  width: fit-content;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
  }
}
</style>