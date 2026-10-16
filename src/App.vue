<script>
import Navbar from "@/components/Navbar.vue";
import MainData from "@/components/MainData.vue";
import {mapActions, mapState} from "vuex";

const DEFAULT_CITY = 'Tashkent'

export default {
    components: {MainData, Navbar},
    created() {
        this.getLocation();
    },
    computed: {
        ...mapState(['weather', 'loading', 'error'])
    },
    methods: {
        ...mapActions(['getWeather']),
        getLocation() {
            // Joylashuv ruxsat berilmasa yoki ishlamasa, standart shahar ko'rsatiladi
            const fallback = () => this.getWeather({city: DEFAULT_CITY});

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.getWeather({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.error("Geolocation error:", error.message);
                        fallback();
                    },
                    {timeout: 10000}
                );
            } else {
                console.error("Geolocation is not supported on the user's device.");
                fallback();
            }
        }
    }
}
</script>

<template>
    <div v-if="weather" class="wrapper">
        <header class="header">
            <Navbar/>
            <p v-if="error" class="error-msg">{{ error }}</p>
            <MainData/>
            <footer class="footer">Powered by <span>Bilol</span></footer>
        </header>
    </div>
    <div v-else-if="error" class="wrapper-loader">
        <p class="error-msg">{{ error }}</p>
        <button class="retry-btn" @click="getLocation">Qayta urinish</button>
    </div>
    <div v-else class="wrapper-loader">
        <span class="loader"></span>
    </div>
</template>

<style>

.error-msg {
  color: #fff;
  text-align: center;
  padding: 10px 20px;
  font-size: 18px;
}

.footer {
  margin-top: auto;
  padding: 20px 15px;
  text-align: center;
  font-size: 16px;
  color: #555;
}

.footer span {
  color: #4793ff;
  font-weight: 700;
}

.retry-btn {
  margin-top: 10px;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.header {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.wrapper-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.loader {
    animation: rotate 1s infinite;
    height: 50px;
    width: 50px;
}

.loader:before,
.loader:after {
    border-radius: 50%;
    content: "";
    display: block;
    height: 20px;
    width: 20px;
}

.loader:before {
    animation: ball1 1s infinite;
    background-color: #fff;
    box-shadow: 30px 0 0 #ff3d00;
    margin-bottom: 10px;
}

.loader:after {
    animation: ball2 1s infinite;
    background-color: #ff3d00;
    box-shadow: 30px 0 0 #fff;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg) scale(0.8)
    }

    50% {
        transform: rotate(360deg) scale(1.2)
    }

    100% {
        transform: rotate(720deg) scale(0.8)
    }
}

@keyframes ball1 {
    0% {
        box-shadow: 30px 0 0 #ff3d00;
    }

    50% {
        box-shadow: 0 0 0 #ff3d00;
        margin-bottom: 0;
        transform: translate(15px, 15px);
    }

    100% {
        box-shadow: 30px 0 0 #ff3d00;
        margin-bottom: 10px;
    }
}

@keyframes ball2 {
    0% {
        box-shadow: 30px 0 0 #fff;
    }

    50% {
        box-shadow: 0 0 0 #fff;
        margin-top: -20px;
        transform: translate(15px, 15px);
    }

    100% {
        box-shadow: 30px 0 0 #fff;
        margin-top: 0;
    }
}
</style>
