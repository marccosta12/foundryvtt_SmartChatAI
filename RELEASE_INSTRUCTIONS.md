# 📦 Release v0.1.0 - Instrucciones

## ¿Qué es un Release?

Un **release** en GitHub es una versión etiquetada de tu código que puedes descargar como un `.zip`. Es lo que los usuarios descargarán para instalar el módulo en Foundry VTT.

---

## 📋 Pasos para Crear el Release

### Paso 1: Hacer commit de los cambios
```powershell
cd "f:\Documentos\Marc\Estudi\Projectes\Rol\foundryvtt_askGPT"

git add module.json package.json CHANGELOG.md
git commit -m "chore: Update version to 0.1.0 for first release"
```

### Paso 2: Crear un tag (etiqueta) en git
```powershell
git tag -a v0.1.0 -m "Release v0.1.0 - Optional Assistants API support"
```

### Paso 3: Hacer push del tag a GitHub
```powershell
git push origin v0.1.0
```

### Paso 4: Crear el release en GitHub (desde el navegador)

1. Ve a: https://github.com/marccosta12/foundryvtt_askGPT/releases
2. Haz click en **"Create a new release"** o **"Draft a new release"**
3. Selecciona el tag: **v0.1.0**
4. Título: `v0.1.0 - Optional Assistants API Support`
5. Descripción (copiar y pegar):

```markdown
## ✨ Features

- **Optional OpenAI Assistants API** - Use your existing Assistants instead of Chat Completions API
- **Consistent History Management** - Both APIs now track conversation history
- **Automatic Retries** - Assistants API now has same retry logic as Chat API
- **Refactored Architecture** - Cleaner code with centralized API client

## 🔧 What Changed

- New `api-client.js` for shared HTTP utilities and retry logic
- Simplified `gpt-api.js` and refactored `assistant-api.js`
- Both APIs now follow identical patterns

## 📚 Configuration

### Using Chat API (Default)
- Leave "Assistant ID" empty in settings
- Uses: gameSystem, modelVersion, gamePrompt

### Using Assistants API (Optional)
- Create an Assistant at https://platform.openai.com/assistants
- Copy the Assistant ID (asst_...)
- Paste in "Assistant ID" field in module settings

## 📖 Documentation

See README.md for detailed setup instructions.

## 🐛 Known Issues

None reported.

## 🙏 Thanks

- Original authors and contributors
- OpenAI for the APIs
- Foundry VTT community
```

6. Haz click en **"Publish release"**

---

## 📥 Instalar en Foundry VTT

Una vez creado el release, los usuarios pueden instalar el módulo así:

1. En Foundry VTT, ve a **Add-on Modules** → **Install Module**
2. Pega esta URL en "Manifest URL":
   ```
   https://raw.githubusercontent.com/marccosta12/foundryvtt_askGPT/main/module.json
   ```
3. Haz click en **Install**
4. Activa el módulo en tu mundo

---

## ✅ Verificación

Para verificar que todo está correcto:

```powershell
# Ver tags locales
git tag

# Ver tags en remoto
git ls-remote --tags origin
```

---

## 🔄 Futuras Releases

Para siguientes versiones:

```powershell
# 1. Hacer cambios en código

# 2. Actualizar versión en:
#    - package.json (version)
#    - module.json (version)
#    - CHANGELOG.md (agregar nueva sección)

# 3. Commit y tag
git add .
git commit -m "chore: Update to version X.Y.Z"
git tag -a vX.Y.Z -m "Release vX.Y.Z - Description"
git push origin vX.Y.Z

# 4. Crear release en GitHub (mismo proceso anterior)
```

---

## 📝 Versionado

Usamos **Semantic Versioning**:
- **0.1.0** = Primera release "real"
- **0.1.1** = Bug fix minor
- **0.2.0** = Nuevas features
- **1.0.0** = Versión estable/completa

---

## ⚠️ Importante

- El archivo `module.json` tiene las URLs del release
- La URL `download` debe apuntar a la release correcta
- El `manifest` debe apuntar a `main` branch (para updates automáticos)

---

## 🎯 Resumen

Una vez hagas estos pasos, tu módulo estará disponible para instalar en Foundry VTT desde la URL:
```
https://raw.githubusercontent.com/marccosta12/foundryvtt_askGPT/main/module.json
```

¡Y listo! Los usuarios podrán instalarlo desde Add-on Modules. 🎉
