# Technical Test – Fullstack Developer (React + Node.js)

## Objetivo
Construir un sistema Fullstack que obtenga datos en tiempo real desde la API pública de REE (Red Eléctrica de España) — específicamente los datos de Balance Eléctrico —, los almacene en una base de datos MongoDB, y los exponga mediante una API GraphQL. Además, debe incluir un frontend en React que consuma esa API y muestre la información de forma clara e interactiva.

El sistema está contenedorizado con Docker y cuenta con testing y documentación adecuados.

## Fuente de Datos y API
Se usa el siguiente endpoint público de REE:
```
https://apidatos.ree.es/es/datos/balance/balance-electrico
```

Este endpoint proporciona información del balance eléctrico nacional: generación, demanda, importaciones/exportaciones, etc.

## Arquitectura del Sistema

### Backend
- **NestJS**: Framework para construir aplicaciones server-side eficientes y escalables
- **MongoDB**: Base de datos NoSQL para almacenar los datos históricos
- **GraphQL**: API para consultar y manipular los datos
- **TypeScript**: Lenguaje de programación tipado que mejora la robustez del código

### Frontend
- **React**: Biblioteca para construir interfaces de usuario
- **Vite**: Herramienta de construcción moderna que ofrece una experiencia de desarrollo más rápida
- **TypeScript**: Para agregar tipado estático al código JavaScript
- **Tailwind CSS**: Framework CSS para diseño responsive y moderno
- **Apollo Client**: Cliente GraphQL para consumir la API del backend
- **Recharts**: Biblioteca para crear gráficos interactivos

### Contenedorización
- **Docker**: Plataforma para desarrollar, enviar y ejecutar aplicaciones
- **Docker Compose**: Herramienta para definir y ejecutar aplicaciones Docker multi-contenedor

## API GraphQL

### Queries

#### Obtener Balance Eléctrico por Rango de Fechas
```graphql
query GetBalanceByDateRange($startDate: DateTime!, $endDate: DateTime!) {
  getBalanceByDateRange(startDate: $startDate, endDate: $endDate) {
    _id
    timestamp
    generation
    demand
    imports
    exports
    balance
    details {
      renewable
      nonRenewable
      storage
      nuclear
      hydro
      wind
      solar
      thermal
    }
  }
}
```

Variables de ejemplo:
```json
{
  "startDate": "2024-04-01T00:00:00.000Z",
  "endDate": "2024-04-30T23:59:59.999Z"
}
```

### Mutations

#### Obtener y Almacenar Datos de Balance Eléctrico
```graphql
mutation FetchBalanceByDateRange($startDate: DateTime!, $endDate: DateTime!) {
  fetchBalanceByDateRange(startDate: $startDate, endDate: $endDate) {
    _id
    timestamp
    generation
    demand
    imports
    exports
    balance
    details {
      renewable
      nonRenewable
      storage
      nuclear
      hydro
      wind
      solar
      thermal
    }
  }
}
```

Variables de ejemplo:
```json
{
  "startDate": "2024-04-01T00:00:00.000Z",
  "endDate": "2024-04-30T23:59:59.999Z"
}
```

## Instrucciones para Ejecutar el Proyecto

### Usando Docker (Recomendado)
La forma más sencilla de ejecutar todo el sistema es usando Docker Compose:

1. Asegúrate de tener instalado [Docker](https://www.docker.com/get-started) y Docker Compose.

2. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd technical-test
```

3. Inicia todos los servicios con Docker Compose:
```bash
docker-compose up -d
```

4. Accede a la aplicación:
   - Frontend: http://localhost
   - API GraphQL: http://localhost/graphql

### Ejecución Manual (Desarrollo)

#### Backend
1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con las credenciales necesarias.

4. Iniciar el servidor:
```bash
npm run start:dev
```

El backend estará disponible en http://localhost:3000/graphql

#### Frontend
1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar la aplicación:
```bash
npm run dev
```

El frontend estará disponible en http://localhost:5173

## Características del Frontend

- **Dashboard de Balance Eléctrico**: Visualización principal que muestra datos históricos del balance eléctrico español.
- **Selector de Rango de Fechas**: Permite filtrar los datos en un periodo específico.
- **Múltiples Visualizaciones**:
  - Gráficos de Generación: Muestra la generación de energía renovable, no renovable y almacenamiento.
  - Gráficos de Balance: Visualiza importaciones, exportaciones y balance neto.
  - Detalles de Generación: Presenta la distribución de diferentes fuentes de energía en gráficos de pastel.
- **Vista Tabular**: Permite ver los datos en formato de tabla para análisis detallado.
- **Actualización de Datos**: Botón para obtener los datos más recientes desde la API de REE.
- **Manejo de Estados**: Indicadores de carga y mensajes de error para mejorar la experiencia de usuario.

## Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   └── electrical-balance/
│   │   │       ├── dto/
│   │   │       ├── schemas/
│   │   │       ├── services/
│   │   │       ├── repositories/
│   │   │       ├── resolvers/
│   │   │       └── types/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── graphql/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Mejoras Futuras

- Implementar autenticación y autorización
- Añadir más visualizaciones y análisis de datos
- Incorporar notificaciones en tiempo real
- Implementar cache de datos para reducir llamadas a la API de REE
- Añadir funcionalidades de exportación de datos (CSV, PDF)
- Mejorar la cobertura de pruebas

## Documentación Adicional
- [API de REE](https://www.ree.es/es/apidatos)
- [GraphQL](https://graphql.org/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://reactjs.org/)
- [Recharts](https://recharts.org/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)