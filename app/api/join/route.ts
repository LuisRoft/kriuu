import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

type JoinPayload = {
  nombres?: string;
  apellidos?: string;
  edad?: string;
  genero?: string;
  ciudad?: string;
  parroquia?: string;
  correo?: string;
  telefono?: string;
  situacion?: string;
  carrera?: string;
  intereses?: string[];
  referido?: string;
  referidoDetalle?: string;
  carta?: string;
  website?: string;
  acepta?: boolean;
  aceptaCodigoConducta?: boolean;
};

const SUPABASE_TABLE = process.env.KRIUU_SUPABASE_APPLICATIONS_TABLE ?? 'applications';

export async function POST(request: Request) {
  let payload: JoinPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Solicitud inválida.' },
      { status: 400 },
    );
  }

  if (payload.website?.trim()) {
    return NextResponse.json({ success: true });
  }

  const validationError = validatePayload(payload);

  if (validationError) {
    return NextResponse.json(
      { success: false, error: validationError },
      { status: 400 },
    );
  }

  let supabaseAdmin;

  try {
    supabaseAdmin = createAdminSupabaseClient();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          'Falta configurar Supabase en el servidor para guardar la postulación.',
      },
      { status: 500 },
    );
  }

  const { error } = await supabaseAdmin.from(SUPABASE_TABLE).insert({
      nombres: payload.nombres?.trim(),
      apellidos: payload.apellidos?.trim(),
      edad: Number(payload.edad),
      genero: payload.genero,
      ciudad: payload.ciudad?.trim(),
      parroquia: payload.parroquia?.trim(),
      correo: payload.correo?.trim().toLowerCase(),
      telefono: payload.telefono?.trim(),
      situacion: payload.situacion,
      carrera: payload.carrera?.trim(),
      intereses: payload.intereses,
      referido: payload.referido,
      referido_detalle: payload.referidoDetalle?.trim() ?? '',
      carta: payload.carta?.trim() ?? '',
      acepta_uso_datos: payload.acepta,
      acepta_codigo_conducta: payload.aceptaCodigoConducta,
      website: payload.website,
      status: 'pending',
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: readSupabaseError(error) },
      { status: error.code === '23505' ? 409 : 500 },
    );
  }

  return NextResponse.json({ success: true });
}

function validatePayload(payload: JoinPayload) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const age = Number(payload.edad);

  if (!payload.nombres?.trim()) return 'Ingresa tus nombres.';
  if (!payload.apellidos?.trim()) return 'Ingresa tus apellidos.';
  if (!Number.isInteger(age) || age < 12 || age > 80) {
    return 'Ingresa una edad válida desde 12 hasta 80 años.';
  }
  if (!payload.genero) return 'Selecciona una opción.';
  if (!payload.ciudad?.trim()) return 'Ingresa tu ciudad.';
  if (!payload.parroquia?.trim()) return 'Ingresa tu parroquia o sector.';
  if (!emailRegex.test(payload.correo?.trim() ?? '')) return 'Ingresa un correo válido.';
  if (!payload.telefono?.trim()) return 'Ingresa tu teléfono.';
  if (!payload.situacion) return 'Selecciona tu situación actual.';
  if (!payload.carrera?.trim()) return 'Ingresa tu carrera o profesión.';
  if (!payload.intereses?.length) return 'Selecciona al menos un área.';
  if (!payload.referido) return 'Selecciona cómo nos conociste.';
  if (payload.referido === 'Otro medio' && !payload.referidoDetalle?.trim()) {
    return 'Cuéntanos cuál fue el medio.';
  }
  if (!payload.acepta) return 'Debes aceptar para continuar.';
  if (!payload.aceptaCodigoConducta) {
    return 'Debes aceptar el código de conducta para inscribirte.';
  }

  return '';
}

function readSupabaseError(error: { code?: string; message?: string }) {
  if (error.code === '23505') {
    return 'Ya existe una postulación con este correo.';
  }

  return error.message || 'No se pudo guardar la postulación.';
}
