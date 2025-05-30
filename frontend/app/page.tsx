import TestAuth from '@/components/TestAuth';
import TestConnection from '@/components/TestConnection';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {/* Header */}
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold">
                    Library Management System
                </h1>
            </div>

            {/* Test Components */}
            <div className="w-full max-w-5xl space-y-4">
                <TestConnection />
                <TestAuth />
            </div>

            {/* Feature Grid */}
            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">
                        Books{' '}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            →
                        </span>
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        Browse our collection of 5000+ books from various authors and genres.
                    </p>
                </div>

                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">
                        Authors{' '}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            →
                        </span>
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        Discover 120+ authors and their literary contributions.
                    </p>
                </div>

                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">
                        Search{' '}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            →
                        </span>
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        Find books by title, author, or genre with real-time search.
                    </p>
                </div>

                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
                    <h2 className="mb-3 text-2xl font-semibold">
                        Profile{' '}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            →
                        </span>
                    </h2>
                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                        Create an account to access advanced features.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center">
                <p className="text-sm text-gray-500">
                    Full-stack application built with Next.js, TypeScript, and Express
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Backend API: http://localhost:3000 | Frontend: http://localhost:3001
                </p>
                <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-400">
                    <span>✅ Backend Connected</span>
                    <span>•</span>
                    <span>🔐 Auth Ready</span>
                    <span>•</span>
                    <span>📚 5200+ Books</span>
                    <span>•</span>
                    <span>👥 120+ Authors</span>
                </div>
            </div>
        </main>
    )
}