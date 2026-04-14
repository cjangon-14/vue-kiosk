<script setup>
import { ref, onMounted, computed } from 'vue'
import { Save, Store, Clock, Bell, Palette, Monitor, AlertCircle, Check } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import { useColorScheme } from '../composables/useColorScheme'
import { useStoreData } from '../composables/useStoreData'
import { useActivityLog } from '../composables/useActivityLog'

const { getUser } = useAuth()
const currentUser = getUser()
const { currentScheme, customColor, setScheme, setCustomColor, colorSchemes, availableSchemes } =
  useColorScheme()
const { storeName, updateStoreName, fetchStoreData } = useStoreData()
const { logColorSchemeChanged } = useActivityLog()

const storeSettings = ref({
  storeName: '',
  timeZone: 'UTC',
  businessHours: {
    start: '09:00',
    end: '21:00',
  },
  notificationsEnabled: true,
  emailNotifications: true,
  smsNotifications: false,
  maintenanceMode: false,
})

const tempCustomColor = ref(null)
let colorInputTimeout = null
const showSaveSuccess = ref(false)

// Track selected color for UI purposes
const selectedColorType = computed(() => {
  return customColor.value ? 'custom' : currentScheme.value
})

onMounted(async () => {
  await fetchStoreData()
  storeSettings.value.storeName = storeName.value
  tempCustomColor.value = customColor.value
})

const saveSettings = async () => {
  try {
    if (storeSettings.value.storeName !== storeName.value) {
      await updateStoreName(storeSettings.value.storeName)
    }
    alert('Settings saved successfully!')
  } catch (err) {
    alert(`Error saving settings: ${err.message}`)
  }
}

const handleColorSchemeChange = (schemeName) => {
  setScheme(schemeName)
  logColorSchemeChanged(colorSchemes[schemeName]?.name || schemeName)
}

