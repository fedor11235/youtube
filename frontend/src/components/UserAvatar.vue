<template>
  <q-avatar :size="size">
    <img :src="getAvatar(avatar)" @error="handleImageError" />
  </q-avatar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAvatar } from '../utils/avatar'

defineProps<{
  avatar?: string | undefined;
  size?: string;
}>();

const imageError = ref(false);

const handleImageError = () => {
  imageError.value = true;
};
</script>