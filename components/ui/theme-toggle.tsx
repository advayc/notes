import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check for dark mode preference
    const isDark = 
      localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && 
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDarkMode(isDark);
  }, []);

  // This is purely visual since we're enforcing dark mode for the app
  // but could be extended to actually toggle themes if needed
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative h-8 w-14 rounded-full bg-black/20 backdrop-blur-md border border-emerald-500/20 p-1 transition-colors hover:bg-black/30"
      aria-label="Toggle theme"
    >
      <div className="relative h-6 w-12">
        {/* Sun icon */}
        <motion.div
          initial={{ opacity: isDarkMode ? 0 : 1 }}
          animate={{ opacity: isDarkMode ? 0 : 1 }}
          className="absolute inset-0 flex items-center justify-start text-emerald-500"
        >
          <Sun className="h-4 w-4" />
        </motion.div>
        
        {/* Moon icon */}
        <motion.div
          initial={{ opacity: isDarkMode ? 1 : 0 }}
          animate={{ opacity: isDarkMode ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-end text-emerald-500"
        >
          <Moon className="h-4 w-4" />
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ x: isDarkMode ? 24 : 0 }}
          animate={{ x: isDarkMode ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute h-6 w-6 rounded-full bg-emerald-500"
        >
          <div className="absolute inset-1 rounded-full bg-black/40 flex items-center justify-center">
            {isDarkMode ? (
              <Moon className="h-3 w-3 text-white" />
            ) : (
              <Sun className="h-3 w-3 text-yellow-300" />
            )}
          </div>
        </motion.div>
      </div>
    </button>
  );
} 