module.exports = {
  plugins: {
    // Removed @tailwindcss/postcss - not compatible with ARM64 Linux
    // Using Bootstrap CSS instead, which doesn't require Tailwind
    autoprefixer: {},
  },
}

