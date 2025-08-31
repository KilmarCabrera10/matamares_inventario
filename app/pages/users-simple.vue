<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Gestión de Usuarios - Versión Simple</h1>
    
    <!-- Botón para cargar usuarios -->
    <div class="mb-4">
      <UButton :loading="loading" @click="loadUsers">
        Cargar Usuarios
      </UButton>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-32">
      <p>Cargando usuarios...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Users list -->
    <div v-else-if="users.length > 0" class="space-y-4">
      <div v-for="user in users" :key="user.id" class="p-4 border rounded-lg">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg">{{ user.name }}</h3>
            <p class="text-gray-600">{{ user.email }}</p>
            <p class="text-sm text-gray-500">ID: {{ user.id }}</p>
            <p class="text-xs text-gray-400">
              Creado: {{ formatDate(user.created_at) }}
            </p>
          </div>
          <div class="flex gap-2">
            <UButton size="sm" variant="outline" @click="editUser(user)">
              Editar
            </UButton>
            <UButton size="sm" variant="outline" color="red" @click="confirmDelete(user)">
              Eliminar
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- No users message -->
    <div v-else class="text-gray-500 text-center py-8">
      No hay usuarios disponibles. Haz clic en "Cargar Usuarios" para obtenerlos.
    </div>

    <!-- Create User Form -->
    <div class="mt-8 p-4 border-t">
      <h2 class="text-lg font-semibold mb-4">Crear Nuevo Usuario</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <UInput v-model="newUser.name" placeholder="Nombre completo" />
        <UInput v-model="newUser.email" type="email" placeholder="Email" />
        <UInput v-model="newUser.password" type="password" placeholder="Contraseña" />
        <UInput 
          v-model="newUser.password_confirmation" 
          type="password" 
          placeholder="Confirmar contraseña" 
        />
      </div>
      
      <UButton 
        :loading="creating" 
        :disabled="!canCreate"
        @click="createUser"
      >
        Crear Usuario
      </UButton>
    </div>

    <!-- Edit User Modal (Simple) -->
    <div v-if="editingUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Editar Usuario</h3>
        
        <div class="space-y-4">
          <UInput v-model="editForm.name" placeholder="Nombre completo" />
          <UInput v-model="editForm.email" type="email" placeholder="Email" />
          <UInput 
            v-model="editForm.password" 
            type="password" 
            placeholder="Nueva contraseña (opcional)" 
          />
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <UButton variant="outline" @click="cancelEdit">
            Cancelar
          </UButton>
          <UButton :loading="updating" @click="updateUser">
            Actualizar
          </UButton>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="userToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-red-600 mb-4">Confirmar Eliminación</h3>
        
        <p class="mb-4">
          ¿Estás seguro de que quieres eliminar al usuario 
          <strong>{{ userToDelete.name }}</strong>?
        </p>
        
        <div class="flex justify-end gap-3">
          <UButton variant="outline" @click="userToDelete = null">
            Cancelar
          </UButton>
          <UButton color="red" :loading="deleting" @click="deleteUser">
            Eliminar
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Composables
const { getUsers, createUser: apiCreateUser, updateUser: apiUpdateUser, deleteUser: apiDeleteUser } = useUsersApi()

// Estado reactivo
const users = ref([])
const loading = ref(false)
const error = ref(null)
const creating = ref(false)
const updating = ref(false)
const deleting = ref(false)

// Estados de modales
const editingUser = ref(null)
const userToDelete = ref(null)

// Formularios
const newUser = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const editForm = ref({
  name: '',
  email: '',
  password: ''
})

// Computed
const canCreate = computed(() => {
  return newUser.value.name && 
         newUser.value.email && 
         newUser.value.password && 
         newUser.value.password === newUser.value.password_confirmation
})

// Función para cargar usuarios
const loadUsers = async () => {
  try {
    loading.value = true
    error.value = null
    users.value = await getUsers()
    console.log('Usuarios cargados:', users.value)
  } catch (err) {
    console.error('Error al cargar usuarios:', err)
    error.value = err.data?.message || err.message || 'Error al cargar usuarios'
  } finally {
    loading.value = false
  }
}

// Función para crear usuario
const createUser = async () => {
  if (!canCreate.value) return
  
  try {
    creating.value = true
    
    await apiCreateUser(newUser.value)
    
    // Limpiar formulario
    newUser.value = {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
    
    // Recargar usuarios
    await loadUsers()
    
    console.log('Usuario creado exitosamente')
    
  } catch (err) {
    console.error('Error al crear usuario:', err)
    error.value = err.data?.message || err.message || 'Error al crear usuario'
  } finally {
    creating.value = false
  }
}

// Función para iniciar edición
const editUser = (user) => {
  editingUser.value = user
  editForm.value = {
    name: user.name,
    email: user.email,
    password: ''
  }
}

// Función para cancelar edición
const cancelEdit = () => {
  editingUser.value = null
  editForm.value = {
    name: '',
    email: '',
    password: ''
  }
}

// Función para actualizar usuario
const updateUser = async () => {
  if (!editingUser.value) return
  
  try {
    updating.value = true
    
    const updateData = {
      name: editForm.value.name,
      email: editForm.value.email
    }
    
    if (editForm.value.password) {
      updateData.password = editForm.value.password
      updateData.password_confirmation = editForm.value.password
    }
    
    await apiUpdateUser(editingUser.value.id, updateData)
    
    cancelEdit()
    await loadUsers()
    
    console.log('Usuario actualizado exitosamente')
    
  } catch (err) {
    console.error('Error al actualizar usuario:', err)
    error.value = err.data?.message || err.message || 'Error al actualizar usuario'
  } finally {
    updating.value = false
  }
}

// Función para confirmar eliminación
const confirmDelete = (user) => {
  userToDelete.value = user
}

// Función para eliminar usuario
const deleteUser = async () => {
  if (!userToDelete.value) return
  
  try {
    deleting.value = true
    
    await apiDeleteUser(userToDelete.value.id)
    
    userToDelete.value = null
    await loadUsers()
    
    console.log('Usuario eliminado exitosamente')
    
  } catch (err) {
    console.error('Error al eliminar usuario:', err)
    error.value = err.data?.message || err.message || 'Error al eliminar usuario'
  } finally {
    deleting.value = false
  }
}

// Función para formatear fecha
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Cargar usuarios al montar
onMounted(() => {
  loadUsers()
})
</script>
