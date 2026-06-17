import AuthShell from '@/components/auth-shell';
import LoginForm from '@/components/login-form';

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow='Acceso'
      title='Entra a Kriuu.'
      description='El acceso no es un registro abierto. Primero revisamos tu postulación; cuando esté aprobada, podrás crear tu contraseña y entrar a la plataforma.'
    >
      <LoginForm />
    </AuthShell>
  );
}
