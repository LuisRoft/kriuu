import * as z from 'zod';

export const JOIN_INTERESTS = [
  'Tecnología & Desarrollo',
  'Diseño & Creatividad',
  'Emprendimiento & Negocios',
  'Arte & Cultura',
  'Ciencia & Investigación',
  'Impacto Social',
  'Comunicación & Marketing',
  'Otro',
] as const;

export const JOIN_SITUATIONS = [
  'Estudia una carrera',
  'No estudia ni trabaja',
  'Trabajando',
  'Estudia y trabaja',
  'Graduado',
  'Graduado y trabajando',
] as const;

export const JOIN_GENDER_OPTIONS = [
  'Masculino',
  'Femenino',
  'No binario',
  'Prefiero no decir',
] as const;

export const JOIN_REFERIDO_OPTIONS = [
  'Un amigo / conocido',
  'Miembro de la comunidad',
  'Instagram',
  'TikTok',
  'Facebook',
  'LinkedIn',
  'Evento o actividad',
  'Otro medio',
] as const;

function isIn(arr: readonly string[]) {
  return (v: string) => arr.includes(v);
}

export const joinFormSchema = z
  .object({
    nombres: z.string().trim().min(1, 'Ingresa tus nombres.'),
    apellidos: z.string().trim().min(1, 'Ingresa tus apellidos.'),
    edad: z
      .string()
      .trim()
      .min(1, 'Ingresa tu edad.')
      .refine((s) => {
        const age = Number(s);
        return Number.isInteger(age) && age >= 12 && age <= 80;
      }, 'Ingresa una edad válida desde 12 hasta 80 años.'),
    genero: z
      .string()
      .min(1, 'Selecciona una opción.')
      .refine(isIn(JOIN_GENDER_OPTIONS), 'Selecciona una opción.'),
    ciudad: z.string().trim().min(1, 'Ingresa tu ciudad.'),
    parroquia: z.string().trim().min(1, 'Ingresa tu parroquia o sector.'),
    correo: z.string().trim().min(1, 'Ingresa un correo válido.').email('Ingresa un correo válido.'),
    telefono: z.string().trim().min(1, 'Ingresa tu teléfono.'),
    situacion: z
      .string()
      .min(1, 'Selecciona tu situación actual.')
      .refine(isIn(JOIN_SITUATIONS), 'Selecciona tu situación actual.'),
    carrera: z.string().trim().min(1, 'Ingresa tu carrera o profesión.'),
    intereses: z.array(z.string()).min(1, 'Selecciona al menos un área.'),
    referido: z
      .string()
      .min(1, 'Selecciona cómo nos conociste.')
      .refine(isIn(JOIN_REFERIDO_OPTIONS), 'Selecciona cómo nos conociste.'),
    otroMedio: z.string(),
    website: z.string(),
    acepta: z.boolean().refine((v) => v === true, 'Debes aceptar para continuar.'),
    aceptaCodigoConducta: z
      .boolean()
      .refine((v) => v === true, 'Debes aceptar el código de conducta para inscribirte.'),
  })
  .superRefine((data, ctx) => {
    if (data.referido === 'Otro medio' && !data.otroMedio.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Cuéntanos cuál fue el medio.',
        path: ['otroMedio'],
      });
    }
  });

export type JoinFormValues = z.infer<typeof joinFormSchema>;

export function joinFormDefaultValues(): JoinFormValues {
  return {
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
    website: '',
    acepta: false,
    aceptaCodigoConducta: false,
  };
}
