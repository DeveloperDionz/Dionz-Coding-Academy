import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DarkModeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    // Check localStorage and system preference immediately
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDark(!dark)}
      className="rounded-full w-9 h-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
    >
      {/* Adding a subtle transition effect for the icons */}
      <div className="relative">
        <Sun className={`h-4 w-4 transition-all ${dark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90 opacity-0 absolute'}`} />
        <Moon className={`h-4 w-4 transition-all ${!dark ? 'scale-100 rotate-0' : 'scale-0 rotate-90 opacity-0 absolute'}`} />
      </div>
    </Button>
  );
}