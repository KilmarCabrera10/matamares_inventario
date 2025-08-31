# Guía de Consistencia de Colores - Nuxt UI

## Colores Configurados

En `app/app.config.ts` hemos definido los siguientes colores semánticos:

```typescript
ui: {
  colors: {
    primary: 'blue',      // Color principal de la marca
    secondary: 'slate',   // Color secundario
    neutral: 'slate',     // Color neutral (grises)
    success: 'green',     // Estados de éxito
    info: 'blue',         // Estados informativos
    warning: 'yellow',    // Estados de advertencia  
    error: 'red'          // Estados de error
  }
}
```

## Clases Semánticas a Usar

### Texto
- `text-default` - Texto principal
- `text-highlighted` - Texto destacado (títulos importantes)
- `text-muted` - Texto secundario/atenuado
- `text-dimmed` - Texto muy atenuado
- `text-toned` - Texto con tono medio
- `text-inverted` - Texto invertido (para fondos oscuros)
- `text-primary` - Texto en color primario
- `text-success` - Texto de éxito
- `text-error` - Texto de error

### Fondos
- `bg-default` - Fondo principal
- `bg-muted` - Fondo atenuado
- `bg-elevated` - Fondo elevado (cards, modales)
- `bg-accented` - Fondo acentuado
- `bg-inverted` - Fondo invertido
- `bg-primary` - Fondo primario
- `bg-success` - Fondo de éxito
- `bg-error` - Fondo de error

### Bordes
- `border-default` - Borde principal
- `border-muted` - Borde atenuado
- `border-accented` - Borde acentuado
- `border-primary` - Borde primario

## ❌ EVITAR - Clases Hardcodeadas

No uses estas clases directamente:
```css
/* ❌ NO USAR */
.text-gray-600
.bg-gray-50
.text-blue-600
.bg-indigo-600
.border-gray-200
```

## ✅ USAR - Clases Semánticas

Usa las clases semánticas de Nuxt UI:
```css
/* ✅ USAR */
.text-muted
.bg-muted
.text-primary
.bg-primary
.border-default
```

## Componentes de Nuxt UI

Cuando uses componentes de Nuxt UI, usa las props de color:

```vue
<!-- ✅ Correcto -->
<UButton color="primary" variant="solid">
<UAlert color="success" variant="soft">
<UBadge color="warning" variant="outline">

<!-- ❌ Incorrecto -->
<UButton class="bg-blue-600 text-white">
```

## Beneficios

1. **Consistencia**: Todos los colores siguen el mismo sistema
2. **Modo Oscuro**: Funciona automáticamente con dark mode
3. **Mantenibilidad**: Cambios globales desde un solo lugar
4. **Accesibilidad**: Los colores están optimizados para contraste
5. **Flexibilidad**: Fácil personalización sin romper la consistencia

## Personalización

Para personalizar colores específicos, edita `app/assets/css/main.css`:

```css
:root {
  /* Personalizar color primario */
  --ui-primary: var(--ui-color-primary-600);
}

.dark {
  /* Color primario en modo oscuro */
  --ui-primary: var(--ui-color-primary-400);
}
```

## Testing

Usa el componente `<ColorModeToggle />` que hemos creado para probar que los colores se ven bien tanto en modo claro como oscuro.
