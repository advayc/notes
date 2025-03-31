import GridBackground from '@/components/ui/grid-background';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-emerald-500">
      <GridBackground gridColor="#22c55e" gridOpacity={0.03}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </GridBackground>
    </div>
  );
}