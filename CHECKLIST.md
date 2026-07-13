# Checklist de cumplimiento — AnalytiCore

Revisión final realizada contra las tres páginas de `Enunciado cloud.pdf`. `[x]` indica que el requisito está implementado y verificado en el repositorio; `[ ]` identifica una acción externa que no puede completarse solo con el código.

## Contexto y funcionalidad

- [x] Plataforma web para enviar textos.
- [x] Análisis simple de sentimiento implementado en Java (`POSITIVO`, `NEGATIVO`, `NEUTRAL`).
- [x] Extracción real de hasta cinco palabras clave implementada en Java.
- [x] Prototipo políglota con React, Python y Java.
- [x] Base preparada para futuras extensiones mediante puertos e interfaces de dominio.

## Componentes requeridos

- [x] Frontend SPA implementado con React y TypeScript.
- [x] Frontend compilado para producción y servido por Nginx.
- [x] Servicio de submisión implementado con FastAPI.
- [x] FastAPI valida textos de 1 a 10.000 caracteres.
- [x] FastAPI persiste el trabajo inicial en PostgreSQL.
- [x] FastAPI orquesta el inicio del análisis mediante REST.
- [x] Servicio de análisis implementado con Spring Boot.
- [x] Spring Boot realiza el análisis y persiste estado y resultados.
- [x] PostgreSQL es compartido por los servicios Python y Java.

## Flujo de datos

- [x] El usuario introduce y envía texto desde React.
- [x] React llama `POST /api/jobs` en FastAPI.
- [x] FastAPI crea el trabajo con estado `PENDIENTE`.
- [x] FastAPI llama síncronamente `POST /internal/analyses` para iniciar Java.
- [x] FastAPI devuelve `202 Accepted`, `job_id` y estado al frontend.
- [x] Java reclama el trabajo de forma atómica y lo cambia a `PROCESANDO`.
- [x] Java guarda sentimiento, palabras clave y estado `COMPLETADO`.
- [x] Los errores operativos se persisten con estado `FALLIDO`.
- [x] React consulta `GET /api/jobs/{job_id}` cada 1,5 segundos.
- [x] React presenta estado y resultados finales.

## Patrones cloud obligatorios

- [x] Frontend tiene su propio `Dockerfile` multi-stage de producción.
- [x] Servicio Python tiene su propio `Dockerfile` de producción y usuario sin privilegios.
- [x] Servicio Java tiene su propio `Dockerfile` multi-stage de producción y usuario sin privilegios.
- [x] La comunicación entre componentes se realiza mediante API REST.
- [x] Los servicios no conservan estado de negocio en memoria.
- [x] Todo el estado de los trabajos se externaliza en PostgreSQL.
- [x] La conexión PostgreSQL se configura externamente mediante variables de entorno.
- [x] Frontend separado en dominio, aplicación, infraestructura y presentación; `main.tsx` es la raíz de composición.
- [x] Python separado en dominio, aplicación, infraestructura y presentación; `main.py` ensambla dependencias.
- [x] Java separado en dominio, aplicación, infraestructura y presentación; Spring realiza la inyección.

## Ejecución y despliegue

- [x] `docker-compose.yml` ejecuta PostgreSQL y los tres componentes localmente.
- [x] Compose incluye dependencias y healthchecks.
- [x] `.env.example` documenta configuración local sin secretos reales.
- [x] `render.yaml` define tres servicios web Docker y PostgreSQL.
- [x] `render.yaml` usa referencias `fromDatabase` para las credenciales.
- [x] Python usa `hostport` de la red privada para comunicarse con Java en Render.
- [x] El frontend recibe la URL pública de FastAPI durante el build en Render.
- [x] `render.yaml` fue validado contra el JSON Schema oficial Draft 2020-12 de Render.
- [ ] Despliegue efectivo en una cuenta de Render y comprobación de sus URLs públicas; requiere cuenta, conexión con GitHub y creación externa del Blueprint.

## Entregables

- [x] Código fuente organizado en `/frontend`, `/python-service` y `/java-service`.
- [x] Diagrama de componentes en `diagrams/componentes.md`.
- [x] Diagrama de capas del frontend en `diagrams/capas-frontend.md`.
- [x] Diagrama de capas de Python en `diagrams/capas-python.md`.
- [x] Diagrama de capas de Java en `diagrams/capas-java.md`.
- [x] Diagrama adicional de secuencia en `diagrams/secuencia.md`.
- [x] Los nombres de capas, dependencias, endpoints y estados de los diagramas coinciden con la implementación.
- [x] Informe ejecutivo en `informe-ejecutivo.md`.
- [x] Informe ejecutivo de 302 palabras, apto para una página con formato de texto normal.
- [x] Informe explica problema, solución, valor, escalabilidad, mantenibilidad y flexibilidad tecnológica en lenguaje sencillo.
- [x] README contiene ejecución local, Compose, variables, API, pruebas y despliegue en Render.

## Calidad, seguridad y entrega GitHub

- [x] Todo el código es ejecutable y no contiene marcadores de trabajo pendiente.
- [x] No hay claves API, tokens, contraseñas reales ni otros secretos versionados.
- [x] Los valores locales de contraseña son ejemplos explícitos de desarrollo.
- [x] `.gitignore` excluye `.env`, dependencias, builds, cachés e IDEs.
- [x] Las tres imágenes Docker compilan correctamente.
- [x] Pruebas unitarias Java incluidas y ejecutadas durante el build Docker.
- [x] Pruebas unitarias Python incluidas.
- [x] Flujo REST integral verificado con PostgreSQL real en Docker.
- [x] El proyecto está listo para inicializarse/subirse como un único repositorio GitHub.
