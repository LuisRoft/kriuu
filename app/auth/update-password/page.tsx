import AuthShell from '@/components/auth-shell';
import UpdatePasswordForm from '@/components/update-password-form';

export default function UpdatePasswordPage() {
  return (
    <AuthShell
      eyebrow='Contraseña'
      title='Crea tu acceso.'
      description='Elige una contraseña para tu cuenta aprobada. Después podrás entrar a la plataforma de Kriuu con tu correo.'
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
