export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}