// Franja con los colores del cerebro del logo. Se usa como sello de marca
// junto a los títulos de sección, en lugar de etiquetas genéricas.
const LOGO_COLORS = ['#12a04a', '#8dc42a', '#eeab52', '#ec6f31', '#e8363b', '#d6006f', '#b0106a', '#2b93d1', '#133a73'];

export function BrandStripe({ className = '' }: { className?: string }) {
  return (
    <div className={`flex h-1 w-24 overflow-hidden rounded-full ${className}`} aria-hidden="true">
      {LOGO_COLORS.map((color) => (
        <span key={color} className="flex-1" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}
