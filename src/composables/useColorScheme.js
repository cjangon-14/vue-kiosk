import { ref, computed } from 'vue'
import { useAuth } from './useAuth'

const colorSchemes = {
  emerald: {
    name: 'Emerald',
    primary: '#059669',
    secondary: '#10b981',
    light: '#a7f3d0',
    dark: '#047857',
    hex: '#10b981',
  },
  blue: {
    name: 'Blue',
    primary: '#2563eb',
    secondary: '#3b82f6',
    light: '#bfdbfe',
    dark: '#1d4ed8',
    hex: '#3b82f6',
  },
  purple: {
    name: 'Purple',
    primary: '#9333ea',
    secondary: '#a855f7',
    light: '#e9d5ff',
    dark: '#7e22ce',
    hex: '#a855f7',
  },
  rose: {
    name: 'Rose',
    primary: '#e11d48',
    secondary: '#f43f5e',
    light: '#fbcfe8',
    dark: '#be123c',
    hex: '#f43f5e',
  },
  orange: {
    name: 'Orange',
    primary: '#ea580c',
    secondary: '#f97316',
    light: '#fed7aa',
    dark: '#c2410c',
    hex: '#f97316',
  },
  indigo: {
    name: 'Indigo',
    primary: '#4f46e5',
    secondary: '#6366f1',
    light: '#e0e7ff',
    dark: '#3730a3',
    hex: '#6366f1',
  },
}

const currentScheme = ref('emerald')
const customColor = ref(null)
const { getUser } = useAuth()

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Helper function to convert RGB to hex
const rgbToHex = (r, g, b) => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

// Helper function to lighten/darken a color
const adjustBrightness = (hex, percent) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const adjust = (channel) => {
    if (percent > 0) {
      // Lighten
      return Math.min(255, Math.round(channel + (255 - channel) * (percent / 100)))
    } else {
      // Darken
      return Math.max(0, Math.round(channel * (1 + percent / 100)))
    }
  }

  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b))
}

// Helper function to calculate brightness (0-255)
const calculateBrightness = (hex) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return 128
  // Use relative luminance formula
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

// Helper function to determine if color is bright (returns true if bright, false if dark)
// Using 180 as threshold for better contrast (WCAG AA standards)
const isBrightColor = (hex) => {
  return calculateBrightness(hex) > 180
}

// Generate color scheme from custom hex color
const generateCustomScheme = (hexColor) => {
  return {
    name: 'Custom',
    primary: hexColor,
    secondary: adjustBrightness(hexColor, 15),
    light: adjustBrightness(hexColor, 60),
    dark: adjustBrightness(hexColor, -20),
    hex: hexColor,
  }
}

export const useColorScheme = () => {
  const user = getUser()
  const storageKey = `theme_${user?.storeId || 'default'}`
  const customColorKey = `custom_color_${user?.storeId || 'default'}`

  // Load scheme from localStorage
  if (typeof window !== 'undefined') {
    const savedCustom = localStorage.getItem(customColorKey)
    if (savedCustom) {
      customColor.value = savedCustom
      currentScheme.value = 'custom'
    } else {
      const saved = localStorage.getItem(storageKey)
      if (saved && colorSchemes[saved]) {
        currentScheme.value = saved
      }
    }
  }

  const scheme = computed(() => {
    if (currentScheme.value === 'custom' && customColor.value) {
      return generateCustomScheme(customColor.value)
    }
    return colorSchemes[currentScheme.value] || colorSchemes.emerald
  })

  const setScheme = (schemeName) => {
    if (colorSchemes[schemeName]) {
      currentScheme.value = schemeName
      customColor.value = null
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, schemeName)
        localStorage.removeItem(customColorKey)
      }
      applyColorScheme(colorSchemes[schemeName])
    }
  }

  const setCustomColor = (hexColor) => {
    customColor.value = hexColor
    currentScheme.value = 'custom'
    if (typeof window !== 'undefined') {
      localStorage.setItem(customColorKey, hexColor)
      localStorage.removeItem(storageKey)
    }
    const newScheme = generateCustomScheme(hexColor)
    applyColorScheme(newScheme)
  }

  const applyColorScheme = (colors) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--color-primary', colors.primary)
      root.style.setProperty('--color-secondary', colors.secondary)
      root.style.setProperty('--color-light', colors.light)
      root.style.setProperty('--color-dark', colors.dark)
    }
  }

  // Apply on init
  applyColorScheme(scheme.value)

  // Get appropriate text color based on background brightness
  const getTextColor = computed(() => {
    if (!scheme.value?.primary) return '#ffffff'
    const brightness = calculateBrightness(scheme.value.primary)
    const isBright = brightness > 180
    return isBright ? '#000000' : '#ffffff'
  })

  // Get appropriate text color for light variant
  const getLightTextColor = computed(() => {
    if (!scheme.value?.light) return '#000000'
    const brightness = calculateBrightness(scheme.value.light)
    const isBright = brightness > 180
    return isBright ? '#000000' : '#ffffff'
  })

  return {
    scheme,
    currentScheme,
    customColor,
    setScheme,
    setCustomColor,
    colorSchemes,
    availableSchemes: Object.keys(colorSchemes),
    getTextColor,
    getLightTextColor,
    isBrightColor,
  }
}