const isValidHexColor = (hex) => {
  // Check if it's a valid hex color (with or without #)
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

const normalizeHexColor = (hex) => {
  // Ensure hex starts with #
  if (!hex.startsWith('#')) {
    return '#' + hex
  }
  return hex
}

const handleCustomColorChange = (hexColor) => {
  // Update the temporary color for real-time UI feedback
  tempCustomColor.value = hexColor

  // Clear existing timeout
  if (colorInputTimeout) {
    clearTimeout(colorInputTimeout)
  }

  // Apply with 3000ms debounce for instant feedback while typing
  colorInputTimeout = setTimeout(() => {
    if (isValidHexColor(hexColor)) {
      const normalizedColor = normalizeHexColor(hexColor)
      setCustomColor(normalizedColor)
      logColorSchemeChanged(`Custom (${normalizedColor})`)
    }
  }, 2000)
}

const sections = [
  {
    title: 'General Settings',
    icon: Store,
    items: ['storeName', 'timeZone'],
  },
  {
    title: 'Business Hours',
    icon: Clock,
    items: ['businessHours'],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: ['notificationsEnabled', 'emailNotifications', 'smsNotifications'],
  },
  {
    title: 'System',
    icon: Monitor,
    items: ['maintenanceMode'],
  },
]
</script>

<template>
  <div class="flex mt-12 ml-64 bg-linear-to-br from-gray-50 to-gray-100">
    <div class="p-8 flex flex-col mx-auto w-[85%]">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
            <p class="text-gray-600 mt-1">Manage your store configuration and preferences</p>
          </div>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-semibold text-gray-900">Settings</span>
          <span class="text-gray-400">→</span>
          <span class="text-gray-600">Configuration</span>
        </nav>

        <!-- Settings Sections -->
        <div class="space-y-6">
          <!-- General Settings -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
              <Store class="w-5 h-5 text-emerald-600" />
              <h2 class="text-lg font-semibold text-gray-900">General Settings</h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <input
                  v-model="storeSettings.storeName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <select
                  v-model="storeSettings.timeZone"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="CST">Central Time</option>
                  <option value="MST">Mountain Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Business Hours -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
              <Clock class="w-5 h-5 text-blue-600" />
              <h2 class="text-lg font-semibold text-gray-900">Business Hours</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                  <input
                    v-model="storeSettings.businessHours.start"
                    type="time"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                  <input
                    v-model="storeSettings.businessHours.end"
                    type="time"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
              <Bell class="w-5 h-5 text-purple-600" />
              <h2 class="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">Enable Notifications</p>
                  <p class="text-sm text-gray-600">Receive alerts about your store</p>
                </div>
                <input
                  v-model="storeSettings.notificationsEnabled"
                  type="checkbox"
                  class="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div class="border-t border-gray-200 pt-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">Email Notifications</p>
                  <p class="text-sm text-gray-600">Get alerts via email</p>
                </div>
                <input
                  v-model="storeSettings.emailNotifications"
                  type="checkbox"
                  class="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div class="border-t border-gray-200 pt-4 flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">SMS Notifications</p>
                  <p class="text-sm text-gray-600">Get alerts via SMS</p>
                </div>
                <input
                  v-model="storeSettings.smsNotifications"
                  type="checkbox"
                  class="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <!-- Color Scheme -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
              <Palette class="w-5 h-5 text-cyan-600" />
              <h2 class="text-lg font-semibold text-gray-900">Color Scheme</h2>
            </div>
            <div class="p-6 space-y-6">
              <div>
                <p class="text-sm font-medium text-gray-900 mb-4">Choose a preset theme</p>
                <!-- Preset Color Schemes Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    v-for="scheme in availableSchemes"
                    :key="scheme"
                    @click="handleColorSchemeChange(scheme)"
                    :aria-label="`Select ${colorSchemes[scheme].name} color scheme`"
                    :aria-pressed="selectedColorType === scheme && !customColor"
                    type="button"
                    class="relative group p-4 rounded-lg border-2 transition-all cursor-pointer duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    :class="
                      selectedColorType === scheme && !customColor
                        ? 'border-gray-400 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
                    "
                    :style="{ backgroundColor: colorSchemes[scheme].light }"
                  >
                    <!-- Check icon for selected state -->
                    <div
                      v-if="selectedColorType === scheme && !customColor"
                      class="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm"
                    >
                      <Check class="w-4 h-4 text-emerald-600" />
                    </div>

                    <!-- Color swatch and label -->
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110"
                        :style="{ backgroundColor: colorSchemes[scheme].primary }"
                      ></div>
                      <span class="font-semibold text-sm text-gray-900">{{
                        colorSchemes[scheme].name
                      }}</span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Custom Color Section -->
              <div class="pt-4 border-t border-gray-200">
                <p class="flex justify-center text-sm font-medium text-gray-900 mb-4">
                  Create a custom color
                </p>

                <!-- Combined Custom Color Input Controls -->
                <div class="flex flex-col justify-center lg:flex-row gap-4">
                  <!-- Color Picker -->
                  <div class="flex flex-col">
                    <label class="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide"
                      >Color Picker</label
                    >
                    <input
                      :value="tempCustomColor || customColor || '#059669'"
                      @input="(e) => handleCustomColorChange(e.target.value)"
                      type="color"
                      aria-label="Select custom color"
                      class="w-20 h-12 rounded-lg border-2 border-gray-300 cursor-pointer transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    />
                  </div>

                  <!-- Hex Color Input -->
                  <div>
                    <label
                      class="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide block"
                      >Hex Code</label
                    >
                    <input
                      :value="tempCustomColor || customColor || ''"
                      @input="(e) => handleCustomColorChange(e.target.value)"
                      type="text"
                      placeholder="#FF5733"
                      aria-label="Enter hex color code"
                      class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:border-transparent hover:border-gray-400"
                    />
                  </div>

                  <!-- Live Preview -->
                  <div class="flex flex-col">
                    <label class="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide"
                      >Preview</label
                    >
                    <div class="flex items-center gap-2">
                      <div
                        class="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm transition-all"
                        :style="{
                          backgroundColor: isValidHexColor(tempCustomColor || customColor)
                            ? tempCustomColor || customColor
                            : '#e5e7eb',
                        }"
                      ></div>
                      <div class="text-right">
                        <p
                          v-if="isValidHexColor(tempCustomColor || customColor)"
                          class="font-mono text-sm font-medium text-gray-900"
                        >
                          {{ normalizeHexColor(tempCustomColor || customColor) }}
                        </p>
                        <p v-else class="text-sm text-red-500 font-medium">Invalid</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Helper Text Below -->
                <p class="text-xs text-gray-500 mt-2">Format: #RRGGBB (e.g., #FF5733) or RRGGBB</p>

                <!-- Validation Message -->
                <div
                  v-if="
                    (tempCustomColor || customColor) &&
                    !isValidHexColor(tempCustomColor || customColor)
                  "
                  class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
                >
                  <AlertCircle class="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p class="text-sm text-red-700">
                    Invalid hex color format. Use #RRGGBB or RRGGBB format (e.g., #FF5733)
                  </p>
                </div>
              </div>

              <!-- Info Section -->
              <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p class="text-sm text-emerald-900">
                  <span class="font-semibold">✓ Changes apply instantly</span> to your admin
                  interface across all sessions.
                </p>
              </div>
            </div>
          </div>

          <!-- System Settings -->
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
              <Monitor class="w-5 h-5 text-red-600" />
              <h2 class="text-lg font-semibold text-gray-900">System Settings</h2>
            </div>
            <div class="p-6 space-y-4">
              <div
                class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <AlertCircle class="w-5 h-5 text-red-600" />
                  <div>
                    <p class="font-medium text-gray-900">Maintenance Mode</p>
                    <p class="text-sm text-gray-600">Kiosks will be offline for maintenance</p>
                  </div>
                </div>
                <input
                  v-model="storeSettings.maintenanceMode"
                  type="checkbox"
                  class="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex gap-4">
            <button
              @click="saveSettings"
              class="flex items-center gap-2 bg-emerald-600 hover:cursor-pointer hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Save class="w-4 h-4" />
              Save Settings
            </button>
            <button
              class="px-6 py-2 border border-gray-300 text-gray-700 hover:cursor-pointer hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for color scheme selection */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Subtle scale effect on hover for preset buttons */
button:hover {
  --tw-scale: 1.02;
}

/* Smooth animation for color updates */
@keyframes colorUpdate {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Apply animation to preview color swatch */
.animate-color-update {
  animation: colorUpdate 0.3s ease-out;
}
</style>
