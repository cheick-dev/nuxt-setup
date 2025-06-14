<!-- BarChart Component -->
<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-1 relative">
      <svg class="w-full h-full" viewBox="0 0 800 300">
        <!-- Grid lines -->
        <defs>
          <pattern
            id="grid"
            width="40"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 30"
              fill="none"
              stroke="#f3f4f6"
              stroke-width="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Bars -->
        <g v-for="(item, index) in data" :key="index">
          <rect
            :x="50 + index * (700 / data.length)"
            :y="250 - (item.value / maxValue) * 200"
            :width="(700 / data.length) * 0.6"
            :height="(item.value / maxValue) * 200"
            :fill="color"
            class="opacity-80 hover:opacity-100 transition-opacity"
            rx="4"
          />
          <!-- Value labels -->
          <text
            :x="50 + index * (700 / data.length) + (700 / data.length) * 0.3"
            :y="245 - (item.value / maxValue) * 200"
            text-anchor="middle"
            class="text-xs fill-gray-600"
          >
            {{ formatValue(item.value) }}
          </text>
        </g>

        <!-- X-axis labels -->
        <g v-for="(item, index) in data" :key="`label-${index}`">
          <text
            :x="50 + index * (700 / data.length) + (700 / data.length) * 0.3"
            y="275"
            text-anchor="middle"
            class="text-sm fill-gray-700 font-medium"
          >
            {{ item.label }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
export default {
  name: "BarChart",
  props: {
    data: Array,
    color: String,
  },
  computed: {
    maxValue() {
      return Math.max(...this.data.map((item) => item.value));
    },
  },
  methods: {
    formatValue(value) {
      if (value >= 1000) {
        return (value / 1000).toFixed(0) + "k";
      }
      return value.toString();
    },
  },
};
</script>

<style scoped>
/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
