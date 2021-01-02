<template>
  <div>
    <v-layout row wrap>
      <v-flex 
        v-for="p in photos"
        :key="p.id"
        xs12
        sm3
        class="card"
      >
        <router-link
          :to="{name: 'detail', params: { id: p.id } }"
          class="detail-link"
        >
          <image-card
            :filePath="imagePath(p.filePath)"
            :name="p.name"
          >
            <el-button
              type="text"
              class="button"
            >
              More Info
            </el-button>
          </image-card>
        </router-link>
      </v-flex>

      <v-flex
        xs12
        sm3
        class="card"
      >
        <vue-dropzone
          id="dropzone"
          ref="dropzone"
          @vdropzone-success="onSuccess"
          :options="dropzoneOptions"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import ImageCard from './ImageCard'

export default {
  name: 'app',
  components: {
    vueDropzone: vue2Dropzone,
    ImageCard,
  },
  computed: {
    photos() {
      return this.$store.state.photos;
    },
  },
  methods: {
    imagePath(filePath) {
      return `/storage/${filePath}`;
    },
    onSuccess() {
      this.$refs.dropzone.removeAllFiles();
    }
  },
  data() {
    return {
      dropzoneOptions: {
        url: '/api/photo',
        thumbnailWidth: 150,
        maxFilesize: 10,
        headers: {
         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      }
    }
  }
}
</script>

<style scoped>
.detail-link, .detail-link a, .detail-link a:active {
  text-decoration: none;
}

.card {
  margin: 0.5em;
}
</style>

