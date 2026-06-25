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
    <div className="w-full py-2 px-4 sm:px-6 lg:px-8 border-b border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 bg-surface dark:bg-dark-surface hover:bg-border dark:hover:bg-dark-border border border-border dark:border-dark-border text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary rounded-sm transition group text-xs sm:text-sm"
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
