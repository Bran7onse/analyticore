# AnalytiCore

Prototipo políglota para análisis simple de sentimiento y extracción de palabras clave. Implementa React, FastAPI, Spring Boot y PostgreSQL, comunicados mediante API REST y organizados con arquitectura limpia.
## Aplicación desplegada

Frontend público:

https://analyticore-frontend-y3jh.onrender.com

API Swagger:

https://analyticore-python-2ba9.onrender.com/docs

Healthcheck Java:

https://analyticore-java-vf8y.onrender.com/actuator/health
## Requisitos

- Docker Engine con Docker Compose v2, para la ejecución recomendada.
- Opcional para desarrollo sin contenedores: Node.js 22, Python 3.12 y Java 21 con Maven 3.9.

## Ejecución local con Docker Compose

Desde la raíz del repositorio:

```bash
cp .env.example .env
docker compose up --build
```

Servicios disponibles:

- Frontend: <http://localhost:3000>
- API FastAPI: <http://localhost:8000>
- OpenAPI/Swagger: <http://localhost:8000/docs>
- Salud de FastAPI: <http://localhost:8000/health>
- Salud de Spring Boot: <http://localhost:8080/actuator/health>

Si el puerto `8080` está ocupado, cambia `JAVA_HOST_PORT` en `.env`; por ejemplo, `JAVA_HOST_PORT=18080`. Para detener sin borrar datos ejecuta `docker compose down`. Para detener y eliminar también PostgreSQL ejecuta `docker compose down -v`.

## API y prueba manual

Crear un trabajo:

```bash
curl -i -X POST http://localhost:8000/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{"text":"Excelente servicio y excelente experiencia"}'
```

La respuesta `202 Accepted` contiene un UUID en `job_id`. Consulta ese valor hasta recibir `COMPLETADO` o `FALLIDO`:

```bash
curl -i http://localhost:8000/api/jobs/REEMPLAZAR_CON_JOB_ID
```

El contrato interno que FastAPI utiliza para iniciar Java es:

```bash
curl -i -X POST http://localhost:8080/internal/analyses \
  -H 'Content-Type: application/json' \
  -d '{"jobId":"REEMPLAZAR_CON_JOB_ID"}'
```

Ese último endpoint es interno en producción y requiere un trabajo previamente creado. Los estados posibles son `PENDIENTE`, `PROCESANDO`, `COMPLETADO` y `FALLIDO`; el texto admite entre 1 y 10.000 caracteres.

## Variables de entorno

El archivo `.env.example` contiene valores de desarrollo, no credenciales reales.

| Variable | Componente | Uso |
|---|---|---|
| `POSTGRES_DB` | PostgreSQL/Java/Compose | Nombre de la base de datos |
| `POSTGRES_USER` | PostgreSQL/Java/Compose | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | PostgreSQL/Java/Compose | Contraseña de PostgreSQL |
| `DATABASE_URL` | FastAPI | URL externa de PostgreSQL; admite `postgres://` o `postgresql://` |
| `POSTGRES_HOST` | Java | Host de PostgreSQL |
| `POSTGRES_PORT` | Java | Puerto de PostgreSQL |
| `JAVA_SERVICE_URL` | FastAPI | URL privada del servicio Java |
| `CORS_ORIGINS` | FastAPI | Orígenes web permitidos, separados por comas |
| `VITE_API_URL` | React | URL pública de FastAPI, usada durante el build |
| `JAVA_HOST_PORT` | Docker Compose | Puerto Java publicado en el host |
| `PORT` | FastAPI/Java | Puerto asignado por la plataforma |

Docker Compose construye las URLs internas automáticamente a partir de las variables PostgreSQL. Por ello, `DATABASE_URL` y `JAVA_SERVICE_URL` de `.env.example` sirven principalmente para ejecución individual o como referencia de producción.

## Ejecución y pruebas por componente

Frontend:

```bash
cd frontend
npm install
npm run build
```

Servicio Python:

```bash
cd python-service
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
PYTHONPATH=. pytest -q
```

Servicio Java:

```bash
cd java-service
mvn test
mvn package
```

El `Dockerfile` Java también ejecuta las pruebas durante la construcción de la imagen. Para verificar todo el empaquetado ejecuta `docker compose build` desde la raíz.

## Despliegue en Render

1. Sube el repositorio a GitHub sin crear un archivo `.env` versionado.
2. En Render selecciona **New → Blueprint**, conecta el repositorio y usa el `render.yaml` de la raíz.
3. Durante la creación, introduce `CORS_ORIGINS` con la URL pública del frontend, por ejemplo `https://analyticore-frontend.onrender.com`.
4. Introduce `VITE_API_URL` con la URL pública de FastAPI, por ejemplo `https://analyticore-python.onrender.com`. Esta variable se inyecta como argumento de build del contenedor React.
5. Crea los cuatro recursos y espera a que sus healthchecks estén correctos.
6. Si Render asigna subdominios diferentes por colisión de nombres, usa exactamente las URLs mostradas en el panel y vuelve a desplegar frontend/Python después de actualizarlas.

El Blueprint declara tres servicios web Docker y una base PostgreSQL. Python se comunica con Java por `hostport` en la red privada; las credenciales se obtienen mediante referencias `fromDatabase` y no se guardan en Git. El plan `free` puede cambiarse por un plan persistente según las necesidades de la cuenta.

## Arquitectura y documentación

- `frontend`: dominio y puerto `JobRepository`, caso de uso de análisis/polling, adaptador HTTP y presentación React; `main.tsx` realiza el ensamblaje.
- `python-service`: dominio y puertos, casos de uso, adaptadores SQLAlchemy/HTTP y presentación FastAPI.
- `java-service`: dominio y puertos, caso de uso, adaptadores JDBC/analizador y controlador Spring Boot.
- `diagrams`: componentes, secuencia y capas reales de los tres componentes en Mermaid.
- `render.yaml`: infraestructura como código para Render.
- `informe-ejecutivo.md`: informe ejecutivo breve.
- `CHECKLIST.md`: trazabilidad completa de los requisitos del enunciado.
