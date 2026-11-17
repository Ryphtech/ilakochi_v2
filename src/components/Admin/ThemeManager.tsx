import React, { useState, useEffect } from 'react';
import {
  SiteThemeConfig,
  ThemeColors,
  THEME_PRESETS,
  defaultThemeConfig,
  saveThemeConfig,
  subscribeThemeConfig,
  applyTheme,
} from '../../lib/theme';
import {
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Eye,
  Sliders,
  CheckCircle2,
  Calendar,
  Utensils,
  ExternalLink,
  Copy,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ThemeManagerProps {
  onSuccessNotice?: (message: string) => void;
}

export const ThemeManager: React.FC<ThemeManagerProps> = ({ onSuccessNotice }) => {
  const [currentConfig, setCurrentConfig] = useState<SiteThemeConfig>(defaultThemeConfig);
  const [selectedPreset, setSelectedPreset] = useState<string>('black');
  const [customColors, setCustomColors] = useState<ThemeColors>({ ...defaultThemeConfig.colors });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSyncedCloud, setIsSyncedCloud] = useState<boolean | null>(null);
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  const [showRulesHelper, setShowRulesHelper] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  // Subscribe to live Firestore theme config
  useEffect(() => {
    const unsubscribe = subscribeThemeConfig((config) => {
      setCurrentConfig(config);
      setSelectedPreset(config.preset);
      setCustomColors({ ...config.colors });
    });
    return () => unsubscribe();
  }, []);

  // Compute the currently active colors in the editor (either preset or custom)
  const activeEditorColors: ThemeColors =
    selectedPreset === 'custom'
      ? customColors
      : THEME_PRESETS[selectedPreset]?.colors || defaultThemeConfig.colors;

  // Handle selecting a preset
  const handleSelectPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey !== 'custom' && THEME_PRESETS[presetKey]) {
      setCustomColors({ ...THEME_PRESETS[presetKey].colors });
      // Instantly preview in browser
      applyTheme({
        preset: presetKey as any,
        name: THEME_PRESETS[presetKey].name,
        colors: THEME_PRESETS[presetKey].colors,
      });
    } else {
      setIsCustomExpanded(true);
    }
  };

  // Handle custom color change
  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const updated = { ...customColors, [key]: value };
    setCustomColors(updated);
    setSelectedPreset('custom');
    // Instantly preview in browser
    applyTheme({
      preset: 'custom',
      name: 'Custom Theme',
      colors: updated,
    });
  };

  // Save to Firebase Firestore & publish to all users
  const handleSaveTheme = async () => {
    try {
      setIsSaving(true);
      const isCustom = selectedPreset === 'custom';
      const presetData = THEME_PRESETS[selectedPreset];

      const newConfig: SiteThemeConfig = {
        preset: selectedPreset as any,
        name: isCustom ? 'Custom Theme' : (presetData?.name ?? 'Custom'),
        colors: isCustom ? customColors : (presetData?.colors ?? defaultThemeConfig.colors),
      };

      const result = await saveThemeConfig(newConfig);
      setIsSyncedCloud(result.syncedToCloud);
      setSaveSuccess(true);

      if (result.syncedToCloud) {
        if (onSuccessNotice) {
          onSuccessNotice(`Theme "${newConfig.name}" has been published to all visitors!`);
        }
      } else {
        if (onSuccessNotice) {
          onSuccessNotice(
            `Theme "${newConfig.name}" applied locally! Notice: Update Firestore Security Rules in Firebase Console to enable multi-device sync.`
          );
        }
      }
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save theme config:', err);
      // Still apply locally so user experience is uninterrupted
      applyTheme({
        preset: selectedPreset as any,
        name: 'Custom Theme',
        colors: activeEditorColors,
      });
      setSaveSuccess(true);
      setIsSyncedCloud(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyRules = () => {
    const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site_settings/{document} {
      allow read, write: if true;
    }
    match /menu_items/{itemId} {
      allow read, write: if true;
    }
    match /reservations/{reservationId} {
      allow read, write: if true;
    }
    match /media_uploads/{mediaId} {
      allow read, write: if true;
    }
  }
}`;
    navigator.clipboard.writeText(rules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 3000);
  };

  // Reset to default Obsidian Black
  const handleResetDefault = () => {
    handleSelectPreset('black');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#262626]/50 text-[11px] uppercase tracking-wider text-[#C5A46D] font-mono mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>Site-Wide Color Theme Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-display text-[#F8F6EE] font-medium">
            Website Theme &amp; Color Palette
          </h2>
          <p className="text-xs text-[#A3A3A3] mt-1 max-w-xl">
            Choose from curated luxury presets or customize hex codes. Changes are broadcast in real-time to all visitor devices via Firebase Firestore.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            onClick={handleResetDefault}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#A3A3A3] hover:text-[#F8F6EE] bg-[#121212] border border-[#262626]/50 hover:border-[#C5A46D]/40 transition-colors cursor-pointer"
            title="Reset to default Black theme"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Black</span>
          </button>

          <button
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5A46D] hover:bg-[#d8b982] text-black transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                <span>Published Live!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Publish Live Theme</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Preset Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C5A46D] font-mono">
            Curated Color Palettes ({Object.keys(THEME_PRESETS).length})
          </h3>
          <span className="text-[11px] text-[#A3A3A3]">
            Active Live: <strong className="text-[#F8F6EE]">{currentConfig.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(THEME_PRESETS).map(([key, preset]) => {
            const isSelected = selectedPreset === key;
            const isLive = currentConfig.preset === key;

            return (
              <div
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 group ${
                  isSelected
                    ? 'bg-[#121212] border-[#C5A46D] shadow-xl shadow-[#C5A46D]/10 ring-1 ring-[#C5A46D]'
                    : 'bg-[#050505] border-[#262626]/50 hover:border-[#262626] hover:bg-[#121212]/50'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8F6EE] flex items-center gap-1.5">
                      <span>{preset.name}</span>
                    </h4>
                    <p className="text-[11px] text-[#A3A3A3] mt-1 leading-snug">
                      {preset.description}
                    </p>
                  </div>

                  {isLive && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 whitespace-nowrap">
                      Live
                    </span>
                  )}
                </div>

                {/* Color Swatch Strip */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#000000]/60 border border-white/5">
                    {/* Background */}
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.colors.bg }}
                      title={`Background: ${preset.colors.bg}`}
                    />
                    {/* Surface */}
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.colors.surface }}
                      title={`Surface: ${preset.colors.surface}`}
                    />
                    {/* Border */}
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.colors.border }}
                      title={`Border: ${preset.colors.border}`}
                    />
                    {/* Accent */}
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.colors.accent }}
                      title={`Accent: ${preset.colors.accent}`}
                    />
                    {/* Text */}
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-sm flex items-center justify-center font-bold text-[10px]"
                      style={{ backgroundColor: preset.colors.bg, color: preset.colors.textSoft }}
                      title={`Text: ${preset.colors.textSoft}`}
                    >
                      Aa
                    </div>
                  </div>

                  {/* Active Indicator Button */}
                  <button
                    className={`w-full py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#C5A46D] text-black shadow-md'
                        : 'bg-[#121212] text-[#A3A3A3] group-hover:text-[#F8F6EE]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select Palette</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Live Interactive Preview Box */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/50 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C5A46D] font-mono flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>Interactive Live Preview ({selectedPreset === 'custom' ? 'Custom Theme' : THEME_PRESETS[selectedPreset]?.name})</span>
          </h3>
          <span className="text-[11px] text-[#A3A3A3]">
            This simulates how components look in the selected palette
          </span>
        </div>

        {/* Simulated Website UI Box */}
        <div
          className="p-6 sm:p-8 rounded-2xl border transition-all duration-500 shadow-2xl relative overflow-hidden"
          style={{
            backgroundColor: activeEditorColors.bg,
            borderColor: activeEditorColors.border,
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: activeEditorColors.accent }}
          />

          <div className="max-w-2xl space-y-6 relative z-10">
            {/* Tagline Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold border backdrop-blur-md"
              style={{
                backgroundColor: activeEditorColors.surface,
                borderColor: activeEditorColors.border,
                color: activeEditorColors.accent,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: activeEditorColors.accent }}
              />
              <span>Authentic Kerala Coastal Dining</span>
            </div>

            {/* Simulated Headings */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-serif-display font-medium text-[#F8F6EE]">
                Fresh Catch from the Harbour.
              </h2>
              <p
                className="text-base sm:text-lg italic font-editorial"
                style={{ color: activeEditorColors.accent }}
              >
                Served on Living Banana Leaf at Pathadipalam.
              </p>
            </div>

            {/* Simulated Paragraph */}
            <p
              className="text-xs sm:text-sm font-light leading-relaxed"
              style={{ color: activeEditorColors.textSoft }}
            >
              Experience the authentic flavours of Kerala coastline, where fresh catch meets stone-ground spices, cold-pressed coconut oil, and centuries of unhurried culinary tradition.
            </p>

            {/* Simulated 3-Pillar Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div
                className="p-3.5 rounded-xl border backdrop-blur-sm"
                style={{
                  backgroundColor: activeEditorColors.surface,
                  borderColor: activeEditorColors.border,
                }}
              >
                <div
                  className="text-[10px] font-mono uppercase tracking-wider font-semibold"
                  style={{ color: activeEditorColors.accent }}
                >
                  01 &bull; Harbour
                </div>
                <div
                  className="text-xs font-light mt-0.5"
                  style={{ color: activeEditorColors.textSoft }}
                >
                  Daily sea harvest
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border backdrop-blur-sm"
                style={{
                  backgroundColor: activeEditorColors.surface,
                  borderColor: activeEditorColors.border,
                }}
              >
                <div
                  className="text-[10px] font-mono uppercase tracking-wider font-semibold"
                  style={{ color: activeEditorColors.accent }}
                >
                  02 &bull; Cast Iron
                </div>
                <div
                  className="text-xs font-light mt-0.5"
                  style={{ color: activeEditorColors.textSoft }}
                >
                  Coconut oil roast
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border backdrop-blur-sm"
                style={{
                  backgroundColor: activeEditorColors.surface,
                  borderColor: activeEditorColors.border,
                }}
              >
                <div
                  className="text-[10px] font-mono uppercase tracking-wider font-semibold"
                  style={{ color: activeEditorColors.accent }}
                >
                  03 &bull; Banana Leaf
                </div>
                <div
                  className="text-xs font-light mt-0.5"
                  style={{ color: activeEditorColors.textSoft }}
                >
                  Living leaf dining
                </div>
              </div>
            </div>

            {/* Simulated Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-black shadow-lg"
                style={{ backgroundColor: activeEditorColors.accent }}
              >
                <Calendar className="w-3.5 h-3.5 text-black" />
                <span>Reserve Your Table</span>
              </button>

              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider text-[#F8F6EE] border backdrop-blur-md"
                style={{
                  backgroundColor: activeEditorColors.surface,
                  borderColor: activeEditorColors.border,
                }}
              >
                <Utensils className="w-3.5 h-3.5" style={{ color: activeEditorColors.accent }} />
                <span>Explore Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Custom Theme Palette Builder (Collapsible) */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/50 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#C5A46D]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C5A46D] font-mono">
              Custom Theme Builder
            </h3>
          </div>

          <button
            onClick={() => setIsCustomExpanded(!isCustomExpanded)}
            className="text-xs text-[#A3A3A3] hover:text-[#F8F6EE] underline cursor-pointer"
          >
            {isCustomExpanded ? 'Hide Color Inputs' : 'Customize Hex Values'}
          </button>
        </div>

        {isCustomExpanded && (
          <div className="space-y-4 pt-2 border-t border-[#262626]/50 animate-fadeIn">
            <p className="text-xs text-[#A3A3A3]">
              Modify any color channel below to build a bespoke brand palette. Changes preview live in your browser and will be published when you click <strong>Publish Live Theme</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Main Background */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#262626]/50 space-y-2">
                <label className="block text-xs font-medium text-[#F8F6EE]">
                  1. Page Background (`bg`)
                </label>
                <p className="text-[10px] text-[#A3A3A3]">
                  Main canvas color across all sections
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.bg}
                    onChange={(e) => handleColorChange('bg', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.bg}
                    onChange={(e) => handleColorChange('bg', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#050505] border border-[#262626]/50 text-xs font-mono text-[#F8F6EE]"
                  />
                </div>
              </div>

              {/* 2. Elevated Surface Card */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#262626]/50 space-y-2">
                <label className="block text-xs font-medium text-[#F8F6EE]">
                  2. Card Surface (`surface`)
                </label>
                <p className="text-[10px] text-[#A3A3A3]">
                  Elevated cards, modals, pills &amp; inputs
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.surface}
                    onChange={(e) => handleColorChange('surface', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.surface}
                    onChange={(e) => handleColorChange('surface', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#050505] border border-[#262626]/50 text-xs font-mono text-[#F8F6EE]"
                  />
                </div>
              </div>

              {/* 3. Subtle Borders */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#262626]/50 space-y-2">
                <label className="block text-xs font-medium text-[#F8F6EE]">
                  3. Borders &amp; Dividers (`border`)
                </label>
                <p className="text-[10px] text-[#A3A3A3]">
                  Container lines, dividers &amp; outlines
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.border}
                    onChange={(e) => handleColorChange('border', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.border}
                    onChange={(e) => handleColorChange('border', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#050505] border border-[#262626]/50 text-xs font-mono text-[#F8F6EE]"
                  />
                </div>
              </div>

              {/* 4. Muted Text */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#262626]/50 space-y-2">
                <label className="block text-xs font-medium text-[#F8F6EE]">
                  4. Muted Text (`textMuted`)
                </label>
                <p className="text-[10px] text-[#A3A3A3]">
                  Subtitles, meta tags, timestamps &amp; icons
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.textMuted}
                    onChange={(e) => handleColorChange('textMuted', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.textMuted}
                    onChange={(e) => handleColorChange('textMuted', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#050505] border border-[#262626]/50 text-xs font-mono text-[#F8F6EE]"
                  />
                </div>
              </div>

              {/* 5. Soft Text */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#262626]/50 space-y-2">
                <label className="block text-xs font-medium text-[#F8F6EE]">
                  5. Body Copy (`textSoft`)
                </label>
                <p className="text-[10px] text-[#A3A3A3]">
                  Paragraph copy &amp; descriptions
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.textSoft}
                    onChange={(e) => handleColorChange('textSoft', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.textSoft}
                    onChange={(e) => handleColorChange('textSoft', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#050505] border border-[#262626]/50 text-xs font-mono text-[#F8F6EE]"
                  />
                </div>
              </div>

              {/* 6. Brand Accent */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#262626]/50 space-y-2">
                <label className="block text-xs font-medium text-[#F8F6EE]">
                  6. Brand Accent (`accent`)
                </label>
                <p className="text-[10px] text-[#A3A3A3]">
                  Primary CTA buttons, badges &amp; highlights
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#050505] border border-[#262626]/50 text-xs font-mono text-[#F8F6EE]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Firebase Security Rules Troubleshooting Helper */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/50 space-y-4">
        <div
          onClick={() => setShowRulesHelper(!showRulesHelper)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#C5A46D]" />
            <div>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#F8F6EE] font-mono">
                Firebase Firestore Permissions Guide (Multi-Device Sync)
              </h3>
              <p className="text-[11px] text-[#A3A3A3] mt-0.5">
                If the browser console says &ldquo;Missing or insufficient permissions&rdquo;, update your Firestore rules in Firebase Console.
              </p>
            </div>
          </div>

          <button className="p-2 rounded-full text-[#A3A3A3] hover:text-[#F8F6EE] hover:bg-[#121212] transition-colors">
            {showRulesHelper ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showRulesHelper && (
          <div className="pt-4 border-t border-[#262626]/50 space-y-4 text-xs text-[#A3A3A3] animate-fadeIn">
            <p>
              By default, Firebase Firestore projects in test mode expire after 30 days or require custom security rules. To allow your Admin Portal to save theme and menu settings across all devices:
            </p>

            <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#E5E5E5] pl-1">
              <li>
                Open{' '}
                <a
                  href="https://console.firebase.google.com/project/ilakochi-809fb/firestore/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A46D] hover:underline font-semibold"
                >
                  Firebase Console &rarr; Firestore Database &rarr; Rules
                </a>
              </li>
              <li>Replace existing rules with the configuration below:</li>
              <li>Click <strong>Publish</strong>.</li>
            </ol>

            <div className="relative rounded-2xl bg-[#121212] border border-[#262626]/60 p-4 font-mono text-[11px] text-[#F8F6EE] overflow-x-auto">
              <button
                onClick={handleCopyRules}
                className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050505] hover:bg-[#1a1a1a] border border-[#262626] text-[10px] text-[#C5A46D] transition-colors cursor-pointer"
              >
                {copiedRules ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Rules</span>
                  </>
                )}
              </button>
              <pre className="text-xs leading-relaxed text-[#D8B982]">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site_settings/{document} {
      allow read, write: if true;
    }
    match /menu_items/{itemId} {
      allow read, write: if true;
    }
    match /reservations/{reservationId} {
      allow read, write: if true;
    }
    match /media_uploads/{mediaId} {
      allow read, write: if true;
    }
  }
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
