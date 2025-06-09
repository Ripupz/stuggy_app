// src/services/auth.ts
import supabase from '../utils/supabase'; // adjust path as needed

export async function signUpWithEmail(
  email: string,
  password: string,
  username: string
) {
  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // Insert into users_data table in public schema
  const user = data.user;
  if (user) {
    const { error: insertError } = await supabase
      .from('users_data')
      .insert([
        {
          id: user.id, // assuming your users_data table uses the same id as auth.users
          email: user.email,
          username: username,
          password: password, 
        },
      ]);
    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  return data;
}
