import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdmin } from '@/lib/authAdmin';
import { getVideoThumbnail } from '@/lib/videoUtils';

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin();
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

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

  // Si no se proporcionó miniatura explícita pero hay un enlace de YouTube, autogenerar la miniatura
  const finalThumbnail = thumbnail_url || getVideoThumbnail(url) || null;

  const { data, error } = await supabaseAdmin
    .from('content')
    .insert({
      title,
      description: description || null,
      type,
      category,
      is_premium: Boolean(is_premium),
      url: url || null,
      thumbnail_url: finalThumbnail,
      body: contentBody || null,
      body_after: body_after || null,
      resource_url: resource_url || null,
      resource_title: resource_title || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, item: data });
}
