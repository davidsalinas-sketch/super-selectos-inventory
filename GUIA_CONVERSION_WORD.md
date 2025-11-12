# 📄 Guía: Convertir Documentación a Word

## Método 1: Usando Pandoc (Recomendado)

### Instalación de Pandoc

**Windows:**
```powershell
winget install --id JohnMacFarlane.Pandoc
```

O descarga desde: https://pandoc.org/installing.html

### Conversión a Word

```powershell
# Navegar a la carpeta del proyecto
cd c:\Users\david\super2

# Convertir con formato avanzado
pandoc DOCUMENTACION_COMPLETA_SUPER_SELECTOS.md -o DOCUMENTACION_SUPER_SELECTOS.docx --toc --toc-depth=3 --highlight-style=tango

# Conversión simple
pandoc DOCUMENTACION_COMPLETA_SUPER_SELECTOS.md -o DOCUMENTACION_SUPER_SELECTOS.docx
```

### Opciones de conversión:

- `--toc`: Genera tabla de contenidos automática
- `--toc-depth=3`: Profundidad de la tabla de contenidos (hasta H3)
- `--highlight-style=tango`: Estilo de resaltado de código
- `--reference-doc=template.docx`: Usar plantilla personalizada de Word

### Con plantilla personalizada:

```powershell
# Crear plantilla base
pandoc -o template.docx --print-default-data-file reference.docx > template.docx

# Editar template.docx en Word con estilos corporativos

# Convertir usando la plantilla
pandoc DOCUMENTACION_COMPLETA_SUPER_SELECTOS.md -o DOCUMENTACION_SUPER_SELECTOS.docx --reference-doc=template.docx --toc
```

---

## Método 2: Usando Microsoft Word (Manual)

1. **Abrir Word**
2. **Archivo → Abrir**
3. **Seleccionar:** `DOCUMENTACION_COMPLETA_SUPER_SELECTOS.md`
4. **Cambiar tipo de archivo a:** "Todos los archivos (*.*)"
5. **Abrir y aceptar importación**
6. **Aplicar estilos:**
   - Títulos H1 → Título 1
   - Títulos H2 → Título 2
   - Código → Estilo de código
7. **Guardar como .docx**

---

## Método 3: Usando Herramientas Online

### Opción A: Markdown to Word
1. Visitar: https://www.markdowntoword.com/
2. Arrastrar archivo `DOCUMENTACION_COMPLETA_SUPER_SELECTOS.md`
3. Descargar DOCX generado

### Opción B: CloudConvert
1. Visitar: https://cloudconvert.com/md-to-docx
2. Subir archivo MD
3. Convertir y descargar

---

## Método 4: Usando VS Code Extension

### Instalar extensión:

1. Abrir VS Code
2. Extensions (Ctrl+Shift+X)
3. Buscar: "Markdown to Word"
4. Instalar: "Markdown Converter"

### Convertir:

1. Abrir `DOCUMENTACION_COMPLETA_SUPER_SELECTOS.md`
2. Ctrl+Shift+P
3. Escribir: "Markdown: Export to Word"
4. Seleccionar ubicación y guardar

---

## Personalización del Documento Word

### Después de la conversión, personaliza:

1. **Portada:**
   - Agregar logo de Super Selectos
   - Título del proyecto
   - Versión y fecha
   - Autor

2. **Tabla de Contenidos:**
   - Insertar → Tabla de contenido
   - Actualizar automáticamente

3. **Encabezados y Pies de Página:**
   - Nombre del proyecto
   - Número de página
   - Fecha de generación

4. **Estilos:**
   - Aplicar colores corporativos
   - Fuentes oficiales de la empresa
   - Márgenes estándar

5. **Imágenes y Diagramas:**
   - Reemplazar bloques de código ASCII con imágenes
   - Agregar capturas de pantalla
   - Incluir diagramas de Visio/Draw.io

---

## Script Automático de Conversión

### crear-word.ps1

```powershell
# Script para convertir MD a DOCX con Pandoc

param(
    [string]$InputFile = "DOCUMENTACION_COMPLETA_SUPER_SELECTOS.md",
    [string]$OutputFile = "DOCUMENTACION_SUPER_SELECTOS.docx",
    [switch]$WithTemplate
)

Write-Host "🔄 Convirtiendo documentación a Word..." -ForegroundColor Cyan

if ($WithTemplate -and (Test-Path "template.docx")) {
    # Con plantilla personalizada
    pandoc $InputFile -o $OutputFile `
        --reference-doc=template.docx `
        --toc `
        --toc-depth=3 `
        --highlight-style=tango `
        --metadata title="Sistema de Inventario Super Selectos" `
        --metadata author="David Salinas" `
        --metadata date=(Get-Date -Format "dd/MM/yyyy")
} else {
    # Sin plantilla
    pandoc $InputFile -o $OutputFile `
        --toc `
        --toc-depth=3 `
        --highlight-style=tango
}

if ($?) {
    Write-Host "✅ Documento Word generado: $OutputFile" -ForegroundColor Green
    Write-Host "📂 Ubicación: $(Get-Location)\$OutputFile" -ForegroundColor Yellow
    
    # Abrir automáticamente
    Start-Process $OutputFile
} else {
    Write-Host "❌ Error al generar documento" -ForegroundColor Red
}
```

### Uso:

```powershell
# Conversión básica
.\crear-word.ps1

# Con plantilla personalizada
.\crear-word.ps1 -WithTemplate

# Especificar archivos
.\crear-word.ps1 -InputFile "doc.md" -OutputFile "salida.docx"
```

---

## Mejores Prácticas

### ✅ Recomendaciones:

1. **Usa Pandoc** para mejor control y calidad
2. **Crea una plantilla** con estilos corporativos
3. **Revisa manualmente** después de la conversión
4. **Exporta a PDF** también para distribución
5. **Versionado:** Incluye número de versión en el nombre

### 📝 Checklist Post-Conversión:

- [ ] Portada con logo corporativo
- [ ] Tabla de contenidos actualizada
- [ ] Estilos de títulos aplicados correctamente
- [ ] Bloques de código formateados
- [ ] Tablas bien formateadas
- [ ] Imágenes con buena resolución
- [ ] Numeración de páginas
- [ ] Encabezados/pies de página
- [ ] Revisión ortográfica
- [ ] Exportar a PDF para distribución

---

## Conversión a PDF (Bonus)

### Con Pandoc:

```powershell
# Requiere MiKTeX o TeX Live
pandoc DOCUMENTACION_COMPLETA_SUPER_SELECTOS.md -o DOCUMENTACION_SUPER_SELECTOS.pdf --toc --pdf-engine=xelatex
```

### Desde Word:

1. Archivo → Guardar como
2. Tipo: PDF
3. Opciones: Optimizado para calidad

---

## Troubleshooting

### Pandoc no encontrado:

```powershell
# Reiniciar terminal o actualizar PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
pandoc --version
```

### Errores de conversión:

- Verificar que el archivo MD no tenga caracteres especiales
- Usar encoding UTF-8
- Revisar sintaxis Markdown

### Tablas no se ven bien:

- En Word, ajustar ancho de columnas manualmente
- O usar plantilla con estilos de tabla predefinidos

---

**¡Listo!** Ahora tienes múltiples formas de convertir la documentación a Word.

**Archivo generado:** `DOCUMENTACION_COMPLETA_SUPER_SELECTOS.md`  
**Ubicación:** `c:\Users\david\super2\`  
**Tamaño:** ~1,640 líneas de documentación completa
