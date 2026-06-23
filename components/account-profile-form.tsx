'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const inputClass =
  'min-h-11 rounded-md border border-dark/12 bg-cream px-3 text-sm text-dark outline-none transition-colors focus:border-olive';

type ProfileFormValue = {
  nombres: string;
  apellidos: string;
  avatarUrl: string;
  bio: string;
  email: string;
  ciudad: string;
  parroquia: string;
  carrera: string;
  telefono: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  websiteUrl: string;
};

export default function AccountProfileForm({ initialValue }: { initialValue: ProfileFormValue }) {
  const router = useRouter();
  const [form, setForm] = useState(initialValue);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(initialValue.avatarUrl);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function updateField(name: keyof ProfileFormValue, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateAvatar(file: File | null) {
    setAvatarFile(file);

    if (!file) {
      setAvatarPreview(form.avatarUrl);
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    try {
      let avatarUrl = form.avatarUrl;

      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.set('avatar', avatarFile);
        const avatarResponse = await fetch('/api/account/avatar', {
          method: 'POST',
          body: avatarData,
        });
        const avatarResult = await avatarResponse.json();

        if (!avatarResponse.ok || !avatarResult.success) {
          throw new Error(avatarResult.error || 'No se pudo subir la foto de perfil.');
        }

        avatarUrl = avatarResult.avatarUrl;
      }

      const response = await fetch('/api/account/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, avatarUrl }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'No se pudo actualizar el perfil.');
      }

      setMessage(result.message);
      setForm((current) => ({ ...current, avatarUrl }));
      setAvatarFile(null);
      setAvatarPreview(avatarUrl);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar el perfil.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className='border border-dark/10 bg-white/30 p-5 md:p-7'>
      <h2 className='font-display text-2xl font-semibold'>Perfil</h2>
      <p className='mt-2 text-sm leading-6 text-dark/62'>
        Estos datos alimentan tu perfil público cuando alguien hace click en tu nombre. El correo es el de tu cuenta; teléfono, bio, foto y redes son opcionales.
      </p>
      <form onSubmit={saveProfile} className='mt-5 grid gap-4 md:grid-cols-2'>
        <div className='flex flex-col gap-4 border-b border-dark/10 pb-5 md:col-span-2 md:flex-row md:items-center'>
          <div className='relative size-24 shrink-0 overflow-hidden border border-dark/10 bg-cream'>
            {avatarPreview ? (
              <Image src={avatarPreview} alt='' fill sizes='96px' className='object-cover' />
            ) : (
              <div className='flex size-full items-center justify-center font-display text-3xl text-dark/30'>
                {form.nombres.charAt(0) || '*'}
              </div>
            )}
          </div>
          <div className='flex-1'>
            <label className='inline-flex min-h-11 cursor-pointer items-center gap-2 border border-dark/12 px-4 text-sm font-semibold text-dark/72 transition-colors hover:border-dark/25 hover:text-dark'>
              <ImagePlus className='size-4' />
              Cambiar foto
              <input
                type='file'
                accept='image/png,image/jpeg,image/webp'
                className='hidden'
                onChange={(event) => updateAvatar(event.target.files?.[0] ?? null)}
              />
            </label>
            <p className='mt-2 text-xs leading-5 text-dark/55'>
              JPG, PNG o WEBP. Máximo 2 MB.
            </p>
          </div>
        </div>
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
            type='tel'
            value={form.telefono}
            onChange={(event) => updateField('telefono', event.target.value)}
            placeholder='Opcional'
          />
        </Field>
        <Field label='Bio'>
          <textarea
            className={`${inputClass} min-h-28 py-3 leading-6`}
            value={form.bio}
            onChange={(event) => updateField('bio', event.target.value)}
            placeholder='Cuéntale a la comunidad quién eres, qué haces o qué estás explorando.'
          />
        </Field>
        <Field label='Ciudad'>
          <input
            className={inputClass}
            value={form.ciudad}
            onChange={(event) => updateField('ciudad', event.target.value)}
          />
        </Field>
        <Field label='Parroquia / sector'>
          <input
            className={inputClass}
            value={form.parroquia}
            onChange={(event) => updateField('parroquia', event.target.value)}
          />
        </Field>
        <Field label='Carrera o profesión'>
          <input
            className={inputClass}
            value={form.carrera}
            onChange={(event) => updateField('carrera', event.target.value)}
          />
        </Field>
        <div className='border-t border-dark/10 pt-4 md:col-span-2'>
          <h3 className='font-display text-xl font-semibold'>Redes</h3>
          <p className='mt-2 text-sm leading-6 text-dark/62'>
            Estas redes serán visibles en tu perfil público cuando alguien haga click en tu nombre.
          </p>
        </div>
        <Field label='GitHub'>
          <input
            className={inputClass}
            value={form.githubUrl}
            onChange={(event) => updateField('githubUrl', event.target.value)}
            placeholder='https://github.com/usuario'
          />
        </Field>
        <Field label='LinkedIn'>
          <input
            className={inputClass}
            value={form.linkedinUrl}
            onChange={(event) => updateField('linkedinUrl', event.target.value)}
            placeholder='https://linkedin.com/in/usuario'
          />
        </Field>
        <Field label='X / Twitter'>
          <input
            className={inputClass}
            value={form.twitterUrl}
            onChange={(event) => updateField('twitterUrl', event.target.value)}
            placeholder='https://x.com/usuario'
          />
        </Field>
        <Field label='Instagram'>
          <input
            className={inputClass}
            value={form.instagramUrl}
            onChange={(event) => updateField('instagramUrl', event.target.value)}
            placeholder='https://instagram.com/usuario'
          />
        </Field>
        <Field label='Sitio web'>
          <input
            className={inputClass}
            value={form.websiteUrl}
            onChange={(event) => updateField('websiteUrl', event.target.value)}
            placeholder='https://tu-sitio.com'
          />
        </Field>
        <div className='flex items-end'>
          <Button
            type='submit'
            disabled={isSaving}
            className='h-auto w-full gap-2 px-6 py-3.5 text-sm font-semibold'
          >
            <Save className='size-4' />
            {isSaving ? 'Guardando...' : 'Guardar perfil'}
          </Button>
        </div>
      </form>
      {message ? <p className='mt-4 text-sm leading-6 text-dark/70'>{message}</p> : null}
    </section>
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
