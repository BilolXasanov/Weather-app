<script>
import {weatherName} from "@/icons.js";
import {unix} from "@/unix.js";

export default {
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    getImg() {
      const key = this.item.weather && this.item.weather[0]
          ? this.item.weather[0].icon
          : 'daily_sun';

      const img = weatherName[key];

      return img || weatherName['daily_sun'];
    },
    getWeekDay() {
        return unix(this.item.dt, 'weekday')
    },
    getDay() {
      return unix(this.item.dt, 'day')
    },
    getMonth() {
      return unix(this.item.dt, 'month')
    },
  }
}
</script>

<template>
  <div class="main__week-item">
    <p class="main__week-item-weekday">{{ getWeekDay }}</p>
    <p class="main__week-item-month">{{ getDay }} {{ getMonth }}</p>
    <img :src="getImg" alt="svg" class="main__week-item-img">
    <p class="main__week-item-tempday">{{ Math.round(item.temp.max) }}</p>
    <p class="main__week-item-tempnight">{{ Math.round(item.temp.night) }}</p>
    <p class="main__week-item-info">
      {{ item.weather && item.weather[0].description ? item.weather[0].description : "No data" }}
    </p>
  </div>
</template>
