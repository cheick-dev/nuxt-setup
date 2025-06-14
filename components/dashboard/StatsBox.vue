<!-- Composant Graphique Simple -->
<template>
  <div class="w-full h-full">
    <svg class="w-full h-full" viewBox="0 0 600 200">
      <!-- Grille de fond -->
      <defs>
        <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 30 0 L 0 0 0 20"
            fill="none"
            stroke="#f3f4f6"
            stroke-width="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      <!-- Graphique en barres -->
      <g v-if="type === 'bar'">
        <rect
          v-for="(item, index) in data"
          :key="index"
          :x="50 + index * (500 / data.length)"
          :y="150 - (item.value / maxValue) * 120"
          :width="(500 / data.length) * 0.7"
          :height="(item.value / maxValue) * 120"
          :fill="color"
          class="opacity-80 hover:opacity-100 transition-opacity"
          rx="3"
        />
      </g>

      <!-- Graphique en ligne -->
      <g v-if="type === 'line'">
        <polyline
          :points="linePoints"
          fill="none"
          :stroke="color"
          stroke-width="3"
          class="drop-shadow-sm"
        />
        <circle
          v-for="(item, index) in data"
          :key="index"
          :cx="50 + index * (500 / (data.length - 1))"
          :cy="150 - (item.value / maxValue) * 120"
          r="4"
          :fill="color"
          class="hover:r-6 transition-all"
        />
      </g>

      <!-- Étiquettes X -->
      <text
        v-for="(item, index) in data"
        :key="`label-${index}`"
        :x="
          50 +
          index * (500 / (type === 'line' ? data.length - 1 : data.length)) +
          (type === 'bar' ? (500 / data.length) * 0.35 : 0)
        "
        y="175"
        text-anchor="middle"
        class="text-sm fill-gray-600 font-medium"
      >
        {{ item.label }}
      </text>

      <!-- Valeurs -->
      <text
        v-for="(item, index) in data"
        :key="`value-${index}`"
        :x="
          50 +
          index * (500 / (type === 'line' ? data.length - 1 : data.length)) +
          (type === 'bar' ? (500 / data.length) * 0.35 : 0)
        "
        :y="145 - (item.value / maxValue) * 120"
        text-anchor="middle"
        class="text-xs fill-gray-700 font-semibold"
      >
        {{ formatValue(item.value) }}
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  name: "SimpleChart",
  props: {
    data: Array,
    color: String,
    type: {
      type: String,
      default: "bar",
    },
  },
  computed: {
    maxValue() {
      return Math.max(...this.data.map((item) => item.value));
    },
    linePoints() {
      return this.data
        .map((item, index) => {
          const x = 50 + index * (500 / (this.data.length - 1));
          const y = 150 - (item.value / this.maxValue) * 120;
          return `${x},${y}`;
        })
        .join(" ");
    },
  },
  methods: {
    formatValue(value) {
      if (value >= 1000) {
        return Math.round(value / 1000) + "k";
      }
      return value.toString();
    },
  },
};
</script>

<style scoped>
/* Animations pour les graphiques */
svg rect,
svg circle,
svg polyline {
  transition: all 0.3s ease;
}

svg rect:hover {
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
