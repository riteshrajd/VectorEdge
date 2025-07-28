'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: {user} } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    redirect('/error')
  }

  if (user) {
    const {error} = await supabase.from('users').insert({
      userid: user.id,
      email: user.email,
      instrument_history: '[]',
      theme: '',
      is_paid_member: false,
    });
    if(error)console.log(`error while making users entry: ${JSON.stringify(error)}`)
    else console.log(`✅user entry done`);
  }
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error }  = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        username: "john doe"
      }
    }
  })

  if (error) {
    console.log(`error ${error}`)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/verify-email')
}