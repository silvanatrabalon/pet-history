# 🔧 Actualizar Scopes en Google Cloud Console

## ⚠️ Por qué necesitas hacer esto

El error que estás viendo (`401 Unauthorized`) ocurre porque la aplicación necesita acceso a la información de tu perfil de Google (email, nombre, foto) para mostrarte como usuario logueado.

Cuando configuraste inicialmente Google Cloud Console, solo agregaste 2 scopes:
- ✅ `spreadsheets`
- ✅ `drive.file`

Pero ahora necesitas agregar 2 más:
- ❌ `userinfo.email` (faltante)
- ❌ `userinfo.profile` (faltante)

---

## 📝 Cómo Agregar los Scopes Faltantes

### Tiempo estimado: 3 minutos

### Paso 1: Ir a Pantalla de Consentimiento

1. Ve a: **https://console.cloud.google.com/apis/credentials/consent**
2. O en el menú: **☰ → APIs y servicios → Pantalla de consentimiento de OAuth**

### Paso 2: Editar Registro de App

Verás algo como:

```
┌─────────────────────────────────────────┐
│  Pet History                            │
│  Estado: En prueba                      │
│                                         │
│  [  EDITAR APLICACIÓN  ] ← CLIC         │
└─────────────────────────────────────────┘
```

Clic en **"EDITAR APLICACIÓN"**

### Paso 3: Ir a la Sección de Alcances

Te llevará al Paso 1 (Información de la app). 

No cambies nada, solo clic en **"GUARDAR Y CONTINUAR"** al final.

Ahora estarás en el Paso 2: **Alcances**

### Paso 4: Agregar/Quitar Alcances

```
┌─────────────────────────────────────────┐
│  Paso 2: Alcances                       │
├─────────────────────────────────────────┤
│                                         │
│  Alcances de acceso limitado            │
│  • .../auth/spreadsheets                │
│  • .../auth/drive.file                  │
│                                         │
│  [  AGREGAR O QUITAR ALCANCES  ] ← CLIC│
└─────────────────────────────────────────┘
```

Clic en **"AGREGAR O QUITAR ALCANCES"**

### Paso 5: Buscar y Marcar userinfo.email

Se abre un modal. Busca en el filtro:

```
┌─────────────────────────────────────────┐
│  Actualizar alcances seleccionados      │
├─────────────────────────────────────────┤
│  🔍 [userinfo.email          ]          │
└─────────────────────────────────────────┘
```

Verás en los resultados:

```
☑ .../auth/spreadsheets           ✅ Ya marcado
☑ .../auth/drive.file              ✅ Ya marcado
☐ .../auth/userinfo.email          ❌ MARCAR ESTE
```

**Marca la casilla** de `userinfo.email`

### Paso 6: Buscar y Marcar userinfo.profile

Borra el filtro y busca:

```
🔍 [userinfo.profile         ]
```

Verás:

```
☐ .../auth/userinfo.profile        ❌ MARCAR ESTE
```

**Marca la casilla** de `userinfo.profile`

### Paso 7: Verificar Scopes Seleccionados

Ahora deberías tener estos 4 marcados:

```
┌─────────────────────────────────────────┐
│  Alcances seleccionados: 4              │
│                                         │
│  ✅ .../auth/spreadsheets               │
│  ✅ .../auth/drive.file                 │
│  ✅ .../auth/userinfo.email    ← NUEVO  │
│  ✅ .../auth/userinfo.profile  ← NUEVO  │
│                                         │
│           [CANCELAR]  [ACTUALIZAR] ←    │
└─────────────────────────────────────────┘
```

Clic en **"ACTUALIZAR"**

### Paso 8: Guardar Cambios

Vuelves a la pantalla de Alcances. Ahora verás los 4 scopes listados.

Clic en **"GUARDAR Y CONTINUAR"** (abajo)

### Paso 9: Pasos 3 y 4

- En Paso 3 (Usuarios de prueba): No cambies nada, solo **"GUARDAR Y CONTINUAR"**
- En Paso 4 (Resumen): Revisa que aparezcan los 4 scopes, clic en **"VOLVER AL PANEL"**

---

## ✅ Verificación

En la pantalla principal de "Pantalla de consentimiento de OAuth" deberías ver:

```
Pet History
Estado: En prueba

Información de la aplicación
├─ Nombre: Pet History
├─ Email de asistencia: silvana.trabalon@gmail.com
└─ ...

Alcances de acceso limitado: 4
├─ .../auth/spreadsheets
├─ .../auth/drive.file
├─ .../auth/userinfo.email     ← ✅ NUEVO
└─ .../auth/userinfo.profile   ← ✅ NUEVO
```

---

## 🚀 Probar el Login Nuevamente

1. **Recarga la aplicación** en el navegador (Cmd + R o F5)
2. Clic en **"Iniciar sesión con Google"**
3. Selecciona tu cuenta: `silvana.trabalon@gmail.com`
4. **IMPORTANTE**: Ahora verás una nueva pantalla de permisos que dice:
   ```
   Pet History quiere acceso a tu cuenta de Google
   
   Esto le permitirá a Pet History:
   ✓ Ver, editar, crear y eliminar todas tus hojas de cálculo
   ✓ Ver y administrar archivos de Google Drive que se abrieron o crearon
   ✓ Ver tu dirección de correo electrónico principal  ← NUEVO
   ✓ Ver tu información personal                       ← NUEVO
   
   [Cancelar]  [Continuar]
   ```

5. Clic en **"Continuar"**

6. Ahora el login debería funcionar correctamente! ✅

---

## 🐛 Si Sigues Viendo el Error

Si después de actualizar los scopes sigues viendo el error:

1. **Revoca el acceso anterior:**
   - Ve a: https://myaccount.google.com/permissions
   - Busca "Pet History"
   - Clic en "Pet History" → "Quitar acceso"

2. **Borra el cache del navegador:**
   - Chrome: Cmd + Shift + Delete (Mac) o Ctrl + Shift + Delete (Windows)
   - Marca "Cookies" y "Caché"
   - Clic en "Borrar datos"

3. **Vuelve a intentar el login** desde cero

---

**Tiempo total**: 3 minutos

Una vez actualizados los scopes, el login funcionará correctamente y verás tu información de usuario en la app! 🎉
