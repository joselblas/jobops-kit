/* Jobops dashboard. No dependencies, no network. Reads tracker.csv in the browser. */
(function () {
  "use strict";

  var DIMS = ["domain", "skill", "level", "evidence", "terms"];
  var EXTRA = ["cv_version", "portfolio_lead"];
  var DIM_KEY = { domain: "dim.domain", skill: "dim.skill", level: "dim.level", evidence: "dim.evidence", terms: "dim.terms" };
  var OUTCOMES = ["", "rejected", "rejected-auto", "interview", "offer", "withdrawn", "no-response"];
  var STATUSES = ["found", "gated", "skipped", "tailored", "applied", "closed"];
  var SOURCES = ["linkedin", "job-board", "company-site", "indeed", "email", "recruiter", "referral", "other"];

  /* ---------- Language ---------- */
  var I = {
    "nav.overview": ["Overview", "Resumen"], "nav.tracker": ["Tracker", "Seguimiento"], "nav.log": ["Log an update", "Registrar novedad"],
    "nav.steady": ["Steady", "Calma"], "nav.review": ["Weekly review", "Revisión semanal"], "title.review": ["Weekly review.", "Revisión semanal."],
    "rev.lede": ["Five calm minutes, once a week. See the week, tidy what is waiting, name one thing that went well, and pick a focus.", "Cinco minutos de calma, una vez por semana. Mira la semana, ordena lo que espera, nombra algo que fue bien y elige un enfoque."],
    "rev.start": ["Start the review", "Empezar la revisión"], "rev.last": ["Last review: {d}. Focus: {f}.", "Última revisión: {d}. Enfoque: {f}."],
    "rev.q1": ["This week", "Esta semana"], "rev.h1": ["The last seven days, against the seven before.", "Los últimos siete días, frente a los siete anteriores."],
    "rev.applied": ["Applications sent", "Candidaturas enviadas"], "rev.replies": ["Replies received", "Respuestas recibidas"], "rev.rej": ["Rejections", "Rechazos"], "rev.int": ["Interviews or offers", "Entrevistas u ofertas"], "rev.prev": ["last week {n}", "semana pasada {n}"],
    "rev.wit0": ["A quiet week. Quiet is data too. Pick one small thing for next week.", "Una semana tranquila. Lo tranquilo también es un dato. Elige una cosa pequeña para la próxima."],
    "rev.wit1": ["{a} sent, {r} answered. Replies lag by weeks, so this week's replies are mostly last month's work.", "{a} enviadas, {r} con respuesta. Las respuestas llegan con semanas de retraso, así que las de esta semana son sobre todo trabajo del mes pasado."],
    "rev.q2": ["Still waiting", "Siguen en espera"], "rev.h2": ["Anything waiting 30 days or more can be closed as no reply. You can always reopen it in the tracker.", "Lo que lleva 30 días o más en espera puede cerrarse como sin respuesta. Siempre puedes reabrirlo en el seguimiento."],
    "rev.fresh": ["{n} are under two weeks old. Nothing to do about those.", "{n} llevan menos de dos semanas. Con esas no hay nada que hacer."], "rev.midn": ["{n} are two to four weeks old. Still normal.", "{n} llevan de dos a cuatro semanas. Aún es normal."],
    "rev.close": ["Mark as no reply", "Marcar sin respuesta"], "rev.none30": ["Nothing waiting 30 days or more.", "Nada esperando 30 días o más."], "rev.closed": ["Closed as no reply.", "Cerrada como sin respuesta."],
    "rev.q3": ["One thing you did well this week?", "¿Una cosa que hiciste bien esta semana?"], "rev.h3": ["Optional. Small counts. Saved in this browser only, and it will show in Steady.", "Opcional. Lo pequeño cuenta. Se guarda solo en este navegador y aparecerá en Calma."],
    "rev.q4": ["What is the focus for next week?", "¿Cuál es el enfoque de la próxima semana?"],
    "rev.f.apply": ["Send new applications", "Enviar candidaturas nuevas"], "rev.f.apply.d": ["A few good ones beat many fast ones.", "Pocas buenas valen más que muchas rápidas."],
    "rev.f.follow": ["Follow up on old ones", "Retomar las antiguas"], "rev.f.follow.d": ["A short, plain note is enough.", "Una nota corta y sencilla basta."],
    "rev.f.craft": ["Improve the CV and portfolio", "Mejorar el CV y el portafolio"], "rev.f.craft.d": ["Sharper material helps every application after.", "Un material más afinado ayuda a todas las candidaturas siguientes."],
    "rev.f.rest": ["Rest", "Descansar"], "rev.f.rest.d": ["A search needs a person who can keep going.", "Una búsqueda necesita a alguien que pueda seguir."],
    "rev.done": ["Review done.", "Revisión hecha."], "rev.next": ["Next week: {f}.", "Próxima semana: {f}."],
    "rev.line.apply": ["New applications. Choose the ones you would be glad to get.", "Candidaturas nuevas. Elige las que te alegraría conseguir."], "rev.line.follow": ["Follow-ups. Be brief, be kind, ask one question.", "Seguimientos. Sé breve, amable y haz una sola pregunta."],
    "rev.line.craft": ["The CV and portfolio. You will reuse the work every time.", "El CV y el portafolio. Reutilizarás ese trabajo cada vez."], "rev.line.rest": ["Rest. The search will still be here, and so will you.", "Descanso. La búsqueda seguirá aquí, y tú también."],
    "rev.wins": ["Your wins", "Tus logros"], "rev.wins.none": ["Wins from your weekly reviews will appear here.", "Los logros de tus revisiones semanales aparecerán aquí."],
    "nav.design": ["Design and story", "Diseño e historia"], "grp.about": ["About", "Acerca de"], "nav.inbox": ["Proposed updates", "Cambios propuestos"], "title.inbox": ["Proposed updates.", "Cambios propuestos."],
    "inbox.lede": ["An agent reads your email and proposes changes with the evidence. You decide each one. Nothing changes until you accept.", "Un agente lee tu correo y propone cambios con la evidencia. Tú decides cada uno. Nada cambia hasta que aceptes."],
    "inbox.load": ["Load proposals.csv", "Cargar proposals.csv"], "inbox.sample": ["Sample proposals", "Propuestas de ejemplo"], "inbox.acceptall": ["Accept all matched", "Aceptar todas las coincidentes"],
    "inbox.accept": ["Accept", "Aceptar"], "inbox.skip": ["Skip", "Omitir"], "inbox.pending": ["{n} waiting for you", "{n} esperando tu decisión"], "inbox.empty": ["Nothing to review. Load a proposals file, or try the sample.", "Nada que revisar. Carga un archivo de propuestas o prueba el ejemplo."],
    "inbox.accepted": ["Accepted", "Aceptada"], "inbox.skipped": ["Skipped", "Omitida"], "inbox.nomatch": ["No matching application in the tracker. Skip it, or add it with Log an update.", "No hay candidatura coincidente en el seguimiento. Omítela o añádela con Registrar novedad."],
    "inbox.newapp": ["New application", "Candidatura nueva"], "inbox.change": ["Change", "Cambio"], "inbox.evidence": ["Evidence", "Evidencia"], "inbox.from": ["from", "desde"], "inbox.guess": ["Closest match, check the role.", "Coincidencia más cercana, comprueba el puesto."],
    "inbox.fit": ["Fit profile", "Perfil de encaje"], "inbox.fitavg": ["average {a}", "media {a}"], "inbox.fitnow": ["current score {s}", "puntuación actual {s}"], "inbox.fitrep": ["Replaces the current profile.", "Sustituye al perfil actual."], "inbox.fitwhy": ["Why these ratings", "Por qué estas puntuaciones"], "inbox.fitbad": ["Ratings must be five numbers from 1 to 5.", "Las puntuaciones deben ser cinco números del 1 al 5."],
    "inbox.done": ["{a} accepted, {s} skipped.", "{a} aceptadas, {s} omitidas."], "nav.scout": ["Scout", "Buscar ofertas"], "nav.craft": ["CV and portfolio", "CV y portafolio"],
    "nav.apply": ["Apply", "Candidaturas"], "nav.prepare": ["Interview prep", "Preparar entrevistas"],
    "nav.followups": ["Follow-ups", "Retomar contacto"], "title.followups": ["Follow up, calmly.", "Retomar contacto, con calma."],
    "fu.intro": ["Applications with no reply after three weeks. A short note is normal and often useful. Nothing is sent from here: copy the draft and send it yourself.", "Candidaturas sin respuesta pasadas tres semanas. Una nota corta es normal y a menudo útil. Desde aquí no se envía nada: copia el borrador y envíalo tú."],
    "fu.none": ["Nothing has waited 21 days or more. Good.", "Nada lleva esperando 21 días o más. Bien."],
    "fu.days": ["days", "días"], "fu.draft": ["Draft a note", "Redactar nota"], "fu.hide": ["Hide", "Ocultar"],
    "fu.lang": ["Language", "Idioma"], "fu.tone": ["Tone", "Tono"], "fu.t.check": ["Check in", "Preguntar"], "fu.t.close": ["Close the loop", "Cerrar el tema"],
    "fu.name": ["Your name", "Tu nombre"], "fu.link": ["Portfolio link (optional)", "Enlace al portafolio (opcional)"],
    "fu.copy": ["Copy draft", "Copiar borrador"], "fu.copied": ["Copied. Paste it into your own email or message.", "Copiado. Pégalo en tu propio correo o mensaje."],
    "fu.sent": ["Mark as sent", "Marcar como enviado"], "fu.noreply": ["Close as no reply", "Cerrar sin respuesta"],
    "fu.marked": ["Noted in the tracker.", "Anotado en el seguimiento."],
    "fu.ago": ["Followed up {n} days ago", "Seguimiento hace {n} días"], "fu.agotoday": ["Followed up today", "Seguimiento hoy"],
    "fu.wit": ["Silence is usually a queue, not a verdict.", "El silencio suele ser una cola, no un veredicto."],
    "fu.draftlabel": ["Draft (edit freely)", "Borrador (edítalo)"], "fu.ph.name": ["[Your name]", "[Tu nombre]"],
    "fu.link.line": ["Portfolio: ", "Portafolio: "],
    "grp.work": ["Your search", "Tu búsqueda"], "grp.soon": ["Coming", "Próximamente"],
    "tag.soon": ["Soon", "Pronto"], "tag.preview": ["Preview", "Avance"],
    "title.overview": ["The search, in numbers.", "La búsqueda, en números."], "title.tracker": ["Every listing.", "Cada oferta."],
    "title.log": ["Log an update.", "Registra una novedad."], "title.steady": ["Keep a clear head.", "Cabeza clara."],
    "title.scout": ["Scout.", "Buscar ofertas."], "title.craft": ["Tune your CV and portfolio.", "Afina tu CV y tu portafolio."],
    "craft.intro": ["Tag each application with the CV and portfolio lead you used, then see what gets replies. Small numbers are hints, not findings.", "Etiqueta cada candidatura con el CV y el portafolio que usaste y mira qué recibe respuesta. Los números pequeños son pistas, no conclusiones."],
    "craft.by": ["Compare by", "Comparar por"], "craft.by.cv": ["CV version", "Versión del CV"], "craft.by.pf": ["Portfolio lead", "Portafolio principal"],
    "craft.th.v": ["Version", "Versión"], "craft.th.n": ["Applied", "Enviadas"], "craft.th.r": ["Replies", "Respuestas"], "craft.th.w": ["Too recent", "Muy recientes"], "craft.th.i": ["Interviews", "Entrevistas"], "craft.th.rate": ["Reply rate", "Tasa de respuesta"],
    "craft.few": ["Too few to compare", "Muy pocas para comparar"], "craft.range": ["likely {a} to {b}", "probable {a} a {b}"],
    "craft.untagged": ["{n} applications have no value here. Add it in the tracker editor.", "{n} candidaturas no tienen valor aquí. Añádelo en el editor del seguimiento."],
    "craft.none": ["Nothing is tagged yet. Open any applied listing in the Tracker and fill in CV version, for example cv-2026-11-systems. After about ten applications per version, this table starts to say something.", "Aún no hay nada etiquetado. Abre cualquier oferta enviada en el Seguimiento y rellena la versión del CV, por ejemplo cv-2026-11-systems. Con unas diez candidaturas por versión, esta tabla empieza a decir algo."],
    "craft.caveat": ["Applications under 21 days old with no reply are left out of the rate, because silence is not an answer yet. Under about 30 applications per version, treat differences as hints. A reply is any answer that is not silence, so it includes rejections.", "Las candidaturas de menos de 21 días sin respuesta se dejan fuera de la tasa, porque el silencio aún no es una respuesta. Con menos de unas 30 candidaturas por versión, trata las diferencias como pistas. Una respuesta es cualquier contestación que no sea silencio, así que incluye rechazos."],
    "craft.ask": ["Ask Claude", "Pregunta a Claude"], "craft.ask.s": ["Copy a prompt, paste it into your Job search Project. It uses the jobops-craft skill and proposes. It never edits your files.", "Copia un prompt y pégalo en tu Proyecto de búsqueda. Usa la skill jobops-craft y propone. Nunca edita tus archivos."],
    "craft.p.cv": ["Audit my CV", "Auditar mi CV"], "craft.p.pf": ["Audit my portfolio", "Auditar mi portafolio"], "craft.p.tune": ["Tune for a listing", "Afinar para una oferta"],
    "craft.p.pick": ["Listing", "Oferta"], "craft.p.nopick": ["Choose a listing", "Elige una oferta"], "craft.copy": ["Copy prompt", "Copiar prompt"], "craft.copied": ["Copied. Paste it into your Project.", "Copiado. Pégalo en tu Proyecto."],
    "craft.t.cv": ["Use jobops-craft. Audit my master CV against career-context.md. Rank the fixes as must, should and nice, and name the line each one applies to. Do not change my files. If a fact is missing, ask me.", "Usa jobops-craft. Audita mi CV maestro contra career-context.md. Ordena los arreglos en obligatorios, recomendables y opcionales, e indica a qué línea afecta cada uno. No cambies mis archivos. Si falta un dato, pregúntame."],
    "craft.t.pf": ["Use jobops-craft. Audit my portfolio the way a hiring manager skims it. Tell me which three or four case studies to lead with for my target roles, what to cut, and what each case study is missing. Do not invent projects.", "Usa jobops-craft. Audita mi portafolio como lo hojea quien contrata. Dime con qué tres o cuatro casos de estudio abrir para mis roles objetivo, qué quitar y qué le falta a cada uno. No inventes proyectos."],
    "craft.t.tune": ["Use jobops-craft. Tune my CV and portfolio for {co}, {role}. Give me the requirements table with evidence or GAP, the two case studies to lead with, one true headline for this role, what to leave out, and your open questions. Then wait for my approval.", "Usa jobops-craft. Afina mi CV y mi portafolio para {co}, {role}. Dame la tabla de requisitos con evidencia o GAP, los dos casos de estudio con los que abrir, un titular veraz para este rol, qué dejar fuera y tus preguntas abiertas. Después espera mi aprobación."],
   
    "title.apply": ["Apply.", "Candidaturas."], "title.prepare": ["Interview prep.", "Entrevistas."],
    "meta.listings": ["listings", "ofertas"], "meta.asof": ["as of", "a fecha"], "meta.unsaved": ["unsaved changes", "cambios sin guardar"], "meta.saved": ["saved to file", "guardado en el archivo"],
    "btn.open": ["Open and edit", "Abrir y editar"], "btn.load": ["Load tracker.csv", "Cargar tracker.csv"], "btn.download": ["Download CSV", "Descargar CSV"],
    "btn.sample": ["Sample data", "Datos de ejemplo"], "btn.add": ["Add listing", "Añadir oferta"], "btn.edit": ["Edit", "Editar"],
    "btn.cancel": ["Cancel", "Cancelar"], "btn.save": ["Save", "Guardar"], "btn.back": ["Back", "Atrás"], "btn.continue": ["Continue", "Continuar"], "btn.skip": ["Skip", "Omitir"],
    "btn.another": ["Log another", "Registrar otra"], "btn.totracker": ["Go to tracker", "Ir al seguimiento"], "btn.close": ["Close", "Cerrar"],
    "foot": ["Nothing leaves your browser. Gates first, then fit. Small samples stay small.", "Nada sale de tu navegador. Primero los filtros, luego el encaje. Las muestras pequeñas siguen siendo pequeñas."],
    "kpi.logged": ["Logged", "Registradas"], "kpi.gated": ["Stopped at a gate", "Frenadas en un filtro"], "kpi.applied": ["Applied", "Enviadas"], "kpi.heard": ["Heard back", "Con respuesta"], "kpi.inter": ["Interview or better", "Entrevista o más"],
    "card.funnel": ["Funnel", "Embudo"], "card.funnel.s": ["Where the effort goes, and where it stops.", "Dónde va el esfuerzo y dónde se detiene."],
    "f.logged": ["Logged", "Registradas"], "f.passed": ["Passed gates", "Pasan filtros"], "f.applied": ["Applied", "Enviadas"], "f.heard": ["Heard back", "Con respuesta"], "f.inter": ["Interview or better", "Entrevista o más"],
    "f.prev": ["of previous", "del anterior"],
    "caveat.small": ["Only {n} applications. Treat every comparison as a hint, not a result.", "Solo {n} candidaturas. Trata cada comparación como una pista, no como un resultado."],
    "caveat.mid": ["Buckets under about 30 applications are still noisy. Read with care.", "Los grupos de menos de 30 candidaturas aún tienen mucho ruido. Léelos con cuidado."],
    "card.fit": ["Fit", "Encaje"], "card.fit.s": ["Pick an opportunity to see how your evidence matches it.", "Elige una oportunidad para ver cómo encaja tu experiencia."],
    "fit.none": ["No scored listings yet.", "Aún no hay ofertas puntuadas."], "fit.select": ["Select an opportunity.", "Selecciona una oportunidad."],
    "fit.overall": ["overall {s} / 5", "total {s} / 5"], "fit.unscored": ["unscored", "sin puntuar"],
    "fit.nodims": ["No fit profile for this row yet. Use Edit and rate the five dimensions, 1 to 5.", "Esta fila aún no tiene perfil de encaje. Usa Editar y puntúa las cinco dimensiones del 1 al 5."],
    "dim.domain": ["Domain", "Ámbito"], "dim.skill": ["Skills", "Habilidades"], "dim.level": ["Level", "Nivel"], "dim.evidence": ["Evidence", "Evidencia"], "dim.terms": ["Terms", "Condiciones"],
    "card.swarm": ["Score against outcome", "Puntuación y resultado"], "card.swarm.s": ["Does the fit score predict anything? Each dot is one application.", "¿Predice algo la puntuación? Cada punto es una candidatura."],
    "swarm.none": ["No scored applications yet.", "Aún no hay candidaturas puntuadas."], "swarm.rec": ["Recommend", "Recomendado"],
    "lg.int": ["Interview or better", "Entrevista o más"], "lg.rej": ["Closed", "Cerrada"], "lg.wait": ["Waiting", "En espera"],
    "swarm.n": ["{n} scored applications. Too few to say the score predicts anything.", "{n} candidaturas puntuadas. Pocas para decir que la puntuación predice algo."],
    "swarm.n2": ["{n} scored applications. Read the pattern as a hint.", "{n} candidaturas puntuadas. Lee el patrón como una pista."],
    "card.gates": ["Gates", "Filtros"], "card.gates.s": ["Listings stopped before any CV work.", "Ofertas frenadas antes de tocar el CV."], "none": ["None logged.", "Nada registrado."],
    "card.sources": ["Sources", "Fuentes"], "card.sources.s": ["Applied / heard back / interview or better.", "Enviadas / con respuesta / entrevista o más."], "noapps": ["No applications yet.", "Aún no hay candidaturas."],
    "card.waiting": ["Waiting", "En espera"], "card.waiting.s": ["Applied, no outcome after two weeks or more.", "Enviadas, sin resultado tras dos semanas o más."],
    "wait.none": ["Nothing waiting 14 days or more.", "Nada esperando 14 días o más."], "wait.days": ["DAYS", "DÍAS"], "wait.follow": ["30+ follow up", "30+ seguimiento"],
    "st.waiting": ["Waiting", "En espera"], "st.interview": ["Interview", "Entrevista"], "st.offer": ["Offer", "Oferta"], "st.rejected": ["Closed", "Cerrada"], "st.auto": ["Closed, auto", "Cerrada, automático"],
    "st.withdrawn": ["Withdrawn", "Retirada"], "st.silent": ["No reply", "Sin respuesta"], "st.gated": ["Gated", "Filtrada"], "st.other": ["Logged", "Registrada"],
    "ch.all": ["All", "Todas"], "ch.applied": ["Applied", "Enviadas"], "ch.waiting": ["Waiting", "En espera"], "ch.interview": ["Interview", "Entrevista"], "ch.rejected": ["Closed", "Cerradas"], "ch.silent": ["No reply", "Sin respuesta"], "ch.gated": ["Gated", "Filtradas"],
    "th.found": ["Found", "Encontrada"], "th.company": ["Company", "Empresa"], "th.role": ["Role", "Puesto"], "th.source": ["Source", "Fuente"], "th.score": ["Score", "Puntuación"], "th.state": ["State", "Estado"],
    "search": ["Search company, role, note", "Buscar empresa, puesto, nota"], "count": ["{a} of {b} listings", "{a} de {b} ofertas"], "nomatch": ["No listings match.", "Ninguna oferta coincide."],
    "edit.new": ["New listing", "Nueva oferta"], "edit.newsub": ["Log a listing by hand.", "Registra una oferta a mano."], "edit.legend": ["Fit profile, 1 to 5 each. Leave all blank if unrated.", "Perfil de encaje, del 1 al 5. Déjalo en blanco si no lo has puntuado."],
    "none.yet": ["none yet", "ninguno aún"],
    "toast.saved": ["Saved to {f}", "Guardado en {f}"], "toast.pagecopy": ["Changed in this page only. Use Download CSV to keep it.", "Cambiado solo en esta página. Usa Descargar CSV para conservarlo."],
    "toast.fail": ["Could not save to the file: {e}. Use Download CSV instead.", "No se pudo guardar en el archivo: {e}. Usa Descargar CSV."], "toast.editing": ["Editing {f}. Changes save straight to this file.", "Editando {f}. Los cambios se guardan directamente en este archivo."],
    "toast.need": ["Please answer this one first.", "Responde a esta primero."],
    "log.lede": ["One question at a time. Pick what happened.", "Una pregunta cada vez. Elige qué ha pasado."],
    "flow.reply": ["A reply arrived", "Ha llegado una respuesta"], "flow.reply.d": ["Rejection, interview invite, offer or silence.", "Rechazo, invitación a entrevista, oferta o silencio."],
    "flow.apply": ["I applied to something", "He enviado una candidatura"], "flow.apply.d": ["Add a new application to the tracker.", "Añade una candidatura nueva al seguimiento."],
    "flow.interview": ["An interview happened", "He tenido una entrevista"], "flow.interview.d": ["Log the stage, the date and how it felt.", "Registra la fase, la fecha y cómo fue."],
    "step.of": ["Step {a} of {b}", "Paso {a} de {b}"], "step.review": ["Review", "Revisión"],
    "q.which": ["Which application?", "¿Qué candidatura?"], "h.which": ["Search by company or role. The ones still waiting come first.", "Busca por empresa o puesto. Primero las que siguen en espera."],
    "q.reply": ["What was the reply?", "¿Cuál fue la respuesta?"],
    "o.rejected": ["Rejected", "Rechazada"], "o.rejected.d": ["A person or a template said no.", "Una persona o una plantilla dijo que no."],
    "o.auto": ["Rejected within a day or two", "Rechazada en uno o dos días"], "o.auto.d": ["Probably a filter, not a reader.", "Probablemente un filtro, no una persona."],
    "o.interview": ["Interview invite", "Invitación a entrevista"], "o.interview.d": ["They want to talk.", "Quieren hablar."], "o.offer": ["Offer", "Oferta"], "o.offer.d": ["In writing or on a call.", "Por escrito o en llamada."],
    "o.silent": ["No reply, treat as closed", "Sin respuesta, darla por cerrada"], "o.silent.d": ["It has been long enough. Move on.", "Ha pasado tiempo suficiente. Sigue adelante."],
    "o.withdrawn": ["I withdrew", "Me retiré"], "o.withdrawn.d": ["You decided not to continue.", "Decidiste no continuar."],
    "q.when": ["When was it?", "¿Cuándo fue?"], "h.when": ["Today is filled in for you.", "Hoy viene rellenado."],
    "q.note": ["Anything worth remembering?", "¿Algo que merezca recordarse?"], "h.note": ["Optional. The reason they gave, pay, feedback, the person's name.", "Opcional. El motivo que dieron, el salario, comentarios, el nombre de la persona."],
    "q.company": ["Which company?", "¿Qué empresa?"], "q.role": ["Which role?", "¿Qué puesto?"], "q.source": ["Where did you find it?", "¿Dónde la encontraste?"],
    "q.applied": ["When did you apply?", "¿Cuándo la enviaste?"], "q.score": ["How strong is the fit, 1 to 5?", "¿Qué tan fuerte es el encaje, del 1 al 5?"], "h.score": ["Optional. Rate it honestly, you can change it later.", "Opcional. Puntúa con honestidad, puedes cambiarlo después."],
    "q.stage": ["Which stage?", "¿Qué fase?"], "stg.recruiter": ["Recruiter call", "Llamada con reclutador"], "stg.manager": ["Hiring manager", "Responsable de contratación"], "stg.exercise": ["Design exercise", "Ejercicio de diseño"], "stg.panel": ["Panel or team", "Panel o equipo"], "stg.final": ["Final round", "Ronda final"], "stg.other": ["Something else", "Otra"],
    "q.date.int": ["When was the interview?", "¿Cuándo fue la entrevista?"], "q.note.int": ["How did it go?", "¿Cómo fue?"], "h.note.int": ["Optional. What they asked, what landed, what you would change, what happens next.", "Opcional. Qué preguntaron, qué funcionó, qué cambiarías, qué sigue."],
    "r.application": ["Application", "Candidatura"], "r.reply": ["Reply", "Respuesta"], "r.date": ["Date", "Fecha"], "r.note": ["Note", "Nota"], "r.company": ["Company", "Empresa"], "r.role": ["Role", "Puesto"], "r.source": ["Source", "Fuente"], "r.score": ["Score", "Puntuación"], "r.stage": ["Stage", "Fase"],
    "done.title": ["Logged.", "Registrado."], "done.sub": ["The tracker is updated.", "El seguimiento está actualizado."],
    "steady.k": ["Steady", "Calma"], "steady.reject": ["Closed", "Cerrada"], "steady.days": ["{n} days after you applied", "{n} días después de enviar"], "steady.applied": ["Applied", "Enviada"], "steady.closedOn": ["Closed", "Cerrada"],
    "steady.big": ["A rejection is the usual result: about {p} in 100 applications.", "Un rechazo es lo habitual: unas {p} de cada 100 candidaturas."],
    "steady.body": ["{k} of {n} applications led to an interview so far. {co}, {role}.", "{k} de {n} candidaturas llegaron a entrevista hasta ahora. {co}, {role}."],
    "steady.hands": ["In your hands", "En tus manos"], "steady.hands.t": ["The next application, and the story you tell about this one.", "La próxima candidatura y la historia que cuentas sobre esta."],
    "steady.not": ["Not in your hands", "Fuera de tu alcance"], "steady.not.t": ["The other candidates, the budget, the inbox.", "Los demás candidatos, el presupuesto, la bandeja."],
    "steady.many": ["{n} rejections logged today. That is mail, not a trend. Close the inbox.", "Hoy has registrado {n} rechazos. Es correo, no una tendencia. Cierra la bandeja."],
    "wit": [["Mail, not a verdict.", "The inbox is not yours. The next application is.", "One more data point. Not one more opinion of you.", "You were never going to win every game. You are playing a lot of them."],
            ["Correo, no un veredicto.", "La bandeja no es tuya. La próxima candidatura sí.", "Un dato más. No una opinión más sobre ti.", "Nunca ibas a ganar todas las partidas. Estás jugando muchas."]],
    "wit.auto": ["Answered in under two days. That was a filter, not a reader.", "Respuesta en menos de dos días. Eso fue un filtro, no una persona."],
    "odds.k": ["Odds of an interview, per application", "Probabilidad de entrevista, por candidatura"], "odds.about": ["about {p} in 100", "unas {p} de cada 100"], "odds.none": ["none in {n} yet", "ninguna en {n} por ahora"],
    "odds.range": ["Range {a} to {b} percent. {n} applications is a small sample, so treat this as a hint. Quality still beats volume here.", "Rango de {a} a {b} por ciento. {n} candidaturas es una muestra pequeña, así que tómalo como una pista. Aquí la calidad sigue ganando al volumen."],
    "odds.range2": ["Range {a} to {b} percent, from {n} applications.", "Rango de {a} a {b} por ciento, con {n} candidaturas."],
    "odds.s": ["Your own history, in plain words.", "Tu propia historia, en palabras claras."],
    "pace.k": ["Today", "Hoy"], "pace.s": ["Pacing", "Ritmo"], "pace.msg0": ["Nothing sent today. Three is a good day. Fewer is fine too.", "Nada enviado hoy. Tres es un buen día. Menos también está bien."],
    "pace.msg": ["{a} of {l} applications today. One more is a good day.", "{a} de {l} candidaturas hoy. Una más es un buen día."],
    "pace.full": ["{a} applications today. That is a day's work. The rest can wait.", "{a} candidaturas hoy. Eso es una jornada. Lo demás puede esperar."],
    "pace.note": ["The limit is yours to set. The tool only reminds.", "El límite lo pones tú. La herramienta solo recuerda."],
    "last.none": ["No rejections logged yet. When one arrives, it will land here with the odds and one line to carry.", "Aún no hay rechazos registrados. Cuando llegue uno, aparecerá aquí con las probabilidades y una frase para llevarte."],
    "conf.k": ["Confidence bank", "Banco de confianza"], "conf.t": ["Your proven strengths, with the evidence behind each. They will appear here from your career record.", "Tus fortalezas probadas, con la evidencia detrás de cada una. Aparecerán aquí a partir de tu historial."],
    "soon.phase": ["Planned", "Previsto"], "soon.status": ["Not built yet", "Aún no construido"],
    "soon.scout.l": ["Search for free, from new sources, or check a link.", "Busca libremente, desde nuevas fuentes o comprueba un enlace."],
    "soon.scout.b": [["Free search with the gates applied before you see a result.", "New sources added without touching code.", "Paste a link and get the fit, the gates and what is missing."], ["Búsqueda libre con los filtros aplicados antes de ver el resultado.", "Nuevas fuentes sin tocar código.", "Pega un enlace y obtén el encaje, los filtros y lo que falta."]],
    "soon.craft.l": ["Create and improve your CV and portfolio from facts you have confirmed.", "Crea y mejora tu CV y tu portafolio a partir de datos que has confirmado."],
    "soon.craft.b": [["A CV tailored per listing, fact-checked against your career record.", "A portfolio review that tells you what to cut and what to add.", "ATS readiness check and a clean export."], ["Un CV adaptado a cada oferta, contrastado con tu historial.", "Una revisión del portafolio que te dice qué quitar y qué añadir.", "Comprobación para sistemas ATS y una exportación limpia."]],
    "soon.apply.l": ["Prepare every application. You press the final button.", "Prepara cada candidatura. El botón final lo pulsas tú."],
    "soon.apply.b": [["Forms filled from your record, one at a time.", "Screening answers drafted from your own stories, shown to you before anything is sent.", "A stop before every final submit."], ["Formularios rellenados desde tu historial, de uno en uno.", "Respuestas de cribado redactadas con tus propias historias, que ves antes de enviar nada.", "Una pausa antes de cada envío final."]],
    "soon.prepare.l": ["Stories and practice built from your own record.", "Historias y práctica construidas desde tu propio historial."],
    "soon.prepare.b": [["A story bank: situation, action, result, and the claim each one proves.", "Practice questions for the stage you are about to face.", "A short debrief after each interview, saved to the tracker."], ["Un banco de historias: situación, acción, resultado y qué afirmación prueba cada una.", "Preguntas de práctica para la fase que vas a afrontar.", "Un breve repaso tras cada entrevista, guardado en el seguimiento."]]
  };
  var NAV = [
    ["grp.work", [["overview", "live"], ["tracker", "live"], ["log", "live"], ["followups", "live"], ["inbox", "live"], ["craft", "live"], ["review", "live"], ["steady", "preview"]]],
    ["grp.soon", [["scout", "soon"], ["apply", "soon"], ["prepare", "soon"]]]
  ];
  var PHASE = { scout: "5", craft: "3", apply: "4", prepare: "3" };

  var state = {
    rows: [], head: [], handle: null, dirty: false, editing: null, selected: null,
    filter: "all", q: "", sortKey: "date_found", sortDir: -1, ref: new Date(), label: "",
    view: "overview", lang: "en", theme: "light", limit: 3, wiz: null, props: [], rev: null, craft: { by: "cv_version", pick: -1 }, fu: { open: -1, lang: "", tone: "", text: "", edited: false }
  };

  function $(s) { return document.querySelector(s); }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function t(k, v) {
    var e = I[k]; if (!e) return k;
    var s = e[state.lang === "es" ? 1 : 0];
    if (v) for (var x in v) s = s.split("{" + x + "}").join(v[x]);
    return s;
  }
  function tl(k) { return I[k][state.lang === "es" ? 1 : 0]; }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function fetchStore(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---------- CSV ---------- */
  function parseCSV(text) {
    var rows = [], row = [], cur = "", inQ = false, i, c;
    text = text.replace(/^﻿/, "");
    for (i = 0; i < text.length; i++) {
      c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else { inQ = false; } } else { cur += c; }
      } else if (c === '"') { inQ = true; }
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cur); cur = "";
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
      } else { cur += c; }
    }
    if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    state.head = head.slice();
    return rows.slice(1).map(function (r) { var o = {}; head.forEach(function (h, k) { o[h] = (r[k] || "").trim(); }); return o; });
  }
  function csvCell(v) { v = v == null ? "" : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function serialise() {
    var head = state.head.slice();
    var used = state.rows.some(function (r) { return DIMS.some(function (d) { return r.raw[d]; }); });
    if (used) DIMS.forEach(function (d) { if (head.indexOf(d) < 0) head.push(d); });
    EXTRA.forEach(function (x) { if (head.indexOf(x) < 0 && state.rows.some(function (r) { return r.raw[x]; })) head.push(x); });
    var lines = [head.join(",")];
    state.rows.forEach(function (r) { lines.push(head.map(function (h) { return csvCell(r.raw[h]); }).join(",")); });
    return lines.join("\n") + "\n";
  }
  function toDate(s) {
    if (!s) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
    return null;
  }
  function days(a, b) { return Math.round((b - a) / 86400000); }
  function todayISO() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }

  function normalise(r) {
    var o = {};
    for (var k in r) o[k] = r[k];
    o.raw = r;
    o.score = r.score === "" || isNaN(parseFloat(r.score)) ? null : parseFloat(r.score);
    o.gate = r.gate_result || "";
    o.gated = o.gate.indexOf("fail") === 0;
    o.applied = (r.status || "") === "applied";
    o.outcome = r.outcome || "";
    o.dims = null;
    var vals = DIMS.map(function (d) { return parseFloat(r[d]); });
    if (vals.every(function (v) { return !isNaN(v); })) o.dims = vals;
    o.dFound = toDate(r.date_found); o.dApplied = toDate(r.date_applied); o.dOutcome = toDate(r.date_outcome);
    if (o.gated) { o.stateKey = "gated"; o.stateText = tl("st.gated") + ": " + o.gate.replace(/^fail:?/, ""); }
    else if (o.applied && !o.outcome) { o.stateKey = "waiting"; o.stateText = tl("st.waiting"); }
    else if (o.outcome === "interview" || o.outcome === "offer") { o.stateKey = "interview"; o.stateText = tl(o.outcome === "offer" ? "st.offer" : "st.interview"); }
    else if (o.outcome.indexOf("rejected") === 0) { o.stateKey = "rejected"; o.stateText = tl(o.outcome === "rejected-auto" ? "st.auto" : "st.rejected"); }
    else if (o.outcome === "no-response") { o.stateKey = "silent"; o.stateText = tl("st.silent"); }
    else if (o.outcome === "withdrawn") { o.stateKey = "rejected"; o.stateText = tl("st.withdrawn"); }
    else { o.stateKey = "other"; o.stateText = r.status || tl("st.other"); }
    return o;
  }
  function renorm() { state.rows = state.rows.map(function (r) { return normalise(r.raw); }); if (state.selected) { var i = 0; } }

  function load(text, label, keepHandle) {
    if (!keepHandle) state.handle = null;
    state.dirty = false;
    var raw = parseCSV(text);
    state.rows = raw.filter(function (r) { return r.company || r.role; }).map(normalise);
    state.label = label;
    var latest = null;
    state.rows.forEach(function (r) { [r.dFound, r.dApplied, r.dOutcome].forEach(function (d) { if (d && (!latest || d > latest)) latest = d; }); });
    var today = new Date();
    if (latest) { var cap = new Date(latest.getTime() + 3 * 86400000); state.ref = cap < today ? cap : today; } else { state.ref = today; }
    var best = state.rows.filter(function (r) { return r.score != null; }).sort(function (a, b) { return b.score - a.score; })[0];
    state.selected = best || null;
    state.filter = "all"; state.q = ""; state.wiz = null;
    render();
  }

  /* ---------- Stats ---------- */
  function stats() {
    var rows = state.rows;
    var applied = rows.filter(function (r) { return r.applied; });
    var heard = applied.filter(function (r) { return r.outcome && r.outcome !== "no-response"; });
    var inter = applied.filter(function (r) { return r.stateKey === "interview"; });
    var gated = rows.filter(function (r) { return r.gated; });
    return { rows: rows, applied: applied, heard: heard, inter: inter, gated: gated };
  }
  function pct(a, b) { return b ? Math.round(100 * a / b) + "%" : "n/a"; }
  function wilson(k, n) {
    if (!n) return [0, 0];
    var z = 1.96, p = k / n, d = 1 + z * z / n, c = p + z * z / (2 * n), a = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
    return [Math.max(0, (c - a) / d), Math.min(1, (c + a) / d)];
  }
  function fmt(v) { var s = v < 10 ? (Math.round(v * 10) / 10).toString() : String(Math.round(v)); return state.lang === "es" ? s.replace(".", ",") : s; }

  /* ---------- Chrome ---------- */
  function renderNav() {
    var h = "";
    NAV.forEach(function (g) {
      h += '<p class="label nav-group">' + esc(tl(g[0])) + "</p>";
      g[1].forEach(function (it) {
        var pend = it[0] === "inbox" ? state.props.filter(function (p) { return p.status === "pending"; }).length : it[0] === "followups" ? followList().length : 0;
        var tag = pend ? '<span class="tag accent">' + pend + "</span>" : it[1] === "soon" ? '<span class="tag">' + esc(tl("tag.soon")) + "</span>" : it[1] === "preview" ? '<span class="tag calm">' + esc(tl("tag.preview")) + "</span>" : "";
        h += '<a href="#' + it[0] + '"' + (state.view === it[0] ? ' aria-current="page"' : "") + ">" + esc(tl("nav." + it[0])) + tag + "</a>";
      });
    });
    h += '<p class="label nav-group">' + esc(tl("grp.about")) + '</p><a href="../design/">' + esc(tl("nav.design")) + "</a>";
    $("#nav").innerHTML = h;
    $("#themeSeg").innerHTML = ["light", "dark"].map(function (m) { return '<button type="button" data-theme-set="' + m + '" aria-pressed="' + (state.theme === m) + '">' + (m === "light" ? (state.lang === "es" ? "Claro" : "Light") : (state.lang === "es" ? "Oscuro" : "Dark")) + "</button>"; }).join("");
    $("#langSeg").innerHTML = ["en", "es"].map(function (m) { return '<button type="button" data-lang-set="' + m + '" aria-pressed="' + (state.lang === m) + '">' + m.toUpperCase() + "</button>"; }).join("");
  }
  function renderTop() {
    var s = stats();
    $("#meta").textContent = (state.label || "Tracker") + "  ·  " + s.rows.length + " " + tl("meta.listings") + "  ·  " + tl("meta.asof") + " " + state.ref.toISOString().slice(0, 10) +
      (state.dirty ? "  ·  " + tl("meta.unsaved") : state.handle ? "  ·  " + tl("meta.saved") : "");
    $("#title").textContent = tl("title." + state.view);
    var a = "";
    if (state.view === "overview" || state.view === "tracker") {
      if (state.view === "tracker") a += '<button class="btn accent" type="button" data-act="add">' + esc(tl("btn.add")) + "</button>";
      a += '<button class="btn ghost" type="button" data-act="sample">' + esc(tl("btn.sample")) + "</button>";
      a += '<button class="btn ghost" type="button" data-act="download">' + esc(tl("btn.download")) + "</button>";
      a += '<label class="btn ghost" for="file">' + esc(tl("btn.load")) + "</label>";
      if (window.showOpenFilePicker) a += '<button class="btn" type="button" data-act="open">' + esc(tl("btn.open")) + "</button>";
    }
    if (state.view === "inbox") {
      a += '<button class="btn ghost" type="button" data-act="prop-sample">' + esc(tl("inbox.sample")) + "</button>";
      a += '<label class="btn" for="pfile">' + esc(tl("inbox.load")) + "</label>";
    }
    $("#actions").innerHTML = a;
    $("#foot").textContent = tl("foot");
    document.documentElement.lang = state.lang;
    document.title = "Jobops · " + tl("nav." + state.view);
  }
  function setBadge(n) { return n; }

  function render() {
    renderNav(); renderTop();
    var v = state.view, box = $("#view");
    if (v === "overview") box.innerHTML = viewOverview();
    else if (v === "tracker") { box.innerHTML = viewTracker(); renderTableBody(); }
    else if (v === "log") { box.innerHTML = viewLog(); }
    else if (v === "inbox") box.innerHTML = viewInbox();
    else if (v === "review") box.innerHTML = viewReview();
    else if (v === "followups") box.innerHTML = viewFollowups();
    else if (v === "craft") box.innerHTML = viewCraft();
    else if (v === "steady") box.innerHTML = viewSteady();
    else box.innerHTML = viewSoon(v);
  }

  /* ---------- Shared pieces ---------- */
  function tagFor(r) {
    var cls = r.stateKey === "interview" ? "accent" : r.stateKey === "rejected" ? "closed" : "";
    return '<span class="tag ' + cls + '">' + esc(r.stateText) + "</span>";
  }
  function card(cls, title, sub, body) {
    return '<section class="card ' + cls + '"><div class="card-head"><h2>' + esc(title) + "</h2>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + "</div>" + body + "</section>";
  }

  /* ---------- Overview ---------- */
  function viewOverview() {
    var s = stats();
    var k = [[s.rows.length, "kpi.logged", ""], [s.gated.length, "kpi.gated", ""], [s.applied.length, "kpi.applied", ""], [pct(s.heard.length, s.applied.length), "kpi.heard", ""], [s.inter.length, "kpi.inter", "accent"]];
    var h = '<div class="grid12"><div class="c12"><div class="kpis">' + k.map(function (i) {
      return '<div class="card kpi ' + i[2] + '"><div class="n">' + esc(i[0]) + '</div><div class="label">' + esc(tl(i[1])) + "</div></div>";
    }).join("") + "</div></div>";
    h += card("c7", tl("card.funnel"), tl("card.funnel.s"), funnelHTML(s));
    h += '<div class="c5">' + oddsCard(s) + "</div>";
    h += card("c12", tl("card.fit"), tl("card.fit.s"), fitHTML());
    h += card("c8", tl("card.swarm"), tl("card.swarm.s"), swarmHTML());
    h += card("c4", tl("card.waiting"), tl("card.waiting.s"), waitingHTML());
    h += card("c6", tl("card.gates"), tl("card.gates.s"), gatesHTML());
    h += card("c6", tl("card.sources"), tl("card.sources.s"), sourcesHTML());
    return h + "</div>";
  }
  function funnelHTML(s) {
    var steps = [["f.logged", s.rows.length], ["f.passed", s.rows.length - s.gated.length], ["f.applied", s.applied.length], ["f.heard", s.heard.length], ["f.inter", s.inter.length]];
    var top = steps[0][1] || 1, n = s.applied.length;
    return '<div class="funnel">' + steps.map(function (st, i) {
      var of = i ? steps[i - 1][1] : 0, sub = i ? pct(st[1], of) + " " + tl("f.prev") : "";
      return '<div class="f-row"><div class="f-label">' + esc(tl(st[0])) + '</div><div class="f-track"><div class="f-bar" style="width:' + (100 * st[1] / top) + '%"></div></div><div class="f-val">' + st[1] + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</div></div>";
    }).join("") + "</div><p class=\"caveat\">" + esc(n < 30 ? t("caveat.small", { n: n }) : tl("caveat.mid")) + "</p>";
  }
  function oddsCard(s) {
    var n = s.applied.length, k = s.inter.length, w = wilson(k, n), p = n ? 100 * k / n : 0;
    var est = k ? t("odds.about", { p: fmt(p) }) : t("odds.none", { n: n });
    var cap = t(n < 30 ? "odds.range" : "odds.range2", { a: fmt(w[0] * 100), b: fmt(w[1] * 100), n: n });
    var scale = Math.max(w[1] * 100, 5) * 1.1;
    return '<section class="card meter" style="height:100%"><span class="label" style="color:var(--calm)">' + esc(tl("steady.k")) + '</span><div class="card-head" style="margin:6px 0 0"><h2>' + esc(tl("odds.k")) + '</h2></div><p class="est num">' + esc(est) +
      '</p><div class="track" role="img" aria-label="' + esc(est) + '"><div class="fill" style="left:' + (100 * w[0] * 100 / scale) + '%;width:' + Math.max(1, 100 * (w[1] - w[0]) * 100 / scale) + '%"></div><div class="tick" style="left:' + (100 * p / scale) + '%"></div></div><p class="caveat" style="margin-top:6px">' + esc(cap) + "</p></section>";
  }
  function fitHTML() {
    var scored = state.rows.filter(function (r) { return r.score != null; }).sort(function (a, b) { return b.score - a.score; });
    if (!scored.length) return '<p class="empty">' + esc(tl("fit.none")) + "</p>";
    var list = '<ol class="fit-list" role="listbox">' + scored.map(function (r) {
      return '<li class="fit-item" tabindex="0" role="option" aria-selected="' + (r === state.selected) + '" data-act="select" data-i="' + state.rows.indexOf(r) + '"><span class="fit-score">' + r.score.toFixed(1) + '</span><span><span>' + esc(r.company) + '</span><br><span class="fit-role">' + esc(r.role) + "</span></span>" + tagFor(r) + "</li>";
    }).join("") + "</ol>";
    return '<div class="fit">' + list + '<div class="radar" aria-live="polite">' + radarHTML() + "</div></div>";
  }
  function pt(cx, cy, r, k, n) { var a = -Math.PI / 2 + (2 * Math.PI * k) / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function radarHTML() {
    var r = state.selected;
    if (!r) return '<p class="empty">' + esc(tl("fit.select")) + "</p>";
    var head = "<h3>" + esc(r.company) + '</h3><p class="sub">' + esc(r.role) + " · " + (r.score != null ? t("fit.overall", { s: r.score.toFixed(1) }) : tl("fit.unscored")) + " · " + esc(r.stateText) + "</p>";
    if (!r.dims) return head + '<p class="radar-note">' + esc(tl("fit.nodims")) + "</p>" + (r.notes ? '<p class="radar-note">' + esc(r.notes) + "</p>" : "");
    var size = 360, c = size / 2, R = 120, n = DIMS.length, svg = "", ring;
    for (ring = 1; ring <= 5; ring++) svg += '<polygon points="' + DIMS.map(function (_, k) { return pt(c, c, R * ring / 5, k, n).join(","); }).join(" ") + '" fill="none" stroke="var(--line-strong)" opacity=".45"/>';
    DIMS.forEach(function (d, k) {
      var e = pt(c, c, R, k, n), l = pt(c, c, R + 26, k, n), anc = l[0] < c - 8 ? "end" : l[0] > c + 8 ? "start" : "middle";
      svg += '<line x1="' + c + '" y1="' + c + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="var(--line-strong)" opacity=".45"/><text x="' + l[0] + '" y="' + (l[1] + 4) + '" text-anchor="' + anc + '" fill="var(--ink-muted)" font-size="11" letter-spacing="1.2" font-family="var(--sans)">' + esc(tl(DIM_KEY[d]).toUpperCase()) + "</text>";
    });
    svg += '<polygon points="' + r.dims.map(function (v, k) { return pt(c, c, R * Math.max(0, Math.min(5, v)) / 5, k, n).join(","); }).join(" ") + '" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.6" stroke-linejoin="round"/>';
    r.dims.forEach(function (v, k) { var p = pt(c, c, R * v / 5, k, n); svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="var(--accent)"/>'; });
    var list = DIMS.map(function (d, k) { return "<li><span>" + esc(tl(DIM_KEY[d])) + '</span><span class="dim-bar"><i style="width:' + (r.dims[k] * 20) + '%"></i></span><b>' + r.dims[k] + "</b></li>"; }).join("");
    return head + '<svg viewBox="' + [-60, 0, 480, 360].join(" ") + '" role="img" aria-label="' + esc(r.company) + ": " + DIMS.map(function (d, k) { return tl(DIM_KEY[d]) + " " + r.dims[k]; }).join(", ") + '">' + svg + '</svg><ul class="dim-list">' + list + "</ul>" + (r.notes ? '<p class="radar-note">' + esc(r.notes) + "</p>" : "");
  }
  function swarmHTML() {
    var apps = state.rows.filter(function (r) { return r.applied && r.score != null; });
    if (!apps.length) return '<p class="empty">' + esc(tl("swarm.none")) + "</p>";
    var W = 1000, H = 200, padL = 20, padR = 20, base = 140;
    var min = Math.min(3, Math.floor(Math.min.apply(null, apps.map(function (a) { return a.score; }))));
    function x(s) { return padL + (W - padL - padR) * (s - min) / (5 - min); }
    var svg = '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + base + '" y2="' + base + '" stroke="var(--line-strong)"/>';
    for (var tk = min; tk <= 5.001; tk += 0.5) svg += '<line x1="' + x(tk) + '" x2="' + x(tk) + '" y1="' + base + '" y2="' + (base + 6) + '" stroke="var(--line-strong)"/><text x="' + x(tk) + '" y="' + (base + 26) + '" text-anchor="middle" fill="var(--ink-muted)" font-size="13" font-family="var(--sans)">' + tk.toFixed(1) + "</text>";
    var gx = x(4);
    svg += '<line x1="' + gx + '" x2="' + gx + '" y1="14" y2="' + base + '" stroke="var(--accent)" stroke-dasharray="3 5"/><text x="' + (gx + 8) + '" y="24" fill="var(--accent)" font-size="12" letter-spacing="1.2" font-family="var(--sans)">' + esc(tl("swarm.rec").toUpperCase()) + "</text>";
    var bk = {};
    apps.slice().sort(function (a, b) { return a.score - b.score; }).forEach(function (a) {
      var key = Math.round(a.score * 10), kk = bk[key] = (bk[key] || 0) + 1, cy = base - 12 - (kk - 1) * 20, cx = x(a.score), ti = esc(a.company) + ", " + a.score.toFixed(1) + ", " + esc(a.stateText);
      if (a.stateKey === "interview") svg += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="var(--accent)"><title>' + ti + "</title></circle>";
      else if (a.stateKey === "rejected") svg += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="var(--ink-faint)"><title>' + ti + "</title></circle>";
      else svg += '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="none" stroke="var(--ink)" stroke-width="1.5"><title>' + ti + "</title></circle>";
    });
    return '<div class="swarm"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(tl("card.swarm")) + '">' + svg + '</svg><div class="legend"><span class="l-int">' + esc(tl("lg.int")) + '</span><span class="l-rej">' + esc(tl("lg.rej")) + '</span><span class="l-wait">' + esc(tl("lg.wait")) + "</span></div></div>" +
      '<p class="caveat">' + esc(t(apps.length < 30 ? "swarm.n" : "swarm.n2", { n: apps.length })) + "</p>";
  }
  function gatesHTML() {
    var counts = {};
    state.rows.filter(function (r) { return r.gated; }).forEach(function (r) { var k = r.gate.replace(/^fail:?/, "") || "other"; counts[k] = (counts[k] || 0) + 1; });
    var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
    if (!keys.length) return '<p class="empty">' + esc(tl("none")) + "</p>";
    var top = counts[keys[0]];
    return '<div class="bars">' + keys.map(function (k) { return '<div class="b-row"><span class="b-label">' + esc(k) + '</span><span class="b-track"><i style="width:' + (100 * counts[k] / top) + '%"></i></span><span class="b-val">' + counts[k] + "</span></div>"; }).join("") + "</div>";
  }
  function sourcesHTML() {
    var by = {};
    state.rows.filter(function (r) { return r.applied; }).forEach(function (r) { var s = r.source || "unknown"; by[s] = by[s] || { a: 0, h: 0, i: 0 }; by[s].a++; if (r.outcome && r.outcome !== "no-response") by[s].h++; if (r.stateKey === "interview") by[s].i++; });
    var keys = Object.keys(by).sort(function (a, b) { return by[b].a - by[a].a; });
    if (!keys.length) return '<p class="empty">' + esc(tl("noapps")) + "</p>";
    var top = by[keys[0]].a;
    return '<div class="bars">' + keys.map(function (k) { var v = by[k]; return '<div class="b-row"><span class="b-label">' + esc(k) + '</span><span class="b-track"><i style="width:' + (100 * v.a / top) + '%"></i></span><span class="b-val">' + v.a + " / " + v.h + " / " + v.i + "</span></div>"; }).join("") + "</div>";
  }
  function waitingHTML() {
    var list = state.rows.filter(function (r) { return r.stateKey === "waiting" && r.dApplied; }).map(function (r) { return { r: r, d: days(r.dApplied, state.ref) }; }).filter(function (x) { return x.d >= 14; }).sort(function (a, b) { return b.d - a.d; });
    return list.length ? '<ul class="waiting">' + list.map(function (x) {
      return '<li><span class="d num">' + x.d + "<small>" + esc(tl("wait.days")) + "</small></span><span>" + esc(x.r.company) + ' <span class="fit-role">' + esc(x.r.role) + "</span></span>" + (x.d >= 30 ? '<span class="tag accent">' + esc(tl("wait.follow")) + "</span>" : '<span class="tag">14+</span>') + "</li>";
    }).join("") + "</ul>" : '<p class="empty">' + esc(tl("wait.none")) + "</p>";
  }


  /* ---------- Follow-ups ---------- */
  function lastSent(r) {
    var m, last = null, re = /\[(\d{4}-\d{2}-\d{2})\] Follow-up sent/g;
    while ((m = re.exec(r.raw.notes || ""))) last = m[1];
    return last ? toDate(last) : null;
  }
  function followList() {
    var out = [];
    state.rows.forEach(function (r, i) {
      if (r.stateKey === "waiting" && r.dApplied) { var d = days(r.dApplied, state.ref); if (d >= 21) out.push({ r: r, i: i, d: d }); }
    });
    return out.sort(function (a, b) { return b.d - a.d; });
  }
  var FU = {
    en: {
      check: "Hello,\n\nI applied for the {role} role at {co} on {date} and wanted to check where things stand. I am still interested and happy to send anything else you need.\n\nThank you for your time.\n\n{sig}",
      close: "Hello,\n\nI applied for the {role} role at {co} on {date} and have not heard back. If the role is still open, I would be glad to hear where it stands. If it has been filled, no problem, and thank you for considering me.\n\n{sig}"
    },
    es: {
      check: "Hola,\n\nMe presenté al puesto de {role} en {co} el {date} y quería saber cómo va el proceso. Mantengo mi interés y puedo enviar lo que necesitéis.\n\nGracias por tu tiempo.\n\n{sig}",
      close: "Hola,\n\nMe presenté al puesto de {role} en {co} el {date} y no he recibido respuesta. Si la vacante sigue abierta, me gustaría saber en qué punto está. Si ya está cubierta, sin problema, y gracias por tener en cuenta mi candidatura.\n\n{sig}"
    }
  };
  function fuMe() { var n = fetchStore("jo.me.name") || "", l = fetchStore("jo.me.link") || ""; return { name: n, link: l }; }
  function fuDraft(r, lang, tone) {
    var me = fuMe(), d = r.dApplied;
    var date = d.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long" });
    var sig = me.name || I["fu.ph.name"][lang === "es" ? 1 : 0];
    if (me.link) sig += "\n" + I["fu.link.line"][lang === "es" ? 1 : 0] + me.link;
    return FU[lang][tone].split("{role}").join(r.role || "").split("{co}").join(r.company || "").split("{date}").join(date).split("{sig}").join(sig);
  }
  function fuCurrent() {
    var f = state.fu, x = state.rows[f.open]; if (!x) return null;
    var d = days(x.dApplied, state.ref);
    return { r: x, lang: f.lang || state.lang, tone: f.tone || (d >= 45 ? "close" : "check") };
  }
  function fuRefill() {
    var c = fuCurrent(); if (!c) return;
    state.fu.text = fuDraft(c.r, c.lang, c.tone); state.fu.edited = false;
  }
  function viewFollowups() {
    var list = followList();
    var h = '<p class="muted" style="max-width:62ch;margin-bottom:18px">' + esc(tl("fu.intro")) + "</p>";
    if (!list.length) return h + '<section class="card"><p class="empty">' + esc(tl("fu.none")) + "</p></section>";
    h += '<div class="fu-list">' + list.map(function (x) {
      var open = state.fu.open === x.i, sent = lastSent(x.r), tag = "";
      if (sent) { var n = days(sent, state.ref); tag = '<span class="tag calm">' + esc(n <= 0 ? tl("fu.agotoday") : t("fu.ago", { n: n })) + "</span>"; }
      var row = '<div class="fu-row"><span class="d num">' + x.d + "<small>" + esc(tl("fu.days")) + "</small></span><span class=\"fu-who\">" + esc(x.r.company) + ' <span class="fit-role">' + esc(x.r.role) + "</span></span>" + tag +
        '<button class="btn ' + (open ? "ghost" : "") + '" type="button" data-act="' + (open ? "fu-close" : "fu-open") + '" data-i="' + x.i + '">' + esc(tl(open ? "fu.hide" : "fu.draft")) + "</button></div>";
      return '<section class="card fu">' + row + (open ? fuPanel(x) : "") + "</section>";
    }).join("") + "</div>";
    return h + '<p class="steady wit" style="margin:18px 0 0;padding:16px 20px">' + esc(tl("fu.wit")) + "</p>";
  }
  function fuPanel(x) {
    var c = fuCurrent(), me = fuMe();
    var seg = function (act, cur, opts) {
      return '<div class="seg" role="group">' + opts.map(function (o) { return '<button type="button" data-act="' + act + '" data-v="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + esc(o[1]) + "</button>"; }).join("") + "</div>";
    };
    return '<div class="fu-panel"><div class="fu-controls"><div><span class="label">' + esc(tl("fu.lang")) + "</span>" + seg("fu-lang", c.lang, [["en", "EN"], ["es", "ES"]]) + '</div><div><span class="label">' + esc(tl("fu.tone")) + "</span>" +
      seg("fu-tone", c.tone, [["check", tl("fu.t.check")], ["close", tl("fu.t.close")]]) + "</div></div>" +
      '<div class="fu-me"><label><span class="label">' + esc(tl("fu.name")) + '</span><input id="fuName" type="text" value="' + esc(me.name) + '" autocomplete="name"></label><label><span class="label">' + esc(tl("fu.link")) + '</span><input id="fuLink" type="url" value="' + esc(me.link) + '" placeholder="https://"></label></div>' +
      '<label><span class="label">' + esc(tl("fu.draftlabel")) + '</span><textarea id="fuText" rows="9">' + esc(state.fu.text) + '</textarea></label>' +
      '<div class="fu-actions"><button class="btn accent" type="button" data-act="fu-copy">' + esc(tl("fu.copy")) + '</button><button class="btn" type="button" data-act="fu-sent" data-i="' + x.i + '">' + esc(tl("fu.sent")) + '</button><button class="btn ghost" type="button" data-act="fu-noreply" data-i="' + x.i + '">' + esc(tl("fu.noreply")) + "</button></div></div>";
  }
  function fuCopy() {
    var txt = $("#fuText") ? $("#fuText").value : state.fu.text;
    var done = function () { toast(tl("fu.copied")); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(done, function () { fuCopyOld(txt); done(); }); }
    else { fuCopyOld(txt); done(); }
  }
  function fuCopyOld(txt) { var ta = $("#fuText"); if (ta) { ta.focus(); ta.select(); try { document.execCommand("copy"); } catch (e) { /* ignore */ } } }

  /* ---------- Craft ---------- */
  function craftGroups(by) {
    var g = {}, untagged = 0;
    state.rows.forEach(function (r) {
      if (!r.applied) return;
      var v = (r.raw[by] || "").trim();
      if (!v) { untagged++; return; }
      var o = g[v] || (g[v] = { v: v, n: 0, heard: 0, inter: 0, young: 0 });
      o.n++;
      var replied = r.outcome && r.outcome !== "no-response";
      if (replied) o.heard++;
      else if (!r.outcome && r.dApplied && days(r.dApplied, state.ref) < 21) o.young++;
      if (r.stateKey === "interview") o.inter++;
    });
    var list = Object.keys(g).map(function (k) { return g[k]; }).sort(function (a, b) { return b.n - a.n; });
    return { list: list, untagged: untagged };
  }
  function craftCandidates() {
    var out = [];
    state.rows.forEach(function (r, i) { if (!r.gated && !r.applied && !r.outcome && r.raw.status !== "skipped" && r.company) out.push({ r: r, i: i }); });
    return out.slice(-30).reverse();
  }
  function craftPrompt(k) {
    if (k === "cv") return tl("craft.t.cv");
    if (k === "pf") return tl("craft.t.pf");
    var c = state.rows[state.craft.pick];
    return t("craft.t.tune", { co: c ? c.company : "[company]", role: c ? c.role : "[role]" });
  }
  function viewCraft() {
    var by = state.craft.by, G = craftGroups(by);
    var h = '<p class="muted" style="max-width:66ch;margin-bottom:18px">' + esc(tl("craft.intro")) + "</p>";
    var seg = '<div class="seg" role="group" aria-label="' + esc(tl("craft.by")) + '">' + [["cv_version", "craft.by.cv"], ["portfolio_lead", "craft.by.pf"]].map(function (o) {
      return '<button type="button" data-act="craft-by" data-v="' + o[0] + '" aria-pressed="' + (by === o[0]) + '">' + esc(tl(o[1])) + "</button>";
    }).join("") + "</div>";
    var body;
    if (!G.list.length) body = '<p class="empty">' + esc(tl("craft.none")) + "</p>";
    else {
      body = '<div class="table-wrap"><table class="craft-table"><thead><tr><th>' + esc(tl("craft.th.v")) + '</th><th class="num">' + esc(tl("craft.th.n")) + '</th><th class="num">' + esc(tl("craft.th.w")) + '</th><th class="num">' + esc(tl("craft.th.r")) + '</th><th class="num">' + esc(tl("craft.th.i")) + "</th><th>" + esc(tl("craft.th.rate")) + "</th></tr></thead><tbody>" +
        G.list.map(function (o) {
          var rated = o.n - o.young, w = wilson(o.heard, rated), few = rated < 10;
          var rate = rated ? Math.round(100 * o.heard / rated) : 0;
          return "<tr><td>" + esc(o.v) + '</td><td class="num">' + o.n + '</td><td class="num">' + o.young + '</td><td class="num">' + o.heard + '</td><td class="num">' + o.inter + '</td><td><div class="rate"><span class="bar"><i style="width:' + rate + '%"></i></span><span class="num">' + rate + '%</span>' +
            (few ? '<span class="tag">' + esc(tl("craft.few")) + "</span>" : '<small class="muted">' + esc(t("craft.range", { a: Math.round(w[0] * 100) + "%", b: Math.round(w[1] * 100) + "%" })) + "</small>") + "</div></td></tr>";
        }).join("") + "</tbody></table></div>";
    }
    h += '<section class="card"><div class="card-head row-head"><h2>' + esc(tl(by === "cv_version" ? "craft.by.cv" : "craft.by.pf")) + "</h2>" + seg + "</div>" + body +
      (G.untagged && G.list.length ? '<p class="muted" style="margin-top:14px">' + esc(t("craft.untagged", { n: G.untagged })) + "</p>" : "") +
      '<p class="muted small-note">' + esc(tl("craft.caveat")) + "</p></section>";
    var cand = craftCandidates();
    var opts = '<option value="-1">' + esc(tl("craft.p.nopick")) + "</option>" + cand.map(function (c) { return '<option value="' + c.i + '"' + (state.craft.pick === c.i ? " selected" : "") + ">" + esc(c.r.company + " · " + c.r.role) + "</option>"; }).join("");
    var card = function (k, extra) {
      return '<div class="craft-prompt"><h3>' + esc(tl("craft.p." + k)) + "</h3>" + (extra || "") + '<div class="prompt-text" id="craftText-' + k + '">' + esc(craftPrompt(k)) + '</div><button class="btn" type="button" data-act="craft-copy" data-k="' + k + '">' + esc(tl("craft.copy")) + "</button></div>";
    };
    var pick = '<label class="craft-pick"><span class="label">' + esc(tl("craft.p.pick")) + '</span><select id="craftPick">' + opts + "</select></label>";
    h += '<section class="card" style="margin-top:16px"><div class="card-head"><h2>' + esc(tl("craft.ask")) + "</h2><p>" + esc(tl("craft.ask.s")) + '</p></div><div class="craft-grid">' + card("cv") + card("pf") + card("tune", pick) + "</div></section>";
    return h;
  }
  function craftCopy(k) {
    var txt = craftPrompt(k);
    var done = function () { toast(tl("craft.copied")); };
    var old = function () { var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) { /* ignore */ } ta.remove(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { old(); done(); }); else { old(); done(); }
  }

  /* ---------- Tracker ---------- */
  var CHIPS = [["all", "ch.all"], ["applied", "ch.applied"], ["waiting", "ch.waiting"], ["interview", "ch.interview"], ["rejected", "ch.rejected"], ["silent", "ch.silent"], ["gated", "ch.gated"]];
  function viewTracker() {
    var th = [["date_found", "th.found"], ["company", "th.company"], ["role", "th.role"], ["source", "th.source"], ["score", "th.score", "num"], ["state", "th.state"]];
    return '<section class="card"><div class="controls"><div class="chips" role="group" aria-label="Filter">' + CHIPS.map(function (c) {
      return '<button class="chip" type="button" data-act="filter" data-f="' + c[0] + '" aria-pressed="' + (state.filter === c[0]) + '">' + esc(tl(c[1])) + "</button>";
    }).join("") + '</div><input type="search" id="q" placeholder="' + esc(tl("search")) + '" aria-label="' + esc(tl("search")) + '" value="' + esc(state.q) + '"></div><p class="muted" id="count" style="margin-bottom:10px"></p><div class="table-wrap"><table id="table"><thead><tr>' +
      th.map(function (h) { return '<th data-act="sort" data-sort="' + h[0] + '" tabindex="0" class="' + (h[2] || "") + '"' + (state.sortKey === h[0] ? ' aria-sort="' + (state.sortDir > 0 ? "ascending" : "descending") + '"' : "") + ">" + esc(tl(h[1])) + "</th>"; }).join("") + '<th aria-label="' + esc(tl("btn.edit")) + '"></th></tr></thead><tbody id="tbody"></tbody></table></div></section>';
  }
  function visibleRows() {
    var q = state.q.toLowerCase();
    var rows = state.rows.filter(function (r) {
      if (state.filter === "applied" && !r.applied) return false;
      if (state.filter !== "all" && state.filter !== "applied" && r.stateKey !== state.filter) return false;
      if (q && (r.company + " " + r.role + " " + (r.notes || "") + " " + (r.source || "")).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var k = state.sortKey, dir = state.sortDir;
    rows.sort(function (a, b) {
      var va, vb;
      if (k === "score") { va = a.score == null ? -1 : a.score; vb = b.score == null ? -1 : b.score; }
      else if (k === "date_found") { va = a.dFound ? a.dFound.getTime() : 0; vb = b.dFound ? b.dFound.getTime() : 0; }
      else if (k === "state") { va = a.stateText; vb = b.stateText; }
      else { va = (a[k] || "").toLowerCase(); vb = (b[k] || "").toLowerCase(); }
      return (va < vb ? -1 : va > vb ? 1 : 0) * dir;
    });
    return rows;
  }
  function renderTableBody() {
    var rows = visibleRows();
    $("#count").textContent = t("count", { a: rows.length, b: state.rows.length });
    $("#tbody").innerHTML = rows.map(function (r) {
      return '<tr class="row"><td class="date">' + esc(r.date_found) + "</td><td>" + esc(r.company) + '</td><td class="muted">' + esc(r.role) + '</td><td class="muted">' + esc(r.source) + '</td><td class="num score num">' + (r.score != null ? r.score.toFixed(1) : "") + "</td><td>" + tagFor(r) + '</td><td><button type="button" class="edit" data-act="edit" data-i="' + state.rows.indexOf(r) + '" aria-label="' + esc(tl("btn.edit") + " " + r.company) + '">' + esc(tl("btn.edit")) + "</button></td></tr>";
    }).join("") || '<tr><td colspan="7" class="empty">' + esc(tl("nomatch")) + "</td></tr>";
  }

  /* ---------- Steady ---------- */
  function steadyCardFor(r, extra) {
    var s = stats(), n = s.applied.length, k = s.inter.length, p = n ? Math.round(100 * (n - k) / n) : 0;
    var lines = I.wit[state.lang === "es" ? 1 : 0], h = 0, name = r.company || "";
    for (var i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % 997;
    var wit = r.outcome === "rejected-auto" ? tl("wit.auto") : lines[h % lines.length];
    var loc = state.lang === "es" ? "es-ES" : "en-GB", fd = function (d) { return d.toLocaleDateString(loc, { day: "numeric", month: "short" }); }, trail = "", when = "";
    if (r.dApplied && r.dOutcome && r.dOutcome >= r.dApplied) { var nd = Math.round((r.dOutcome - r.dApplied) / 86400000); when = '<span class="when">' + esc(t("steady.days", { n: nd })) + "</span>"; trail = '<div class="trail"><div><b>' + esc(tl("steady.applied")) + "</b>" + esc(fd(r.dApplied)) + "</div><div><b>" + esc(tl("steady.closedOn")) + "</b>" + esc(fd(r.dOutcome)) + "</div></div>"; }
    return '<section class="steady"><span class="label k">' + esc(tl("steady.reject")) + "</span>" + when + trail + '<p class="big">' + esc(t("steady.big", { p: p })) + "</p><p>" + esc(t("steady.body", { k: k, n: n, co: r.company, role: r.role })) + '</p><div class="row"><span class="label">' + esc(tl("steady.hands")) + "</span><p>" + esc(tl("steady.hands.t")) + '</p></div><div class="row"><span class="label">' + esc(tl("steady.not")) + "</span><p>" + esc(tl("steady.not.t")) + '</p></div><p class="wit">' + esc(wit) + "</p>" + (extra || "") + "</section>";
  }
  function lastRejection() {
    return state.rows.filter(function (r) { return r.stateKey === "rejected" && r.outcome.indexOf("rejected") === 0; }).sort(function (a, b) { return (b.dOutcome ? b.dOutcome.getTime() : 0) - (a.dOutcome ? a.dOutcome.getTime() : 0); })[0];
  }
  function appliedOn(iso) { return state.rows.filter(function (r) { return r.applied && r.raw.date_applied === iso; }).length; }
  function viewSteady() {
    var s = stats(), last = lastRejection(), a = appliedOn(todayISO()), L = state.limit, dots = "";
    for (var i = 0; i < L; i++) dots += "<i" + (i < a ? ' class="on"' : "") + "></i>";
    var msg = a === 0 ? tl("pace.msg0") : a >= L ? t("pace.full", { a: a }) : t("pace.msg", { a: a, l: L });
    var h = '<div class="grid12"><div class="c7">' + (last ? steadyCardFor(last) : '<section class="card"><p class="muted">' + esc(tl("last.none")) + "</p></section>") + "</div>";
    h += '<div class="c5">' + oddsCard(s) + "</div>";
    h += '<section class="card c6"><span class="label" style="color:var(--calm)">' + esc(tl("pace.s")) + '</span><div class="card-head" style="margin:6px 0 0"><h2>' + esc(tl("pace.k")) + '</h2></div><div class="dots" role="img" aria-label="' + a + " / " + L + '">' + dots + "</div><p>" + esc(msg) + '</p><p class="caveat">' + esc(tl("pace.note")) + "</p></section>";
    h += '<section class="card c6"><span class="label" style="color:var(--calm)">' + esc(tl("tag.soon")) + '</span><div class="card-head" style="margin:6px 0 0"><h2>' + esc(tl("conf.k")) + "</h2></div><p class=\"muted\">" + esc(tl("conf.t")) + "</p>" + winsHTML() + "</section></div>";
    return h;
  }


  /* ---------- Proposed updates ---------- */
  var OUT_KEY = { "rejected": "st.rejected", "rejected-auto": "st.auto", "interview": "st.interview", "offer": "st.offer", "withdrawn": "st.withdrawn", "no-response": "st.silent" };
  function normName(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  function matchRow(p) {
    var c = normName(p.company), pr = normName(p.role), best = -1, score = -1;
    state.rows.forEach(function (r, i) {
      if (normName(r.company) !== c) return;
      var s = 0;
      if (r.applied) s += 2;
      if (r.applied && !r.outcome) s += 2;
      if (pr && normName(r.role) === pr) s += 5;
      else if (pr && (normName(r.role).indexOf(pr) >= 0 || pr.indexOf(normName(r.role)) >= 0)) s += 3;
      if (s > score) { score = s; best = i; }
    });
    return best;
  }
  function loadProps(text) {
    var keep = state.head.slice(), raw = parseCSV(text);
    state.head = keep;
    state.props = raw.filter(function (r) { return r.company; }).map(function (r, i) {
      var p = { id: i, kind: (r.kind || r.type || "outcome").toLowerCase(), company: r.company, role: r.role || "", outcome: (r.outcome || "").toLowerCase(), date: r.date || "", evidence: r.evidence || "", source: r.source || "email", status: "pending" };
      if (p.kind === "update") p.kind = "outcome";
      if (p.kind === "fit") {
        p.dims = [r.domain, r.skill, r.level, r.evidence, r.terms].map(function (x) { return parseFloat(x); });
        p.bad = p.dims.some(function (x) { return isNaN(x) || x < 1 || x > 5; });
        p.reason = r.reason || ""; p.evidence = p.reason;
      }
      p.match = p.kind === "applied" ? -1 : matchRow(p);
      return p;
    });
    render();
  }
  function viewInbox() {
    var list = state.props, pend = list.filter(function (p) { return p.status === "pending"; });
    if (!list.length) return '<p class="muted" style="margin:0 0 18px">' + esc(tl("inbox.lede")) + '</p><div class="card"><p class="empty">' + esc(tl("inbox.empty")) + "</p></div>";
    var acc = list.filter(function (p) { return p.status === "accepted"; }).length, sk = list.filter(function (p) { return p.status === "skipped"; }).length;
    var h = '<p class="muted" style="margin:0 0 18px">' + esc(tl("inbox.lede")) + '</p><div class="controls"><span class="tag accent">' + esc(t("inbox.pending", { n: pend.length })) + "</span>" + (acc + sk ? '<span class="muted">' + esc(t("inbox.done", { a: acc, s: sk })) + "</span>" : "") + (pend.some(function (p) { return (p.match >= 0 || p.kind === "applied") && !p.bad; }) ? '<button class="btn" type="button" data-act="prop-acceptall">' + esc(tl("inbox.acceptall")) + "</button>" : "") + '</div><div class="prop-list">';
    list.forEach(function (p) {
      var row = p.match >= 0 ? state.rows[p.match] : null, change;
      var dimsHTML = "";
      if (p.kind === "fit") {
        var okd = !p.bad, avg = okd ? p.dims.reduce(function (a, b) { return a + b; }, 0) / 5 : 0;
        change = tl("inbox.fit") + (okd ? ": " + t("inbox.fitavg", { a: fmt(avg) }) : "") + (row && row.score != null ? " · " + t("inbox.fitnow", { s: row.score.toFixed(1) }) : "");
        if (okd) dimsHTML = '<ul class="dim-list">' + DIMS.map(function (d, k) { return "<li><span>" + esc(tl(DIM_KEY[d])) + '</span><span class="dim-bar"><i style="width:' + (p.dims[k] * 20) + '%"></i></span><b>' + p.dims[k] + "</b></li>"; }).join("") + "</ul>" + (row && row.dims ? '<p class="caveat">' + esc(tl("inbox.fitrep")) + "</p>" : "");
      } else if (p.kind === "applied") change = tl("inbox.newapp") + ": " + p.role + (p.date ? ", " + p.date : "");
      else change = (row ? row.stateText : "?") + " → " + tl(OUT_KEY[p.outcome] || "st.other") + (p.date ? ", " + p.date : "");
      var ok = p.kind === "applied" || (row && !p.bad), done = p.status !== "pending";
      h += '<article class="card prop' + (done ? " done" : "") + '"><div class="prop-head"><div><h3>' + esc(p.company) + '</h3><p class="fit-role">' + esc(row ? row.role : p.role) + "</p></div>" +
        (done ? '<span class="tag ' + (p.status === "accepted" ? "calm" : "") + '">' + esc(tl(p.status === "accepted" ? "inbox.accepted" : "inbox.skipped")) + "</span>" : "") + "</div>" +
        '<p class="label">' + esc(tl("inbox.change")) + '</p><p class="prop-change">' + esc(change) + "</p>" + dimsHTML +
        (p.evidence ? '<p class="label">' + esc(p.kind === "fit" ? tl("inbox.fitwhy") : tl("inbox.evidence")) + " · " + esc(tl("inbox.from")) + " " + esc(p.source) + '</p><blockquote>' + esc(p.evidence) + "</blockquote>" : "") +
        (!ok ? '<p class="caveat">' + esc(p.bad ? tl("inbox.fitbad") : tl("inbox.nomatch")) + "</p>" : "") +
        (done ? "" : '<div class="wiz-nav"><button class="btn ghost" type="button" data-act="prop-skip" data-i="' + p.id + '">' + esc(tl("inbox.skip")) + "</button>" + (ok ? '<button class="btn accent" type="button" data-act="prop-accept" data-i="' + p.id + '">' + esc(tl("inbox.accept")) + "</button>" : "") + "</div>") + "</article>";
    });
    return h + "</div>";
  }
  function applyProp(p) {
    var date = p.date || todayISO();
    if (p.kind === "fit") {
      var fr = state.rows[p.match]; if (!fr || p.bad) return false;
      var fw = fr.raw; DIMS.forEach(function (d, k) { fw[d] = String(p.dims[k]); });
      if (!fw.score) fw.score = String(Math.round(p.dims.reduce(function (a, b) { return a + b; }, 0) / 5 * 2) / 2);
      state.rows[p.match] = normalise(fw); if (state.selected === fr) state.selected = state.rows[p.match];
      p.status = "accepted"; state.dirty = true; return true;
    }
    if (p.kind === "applied") {
      var raw = {}; state.head.forEach(function (h) { raw[h] = ""; });
      raw.date_found = date; raw.company = p.company; raw.role = p.role; raw.source = p.source || "email"; raw.gate_result = "pass"; raw.status = "applied"; raw.date_applied = date;
      state.rows.push(normalise(raw));
    } else {
      var row = state.rows[p.match]; if (!row) return false;
      var rw = row.raw; rw.outcome = p.outcome; rw.date_outcome = p.outcome === "no-response" ? "" : date; if (!rw.status) rw.status = "applied";
      state.rows[p.match] = normalise(rw);
      if (state.selected === row) state.selected = state.rows[p.match];
    }
    p.status = "accepted"; state.dirty = true; return true;
  }


  /* ---------- Weekly review ---------- */
  var FOCI = ["apply", "follow", "craft", "rest"];
  function getReviews() { try { return JSON.parse(fetchStore("jo.reviews") || "[]") || []; } catch (e) { return []; } }
  function winsHTML() {
    var w = getReviews().filter(function (r) { return r.win; }).slice(-3).reverse();
    return '<p class="label" style="margin-top:16px">' + esc(tl("rev.wins")) + "</p>" + (w.length ? '<ul class="review">' + w.map(function (r) { return "<li><span class=\"label\">" + esc(r.date) + "</span><span>" + esc(r.win) + "</span></li>"; }).join("") + "</ul>" : '<p class="muted">' + esc(tl("rev.wins.none")) + "</p>");
  }
  function day0(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function weekStats() {
    var end = day0(state.ref), s1 = new Date(end.getTime() - 6 * 86400000), p1 = new Date(end.getTime() - 13 * 86400000), p2 = new Date(end.getTime() - 7 * 86400000);
    function inR(d, a, b) { return d && d >= a && d <= b; }
    function cnt(a, b) {
      var o = { applied: 0, replies: 0, rej: 0, int: 0 };
      state.rows.forEach(function (r) {
        if (inR(r.dApplied, a, b)) o.applied++;
        if (inR(r.dOutcome, a, b) && r.outcome && r.outcome !== "no-response") { o.replies++; if (r.outcome.indexOf("rejected") === 0) o.rej++; if (r.outcome === "interview" || r.outcome === "offer") o.int++; }
      });
      return o;
    }
    return { cur: cnt(s1, end), prev: cnt(p1, p2) };
  }
  function viewReview() {
    var w = state.rev;
    if (!w) {
      var last = getReviews().slice(-1)[0];
      return '<div class="wiz-wrap"><div class="wiz"><span class="label">' + esc(tl("nav.review")) + "</span><h2>" + esc(tl("title.review")) + '</h2><p class="hint">' + esc(tl("rev.lede")) + "</p>" +
        (last ? '<p class="muted">' + esc(t("rev.last", { d: last.date, f: tl("rev.f." + last.focus) })) + "</p>" : "") +
        '<div class="wiz-nav"><span></span><button class="btn accent" type="button" data-act="rev-start">' + esc(tl("rev.start")) + "</button></div></div></div>";
    }
    var h = '<div class="wiz-wrap"><div class="wiz" role="group" aria-live="polite">';
    if (w.done) {
      var f = w.data.focus;
      return h + '<span class="label">' + esc(tl("rev.done")) + "</span><h2>" + esc(t("rev.next", { f: tl("rev.f." + f).toLowerCase() })) + '</h2><section class="steady"><span class="label k">' + esc(tl("steady.k")) + '</span><p class="big">' + esc(tl("rev.line." + f)) + "</p>" +
        (w.data.win ? '<p class="wit">' + esc(w.data.win) + "</p>" : "") + '</section><div class="wiz-nav"><button class="btn ghost" type="button" data-act="rev-again">' + esc(tl("btn.close")) + '</button><a class="btn" href="#overview">' + esc(tl("nav.overview")) + "</a></div></div></div>";
    }
    var n = 4, i = w.step;
    h += '<div class="prog" role="img" aria-label="' + esc(t("step.of", { a: i + 1, b: n })) + '">' + [0, 1, 2, 3].map(function (k) { return "<i" + (k <= i ? ' class="on"' : "") + "></i>"; }).join("") + "</div>";
    h += '<span class="label">' + esc(t("step.of", { a: i + 1, b: n })) + "</span><h2>" + esc(tl("rev.q" + (i + 1))) + "</h2>";
    if (i === 0) {
      var ws = weekStats(), c = ws.cur, p = ws.prev;
      h += '<p class="hint">' + esc(tl("rev.h1")) + '</p><ul class="review">' + [["rev.applied", "applied"], ["rev.replies", "replies"], ["rev.rej", "rej"], ["rev.int", "int"]].map(function (x) {
        return "<li><span class=\"label\">" + esc(tl(x[0])) + "</span><span><b>" + c[x[1]] + "</b> · " + esc(t("rev.prev", { n: p[x[1]] })) + "</span></li>";
      }).join("") + '</ul><p class="steady wit" style="margin:18px 0 0;padding:16px 20px">' + esc(c.applied === 0 ? tl("rev.wit0") : t("rev.wit1", { a: c.applied, r: c.replies })) + "</p>";
    } else if (i === 1) {
      var wait = state.rows.filter(function (r) { return r.stateKey === "waiting" && r.dApplied; }).map(function (r) { return { r: r, d: days(r.dApplied, state.ref) }; });
      var fresh = wait.filter(function (x) { return x.d < 14; }).length, mid = wait.filter(function (x) { return x.d >= 14 && x.d < 30; }).length, old = wait.filter(function (x) { return x.d >= 30; }).sort(function (a, b) { return b.d - a.d; });
      h += '<p class="hint">' + esc(tl("rev.h2")) + '</p><p class="muted" style="margin:0 0 12px">' + esc(t("rev.fresh", { n: fresh })) + " " + esc(t("rev.midn", { n: mid })) + "</p>";
      h += old.length ? '<ul class="waiting" style="max-height:340px">' + old.slice(0, 40).map(function (x) {
        return '<li><span class="d num">' + x.d + "<small>" + esc(tl("wait.days")) + "</small></span><span>" + esc(x.r.company) + ' <span class="fit-role">' + esc(x.r.role) + '</span></span><button type="button" class="btn ghost" data-act="rev-close" data-i="' + state.rows.indexOf(x.r) + '">' + esc(tl("rev.close")) + "</button></li>";
      }).join("") + "</ul>" : '<p class="empty">' + esc(tl("rev.none30")) + "</p>";
    } else if (i === 2) {
      h += '<p class="hint">' + esc(tl("rev.h3")) + '</p><textarea class="big-input" id="revIn" rows="3">' + esc(w.data.win || "") + "</textarea>";
    } else {
      h += '<p class="hint"></p><div class="opts">' + FOCI.map(function (f) {
        return '<button class="opt" type="button" data-act="rev-focus" data-v="' + f + '" aria-pressed="' + (w.data.focus === f) + '"><strong>' + esc(tl("rev.f." + f)) + "</strong><small>" + esc(tl("rev.f." + f + ".d")) + "</small></button>";
      }).join("") + "</div>";
    }
    h += '<div class="wiz-nav"><button class="btn ghost" type="button" data-act="rev-back">' + esc(i === 0 ? tl("btn.cancel") : tl("btn.back")) + "</button>" + (i < 3 ? '<button class="btn" type="button" data-act="rev-next">' + esc(i === 2 && !w.data.win ? tl("btn.skip") : tl("btn.continue")) + "</button>" : "") + "</div></div></div>";
    return h;
  }
  function revCapture() { var el = $("#revIn"); if (el && state.rev) state.rev.data.win = el.value.trim(); }
  function revFinish() {
    var d = state.rev.data, list = getReviews();
    list.push({ date: todayISO(), focus: d.focus, win: d.win || "" });
    store("jo.reviews", JSON.stringify(list.slice(-60)));
    state.rev.done = true; render();
  }

  /* ---------- Soon ---------- */
  function viewSoon(v) {
    return '<div class="card soon"><span class="tag">' + esc(tl("soon.status")) + " · " + esc(tl("soon.phase")) + " " + PHASE[v] + '</span><h2>' + esc(tl("nav." + v)) + '</h2><p class="lede">' + esc(tl("soon." + v + ".l")) + "</p><ul>" + I["soon." + v + ".b"][state.lang === "es" ? 1 : 0].map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></div>";
  }

  /* ---------- Step forms ---------- */
  var O = [["rejected", "o.rejected"], ["auto", "o.auto"], ["interview", "o.interview"], ["offer", "o.offer"], ["silent", "o.silent"], ["withdrawn", "o.withdrawn"]];
  var STAGE = [["recruiter", "stg.recruiter"], ["manager", "stg.manager"], ["exercise", "stg.exercise"], ["panel", "stg.panel"], ["final", "stg.final"], ["other", "stg.other"]];
  var FLOWS = {
    reply: { steps: [
      { key: "row", type: "pick", q: "q.which", h: "h.which" },
      { key: "reply", type: "choice", q: "q.reply", opts: O.map(function (o) { return [o[0], o[1], o[1] + ".d"]; }) },
      { key: "date", type: "date", q: "q.when", h: "h.when" },
      { key: "note", type: "text", q: "q.note", h: "h.note", optional: true, long: true }] },
    apply: { steps: [
      { key: "company", type: "text", q: "q.company", required: true },
      { key: "role", type: "text", q: "q.role", required: true },
      { key: "source", type: "choice", q: "q.source", two: true, opts: SOURCES.map(function (s) { return [s, null]; }) },
      { key: "date", type: "date", q: "q.applied", h: "h.when" },
      { key: "score", type: "choice", q: "q.score", h: "h.score", two: true, optional: true, opts: [["1"], ["2"], ["3"], ["4"], ["5"]].map(function (s) { return [s[0], null]; }) },
      { key: "note", type: "text", q: "q.note", h: "h.note", optional: true, long: true }] },
    interview: { steps: [
      { key: "row", type: "pick", q: "q.which", h: "h.which" },
      { key: "stage", type: "choice", q: "q.stage", two: true, opts: STAGE.map(function (o) { return [o[0], o[1]]; }) },
      { key: "date", type: "date", q: "q.date.int", h: "h.when" },
      { key: "note", type: "text", q: "q.note.int", h: "h.note.int", optional: true, long: true }] }
  };
  function optLabel(o) { return o[1] ? tl(o[1]) : o[0]; }
  function viewLog() {
    var w = state.wiz;
    if (!w) return '<p class="muted" style="margin:0 0 18px">' + esc(tl("log.lede")) + '</p><div class="start-grid">' + ["reply", "apply", "interview"].map(function (f) {
      return '<button class="start" type="button" data-act="wiz-start" data-flow="' + f + '"><h3>' + esc(tl("flow." + f)) + "</h3><p>" + esc(tl("flow." + f + ".d")) + "</p></button>";
    }).join("") + "</div>";
    if (w.done) return '<div class="wiz-wrap"><div class="wiz"><span class="label">' + esc(tl("done.sub")) + "</span><h2>" + esc(tl("done.title")) + "</h2>" + (w.steady ? w.steady : "") + '<div class="wiz-nav"><button class="btn ghost" type="button" data-act="wiz-again">' + esc(tl("btn.another")) + '</button><a class="btn" href="#tracker">' + esc(tl("btn.totracker")) + "</a></div></div></div>";
    var steps = FLOWS[w.flow].steps, n = steps.length, i = w.step, h = '<div class="wiz-wrap"><div class="wiz" role="group" aria-live="polite">';
    h += '<div class="prog" role="img" aria-label="' + esc(t("step.of", { a: Math.min(i + 1, n + 1), b: n + 1 })) + '">' + steps.concat([0]).map(function (_, k) { return "<i" + (k <= i ? ' class="on"' : "") + "></i>"; }).join("") + "</div>";
    h += '<span class="label">' + esc(i >= n ? tl("step.review") : t("step.of", { a: i + 1, b: n + 1 })) + "</span>";
    if (i >= n) {
      h += "<h2>" + esc(tl("step.review")) + '</h2><ul class="review">' + reviewItems(w).map(function (x) { return "<li><span class=\"label\">" + esc(x[0]) + "</span><span>" + esc(x[1]) + "</span></li>"; }).join("") + "</ul>";
      h += '<div class="wiz-nav"><button class="btn ghost" type="button" data-act="wiz-back">' + esc(tl("btn.back")) + '</button><button class="btn accent" type="button" data-act="wiz-save">' + esc(tl("btn.save")) + "</button></div></div></div>";
      return h;
    }
    var st = steps[i], val = w.data[st.key];
    h += "<h2>" + esc(tl(st.q)) + "</h2>" + (st.h ? '<p class="hint">' + esc(tl(st.h)) + "</p>" : '<p class="hint"></p>');
    if (st.type === "choice") {
      h += '<div class="opts' + (st.two ? " two" : "") + '">' + st.opts.map(function (o) {
        return '<button class="opt" type="button" data-act="wiz-opt" data-v="' + esc(o[0]) + '" aria-pressed="' + (val === o[0]) + '"><strong>' + esc(optLabel(o)) + "</strong>" + (o[2] ? "<small>" + esc(tl(o[2])) + "</small>" : "") + "</button>";
      }).join("") + "</div>";
    } else if (st.type === "date") {
      h += '<input class="big-input" id="wizIn" type="date" value="' + esc(val || todayISO()) + '">';
    } else if (st.type === "text") {
      h += st.long ? '<textarea class="big-input" id="wizIn" rows="4">' + esc(val || "") + "</textarea>" : '<input class="big-input" id="wizIn" type="text" value="' + esc(val || "") + '" autocomplete="off">';
    } else if (st.type === "pick") {
      h += '<input type="search" class="input" id="wizQ" style="width:100%" placeholder="' + esc(tl("search")) + '" value="' + esc(w.q || "") + '" aria-label="' + esc(tl("search")) + '"><div class="pick-list" id="pickList">' + pickHTML(w) + "</div>";
    }
    h += '<div class="wiz-nav"><button class="btn ghost" type="button" data-act="wiz-back">' + esc(i === 0 ? tl("btn.cancel") : tl("btn.back")) + "</button>" + (st.type === "choice" && !st.optional ? "" : '<button class="btn" type="button" data-act="wiz-next">' + esc(st.optional && !val ? tl("btn.skip") : tl("btn.continue")) + "</button>") + "</div></div></div>";
    return h;
  }
  function pickCandidates(w) {
    var q = (w.q || "").toLowerCase();
    var rows = state.rows.filter(function (r) { return r.applied; });
    if (w.flow === "reply") rows.sort(function (a, b) { return (a.outcome ? 1 : 0) - (b.outcome ? 1 : 0) || (b.dApplied ? b.dApplied.getTime() : 0) - (a.dApplied ? a.dApplied.getTime() : 0); });
    else rows.sort(function (a, b) { return (b.dApplied ? b.dApplied.getTime() : 0) - (a.dApplied ? a.dApplied.getTime() : 0); });
    return rows.filter(function (r) { return !q || (r.company + " " + r.role).toLowerCase().indexOf(q) >= 0; }).slice(0, 60);
  }
  function pickHTML(w) {
    var rows = pickCandidates(w);
    return rows.map(function (r) { var i = state.rows.indexOf(r); return '<button class="opt" type="button" data-act="wiz-pick" data-i="' + i + '" aria-pressed="' + (w.data.row === i) + '"><strong>' + esc(r.company) + "</strong><small>" + esc(r.role) + " · " + esc(r.stateText) + "</small></button>"; }).join("") || '<p class="empty">' + esc(tl("nomatch")) + "</p>";
  }
  function reviewItems(w) {
    var d = w.data, out = [];
    if (w.flow === "apply") {
      out = [[tl("r.company"), d.company], [tl("r.role"), d.role], [tl("r.source"), d.source], [tl("r.date"), d.date || todayISO()]];
      if (d.score) out.push([tl("r.score"), d.score]);
    } else {
      var r = state.rows[d.row];
      out.push([tl("r.application"), r ? r.company + ", " + r.role : ""]);
      if (w.flow === "reply") out.push([tl("r.reply"), tl(O.filter(function (o) { return o[0] === d.reply; })[0][1])]);
      else out.push([tl("r.stage"), tl(STAGE.filter(function (o) { return o[0] === d.stage; })[0][1])]);
      out.push([tl("r.date"), d.date || todayISO()]);
    }
    if (d.note) out.push([tl("r.note"), d.note]);
    return out;
  }
  function wizCapture() { var el = $("#wizIn"); if (el && state.wiz) state.wiz.data[FLOWS[state.wiz.flow].steps[state.wiz.step].key] = el.value.trim(); }
  function wizValid() {
    var w = state.wiz, st = FLOWS[w.flow].steps[w.step], v = w.data[st.key];
    if (st.type === "date" && !v) { w.data[st.key] = todayISO(); return true; }
    if ((st.required || st.type === "pick" || st.type === "choice") && !st.optional && (v == null || v === "")) { toast(tl("toast.need")); return false; }
    return true;
  }
  function wizNext() {
    var w = state.wiz; if (!w || w.done) return;
    if (w.step < FLOWS[w.flow].steps.length) { wizCapture(); if (!wizValid()) return; }
    w.step++; render(); focusWiz();
  }
  function focusWiz() { var el = $("#wizIn") || $("#wizQ"); if (el) el.focus(); }
  function wizSave() {
    var w = state.wiz, d = w.data, today = todayISO(), date = d.date || today, steady = "";
    var MAP = { rejected: "rejected", auto: "rejected-auto", interview: "interview", offer: "offer", silent: "no-response", withdrawn: "withdrawn" };
    function addNote(raw, text) { if (text) raw.notes = (raw.notes ? raw.notes + " " : "") + "[" + date + "] " + text; }
    if (w.flow === "apply") {
      var raw = {}; state.head.forEach(function (h) { raw[h] = ""; });
      raw.date_found = date; raw.company = d.company; raw.role = d.role; raw.source = d.source || ""; raw.score = d.score || ""; raw.gate_result = "pass"; raw.status = "applied"; raw.date_applied = date; raw.notes = d.note || "";
      state.rows.push(normalise(raw));
    } else {
      var row = state.rows[d.row], rw = row.raw, idx = d.row;
      if (w.flow === "reply") {
        rw.outcome = MAP[d.reply]; rw.date_outcome = date; rw.status = rw.status || "applied"; addNote(rw, d.note);
      } else {
        var sl = tl(STAGE.filter(function (o) { return o[0] === d.stage; })[0][1]);
        if (!rw.outcome || rw.outcome === "no-response") { rw.outcome = "interview"; rw.date_outcome = date; }
        addNote(rw, "Interview, " + sl + "." + (d.note ? " " + d.note : ""));
      }
      state.rows[idx] = normalise(rw);
      if (w.flow === "reply" && (d.reply === "rejected" || d.reply === "auto")) steady = steadyCardFor(state.rows[idx]);
    }
    state.dirty = true; w.done = true; w.steady = steady;
    render(); persist();
  }

  /* ---------- Edit dialog ---------- */
  var EDIT_ES = { Company: "Empresa", Role: "Puesto", Source: "Fuente", "Score (1 to 5)": "Puntuación (1 a 5)", Status: "Estado", Outcome: "Resultado", Found: "Encontrada", Applied: "Enviada", "Outcome date": "Fecha del resultado", "Gate result": "Filtro", Domain: "Ámbito", Skills: "Habilidades", Level: "Nivel", Evidence: "Evidencia", Terms: "Condiciones", Notes: "Notas", "CV version": "Versión del CV", "Portfolio lead": "Portafolio principal" };
  function labelsLang() {
    document.querySelectorAll("#editForm label").forEach(function (l) {
      var n = l.firstChild; if (!n || n.nodeType !== 3) return;
      if (!l.dataset.en) l.dataset.en = n.nodeValue;
      n.nodeValue = state.lang === "es" ? (EDIT_ES[l.dataset.en] || l.dataset.en) : l.dataset.en;
    });
    $("#fitLegend").textContent = tl("edit.legend"); $("#editCancel").textContent = tl("btn.cancel"); $("#editSave").textContent = tl("btn.save");
  }
  function fillSelect(sel, values, current) {
    var list = values.slice(); if (current && list.indexOf(current) < 0) list.push(current);
    sel.innerHTML = list.map(function (v) { return '<option value="' + esc(v) + '"' + (v === current ? " selected" : "") + ">" + (v || tl("none.yet")) + "</option>"; }).join("");
  }
  function openEditor(i) {
    var isNew = i < 0, r = isNew ? { raw: { date_found: todayISO(), status: "found" } } : state.rows[i], f = r.raw;
    state.editing = isNew ? null : r;
    var form = $("#editForm");
    $("#editTitle").textContent = isNew ? tl("edit.new") : f.company;
    $("#editSub").textContent = isNew ? tl("edit.newsub") : f.role;
    ["company", "role", "source", "date_found", "date_applied", "date_outcome", "gate_result", "score", "notes"].concat(DIMS, EXTRA).forEach(function (k) { if (form.elements[k]) form.elements[k].value = f[k] || ""; });
    fillSelect(form.elements.status, STATUSES, f.status || "found");
    fillSelect(form.elements.outcome, OUTCOMES, f.outcome || "");
    labelsLang(); $("#editor").showModal();
  }
  function saveEditor() {
    var form = $("#editForm"), raw = state.editing ? state.editing.raw : {}, isNew = !state.editing;
    ["company", "role", "source", "date_found", "date_applied", "date_outcome", "gate_result", "score", "status", "outcome", "notes"].concat(DIMS, EXTRA).forEach(function (k) { if (form.elements[k]) raw[k] = form.elements[k].value.trim(); });
    if (raw.outcome && !raw.date_outcome && raw.outcome !== "no-response") raw.date_outcome = todayISO();
    if (raw.status === "applied" && !raw.date_applied) raw.date_applied = todayISO();
    if (isNew) { state.head.forEach(function (h) { if (raw[h] == null) raw[h] = ""; }); state.rows.push(normalise(raw)); }
    else { var idx = state.rows.indexOf(state.editing), sel = state.selected === state.editing; state.rows[idx] = normalise(raw); if (sel) state.selected = state.rows[idx]; }
    state.dirty = true; render(); persist();
  }

  /* ---------- Files ---------- */
  function toast(msg) { var el = $("#toast"); el.textContent = msg; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 4200); }
  function persist() {
    if (state.handle) {
      state.handle.createWritable().then(function (w) { return w.write(serialise()).then(function () { return w.close(); }); })
        .then(function () { state.dirty = false; renderTop(); toast(t("toast.saved", { f: state.handle.name })); })
        .catch(function (err) { toast(t("toast.fail", { e: err.message })); });
    } else { toast(tl("toast.pagecopy")); }
  }
  function download() {
    var blob = new Blob([serialise()], { type: "text/csv" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = (state.handle && state.handle.name) || "tracker.csv";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    state.dirty = false; renderTop();
  }
  function openWithHandle() {
    window.showOpenFilePicker({ types: [{ description: "Tracker CSV", accept: { "text/csv": [".csv"] } }] }).then(function (hs) {
      var h = hs[0];
      return h.getFile().then(function (file) { return file.text(); }).then(function (text) { state.handle = h; load(text, h.name, true); toast(t("toast.editing", { f: h.name })); });
    }).catch(function (e) { if (e && e.name !== "AbortError") toast(e.message); });
  }
  function readFile(file) { if (!file) return; var fr = new FileReader(); fr.onload = function () { load(String(fr.result), file.name); }; fr.readAsText(file); }

  /* ---------- Events ---------- */
  function route() {
    var v = (location.hash || "#overview").slice(1), ok = ["overview", "tracker", "log", "inbox", "review", "followups", "steady", "scout", "craft", "apply", "prepare"];
    state.view = ok.indexOf(v) >= 0 ? v : "overview";
    if (state.view !== "log") state.wiz = state.wiz && state.wiz.done ? null : state.wiz;
    render(); window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  document.addEventListener("click", function (e) {
    var th = e.target.closest("[data-theme-set]");
    if (th) { state.theme = th.dataset.themeSet; document.documentElement.dataset.theme = state.theme; store("jo.theme", state.theme); renderNav(); return; }
    var lg = e.target.closest("[data-lang-set]");
    if (lg) { state.lang = lg.dataset.langSet; store("jo.lang", state.lang); renorm(); render(); return; }
    var el = e.target.closest("[data-act]"); if (!el) return;
    var act = el.dataset.act, i = +el.dataset.i;
    if (act === "select") { state.selected = state.rows[i]; $("#view").innerHTML = viewOverview(); }
    else if (act === "edit") openEditor(i);
    else if (act === "add") openEditor(-1);
    else if (act === "sample") load(window.SAMPLE_CSV, "Sample data (fictional)");
    else if (act === "download") download();
    else if (act === "open") openWithHandle();
    else if (act === "filter") { state.filter = el.dataset.f; render(); }
    else if (act === "sort") { var k = el.dataset.sort; if (state.sortKey === k) state.sortDir *= -1; else { state.sortKey = k; state.sortDir = (k === "score" || k === "date_found") ? -1 : 1; } render(); }
    else if (act === "wiz-start") { state.wiz = { flow: el.dataset.flow, step: 0, data: {}, q: "", done: false }; render(); focusWiz(); }
    else if (act === "wiz-again") { state.wiz = null; render(); }
    else if (act === "wiz-back") { var w = state.wiz; if (w.step === 0) state.wiz = null; else { if (w.step < FLOWS[w.flow].steps.length) wizCapture(); w.step--; } render(); focusWiz(); }
    else if (act === "wiz-next") wizNext();
    else if (act === "wiz-opt") { var wz = state.wiz, st = FLOWS[wz.flow].steps[wz.step]; wz.data[st.key] = st.optional && wz.data[st.key] === el.dataset.v ? "" : el.dataset.v; if (st.optional) render(); else setTimeout(function () { wizNext(); }, 140); render(); }
    else if (act === "wiz-pick") { state.wiz.data.row = i; setTimeout(function () { wizNext(); }, 140); render(); }
    else if (act === "wiz-save") wizSave();
    else if (act === "rev-start") { state.rev = { step: 0, data: {}, done: false }; render(); }
    else if (act === "rev-again") { state.rev = null; render(); }
    else if (act === "rev-back") { if (state.rev.step === 0) state.rev = null; else { revCapture(); state.rev.step--; } render(); }
    else if (act === "rev-next") { revCapture(); state.rev.step++; render(); }
    else if (act === "rev-close") { var rr = state.rows[i]; rr.raw.outcome = "no-response"; rr.raw.date_outcome = ""; state.rows[i] = normalise(rr.raw); state.dirty = true; render(); persist(); }
    else if (act === "rev-focus") { state.rev.data.focus = el.dataset.v; render(); setTimeout(revFinish, 160); }
    else if (act === "craft-by") { state.craft.by = el.dataset.v; render(); }
    else if (act === "craft-copy") craftCopy(el.dataset.k);
    else if (act === "fu-open") { state.fu = { open: i, lang: "", tone: "", text: "", edited: false }; fuRefill(); render(); }
    else if (act === "fu-close") { state.fu.open = -1; render(); }
    else if (act === "fu-lang") { state.fu.lang = el.dataset.v; fuRefill(); render(); }
    else if (act === "fu-tone") { state.fu.tone = el.dataset.v; fuRefill(); render(); }
    else if (act === "fu-copy") fuCopy();
    else if (act === "fu-sent") { var fr = state.rows[i]; fr.raw.notes = ((fr.raw.notes || "") + (fr.raw.notes ? " " : "") + "[" + todayISO() + "] Follow-up sent.").trim(); state.rows[i] = normalise(fr.raw); state.fu.open = -1; state.dirty = true; render(); persist(); }
    else if (act === "fu-noreply") { var nr = state.rows[i]; nr.raw.outcome = "no-response"; nr.raw.date_outcome = ""; state.rows[i] = normalise(nr.raw); state.fu.open = -1; state.dirty = true; render(); persist(); }
    else if (act === "prop-accept") { if (applyProp(state.props[i])) { render(); persist(); } }
    else if (act === "prop-skip") { state.props[i].status = "skipped"; render(); }
    else if (act === "prop-acceptall") { var n = 0; state.props.forEach(function (p) { if (p.status === "pending" && (p.kind === "applied" || p.match >= 0) && !p.bad && applyProp(p)) n++; }); render(); if (n) persist(); }
    else if (act === "prop-sample") loadProps(window.SAMPLE_PROPOSALS || "");
  });
  document.addEventListener("keydown", function (e) {
    var el = e.target;
    if ((e.key === "Enter" || e.key === " ") && el.matches && el.matches("th[data-sort], .fit-item")) { e.preventDefault(); el.click(); return; }
    if (e.key === "Enter" && state.view === "log" && state.wiz && !state.wiz.done && el.id === "wizIn" && (el.tagName !== "TEXTAREA" || e.metaKey || e.ctrlKey)) { e.preventDefault(); wizNext(); }
  });
  document.addEventListener("input", function (e) {
    if (e.target.id === "q") { state.q = e.target.value; renderTableBody(); }
    else if (e.target.id === "craftPick") { state.craft.pick = +e.target.value; var tx = $("#craftText-tune"); if (tx) tx.textContent = craftPrompt("tune"); }
    else if (e.target.id === "fuText") { state.fu.text = e.target.value; state.fu.edited = true; }
    else if (e.target.id === "fuName" || e.target.id === "fuLink") { store(e.target.id === "fuName" ? "jo.me.name" : "jo.me.link", e.target.value.trim()); if (!state.fu.edited) { fuRefill(); var ta = $("#fuText"); if (ta) ta.value = state.fu.text; } }
    else if (e.target.id === "wizQ") { state.wiz.q = e.target.value; $("#pickList").innerHTML = pickHTML(state.wiz); }
  });
  $("#editForm").addEventListener("submit", function (e) { if (e.submitter && e.submitter.value === "cancel") return; e.preventDefault(); saveEditor(); $("#editor").close(); });
  $("#pfile").addEventListener("change", function (e) { var f = e.target.files[0]; if (f) { var fr = new FileReader(); fr.onload = function () { loadProps(String(fr.result)); }; fr.readAsText(f); } e.target.value = ""; });
  $("#file").addEventListener("change", function (e) { readFile(e.target.files[0]); e.target.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { document.addEventListener(ev, function (e) { e.preventDefault(); document.body.classList.add("dragging"); }); });
  ["dragleave", "drop"].forEach(function (ev) { document.addEventListener(ev, function (e) { e.preventDefault(); document.body.classList.remove("dragging"); }); });
  document.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files.length) readFile(e.dataTransfer.files[0]); });
  window.addEventListener("beforeunload", function (e) { if (state.dirty) { e.preventDefault(); e.returnValue = ""; } });

  var sl = fetchStore("jo.lang"), sth = fetchStore("jo.theme");
  if (sl === "es" || sl === "en") state.lang = sl;
  if (sth === "dark" || sth === "light") state.theme = sth;
  document.documentElement.dataset.theme = state.theme;
  state.view = (location.hash || "#overview").slice(1);
  load(window.SAMPLE_CSV || "", "Sample data (fictional)");
  route();
})();
