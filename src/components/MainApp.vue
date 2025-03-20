<!-- filename: MainApp.vue -->
<template>
  <div :class="{'dark': isDark}">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-40 md:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 flex z-40">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button type="button" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
   
              <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div class="items-center px-4">
                  <img class="h-16 w-auto mx-auto" src="../assets/einov.jpg" alt="Workflow" />
                </div>
                <nav class="mt-5 px-2 space-y-1">

                  <span v-for="item in navigation" :key="item.name">

                    <router-link :to="item.router" class="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                      <component :is="item.icon" :class="[item.current ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400', 'mr-4 flex-shrink-0 h-6 w-6']" aria-hidden="true" />
                      {{ item.name }}
                    </router-link>

                  </span>

                
                </nav>
                
              </div>
              
              <div class="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <!-- REPLACE WITH DROPDOWN MENU -->
                <Menu as="div" class="relative w-full">
                  <!-- Same MenuButton content as above -->
                  <MenuButton class="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div class="flex items-center gap-3">
                      <!-- Avatar -->
                      <div class="relative">
                        <UserIcon 
                          class="h-10 w-10 rounded-full p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600"
                          aria-hidden="true"
                        />
                        <!-- Indicador Online -->
                        <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      </div>
                      
                      <!-- Nome e Email -->
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ userName }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
                      </div>
                      
                      <!-- Ícone de Seta -->
                      <ChevronDownIcon class="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </MenuButton>

                  <!-- Submenu Dropdown - Same as desktop but opens upward -->
                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <MenuItems class="absolute left-0 bottom-full mb-2 w-full origin-bottom-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div class="p-1">
                        <!-- Same menu items as desktop -->
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md flex items-center gap-2'
                            ]"
                          >
                            <CogIcon class="h-5 w-5" />
                            Configurações
                          </button>
                        </MenuItem>

                        <MenuItem v-slot="{ active }">
                          <button
                            @click="handleLogout"
                            :class="[
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 rounded-md flex items-center gap-2'
                            ]"
                          >
                            <ArrowLeftOnRectangleIcon class="h-5 w-5" />
                            Sair
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </DialogPanel>
          </TransitionChild>
          <div class="flex-shrink-0 w-14">
            <!-- Force sidebar to shrink to fit close icon -->
          </div>
          
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <!-- Sidebar component -->
      <div class="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-background text-foreground">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="items-center px-4">
            <router-link :to="{name: 'home'}">
              <img class="h-16 w-auto mx-auto" src="../assets/einov.jpg" alt="E-Inov desafio Vue.js" />
            </router-link>
           
            
          </div>
          <nav class="mt-5 flex-1 px-2 bg-white space-y-1">

              <span v-for="item in navigation" :key="item.name">

                  <router-link :to="item.router" class="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 group flex items-center px-2 py-2 text-base font-medium rounded-md">
                    <component :is="item.icon" :class="[item.current ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400', 'mr-4 flex-shrink-0 h-6 w-6']" aria-hidden="true" />
                    {{ item.name }}
                  </router-link>

                </span>

         
          </nav>
          
        </div>
        <div class="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
  <!-- REPLACE WITH DROPDOWN MENU -->
  <Menu as="div" class="relative w-full">
    <!-- Botão do Menu -->
    <MenuButton class="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div class="flex items-center gap-3">
        <!-- Avatar -->
        <div class="relative">
          <UserIcon 
            class="h-10 w-10 rounded-full p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600"
            aria-hidden="true"
          />
          <!-- Indicador Online -->
          <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>
        
        <!-- Nome e Email -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ userName }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
        </div>
        
        <!-- Ícone de Seta -->
        <ChevronDownIcon class="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
    </MenuButton>

    <!-- Submenu Dropdown -->
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems class="absolute left-0 bottom-full mb-2 w-full origin-bottom-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div class="p-1">
          <!-- Item de Menu - Configurações -->
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                'w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md flex items-center gap-2'
              ]"
            >
              <CogIcon class="h-5 w-5" />
              Configurações
            </button>
          </MenuItem>

          <!-- Item de Menu - Sair -->
          <MenuItem v-slot="{ active }">
            <button
              @click="handleLogout"
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                'w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 rounded-md flex items-center gap-2'
              ]"
            >
              <ArrowLeftOnRectangleIcon class="h-5 w-5" />
              Sair
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</div>
      </div>
    </div>
    <div class="md:pl-64 flex flex-col flex-1">
      <div class="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
        <button
      @click="toggleTheme"
      class="fixed top-3 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {{ isDark ? '🌙' : '☀️' }}
    </button>
        <div class="flex items-center gap-2">
          <!-- Remove this duplicate button -->
          <!-- <button @click="sidebarOpen = true">...</button> -->
        </div>

        <!-- Update this button to use the toggle function -->
        <button 
          type="button" 
          class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" 
          @click="toggleSidebar"
        >
          <span class="sr-only">{{ sidebarOpen ? 'Close' : 'Open' }} sidebar</span>
          <MenuIcon v-if="!sidebarOpen" class="h-6 w-6" aria-hidden="true" />
          <XIcon v-else class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <main class="flex-1">
        <div class="py-6">

          <slot></slot>

        </div>
      </main>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { 
  Dialog, 
  DialogPanel, 
  TransitionChild, 
  TransitionRoot,
  Menu, 
  MenuButton, 
  MenuItems, 
  MenuItem 
} from '@headlessui/vue'
import {
  HomeIcon,
  MenuIcon,
  UsersIcon,
  XIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  CogIcon // or use Cog6ToothIcon if using heroicons v2
} from '@heroicons/vue/outline'
import useTheme from '@/composables/useTheme'
import useAuth from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { isDark, toggleTheme } = useTheme()
const { user, logout } = useAuth()
const router = useRouter()

// Get user name and email with defaults
const userName = computed(() => user.value?.name || 'Guest User')
const userEmail = computed(() => user.value?.email || 'Not logged in')
console.log(user.value) // Use .value to log the actual user object
const navigation = [
  { name: 'Home', router: {name: 'home'}, icon: HomeIcon, current: true },
  { name: 'Usuários', router: {name: 'users'}, icon: UsersIcon, current: false },
]

// Change to false so sidebar is closed by default on mobile
const sidebarOpen = ref(false)

// Add a toggle function for better control
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Handle logout function
const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

