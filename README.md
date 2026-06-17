# Kriuu

Sitio web de Kriuu construido con Next.js.

## Desarrollo

Instala dependencias y levanta el servidor local:

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000`.

## Variables De Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xhuflxdmczzvaqrziuak.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
KRIUU_SUPABASE_APPLICATIONS_TABLE=applications
```

La publishable key de Supabase es pública. La service role key solo debe existir en `.env.local` y en variables privadas del hosting; nunca debe usarse en componentes cliente.

## Inscripciones Con Supabase

El formulario de inscripción ahora funciona como postulación. Vive en `components/join-provider.tsx` y envía los datos a `/api/join`, que guarda el registro en `public.applications` con `status = pending`.

El flujo implementado:

1. Visitante postula desde el formulario público.
2. La postulación queda en `applications` con estado `pending`.
3. Un admin entra por `/login` y revisa en `/admin/postulaciones`.
4. Al aprobar, `/api/admin/applications/[id]/approve` invita/crea el usuario en Supabase Auth, crea/actualiza `profiles`, asigna rol `member` en `user_roles` y marca la postulación como `approved`.
5. El usuario aprobado entra a `/login`, solicita crear contraseña, abre el correo y llega a `/auth/update-password`.
6. Usuarios con rol `member`, `author`, `admin` o `superadmin` entran a `/dashboard`. Admins y superadmins entran a `/admin`.

## Primer Superadmin

Para crear el primer superadmin:

1. Crea el usuario inicial en Supabase Auth desde el dashboard de Supabase.
2. Copia su `user.id`.
3. Inserta un profile y rol:

```sql
insert into public.profiles (id, display_name, status)
values ('USER_ID', 'Nombre Admin', 'active')
on conflict (id) do update set status = 'active';

insert into public.user_roles (user_id, role)
values ('USER_ID', 'superadmin')
on conflict do nothing;
```

Después entra a `/login`, crea/restablece contraseña si hace falta y abre `/admin`.

## Pendiente Para La Siguiente Fase

Quedan como placeholders: creación editorial de posts, revisión completa de posts, comentarios, votos/upvotes y moderación.

## Comandos

```bash
pnpm lint
pnpm build
```
