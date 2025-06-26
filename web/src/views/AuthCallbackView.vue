<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onBeforeMount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  const state = route.query.state;
  const success = route.query.authSuccess;

  if(state && success === "true") {
    await auth.getAccessToken(state.toString())
    router.push({ path: '/'})
  }
})
</script>