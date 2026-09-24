"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Credenciales inválidas");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100">
            Panel de Administración
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Ingresa tus credenciales para continuar
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Input
                id="username"
                type="text"
                required
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <div>
              <Input
                id="password"
                type="password"
                required
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}
