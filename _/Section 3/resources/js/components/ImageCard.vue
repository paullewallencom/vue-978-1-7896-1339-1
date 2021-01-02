<template>
  <v-card>
    <v-img
      :src="filePath"
      aspect-ratio="2.75"
    ></v-img>

    <v-card-title primary-title>
      {{ name }}
    </v-card-title>

    <v-card-actions>
      <slot />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    filePath: {
      type: String,
    },
    name: {
      type: String,
    }
  }
}
</script>
