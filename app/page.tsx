import { PNodeDashboard } from "@/components/PNodeDashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Xandeum pNodes Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time analytics for Xandeum storage providers • {new Date().toLocaleDateString()}
          </p>
        </header>
        <PNodeDashboard />
      </div>
    </main>
  );
}
