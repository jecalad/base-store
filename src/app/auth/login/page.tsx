import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-4 border rounded shadow-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Iniciar sesión</h1>
        <LoginForm />
      </div>
    </div>
  );
}
