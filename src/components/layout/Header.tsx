import logoSvg from '../../assets/logo.svg';

export function Header() {
  return (
    <header className="bg-dark-100 border-b border-gray-800 px-4 py-4">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-center relative">
        <div className="flex items-center gap-3">
          <img src={logoSvg} alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-semibold text-white">
            Token Liquidity Monitor
          </h1>
        </div>
        <div className="absolute right-0 flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-dark-50 rounded-lg text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-400">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}