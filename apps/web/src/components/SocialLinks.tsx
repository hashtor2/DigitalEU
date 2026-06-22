export function SocialLinks() {
  const socials = [
    {
      name: "X",
      handle: "@digitaleume",
      url: "https://x.com/digitaleume",
      icon: "𝕏",
    },
    {
      name: "Reddit",
      handle: "u/Digitaleume",
      url: "https://www.reddit.com/user/DigitalEUme/",
      icon: "🔴",
    },
  ];

  return (
    <div className="w-full py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-700 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 rounded transition group text-xs sm:text-sm"
              title={`Follow us on ${social.name}`}
            >
              <span className="text-sm group-hover:scale-110 transition">
                {social.icon}
              </span>
              <span className="hidden sm:inline font-medium">
                {social.handle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
