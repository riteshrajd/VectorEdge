'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log(`data: ${JSON.stringify(data)}`);

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log(`data: ${JSON.stringify(credentials)}`);

  const {error, data}  = await supabase.auth.signUp({
    ...credentials,
    options: {
      data: {
        username: "john doe"
      }
    }
  })
  


  if (error) {
    console.log(`error ${error}`)
    redirect('/error')
  } else if (data?.user?.identities?.length === 0) {
    console.log(`----- user already exists ------`)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}