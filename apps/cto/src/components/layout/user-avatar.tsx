'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Camera } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toRecord } from '@/lib/supabase-helpers'
import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  editable?: boolean
  className?: string
}

export function UserAvatar({ size = 'md', editable = false, className }: UserAvatarProps) {
  const { user } = useCurrentUser()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [user.avatar_url])

  const initials = user.nome
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  const sizeClasses = {
    sm: 'h-8 w-8 text-[10px]',
    md: 'h-10 w-10 text-[11px]',
    lg: 'h-14 w-14 text-sm',
  }

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user.id) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 2MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido. Selecione uma imagem.')
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'png'
      const path = `avatars/${user.id}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)

      const { error: updateError } = await supabase
        .from('profiles')
        .update(toRecord({ avatar_url: publicUrl }))
        .eq('user_id', user.id)

      if (updateError) throw updateError

      await queryClient.invalidateQueries({ queryKey: ['current-user'] })
      toast.success('Foto atualizada!')
    } catch {
      toast.error('Erro ao atualizar foto. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }, [user.id, queryClient])

  return (
    <div className={cn('relative group', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold overflow-hidden border-2 border-brand-cyan/20 transition-opacity',
          sizeClasses[size],
          uploading && 'opacity-50'
        )}
        style={{
          background: user.avatar_url ? undefined : 'linear-gradient(135deg, #00BFFF, #1A6AAA)',
          color: user.avatar_url ? undefined : '#FFFFFF',
        }}
      >
        {user.avatar_url && !imageError ? (
          <Image
            src={user.avatar_url}
            alt={user.nome}
            width={56}
            height={56}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          initials
        )}
      </div>

      {editable && (
        <>
          <label
            htmlFor="file-upload"
            aria-disabled={uploading}
            className={cn(
              'absolute -bottom-0.5 -right-0.5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-brand-cyan text-white shadow-md active:scale-90 transition-transform',
              uploading && 'pointer-events-none opacity-70'
            )}
            aria-label="Trocar foto de perfil"
          >
            <Camera className="h-4 w-4" />
          </label>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </>
      )}
    </div>
  )
}
