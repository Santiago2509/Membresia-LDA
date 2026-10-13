import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = 'santiago@gmail.com';
  const password = '123456';

  console.log('Creando usuario admin:', email);

  // 1. Verificar si ya existe en auth.users
  const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
  let user = userList?.users?.find((u) => u.email === email);

  if (!user) {
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Santiago Admin' },
    });

    if (createError) {
      console.error('Error al crear usuario:', createError);
      process.exit(1);
    }
    user = newUser.user;
    console.log('Usuario creado exitosamente con ID:', user.id);
  } else {
    // Si ya existe, actualizar contraseña
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password, email_confirm: true }
    );
    if (updateError) {
      console.error('Error al actualizar contraseña:', updateError);
    } else {
      console.log('Contraseña actualizada para usuario existente ID:', user.id);
    }
  }

  // 2. Asegurar en public.profiles
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: user.id,
      email: email,
      full_name: 'Santiago Admin',
      role: 'admin',
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    console.error('Error al insertar en profiles:', profileError);
  } else {
    console.log('Perfil admin registrado en profiles');
  }

  // 3. Asegurar en public.admins
  const { error: adminError } = await supabaseAdmin
    .from('admins')
    .upsert({
      id: user.id,
      email: email,
      full_name: 'Santiago Admin',
    });

  if (adminError) {
    console.error('Error al insertar en admins:', adminError);
  } else {
    console.log('Admin registrado en public.admins');
  }

  console.log('¡Listo! Administrador santiago@gmail.com configurado al 100%.');
}

main().catch(console.error);
