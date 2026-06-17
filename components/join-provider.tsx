'use client';

import Link from 'next/link';
import {
  createContext,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CODE_OF_CONDUCT_DATE,
  CODE_OF_CONDUCT_SECTIONS,
} from '@/lib/code-of-conduct';

const WHATSAPP_URL = 'https://chat.whatsapp.com/CizNIkE9F5Y5L66E24KJD6?mode=gi_t';

const INTERESTS = [
  'Tecnología & Desarrollo',
  'Diseño & Creatividad',
  'Emprendimiento & Negocios',
  'Arte & Cultura',
  'Ciencia & Investigación',
  'Impacto Social',
  'Comunicación & Marketing',
  'Otro',
] as const;

const SITUATIONS = [
  'Estudia una carrera', 'No estudia ni trabaja',
  'Trabajando',
  'Estudia y trabaja',
  'Graduado',
  'Graduado y trabajando'
] as const;

type JoinContextValue = {
  openJoinForm: () => void;
};

type FormState = {
  nombres: string;
  apellidos: string;
  edad: string;
  genero: string;
  ciudad: string;
  parroquia: string;
  correo: string;
  telefono: string;
  situacion: string;
  carrera: string;
  intereses: string[];
  referido: string;
  otroMedio: string;
  carta: string;
  website: string;
  acepta: boolean;
  aceptaCodigoConducta: boolean;
};

const INITIAL_FORM: FormState = {
  nombres: '',
  apellidos: '',
  edad: '',
  genero: '',
  ciudad: '',
  parroquia: '',
  correo: '',
  telefono: '',
  situacion: '',
  carrera: '',
  intereses: [],
  referido: '',
  otroMedio: '',
  carta: '',
  website: '',
  acepta: false,
  aceptaCodigoConducta: false,
};

const JoinContext = createContext<JoinContextValue | null>(null);
const fieldClass =
  'min-h-11 rounded-md border border-dark/12 bg-cream px-3 text-sm text-dark outline-none transition-colors focus:border-olive';
const labelClass = 'text-xs font-semibold uppercase tracking-[0.16em] text-dark/55';
const errorClass = 'text-xs font-medium text-red-700';

export function useJoinForm() {
  const context = useContext(JoinContext);

  if (!context) {
    throw new Error('useJoinForm debe usarse dentro de JoinProvider');
  }

  return context;
}

