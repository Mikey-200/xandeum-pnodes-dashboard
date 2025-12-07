import { PNodeDashboard } from "@/components/PNodeDashboard";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Xandeum pNodes Explorer
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Real-time analytics for Xandeum storage provider nodes • {new Date().toLocaleDateString()}
          </p>
        </header>
        <PNodeDashboard />
      </div>
    </main>
  );
}
