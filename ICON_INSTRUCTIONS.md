# Crear Íconos de la App

Para generar el ícono que aparece cuando agregas la app a la pantalla de inicio en iOS:

## Opción 1: Usar Figma/Canva/Photoshop
1. Crear un diseño de 180x180 px con fondo rosa (#E91E63)
2. Agregar una huella de mascota o el diseño que quieras
3. Exportar como PNG: `apple-touch-icon.png`
4. Guardar en `public/apple-touch-icon.png`

## Opción 2: Usar herramienta online
1. Ir a https://cloudconvert.com/svg-to-png
2. Subir `public/icon.svg`
3. Configurar tamaño: 180x180 px
4. Descargar como `apple-touch-icon.png`
5. Guardar en `public/apple-touch-icon.png`

## Opción 3: Usar ImageMagick (línea de comandos)
```bash
# Instalar ImageMagick
brew install imagemagick

# Convertir SVG a PNG
cd public
convert -background none -resize 180x180 icon.svg apple-touch-icon.png
convert -background none -resize 32x32 icon.svg favicon-32x32.png
convert -background none -resize 16x16 icon.svg favicon-16x16.png
```

## Resultado
Cuando agregues la app a tu pantalla de inicio en iOS, verás el ícono personalizado en lugar de la "P" por defecto.
