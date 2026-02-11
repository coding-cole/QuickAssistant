// Provider brand colors
const PROVIDER_COLORS: Record<string, string> = {
  bolt: '#34D186',
  uber: '#000000',
  indrive: '#FF6B00',
  taxify: '#34D186',
  lyft: '#FF00BF',
};

// Generate avatar URL for provider logo
export const getProviderLogo = (name: string, color: string) => ({
  uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color.replace('#', '')}&color=fff&size=96`,
});

// Get provider color (fallback to gray)
export const getProviderColor = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  return PROVIDER_COLORS[normalized] || '#666666';
};
