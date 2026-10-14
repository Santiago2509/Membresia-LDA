import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdmin } from '@/lib/authAdmin';
import { getVideoThumbnail } from '@/lib/videoUtils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin();
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const { data: item, error } = await supabaseAdmin
    .from('content')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) {
    return NextResponse.json({ error: 'Contenido no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin();
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const {
    title,
    description,
    type,
    category,
    is_premium,
    url,
    thumbnail_url,
    body: contentBody,
    body_after,
    resource_url,
    resource_title,
  } = body;

  if (!title || !category || !type) {
    return NextResponse.json(
      { error: 'Título, tipo y categoría son obligatorios' },
      { status: 400 }
    );
  }

  const finalThumbnail = thumbnail_url || getVideoThumbnail(url) || null;

  const { data, error } = await supabaseAdmin
    .from('content')
    .update({
      title,
      description,
      type,
      category,
      is_premium: Boolean(is_premium),
      url: url || null,
      thumbnail_url: finalThumbnail,
      body: contentBody || null,
      body_after: body_after || null,
      resource_url: resource_url || null,
      resource_title: resource_title || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, item: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin();
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('content')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
