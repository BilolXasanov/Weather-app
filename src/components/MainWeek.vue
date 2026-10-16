<script>
import Days from "@/components/Days.vue";
import {mapState} from "vuex";

export default {
  components: {Days},
  computed: {
    ...mapState(['weather'])
  }
}

</script>

<template>
  <div class="main__week" v-if="weather && weather.daily">
    <Days v-for="(item, i) in weather.daily"
          :key="i"
          :item="item"
    />

  </div>
</template>

<style scoped lang="scss">
.main__week {
  @media (max-width: 1250px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 750px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>

