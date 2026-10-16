import { createStore } from 'vuex'
import axios from 'axios'

// Open-Meteo: bepul, API kalit kerak emas, HTTPS
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

// WMO ob-havo kodlari -> (tavsif, ikonka kaliti)
const WMO = {
    0: ['Ясно', 'clear'],
    1: ['Преимущественно ясно', 'clear'],
    2: ['Переменная облачность', 'partly cloudy'],
    3: ['Пасмурно', 'overcast clouds'],
    45: ['Туман', 'mist'],
    48: ['Изморозь', 'mist'],
    51: ['Лёгкая морось', 'light rain'],
    53: ['Морось', 'light rain'],
    55: ['Сильная морось', 'light rain'],
    56: ['Ледяная морось', 'light rain'],
    57: ['Сильная ледяная морось', 'light rain'],
    61: ['Небольшой дождь', 'light rain'],
    63: ['Дождь', 'rain'],
    65: ['Сильный дождь', 'rain'],
    66: ['Ледяной дождь', 'rain'],
    67: ['Сильный ледяной дождь', 'rain'],
    71: ['Небольшой снег', 'mist'],
    73: ['Снег', 'mist'],
    75: ['Сильный снег', 'mist'],
    77: ['Снежные зёрна', 'mist'],
    80: ['Небольшой ливень', 'light intensity shower rain'],
    81: ['Ливень', 'rain'],
    82: ['Сильный ливень', 'rain'],
    85: ['Снегопад', 'mist'],
    86: ['Сильный снегопад', 'mist'],
    95: ['Гроза', 'rain'],
    96: ['Гроза с градом', 'rain'],
    99: ['Сильная гроза с градом', 'rain'],
}

const describe = (code) => {
    const [description, icon] = WMO[code] || ['Нет данных', 'daily_sun']
    return { description, icon }
}

const HPA_TO_MMHG = 0.750062

async function loadForecast(lat, lon, name) {
    const { data } = await axios.get(FORECAST_URL, {
        params: {
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,apparent_temperature,pressure_msl,cloud_cover,wind_speed_10m,weather_code',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min',
            wind_speed_unit: 'ms',
            timezone: 'auto',
            forecast_days: 8,
        },
    })

    const c = data.current
    const current = {
        temp: c.temperature_2m,
        feels_like: c.apparent_temperature,
        pressure: Math.round(c.pressure_msl * HPA_TO_MMHG),
        clouds: c.cloud_cover,
        wind_speed: c.wind_speed_10m,
        weather: [describe(c.weather_code)],
    }

    const daily = data.daily.time.map((date, i) => ({
        // kun o'rtasi (UTC) — vaqt zonasi tufayli sana siljib ketmasligi uchun
        dt: Date.parse(`${date}T12:00:00Z`) / 1000,
        temp: {
            max: data.daily.temperature_2m_max[i],
            night: data.daily.temperature_2m_min[i],
        },
        weather: [describe(data.daily.weather_code[i])],
    }))

    return { current, daily, timezone: data.timezone, name }
}

async function cityFromCoords(lat, lon) {
    try {
        const { data } = await axios.get(REVERSE_URL, {
            params: { latitude: lat, longitude: lon, localityLanguage: 'en' },
        })
        return data.city || data.locality || data.principalSubdivision || "Noma'lum"
    } catch {
        return "Noma'lum"
    }
}

export default createStore({
    state: {
        city: '',
        weather: null,
        loading: true,
        error: '',
    },
    mutations: {
        setCity(state, payload) {
            state.city = payload
        },
        setWeather(state, info) {
            state.weather = info
            state.city = ''
            state.error = ''
            state.loading = false
        },
        setLoading(state, value) {
            state.loading = value
        },
        setError(state, message) {
            state.error = message
            state.loading = false
        },
    },
    actions: {
        async getWeather({ commit }, { city, lat, lon }) {
            commit('setLoading', true)
            try {
                let name
                if (city && city.trim()) {
                    const { data } = await axios.get(GEO_URL, {
                        params: { name: city.trim(), count: 1, language: 'en' },
                    })
                    if (!data.results || !data.results.length) {
                        commit('setError', `"${city}" shahri topilmadi`)
                        return
                    }
                    const place = data.results[0]
                    lat = place.latitude
                    lon = place.longitude
                    name = place.name
                } else {
                    name = await cityFromCoords(lat, lon)
                }
                const info = await loadForecast(lat, lon, name)
                commit('setWeather', info)
            } catch (error) {
                console.error("Ma'lumotni olishda xatolik: " + error)
                commit('setError', "Ma'lumotni olib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.")
            }
        },
    },
})
