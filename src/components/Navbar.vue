<script>
import logo from '@/assets/images/Header logo.svg'
import { mapState, mapActions, mapMutations} from 'vuex'

export default {
  data() {
    return {
      logo
    }
  },
  computed: {
    ...mapState(['city']),
    getCity: {
      get() {
        return this.city
      },
      set(val) {
        this.setCity(val)
      }
    }
  },
  methods: {
    ...mapMutations(['setCity']),
    ...mapActions(['getWeather'])
  }
}


</script>

<template>
    <nav class="nav">
        <div class="nav__box container">
            <a href="#" class="nav__box-link">
                <img :src="logo" alt="svg" class="nav__box-link-image">
                <span>vue weather</span>
            </a>
            <div class="nav__box-search">
                <img src="../assets/images/kaplya.svg" alt="svg">
                <input 
                    type="text" 
                    placeholder="Выбрать город" 
                    class="nav__box-search-input"
                    v-model="getCity"
                    @keydown.enter="getWeather({city: getCity})"
                >
            </div>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
.nav__box {
  @media (max-width: 750px) {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
