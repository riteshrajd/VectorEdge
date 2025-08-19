'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { BASE_URL } from '@/constants/constants'

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

  if (user && !(await supabase.from('users').select('*').match({id:user.id}).single())) {
    const {error} = await supabase.from('users').insert({
      id: user.id,
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
        full_name: formData.get('username'),
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


export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if(error) {
    console.log(`error occured while logging out: ${JSON.stringify(error)}`);
    redirect('/error');
  }
  redirect('/login');
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        prompt: 'consent',
        access_type: 'offline',
      },
      redirectTo: `${BASE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.log(`error occurred while signing in with google: ${JSON.stringify(error)}`)
    redirect('/error')
  }

  redirect(data.url)
}