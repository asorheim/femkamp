const ICON_POOL = ["🃏", "🎴", "👑", "🎩", "🦊", "🐻", "🦉", "🐸", "🎪", "🂠"];

export function assignIcon(index: number): string {
  return ICON_POOL[index % ICON_POOL.length];
}

export function nextIcon(currentIcon: string): string {
  const currentIndex = ICON_POOL.indexOf(currentIcon);
  if (currentIndex === -1) return ICON_POOL[0];
  return ICON_POOL[(currentIndex + 1) % ICON_POOL.length];
}

export { ICON_POOL };
