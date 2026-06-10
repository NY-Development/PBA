
  export const indexTemplate = () => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nutora API | Core Gateway</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            brand: {
                                gold: '#ff9514',
                                darkGold: '#cc7710',
                                chocolate: '#120d0a',
                                cream: '#fcf8f2',
                            }
                        }
                    }
                }
            }
        </script>
        <style>
            @keyframes pulse-soft {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(1.05); }
            }
            .animate-pulse-soft { animation: pulse-soft 2s infinite ease-in-out; }
        </style>
    </head>
    <body class="bg-[#0c0806] text-gray-200 font-sans min-h-screen flex flex-col justify-between selection:bg-brand-gold/30 selection:text-brand-gold">

        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-brand-gold/10 to-transparent blur-[120px] pointer-events-none z-0"></div>

        <main class="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
            <div class="w-full max-w-xl bg-brand-chocolate/60 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-8 shadow-2xl shadow-black/80">
                
                <div class="flex flex-col items-center mb-8">
                    <div class="w-20 h-20 bg-brand-gold/10 border border-brand-gold/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <span class="text-4xl animate-bounce">🍯</span>
                    </div>
                    <h1 class="text-3xl font-extrabold tracking-tight text-white mb-1 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        Nutora Core API
                    </h1>
                    <p class="text-sm font-medium text-brand-gold/80 tracking-widest uppercase">
                        V1 Gateway Active
                    </p>
                </div>

                <div class="space-y-4 mb-8">
                    <div class="flex items-center justify-between bg-neutral-900/40 border border-neutral-800/40 rounded-xl p-4">
                        <div class="flex items-center gap-3">
                            <span class="relative flex h-3 w-3">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span class="text-sm font-medium text-neutral-300">Environment Node Instance</span>
                        </div>
                        <span class="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold">
                            Operational
                        </span>
                    </div>
                    

                    <div class="bg-neutral-900/20 border border-neutral-800/40 rounded-xl p-4 space-y-2.5">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-neutral-400 font-medium">Network Interface Binding</span>
                            <span class="font-mono text-neutral-200">0.0.0.0:9000</span>
                        </div>
                        <div class="h-px bg-neutral-800/40"></div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-neutral-400 font-medium">Primary Database</span>
                            <span class="font-mono text-brand-gold">PostgreSQL Connected</span>
                        </div>
                        <div class="h-px bg-neutral-800/40"></div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-neutral-400 font-medium">Session Micro-Tier</span>
                            <span class="font-mono text-neutral-400">Upstash Cluster / DB Fallback Active</span>
                        </div>
                    </div>
                </div>

                <div class="bg-neutral-950/60 rounded-xl p-4 border border-neutral-900 font-mono text-[11px] leading-relaxed text-neutral-400">
                    <div class="flex items-center gap-2 mb-2 text-neutral-500 text-xs border-b border-neutral-900 pb-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-green-500/40"></span>
                        <span class="ml-1 text-neutral-500">api_handshake_diagnostics.log</span>
                    </div>
                    <p><span class="text-purple-400">GET</span> /api/v1/auth/login <span class="text-emerald-400">200 OK</span></p>
                    <p><span class="text-purple-400">POST</span> /api/v1/auth/refresh <span class="text-amber-400">401 Pending</span></p>
                    <p class="text-neutral-600">// Mobile client device handshakes routed securely via LAN IPv4</p>
                </div>

            </div>
        </main>

        <footer class="w-full text-center py-6 text-xs text-neutral-600 tracking-wide border-t border-neutral-900/60 bg-neutral-950/20 relative z-10">
            &copy; ${new Date().getFullYear()} Nutora Inc. All rights reserved. Artisanal Peanut Butter Supply Chain Platform.
        </footer>

    </body>
    </html>
  `};