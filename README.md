# Portfolio Frontend

Portfolio profesional desarrollado con Angular 21, TypeScript y CSS puro.

## Características

- Angular 21 con Standalone Components
- Signals para gestión de estado
- CSS puro con variables CSS modernas
- Diseño totalmente responsive
- Animaciones CSS suaves
- Consumo de API REST
- Formulario de contacto funcional
- Descarga de CV dinámica

## Stack Tecnológico

- Angular 21
- TypeScript 5.6
- CSS3
- RxJS
- HttpClient

## Estructura del Proyecto

```
portfolio-web/
├── src/
│   ├── app/
│   │   ├── core/                 # Services, Guards, Interceptors
│   │   ├── shared/               # Models, Components compartidos
│   │   └── features/
│   │       └── public/           # Páginas públicas
│   │           ├── home/
│   │           ├── about/
│   │           ├── skills/
│   │           ├── experience/
│   │           ├── projects/
│   │           └── contact/
│   └── environments/             # Configuración de entornos
```

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/JonathanAldairAv/portfolio-frontend.git

# Navegar al proyecto
cd portfolio-web

# Instalar dependencias
npm install

# Ejecutar en desarrollo
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

## Configuración

### Desarrollo

Actualiza `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

### Producción

Actualiza `src/environments/environment.production.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-en-produccion.com/api'
};
```

## Páginas

- / - Home: Hero section con presentación y stack tecnológico
- /about - Sobre Mí: Biografía extendida, valores y descarga de CV
- /skills - Habilidades: Habilidades técnicas con barras de progreso por categoría
- /experience - Experiencia: Timeline de experiencia profesional
- /projects - Proyectos: Grid de proyectos con filtros por categoría
- /contact - Contacto: Formulario funcional para enviar mensajes

## Scripts Disponibles

```bash
# Desarrollo
ng serve

# Build de producción
ng build

# Tests
ng test

# Linting
ng lint
```

## Build para Producción

```bash
# Generar build optimizado
ng build --configuration production

# Los archivos generados estarán en dist/
```

## Características Técnicas

### Servicios HTTP

- ProfileService - Gestión de perfil y descarga de CV
- ProjectService - CRUD de proyectos
- SkillService - Gestión de habilidades
- ExperienceService - Gestión de experiencia laboral
- ContactService - Envío de mensajes

### Guards

- AuthGuard - Protección de rutas del panel admin (pendiente implementación)

### Interceptors

- AuthInterceptor - Inyección automática de JWT token en requests

## Responsive Design

El portfolio está completamente optimizado para:

- Desktop (1920px y superiores)
- Laptop (1366px - 1920px)
- Tablet (768px - 1365px)
- Mobile (320px - 767px)

## Navegadores Soportados

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

## Paleta de Colores

```css
--primary: #6366F1 (Indigo)
--secondary: #8B5CF6 (Purple)
--accent: #3B82F6 (Blue)
--success: #10B981 (Green)
--bg-primary: #0f172a (Dark Blue)
--bg-secondary: #1e293b (Slate)
```

## Autor

Jonathan Fabián Aldana Torres

Desarrollador Senior Full Stack | .NET & Angular

GitHub: https://github.com/JonathanAldairAv

LinkedIn: https://linkedin.com/in/jonathan-aldana