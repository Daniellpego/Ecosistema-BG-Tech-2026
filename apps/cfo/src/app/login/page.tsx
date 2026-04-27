'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@gradios/ui'
import { Input } from '@gradios/ui'
import { Label } from '@gradios/ui'

export default function LoginPage() {
  useEffect(() => { document.title = 'Login | Gradios CFO' }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos.')
      setLoading(false)
      return
    }

    // Use a full-page navigation so the browser commits the fresh Supabase
    // session cookies before the middleware re-evaluates them. iOS Safari in
    // standalone PWA mode races client-side router transitions against async
    // cookie writes, which previously caused an infinite /login redirect.
    window.location.assign('/dashboard')
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard`,
    })

    setLoading(false)
    if (error) {
      setError('Erro ao enviar email de recuperação.')
      return
    }
    setResetSent(true)
  }

  return (
    <main
      className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-bg-navy px-4"
      style={{
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(16px, env(safe-area-inset-left))',
        paddingRight: 'max(16px, env(safe-area-inset-right))',
      }}
    >
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <Image
              src="/logo.png"
              alt="Gradios"
              width={64}
              height={64}
              className="object-contain drop-shadow-md"
              sizes="64px"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-text-primary">Gradios</h1>
            <p className="text-xs font-semibold text-brand-blue tracking-widest uppercase mt-1">
              Painel CFO
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={resetMode ? handleResetPassword : handleLogin}
          className="card-glass space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="gustavo@bgtech.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
            />
          </div>

          {!resetMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded text-text-dark hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-status-negative text-center">{error}</p>
          )}

          {resetSent && (
            <p className="text-sm text-status-positive text-center">
              Email de recuperação enviado. Verifique sua caixa de entrada.
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {resetMode ? 'Enviar Email de Recuperação' : 'Entrar no Painel'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setResetMode(!resetMode)
              setError(null)
              setResetSent(false)
            }}
            className="text-xs text-text-secondary hover:text-brand-cyan transition-colors w-full text-center"
          >
            {resetMode ? 'Voltar ao login' : 'Esqueci a senha'}
          </button>
        </form>
      </div>
    </main>
  )
}

