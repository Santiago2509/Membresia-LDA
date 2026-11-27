import Link from 'next/link';
import CourseForm from '../CourseForm';

export default function NuevoCursoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-4 border-b border-black/10 pb-6">
        <Link href="/admin/cursos" aria-label="Volver" className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/10 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Nuevo curso</h1>
          <p className="text-sm text-neutral-600 mt-0.5">Después de crearlo podrás agregarle lecciones (videos, guías PDF, audios).</p>
        </div>
      </div>
      <CourseForm />
    </div>
  );
}
