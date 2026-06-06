---
title: "Construyendo mi primer Skill público para Claude Code: el 1on1"
description: "Construí un comando /1on1 para Claude Code que ejecuta una reunión de seguimiento estructurada entre mi IA colaboradora y yo. Esta es la historia de cómo y por qué."
date: 2026-06-01
translationKey: "1on1-skill"
assetSlug: "building-my-first-public-claude-code-skill-the-1on1"
hero: "../../assets/blog/building-my-first-public-claude-code-skill-the-1on1/hero.png"
---

**TL;DR:** Construí un comando `/1on1` para Claude Code que ejecuta una reunión de seguimiento estructurada con mi colaborador de IA. Se prepara en silencio a partir del historial de git, hace una pregunta a la vez, hace una autoevaluación, genera un informe, persiste los puntos de acción donde Claude los puede ver y programa la próxima sesión. Es mi primer skill público, disponible en [github.com/jzfgo/agents](https://github.com/jzfgo/agents).

---

Llevo varios meses usando Claude Code a diario. Pronto noté que cada sesión comienza desde cero. Claude lee el código, extrae contexto de `CLAUDE.md` y empieza a trabajar, pero no retiene ningún recuerdo de nuestra colaboración anterior. No hay rendición de cuentas ni una forma sistemática de mejorar. Un asistente infinitamente paciente que lo olvida todo cuando se cierra la ventana.

Aunque es eficaz para completar tareas, a este enfoque le falta un elemento vital.

Las reuniones 1on1 regulares — revisiones estructuradas entre responsables y colaboradores directos — existen precisamente por esto. Sacan a la superficie los problemas antes de que se agraven, establecen compromisos y exigen rendición de cuentas. Con el tiempo, la relación mejora.

Quería esa rendición de cuentas en Claude Code.

## Qué hace el skill

El skill `/1on1` lleva a cabo esta revisión en siete pasos:

**1. Preparación silenciosa.** Primero, Claude lee el `git log`, el `CLAUDE.md`, los TODOs abiertos y las revisiones anteriores en `.claude/reviews/`. Evalúa qué se ha entregado, qué ha fallado, qué se ha prometido y qué patrones se repiten.

**2. Apertura.** Claude indica el nombre del proyecto, la actividad reciente en git y los temas de la sesión, y acto seguido formula la primera pregunta sin preámbulos.

**3. La entrevista.** Haciendo una pregunta a la vez, Claude evalúa su propio rendimiento (calidad, errores, herramientas y estilo) y tu flujo de trabajo (prompts, funcionalidades poco utilizadas y fricciones). El objetivo es una evaluación honesta, no una validación.

**4. El informe.** Claude guarda un informe estructurado en markdown — con logros, mejoras, compromisos, observaciones, puntos de acción y una fecha de próxima revisión — en `.claude/reviews/YYYY-MM-DD.md`.

**5. Persistencia en CLAUDE.md.** Escribe los puntos de acción abiertos directamente en `CLAUDE.md`, el archivo que Claude lee al inicio de cada sesión. Estos elementos se convierten en contexto activo. Una instrucción en línea le indica a Claude que saque a relucir los problemas relevantes de inmediato, en lugar de esperar a la próxima revisión.

**6. Programación.** Claude ofrece programar un agente remoto que se ejecute antes de la próxima revisión. El agente lee el git log, identifica los cambios y guarda un resumen de preparación en `.claude/reviews/YYYY-MM-DD-prep.md` para reunir el contexto con antelación.

**7. Hecho.** En la práctica, esto significa: "Nos vemos la semana que viene."

## Las partes difíciles

### Hacer que la autoevaluación sea honesta

En los primeros borradores, las autoevaluaciones de Claude eran educadas e inútiles, con críticas genéricas como "podría mejorar mi comunicación".

Lo resolví exigiendo especificidad: el skill escanea el historial de git en busca de `fix:`, `revert:`, `wip` o `attempt` en los mensajes de commit. Cuando encuentra estas señales de dificultad, obliga a Claude a nombrar los fallos concretos.

Sin esto, la revisión es pura teatralidad.

### El problema del seguimiento

Un feedback inicial planteó una pregunta crítica: "¿Cómo va a actuar Claude Code sobre estos puntos de acción?"

La mayoría de los procesos de revisión fallan aquí: las conclusiones se registran en un informe y se olvidan de inmediato.

Como Claude lee `CLAUDE.md` al inicio de cada sesión, escribir allí los puntos de acción los pone en contexto de inmediato. La presión por mantener `CLAUDE.md` conciso crea un incentivo natural para completar y eliminar estos puntos.

### El problema de la programación

Surgió una segunda pregunta: "¿Cómo sabrá Claude Code cuándo es el momento de hacer una revisión?"

Para crear un mecanismo de forzado, el skill programa un agente remoto. Esta rutina en la nube, de ejecución única, compila el resumen de preparación antes de la próxima fecha programada. Aunque hay que seguir lanzando `/1on1` manualmente, la preparación está automatizada y programada.

## La primera sesión real

Probé el skill por primera vez con [CarroQueSí](https://github.com/jzfgo/carroquesi), una app colaborativa de lista de la compra. Haber lanzado tres versiones en cuatro días proporcionó material más que suficiente.

La preparación silenciosa reveló patrones que habría pasado por alto: commits `fix:` apareciendo justo después de aterrizar funcionalidades, y un conflicto de migración en Alembic que requirió un commit de recuperación. La causa era clara: ejecuto Claude Code, Codex CLI y Antigravity CLI en paralelo en worktrees separados de git como sistema de capacidades escalonadas. Dos worktrees habían generado migraciones desde el mismo commit padre, provocando un clásico conflicto de cabeceras divergentes.

Lo resolvimos estableciendo una convención: escribir las migraciones como el último paso antes de hacer merge, después de hacer rebase sobre `main`. Lo documentamos en `AGENTS.md` durante la sesión. El 1on1 sacó este patrón a la superficie con suficiente claridad como para promover una acción concreta.

La revisión también codificó otro problema conocido: los agentes se saltan rutinariamente las reglas del worktree y descuidan los archivos `TODO` y `CHANGELOG`, tratándolos como limpiezas opcionales en lugar de requisitos para dar algo por terminado. Escribir estos puntos de acción donde los tres harnesses de agentes los leen es mucho más duradero que repetirlos en los prompts.

La próxima revisión está programada. Un agente remoto preparará el resumen el 8 de junio a las 11:00 para evaluar cómo se han mantenido nuestros compromisos.

## Pruébalo

El skill está disponible en mi repositorio: [github.com/jzfgo/agents](https://github.com/jzfgo/agents). Ejecuta `/1on1` en cualquier directorio de proyecto para empezar.

---

Mi conclusión principal es que el mecanismo importa más que el contenido. Una revisión guardada en un archivo olvidado no es más que documentación. Esos mismos puntos de acción integrados en `CLAUDE.md` permanecen activos: dan forma a cada sesión, invitan al seguimiento natural y exigen resolución.

La reflexión periódica es útil; la reflexión persistente es esencial.