export default function JoinProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const dialogRef = useRef<HTMLElement | null>(null);
  const initialFocusRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);

  const closeJoinForm = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openJoinForm = useCallback(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeJoinForm();
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => {
      initialFocusRef.current?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [closeJoinForm, isOpen]);

  const value = useMemo(
    () => ({
      openJoinForm,
    }),
    [openJoinForm],
  );

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('join') === '1') {
      openJoinForm();
    }
  }, [openJoinForm]);

  function trapDialogFocus(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== 'Tab') return;

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(','),
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function updateField(name: keyof FormState, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function toggleInterest(value: string) {
    const interests = form.intereses.includes(value)
      ? form.intereses.filter((item) => item !== value)
      : [...form.intereses, value];

    updateField('intereses', interests);
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.nombres.trim()) nextErrors.nombres = 'Ingresa tus nombres.';
    if (!form.apellidos.trim()) nextErrors.apellidos = 'Ingresa tus apellidos.';
    if (!form.edad.trim()) {
      nextErrors.edad = 'Ingresa tu edad.';
    } else {
      const age = Number(form.edad);
      if (!Number.isInteger(age) || age < 12 || age > 80) {
        nextErrors.edad = 'Ingresa una edad válida desde 12 hasta 80 años.';
      }
    }
    if (!form.genero) nextErrors.genero = 'Selecciona una opción.';
    if (!form.ciudad.trim()) nextErrors.ciudad = 'Ingresa tu ciudad.';
    if (!form.parroquia.trim()) nextErrors.parroquia = 'Ingresa tu parroquia o sector.';
    if (!emailRegex.test(form.correo.trim())) nextErrors.correo = 'Ingresa un correo válido.';
    if (!form.telefono.trim()) nextErrors.telefono = 'Ingresa tu teléfono.';
    if (!form.situacion) nextErrors.situacion = 'Selecciona tu situación actual.';
    if (!form.carrera.trim()) nextErrors.carrera = 'Ingresa tu carrera o profesión.';
    if (!form.intereses.length) nextErrors.intereses = 'Selecciona al menos un área.';
    if (!form.referido) nextErrors.referido = 'Selecciona cómo nos conociste.';
    if (form.referido === 'Otro medio' && !form.otroMedio.trim()) {
      nextErrors.otroMedio = 'Cuéntanos cuál fue el medio.';
    }
    if (!form.acepta) nextErrors.acepta = 'Debes aceptar para continuar.';
    if (!form.aceptaCodigoConducta) {
      nextErrors.aceptaCodigoConducta = 'Debes aceptar el código de conducta para inscribirte.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('idle');
    setMessage('');

    if (!validateForm()) {
      window.setTimeout(() => {
        errorSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        errorSummaryRef.current?.focus();
      }, 0);
      return;
    }

    setStatus('sending');

    const payload = {
      ...form,
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim().toLowerCase(),
      referidoDetalle: form.referido === 'Otro medio' ? form.otroMedio.trim() : '',
      website: form.website,
    };

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo guardar la postulación.');
      }

      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la postulación.');
    }
  }

  return (
    <JoinContext.Provider value={value}>
      {children}

      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[1000] transition-[visibility] duration-500 ${isOpen ? 'visible' : 'invisible'}`}
      >
        <button
          type='button'
          aria-label='Cerrar formulario de inscripción'
          onClick={closeJoinForm}
          className={`absolute inset-0 bg-dark/45 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        <aside
          ref={dialogRef}
          role='dialog'
          aria-modal='true'
          aria-labelledby='join-title'
          onKeyDown={trapDialogFocus}
          className={`absolute inset-y-0 right-0 flex w-full max-w-[100vw] flex-col border-l border-dark/10 bg-cream text-dark shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:max-w-[760px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className='flex items-center justify-between border-b border-dark/10 px-4 py-4 md:px-8 md:py-5'>
            <button
              ref={initialFocusRef}
              type='button'
              onClick={closeJoinForm}
              className='inline-flex min-h-11 items-center gap-3 rounded-none border border-dark/12 px-4 text-sm font-medium text-dark/78 transition-colors hover:border-dark/25 hover:text-dark'
            >
              <ArrowLeft className='size-4' />
              <span>Volver</span>
            </button>

            <Link
              href={WHATSAPP_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex min-h-11 items-center gap-2 rounded-none bg-olive px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90'
            >
              WhatsApp
              <ExternalLink className='size-4' />
            </Link>
          </div>

          <div className='flex-1 overflow-y-auto'>
            <div className='px-5 py-8 md:px-8 md:py-10'>
              {status === 'success' ? (
                <div className='mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center'>
                  <div className='flex size-18 items-center justify-center rounded-full bg-olive/12 font-display text-3xl text-olive'>
                    *
                  </div>
                  <h2 className='mt-6 font-display text-4xl font-semibold leading-none tracking-tight text-dark'>
                    Solicitud enviada.
                  </h2>
                  <p className='mt-4 text-base leading-7 text-dark/68'>
                    Tu postulación fue recibida por Kriuu y será revisada por el equipo. Si es aprobada, podrás crear tu contraseña e iniciar sesión en la plataforma.
                  </p>
                  <Button
                    type='button'
                    onClick={() => {
                      setStatus('idle');
                      closeJoinForm();
                    }}
                    className='mt-8 h-auto px-6 py-3'
                  >
                    Listo
                  </Button>
                </div>
              ) : (
                <>
                  <p className='text-xs font-medium uppercase tracking-widest text-dark/45'>
                    Postulación
                  </p>
                  <h2
                    id='join-title'
                    className='mt-4 max-w-xl font-display text-4xl font-semibold leading-none tracking-tight text-dark md:text-5xl'
                  >
                    Postula para formar parte de Kriuu.
                  </h2>
                  <p className='mt-5 max-w-2xl text-sm leading-7 text-dark/68 md:text-base'>
                    Completa tus datos para solicitar una cuenta en la plataforma de Kriuu. Nuestro equipo revisará tu solicitud y, si es aprobada, podrás crear tu contraseña e iniciar sesión para participar como miembro.
                  </p>

                  <form onSubmit={submitForm} className='mt-8 space-y-8'>
                    <p className='text-xs font-medium text-dark/55'>
                      <span className='text-red-700'>*</span> Campos obligatorios.
                    </p>

                    {Object.keys(errors).length ? (
                      <div
                        ref={errorSummaryRef}
                        tabIndex={-1}
                        className='scroll-mt-6 border border-red-900/15 bg-red-900/8 px-4 py-3 text-sm text-red-800 outline-none'
                      >
                        <p className='font-semibold'>
                          Revisa los campos obligatorios antes de enviar.
                        </p>
                        <ul className='mt-2 list-disc space-y-1 pl-5'>
                          {Object.entries(errors).map(([field, error]) => (
                            <li key={field}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <input
                      type='text'
                      tabIndex={-1}
                      autoComplete='off'
                      value={form.website}
                      onChange={(event) => updateField('website', event.target.value)}
                      className='hidden'
                      aria-hidden='true'
                    />

                    <section className='space-y-4 border-t border-dark/10 pt-6'>
                      <h3 className='font-display text-xl font-semibold'>Datos personales</h3>
                      <div className='grid gap-4 md:grid-cols-2'>
                        <Field label='Nombres' error={errors.nombres} required>
                          <input
                            className={fieldClass}
                            value={form.nombres}
                            onChange={(event) => updateField('nombres', event.target.value)}
                            placeholder='María José'
                          />
                        </Field>
                        <Field label='Apellidos' error={errors.apellidos} required>
                          <input
                            className={fieldClass}
                            value={form.apellidos}
                            onChange={(event) => updateField('apellidos', event.target.value)}
                            placeholder='Torres Vega'
                          />
                        </Field>
                        <Field label='Edad' error={errors.edad} required>
                          <input
                            className={fieldClass}
                            type='number'
                            min='12'
                            step='1'
                            inputMode='numeric'
                            value={form.edad}
                            onChange={(event) => updateField('edad', event.target.value)}
                          />
                        </Field>
                        <Field label='Género' error={errors.genero} required>
                          <select
                            className={fieldClass}
                            value={form.genero}
                            onChange={(event) => updateField('genero', event.target.value)}
                          >
                            <option value=''>Selecciona...</option>
                            <option>Masculino</option>
                            <option>Femenino</option>
                            <option>No binario</option>
                            <option>Prefiero no decir</option>
                          </select>
                        </Field>
                        <Field label='Ciudad' error={errors.ciudad} required>
                          <input
                            className={fieldClass}
                            value={form.ciudad}
                            onChange={(event) => updateField('ciudad', event.target.value)}
                            placeholder='Portoviejo'
                          />
                        </Field>
                        <Field label='Parroquia / sector' error={errors.parroquia} required>
                          <input
                            className={fieldClass}
                            value={form.parroquia}
                            onChange={(event) => updateField('parroquia', event.target.value)}
                            placeholder='Andrés de Vera'
                          />
                        </Field>
                        <Field label='Correo' error={errors.correo} required>
                          <input
                            className={fieldClass}
                            type='email'
                            value={form.correo}
                            onChange={(event) => updateField('correo', event.target.value)}
                            placeholder='tu@correo.com'
                          />
                        </Field>
                        <Field label='Teléfono / WhatsApp' error={errors.telefono} required>
                          <input
                            className={fieldClass}
                            type='tel'
                            value={form.telefono}
                            onChange={(event) => updateField('telefono', event.target.value)}
                            placeholder='+593 99 000 0000'
                          />
                        </Field>
                      </div>
                    </section>

                    <section className='space-y-4 border-t border-dark/10 pt-6'>
                      <h3 className='font-display text-xl font-semibold'>Formación e intereses</h3>
                      <GroupField label='Situación actual' error={errors.situacion} required>
                        <div className='grid gap-2 md:grid-cols-3'>
                          {SITUATIONS.map((value) => (
                            <Choice
                              key={value}
                              checked={form.situacion === value}
                              label={value}
                              onClick={() => updateField('situacion', value)}
                            />
                          ))}
                        </div>
                      </GroupField>
                      <Field label='Carrera o profesión' error={errors.carrera} required>
                        <input
                          className={fieldClass}
                          value={form.carrera}
                          onChange={(event) => updateField('carrera', event.target.value)}
                          placeholder='Diseño, software, marketing...'
                        />
                      </Field>
                      <GroupField label='Áreas de interés' error={errors.intereses} required>
                        <div className='grid gap-2 md:grid-cols-2'>
                          {INTERESTS.map((value) => (
                            <Choice
                              key={value}
                              checked={form.intereses.includes(value)}
                              label={value}
                              onClick={() => toggleInterest(value)}
                            />
                          ))}
                        </div>
                      </GroupField>
                    </section>

                    <section className='space-y-4 border-t border-dark/10 pt-6'>
                      <h3 className='font-display text-xl font-semibold'>Comunidad</h3>
                      <GroupField label='¿Cómo nos conociste?' error={errors.referido} required>
                        <div className='grid gap-2 md:grid-cols-2'>
                          {[
                            'Un amigo / conocido',
                            'Miembro de la comunidad',
                            'Instagram',
                            'TikTok',
                            'Facebook',
                            'LinkedIn',
                            'Evento o actividad',
                            'Otro medio',
                          ].map((value) => (
                            <Choice
                              key={value}
                              checked={form.referido === value}
                              label={value}
                              onClick={() => updateField('referido', value)}
                            />
                          ))}
                        </div>
                      </GroupField>
                      {form.referido === 'Otro medio' ? (
                        <Field label='¿Cuál?' error={errors.otroMedio} required>
                          <input
                            className={fieldClass}
                            value={form.otroMedio}
                            onChange={(event) => updateField('otroMedio', event.target.value)}
                            placeholder='Cuéntanos cómo nos encontraste'
                          />
                        </Field>
                      ) : null}
                      <Field label='Carta para Kriuu'>
                        <textarea
                          className={`${fieldClass} min-h-32 py-3 leading-6`}
                          value={form.carta}
                          onChange={(event) => updateField('carta', event.target.value)}
                          placeholder='Cuéntanos por qué quieres unirte a Kriuu. Es opcional, pero ayuda al equipo a entender mejor tu postulación.'
                        />
                      </Field>
                      <p className='text-sm leading-6 text-dark/60'>
                        Esta carta es opcional, pero puede ayudar a que el equipo evalúe mejor tu postulación.
                      </p>
                    </section>

                    <section className='space-y-4 border-t border-dark/10 pt-6'>
                      <div className='space-y-2'>
                        <h3 className='font-display text-xl font-semibold'>Código de conducta</h3>
                        <p className='text-sm leading-6 text-dark/68'>
                          Antes de inscribirte, revisa el acuerdo de convivencia de Kriuu. Aplica a eventos presenciales, grupos de mensajería, redes sociales y cualquier espacio donde participe la comunidad.
                        </p>
                      </div>
                      <details className='group border border-dark/12 bg-white/35'>
                        <summary className='flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-semibold text-dark/78 transition-colors hover:text-dark'>
                          Ver código de conducta
                          <span className='text-lg leading-none text-olive transition-transform group-open:rotate-45'>+</span>
                        </summary>
                        <div className='space-y-4 border-t border-dark/10 px-4 py-4'>
                          {CODE_OF_CONDUCT_SECTIONS.map((section) => (
                            <div key={section.title} className='space-y-1'>
                              <h4 className='text-sm font-semibold text-dark'>{section.title}</h4>
                              <p className='text-sm leading-6 text-dark/68'>
                                {section.paragraphs.join(' ')}
                              </p>
                            </div>
                          ))}
                          <p className='border-t border-dark/10 pt-4 text-sm leading-6 text-dark/68'>
                            Kriuu · {CODE_OF_CONDUCT_DATE}.
                          </p>
                        </div>
                      </details>
                      <div>
                        <p className={`${labelClass} mb-2`}>
                          Aceptación del código de conducta
                          <span className='ml-1 text-red-700'>*</span>
                        </p>
                        <button
                          type='button'
                          onClick={() => updateField('aceptaCodigoConducta', !form.aceptaCodigoConducta)}
                          className={`flex w-full items-start gap-3 rounded-none border p-4 text-left text-sm leading-6 transition-colors ${
                            form.aceptaCodigoConducta
                              ? 'border-olive bg-olive/8 text-dark'
                              : 'border-dark/12 bg-white/35 text-dark/72'
                          }`}
                        >
                          <span className='mt-1 flex size-4 shrink-0 items-center justify-center rounded border border-current text-[10px]'>
                            {form.aceptaCodigoConducta ? '✓' : ''}
                          </span>
                          <span>
                            He leído el código de conducta de Kriuu y acepto atenerme a él al inscribirme y participar en la comunidad.
                          </span>
                        </button>
                        {errors.aceptaCodigoConducta ? (
                          <p className={`${errorClass} mt-2`}>{errors.aceptaCodigoConducta}</p>
                        ) : null}
                      </div>
                      <div>
                        <p className={`${labelClass} mb-2`}>
                          Uso de datos
                          <span className='ml-1 text-red-700'>*</span>
                        </p>
                        <button
                          type='button'
                          onClick={() => updateField('acepta', !form.acepta)}
                          className={`flex w-full items-start gap-3 rounded-none border p-4 text-left text-sm leading-6 transition-colors ${
                            form.acepta
                              ? 'border-olive bg-olive/8 text-dark'
                              : 'border-dark/12 bg-white/35 text-dark/72'
                          }`}
                        >
                          <span className='mt-1 flex size-4 shrink-0 items-center justify-center rounded border border-current text-[10px]'>
                            {form.acepta ? '✓' : ''}
                          </span>
                          <span>
                            Acepto que Kriuu use mis datos para gestionar la comunidad y sus actividades.
                          </span>
                        </button>
                        {errors.acepta ? <p className={`${errorClass} mt-2`}>{errors.acepta}</p> : null}
                      </div>
                    </section>

                    {status === 'error' && message ? (
                      <p className='rounded-md border border-red-900/15 bg-red-900/8 px-4 py-3 text-sm font-medium text-red-800'>
                        {message}
                      </p>
                    ) : null}

                    <div className='flex flex-col gap-3 border-t border-dark/10 pt-6 sm:flex-row sm:items-center sm:justify-between'>
                      <Button
                        type='submit'
                        disabled={status === 'sending'}
                        className='group/button h-auto gap-2 px-7 py-3.5 text-sm font-semibold'
                      >
                        {status === 'sending' ? 'Guardando...' : 'Enviar postulación'}
                        <ArrowRight className='size-4 transition-transform duration-200 group-hover/button:translate-x-1' />
                      </Button>
                      <Link
                        href={WHATSAPP_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex min-h-11 items-center justify-center gap-2 rounded-none border border-dark/12 px-5 text-sm font-semibold text-dark/78 transition-colors hover:border-dark/25 hover:text-dark'
                      >
                        Entrar a WhatsApp
                        <ExternalLink className='size-4' />
                      </Link>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </JoinContext.Provider>
  );
}

function Field({
  children,
  error,
  label,
  required = false,
}: {
  children: ReactNode;
  error?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className='flex flex-col gap-2'>
      <span className={labelClass}>
        {label}
        {required ? <span className='ml-1 text-red-700'>*</span> : null}
      </span>
      {children}
      {error ? <span className={errorClass}>{error}</span> : null}
    </label>
  );
}

function GroupField({
  children,
  error,
  label,
  required = false,
}: {
  children: ReactNode;
  error?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <fieldset className='flex flex-col gap-2'>
      <legend className={labelClass}>
        {label}
        {required ? <span className='ml-1 text-red-700'>*</span> : null}
      </legend>
      {children}
      {error ? <span className={errorClass}>{error}</span> : null}
    </fieldset>
  );
}

function Choice({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`min-h-11 rounded-none border px-3 py-2 text-left text-sm font-medium transition-colors ${
        checked
          ? 'border-olive bg-olive/10 text-olive'
          : 'border-dark/10 bg-white/35 text-dark/70 hover:border-dark/20 hover:text-dark'
      }`}
    >
      {label}
    </button>
  );
}
