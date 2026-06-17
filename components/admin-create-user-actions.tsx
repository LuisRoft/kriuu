'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldPlus, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const inputClass =
  'min-h-11 rounded-md border border-dark/12 bg-cream px-3 text-sm text-dark outline-none transition-colors focus:border-olive';

type Mode = 'member' | 'admin';

export default function AdminCreateUserActions() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    ciudad: '',
    carrera: '',
    telefono: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mode) return;

    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          roles: mode === 'admin' ? ['admin'] : ['member'],
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo crear el usuario.');
      }

      setMessage(result.message);
      setForm({ nombres: '', apellidos: '', email: '', ciudad: '', carrera: '', telefono: '' });
      setMode(null);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo crear el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-2'>
        <Button
          type='button'
          onClick={() => setMode(mode === 'member' ? null : 'member')}
          className='h-auto gap-2 px-4 py-3 text-sm'
        >
          <UserPlus className='size-4' />
          Crear usuario
        </Button>
        <Button
          type='button'
          onClick={() => setMode(mode === 'admin' ? null : 'admin')}
          variant='outline'
          className='h-auto gap-2 border-dark/12 bg-transparent px-4 py-3 text-sm'
        >
          <ShieldPlus className='size-4' />
          Crear administrador
        </Button>
      </div>

      {mode ? (
        <div className='fixed inset-0 z-[1100] flex items-center justify-center px-4 py-6'>
          <button
            type='button'
            aria-label='Cerrar creación de usuario'
            onClick={() => setMode(null)}
            className='absolute inset-0 bg-dark/45 backdrop-blur-[2px]'
          />
          <section className='relative z-10 max-h-[min(760px,calc(100vh-48px))] w-full max-w-2xl overflow-y-auto border border-dark/10 bg-cream p-5 shadow-2xl md:p-7'>
            <div className='flex items-start justify-between gap-4 border-b border-dark/10 pb-5'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/45'>
                  {mode === 'admin' ? 'Nuevo administrador' : 'Nuevo usuario'}
                </p>
                <h2 className='mt-2 font-display text-3xl font-semibold leading-none'>
                  Crear e invitar
                </h2>
              </div>
              <button
                type='button'
                onClick={() => setMode(null)}
                className='flex size-10 shrink-0 items-center justify-center border border-dark/12 text-dark/70 transition-colors hover:border-dark/25 hover:text-dark'
                aria-label='Cerrar'
              >
                <X className='size-5' />
              </button>
            </div>

            <form onSubmit={createUser} className='mt-5 grid gap-3 md:grid-cols-2'>
              <Field label='Nombres'>
                <input
                  className={inputClass}
                  value={form.nombres}
                  onChange={(event) => updateField('nombres', event.target.value)}
                />
              </Field>
              <Field label='Apellidos'>
                <input
                  className={inputClass}
                  value={form.apellidos}
                  onChange={(event) => updateField('apellidos', event.target.value)}
                />
              </Field>
              <Field label='Correo'>
                <input
                  className={inputClass}
                  type='email'
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </Field>
              <Field label='Teléfono'>
                <input
                  className={inputClass}
                  value={form.telefono}
                  onChange={(event) => updateField('telefono', event.target.value)}
                />
              </Field>
              <Field label='Ciudad'>
                <input
                  className={inputClass}
                  value={form.ciudad}
                  onChange={(event) => updateField('ciudad', event.target.value)}
                />
              </Field>
              <Field label='Carrera'>
                <input
                  className={inputClass}
                  value={form.carrera}
                  onChange={(event) => updateField('carrera', event.target.value)}
                />
              </Field>
              <div className='mt-3 flex items-center gap-2 border-t border-dark/10 pt-5 md:col-span-2'>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='h-auto px-5 py-3 text-sm'
                >
                  {isSubmitting ? 'Creando...' : 'Crear e invitar'}
                </Button>
                <button
                  type='button'
                  onClick={() => setMode(null)}
                  className='min-h-11 border border-dark/12 px-4 text-sm font-semibold text-dark/65'
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {message ? <p className='text-sm leading-6 text-dark/70'>{message}</p> : null}
    </div>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className='flex flex-col gap-2'>
      <span className='text-xs font-semibold uppercase tracking-[0.16em] text-dark/55'>
        {label}
      </span>
      {children}
    </label>
  );
}
