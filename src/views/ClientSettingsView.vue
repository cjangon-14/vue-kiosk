<script setup>
import { ref, onMounted } from 'vue'
import { Settings, Save, Store, Clock, Bell, Palette, Monitor, AlertCircle } from '@lucide/vue'
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

onMounted(async () => {
  await fetchStoreData()
  storeSettings.value.storeName = storeName.value
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

const handleCustomColorChange = (hexColor) => {
  setCustomColor(hexColor)
  logColorSchemeChanged(`Custom (${hexColor})`)
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
  <div class="flex mt-8 ml-64 bg-linear-to-br from-gray-50 to-gray-100">
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
            <div class="p-6 space-y-4">
              <p class="text-sm text-gray-600">Choose a color theme for your admin interface</p>

              <!-- Preset Color Schemes -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="scheme in availableSchemes"
                  :key="scheme"
                  @click="handleColorSchemeChange(scheme)"
                  :class="
                    currentScheme === scheme && !customColor
                      ? 'ring-2 ring-offset-2 ring-gray-400'
                      : 'ring-1 ring-gray-200 hover:ring-gray-300'
                  "
                  class="p-4 rounded-lg cursor-pointer transition-all"
                  :style="{ backgroundColor: colorSchemes[scheme].light }"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-6 h-6 rounded-full"
                      :style="{ backgroundColor: colorSchemes[scheme].primary }"
                    ></div>
                    <span class="font-medium text-sm text-gray-900">{{
                      colorSchemes[scheme].name
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Custom Color Picker -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-900 mb-3">Or create a custom color</p>
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-3">
                    <label class="text-sm font-medium text-gray-700">Pick a color:</label>
                    <input
                      :value="customColor || '#059669'"
                      @input="
                        (e) => {
                          handleCustomColorChange(e.target.value)
                        }
                      "
                      type="color"
                      class="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div
                    v-if="customColor"
                    class="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg font-mono"
                  >
                    {{ customColor }}
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-3">
                  The color picker automatically generates complementary shades for your interface
                </p>
              </div>

              <p class="text-xs text-gray-500 mt-4">
                Your color preference is automatically saved and will apply to all interface
                elements
              </p>
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
              class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Save class="w-4 h-4" />
              Save Settings
            </button>
            <button
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
