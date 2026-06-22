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
      url: "https://reddit.com/u/Digitaleume",
      icon: "🔴",
    },
    {
      name: "Substack",
      handle: "@digitaleurope",
      url: "https://substack.com/@digitaleurope",
      icon: "📄",
    },
    {
      name: "Bluesky",
      handle: "digitaleu.me",
      url: "https://bsky.app/profile/digitaleu.me",
      icon: "🌌",
    },
  ];

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-700 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs sm:text-sm text-slate-400 mb-3">
          Follow our community →
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 rounded transition group"
              title={`Follow us on ${social.name}`}
            >
              <span className="text-lg group-hover:scale-110 transition">
                {social.icon}
              </span>
              <span className="hidden sm:inline text-sm font-medium">
                {social.handle}
              </span>
              <span className="sm:hidden text-sm font-medium">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
