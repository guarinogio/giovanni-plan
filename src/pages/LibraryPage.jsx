function Section({ title, items }) {
  return (
    <details className="overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
      <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-left">
        <span className="text-base font-medium text-neutral-900 dark:text-neutral-100">
          {title}
        </span>
        <span className="text-[11px] text-neutral-500 dark:text-neutral-500">
          tap para ver
        </span>
      </summary>
      <div className="space-y-4 border-t border-neutral-200 px-4 pb-4 pt-4 text-sm leading-relaxed text-neutral-700 dark:border-neutral-800 dark:text-neutral-400">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-2">
            {item.heading && (
              <div className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-200">
                {item.heading}
              </div>
            )}
            {Array.isArray(item.body) ? (
              <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-neutral-400">
                {item.body.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-400">
                {item.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </details>
  )
}

export default function LibraryPage() {
  return (
    <div className="space-y-6 pb-24 text-neutral-900 dark:text-neutral-100">
      <header className="px-4 pt-6">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Biblioteca técnica
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Cómo hacer cada bloque, progresar sin lesionarte y cuándo parar.
        </p>
      </header>

      <div className="space-y-4 px-4">
        <Section
          title="Parte A — Core diario / columna"
          items={[
            {
              heading: 'Objetivo',
              body:
                'Bajar dolor lumbar, enseñar al tronco a ser estable sin colgar de la zona baja, activar glúteos y corregir postura de programador. Esto prepara para Cardio Z2 y luego Fuerza sin miedo.'
            },
            {
              heading: 'Bloque diario (10–12 min)',
              body: [
                'Curl-up modificado (McGill): 3 series, 6–8 repeticiones de 8–10 s cada una por lado. Cuello largo, no tirar con las manos.',
                'Plancha lateral corta: 3 rondas por lado. Mantener 8–10 s alineando rodillas → cadera → hombro. Descansar 5–10 s.',
                'Bird-dog: 3 series, 6–8 repeticiones de 8–10 s por lado. Brazo y pierna contrarios, cadera paralela al suelo, cuello largo mirando al suelo.',
                'Puente de glúteo: 2–3 series de 10–12 repeticiones. Retroversión pélvica suave, sube apretando glúteos sin arquear la lumbar, mantén arriba 2–3 s.'
              ]
            },
            {
              heading:
                'Pausa activa cuando estás al ordenador (cada 30–45 min sentado)',
              body: [
                'Retracción escapular x15–20 repeticiones: codos pegados al cuerpo, junta omóplatos abajo y atrás, cuello largo.',
                'Estiramiento pectoral en puerta: 30 s por lado, hombro abajo y lejos de la oreja.',
                'Camina 10–20 pasos para cambiar el ángulo de cadera y descargar la zona lumbar.'
              ]
            },
            {
              heading: 'Progresión semanal',
              body: [
                'Semanas 1–2: Mantén 8 s, 6 repeticiones por lado.',
                'Semanas 3–4: Mantén 10 s, 8 repeticiones por lado. Plancha lateral con más palanca.',
                'Semana 5+: Bird-dog con mancuerna muy ligera (1–2 kg) en la mano extendida si la lumbar está tranquila. Puente de glúteo con peso ligero en la pelvis y pausa de 3 s arriba.',
                'No progreses si el dolor lumbar pasa de 2/10 o aparece dolor que baja por la pierna, hormigueo o debilidad.'
              ]
            }
          ]}
        />

        <Section
          title="Parte B — Cardio Z2 (bajo impacto, espalda-friendly)"
          items={[
            {
              heading: 'Zona 2',
              body: [
                'Esfuerzo percibido RPE 3–4/10: puedes hablar frases sin ahogarte.',
                'Frecuencia cardiaca aproximada ~110–130 lpm (≈60–70% de FCmáx).',
                'Objetivo: subir minutos totales, no apretar intensidad. Es base metabólica para energía y salud cardiometabólica.'
              ]
            },
            {
              heading: 'Modalidades seguras',
              body: [
                'Bici estática: muy bajo impacto lumbar y plantar.',
                'Elíptica: movimiento fluido, sin impacto, implica tren superior.',
                'Cinta caminando con ligera inclinación: controlas pulsaciones sin trotar.',
                'Piscina / caminar en agua: descarga lumbar y pies. Evita hiperextender la zona baja al patear fuerte.'
              ]
            },
            {
              heading: 'Plan semanas 1–6',
              body: [
                'Semanas 1–2: 4 sesiones/semana, 20–25 min por sesión, RPE ~3/10.',
                'Semanas 3–4: 5 sesiones/semana, 30–35 min, RPE 3–4/10. Subes minutos, no intensidad.',
                'Semanas 5–6: 5–6 sesiones/semana, 40–45 min. Una sesión puede ser paseo largo o piscina. Meta: 150–200+ min/semana sin que la lumbar grite.'
              ]
            },
            {
              heading: 'Señales rojas',
              body: [
                'Dolor lumbar agudo que sube de 0–2/10 a más de 4/10.',
                'Dolor que irradia a nalga o pierna, hormigueo, adormecimiento.',
                'Dolor plantar punzante que te obliga a cambiar la pisada.',
                'Falta de aire tipo “me ahogo”, mareo o dolor torácico.',
                'Pulsaciones que siguen disparadas más de 5 min después de parar.'
              ]
            }
          ]}
        />

        <Section
          title="Parte C — Fuerza técnica full-body (2 días por semana)"
          items={[
            {
              heading: 'Estructura de sesión',
              body: [
                '1) Calentamiento general 3–5 min cardio suave.',
                '2) Calentamiento específico: bisagra palo x10, sentadilla a cajón x10, face pull x15 (2 rondas).',
                '3) Bloque principal (3×8–12 RPE 6–7, control limpio):',
                '   • Bisagra de cadera (rumano mancuernas o pull-through banda).',
                '   • Empuje (push-up inclinado o press máquina).',
                '   • Tirón (remo sentado, pecho-soportado o banda).',
                '   • Pierna (sentadilla a cajón cómodo o prensa).',
                '   • Glúteo (puente / hip thrust con pausa arriba 2–3 s) 3×12–15.',
                '4) Correctivos posturales:',
                '   • Face pull / pull-apart 2×15.',
                '   • Farmer carry 2×30–45 s o plancha frontal 20–30 s.',
                '5) Cooldown rápido: caminar suave 2–3 min más estirar pectoral y flexor de cadera.'
              ]
            },
            {
              heading: 'Reglas',
              body: [
                'Todo a RPE 6–7. Nada de ego.',
                'Siente el trabajo en glúteo, isquios y espalda alta, no en la zona lumbar.',
                'Pecho abierto, hombros abajo y atrás, cuello largo.'
              ]
            },
            {
              heading: 'Cuándo bajar intensidad o parar',
              body: [
                'Dolor lumbar punzante o que irradia a nalga o pierna.',
                'Hormigueo, entumecimiento o debilidad súbita.',
                'Dolor agudo en rodilla o fascia plantar.',
                'Necesitas arquear mucho la zona baja para sacar la repetición.'
              ]
            },
            {
              heading: 'Por qué esto importa',
              body:
                'Parte C construye estructura (cadera fuerte, espalda alta fuerte, piernas sólidas) encima de la estabilidad de la Parte A y de la base cardiometabólica de la Parte B.'
            }
          ]}
        />

        <Section
          title="Parte D — Movilidad / mantenimiento postural"
          items={[
            {
              heading: 'Objetivo',
              body: [
                'Abrir cadera y flexores.',
                'Abrir pecho y reducir cuello adelantado.',
                'Dar movilidad torácica para que la lumbar no tenga que compensar.',
                'Descargar gemelos y fascia plantar.',
                'Mantener hombros menos protraídos.'
              ]
            },
            {
              heading: 'Rutina diaria sugerida (~10 min)',
              body: [
                'Flexor de cadera tipo couch stretch suave: 2×30–45 s por lado con glúteo apretado y costillas abajo.',
                'Pectoral en puerta: 2×30 s por lado, hombro abajo/lejos de la oreja.',
                'Extensión torácica sobre rodillo o toalla: 1–2 min total moviendo el punto en la zona media/alta, no en la lumbar.',
                'T y Y boca abajo o en banco inclinado: 1×10–12 reps cada posición, apretando escápulas atrás y abajo.',
                'Gemelo y sóleo en pared: 30 s rodilla estirada + 30 s rodilla flexionada por lado.',
                'Liberación plantar con pelota dura: ~1 min por pie, presión tolerable (sin dolor punzante agudo).',
                'Chin tucks: 2×10 repeticiones llevando mentón atrás y coronilla hacia arriba, sin mirar al techo.'
              ]
            },
            {
              heading: 'Señales para parar o modificar',
              body: [
                'Hormigueo, entumecimiento o dolor que viaja por brazo o pierna.',
                'Dolor lumbar agudo durante el estiramiento de cadera.',
                'Dolor punzante en el talón durante la liberación plantar.',
                'Mareo o visión rara con chin tucks.'
              ]
            }
          ]}
        />

        <Section
          title="Ergonomía rápida para programar"
          items={[
            {
              heading: 'Postura base',
              body: [
                'Apoyo lumbar real (cojín o respaldo ajustado). Zona baja no cuelga.',
                'Pies planos en el suelo o reposapiés estable.',
                'Caderas y rodillas cerca de 90–100°, sin rodillas más altas que caderas.',
                'Peso repartido en los isquiones, no solo en el coxis.'
              ]
            },
            {
              heading: 'Tronco, hombros, manos',
              body: [
                'Pecho suave abierto, hombros bajos y un poco atrás.',
                'Codos cerca del cuerpo ~90°. Si parecen alas de pollo, teclado/ratón están demasiado lejos.',
                'Antebrazos apoyados para no cargar trapecios.',
                'Teclado y ratón cerca del cuerpo, muñeca casi en línea con antebrazo.'
              ]
            },
            {
              heading: 'Cabeza y pantalla',
              body: [
                'Ojos mirando de frente, no siempre hacia abajo.',
                'Parte superior del monitor a la altura de los ojos o un poco por debajo.',
                'Acerca la pantalla a ti, no saques el cuello hacia la pantalla.'
              ]
            },
            {
              heading: 'Break cada 30–45 min',
              body: [
                'Levántate 2–3 min.',
                'Retracción escapular x15–20.',
                'Pectoral en puerta 30 s por lado.',
                'Camina 10–20 pasos.',
                'Alterna ratos sentado / de pie si puedes.'
              ]
            }
          ]}
        />

        <Section
          title="Señales de alerta médica"
          items={[
            {
              heading: 'Para y busca ayuda si aparece',
              body: [
                'Dolor lumbar que empieza a irradiar hacia nalga, muslo o pierna.',
                'Entumecimiento, hormigueo o pinchazos eléctricos en pierna o pie.',
                'Debilidad clara en una pierna (por ejemplo no puedes levantar el pie igual).',
                'Pérdida progresiva de fuerza de agarre o control fino en manos tras dolor cervical.',
                'Dolor lumbar nocturno que te despierta y no te deja dormir.',
                'Fiebre reciente más golpe/caída más dolor lumbar agudo.',
                'Problemas nuevos para controlar vejiga o intestino.'
              ]
            },
            {
              heading: 'Amarillo (vigila, baja intensidad)',
              body: [
                'Dolor lumbar que sube de 0–2/10 a más de 4/10 en un ejercicio concreto.',
                'Dolor plantar punzante al apoyar el talón o el arco.',
                'Pinchazo agudo en rodilla en sentadilla o prensa.',
                'Mareo o sensación de falta de aire brutal en cardio Zona 2.'
              ]
            }
          ]}
        />

        <Section
          title="Plan base semanas 1–6"
          items={[
            {
              heading: 'Semana tipo',
              body: [
                'Todos los días: Parte A (core estable) más pausas activas cuando programas.',
                '4–6 días por semana: Cardio Zona 2 suave 30–45 min (bici, elíptica, cinta inclinada o agua).',
                '2 días por semana: Fuerza técnica full-body (Parte C) a RPE 6–7, cero ego.',
                '3 o más veces por semana y domingo: Parte D completa ~10 min para abrir cadera, pecho y cuello.',
                'Sábado o domingo: paseo largo o piscina cuenta como cardio largo suave.'
              ]
            },
            {
              heading: 'Reglas de seguridad',
              body: [
                'Para si aparece dolor lumbar punzante que supera 4/10.',
                'Para si hay dolor que baja por la pierna, hormigueo, entumecimiento o debilidad.',
                'Adapta (no pares todo el día) si solo estás rígido: baja rango, baja carga, haz más lento.',
                'Si duermes fatal y estás destruido, 15 min suaves de cardio Zona 2 cuentan como sí. El hábito importa más que apretar.'
              ]
            },
            {
              heading: 'Meta al final de la fase',
              body: [
                '150–200+ min de cardio suave por semana sin brotes de dolor lumbar serio.',
                'Lumbar más estable, menos frágil al estar de pie.',
                'Listo para subir fuerza real, más carga útil en piernas y glúteo, y empezar recomposición corporal.'
              ]
            }
          ]}
        />
      </div>
    </div>
  )
}
