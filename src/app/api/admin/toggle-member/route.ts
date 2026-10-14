import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdmin } from '@/lib/authAdmin';

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { membershipId, newStatus } = await req.json();
  if (!membershipId || !['active', 'canceled'].includes(newStatus)) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('memberships')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', membershipId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, membership: data });
}
