<script>
import {mapState} from 'vuex';
import {weatherName} from '@/icons';
import tempImg from '@/assets/images/temp.svg'
import davleniyeImg from '@/assets/images/davleniye.svg'
import osadkiImg from '@/assets/images/osadki.svg'
import windImg from '@/assets/images/wind.svg'

export default {
  computed: {
    ...mapState(['weather']),
    getTime() {
      return new Date().toLocaleString('en-EN', {
        timeZone: this.weather.timezone,
        timeStyle: 'short',
        hourCycle: 'h23'
      })
    },
    getImg() {
      const key = this.weather.current.weather[0].icon;
      return weatherName[key] || weatherName['clear'];
    },
    content() {
      return [
        {
          img: tempImg, name: 'Temperature', info: `${Math.round(this.weather.current.temp)}°C - feels like ${Math.round(this.weather.current.feels_like)}°C`
        },
        {
          img: davleniyeImg, name: 'Pressure', info: `${this.weather.current.pressure} mm Hg`
        },
        {
          img: osadkiImg, name: 'Cloudness', info: `${this.weather.current.clouds} %`
        },
        {
          img: windImg, name: 'Wind', info: `${Math.round(this.weather.current.wind_speed * 10) / 10} m/s`
        }

      ]
    }
  }
}
</script>


<template>
  <div class="main__content">

    <div class="main__content-left" v-if="weather">
      <div class="main__content-left-box">
        <p class="main__content-left-box-degree">{{ Math.round(weather.current.temp) }}°</p>
        <p class="main__content-left-box-today">Сегодня</p>
        <p class="main__content-left-box-time">Время: {{ getTime }}</p>
        <p class="main__content-left-box-city">Город: {{ weather.name.toUpperCase() }}</p>
      </div>
      <img :src="getImg" alt="svg" class="main__content-left-img">
    </div>
    <div class="main__content-right">
      <img src="../assets/images/headerBg.png" alt="png" class="main__content-right-bg">

      <div class="main__content-right-item" v-for="item in content" :key="item.name">
        <div class="main__content-right-item-img">
          <img :src="item.img" alt="svg">
        </div>
        <span>{{ item.name }}</span>
        <p>{{ item.info }}</p>
      </div>

    </div>

  </div>

</template>

<style scoped lang="scss">
.main__content {
  @media (max-width: 1250px) {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
}
</style>