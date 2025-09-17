# Configuración de EmailJS para Blue Marine Nautical Services

## Pasos para configurar el envío de emails del formulario

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Regístrate gratis con el email de la empresa: `bulelemarineservices@gmail.com`
3. Confirma tu email

### 2. Configurar servicio de email
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona "Gmail" 
4. Conecta la cuenta `bulelemarineservices@gmail.com`
5. Anota el **Service ID** (ejemplo: `service_abc123`)

### 3. Crear plantilla de email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa esta plantilla:

**Subject:** Nueva solicitud de presupuesto - {{from_name}}

**Content:**
```
Hola,

Has recibido una nueva solicitud de presupuesto de servicios marinos:

Cliente: {{from_name}}
Email: {{from_email}}
Teléfono: {{phone}}
Tipo de embarcación: {{boat_type}}
Servicio solicitado: {{service_type}}

Mensaje:
{{message}}

---
Enviado desde el formulario web de Blue Marine Nautical Services
```

4. Anota el **Template ID** (ejemplo: `template_xyz789`)

### 4. Obtener clave pública
1. Ve a "Account" > "General"
2. Copia tu **Public Key** (ejemplo: `user_abc123def456`)

### 5. Actualizar el código
En el archivo `script.js`, reemplaza:

```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // Línea 136
```
Con:
```javascript
emailjs.init("tu_public_key_aqui");
```

Y reemplaza en la línea 169:
```javascript
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```
Con:
```javascript
emailjs.send('tu_service_id', 'tu_template_id', templateParams)
```

### 6. Configuración de Gmail (si es necesario)
Si usas Gmail, puede que necesites:
1. Activar "Aplicaciones menos seguras" o
2. Usar contraseñas de aplicación (recomendado)

### 7. Probar el formulario
1. Llena el formulario en tu sitio web
2. Haz clic en "Solicitar Presupuesto"
3. Verifica que llegue el email a `bulelemarineservices@gmail.com`

## Plan gratuito de EmailJS
- 200 emails por mes gratis
- Perfecto para empezar
- Se puede actualizar si necesitas más

## Alternativa temporal
Mientras configuras EmailJS, el formulario mostrará un mensaje de error y sugerirá contactar por WhatsApp.