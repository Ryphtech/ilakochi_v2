import React, { useState, useEffect } from 'react';
import {
  SiteHeadingsConfig,
  SiteSectionsHeadings,
  DEFAULT_HEADINGS_EN,
  DEFAULT_HEADINGS_ML,
  DEFAULT_HEADINGS_BILINGUAL,
  defaultHeadingsConfig,
  saveHeadingsConfig,
  subscribeHeadingsConfig,
  HeadingsLanguageMode,
} from '../../lib/headings';
import {
  Languages,
  Sparkles,
  CheckCircle2,
  Globe,
  RotateCcw,
  Search,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HeadingsManagerProps {
  onSuccessNotice?: (message: string) => void;
}

interface SectionMeta {
  key: keyof SiteSectionsHeadings;
  name: string;
  badge: string;
  description: string;
  hasHighlight?: boolean;
}

const SECTION_METAS: SectionMeta[] = [
  { key: 'hero', name: 'Hero Section', badge: 'Top Banner', description: 'Main above-the-fold welcoming title and coastal hook' },
  { key: 'brandIntro', name: 'Brand Intro', badge: '#about', description: 'Soul of Kochi story headline & accent motto', hasHighlight: true },
  { key: 'signatureDishes', name: 'Signature Dishes', badge: '#signature', description: 'Harbour to Hearth showcase heading' },
  { key: 'howItWorks', name: 'How It Works / Ritual', badge: '#ritual', description: 'From Ocean Tides to Banana Leaf 3-step ritual' },
  { key: 'ourStory', name: 'Our Story & Heritage', badge: '#story', description: 'Why We Serve on ILA philosophy header' },
  { key: 'keralaCulture', name: 'Kerala Culture', badge: '#culture', description: 'Sacred Art of Banana Leaf Dining' },
  { key: 'reviews', name: 'Guest Reviews', badge: '#reviews', description: 'Loved by Seafood Connoisseurs guest testimonials' },
  { key: 'menu', name: 'Menu Section', badge: '#menu', description: 'Coastal Culinary Repertoire & dish categories' },
  { key: 'diningExperience', name: 'Dining Experience', badge: '#experience', description: 'Atmosphere & Five Senses showcase' },
  { key: 'gallery', name: 'Visual Gallery', badge: '#gallery', description: 'Glimpses of Ila Kochi photo reel' },
  { key: 'faq', name: 'FAQ Section', badge: '#faq', description: 'Frequently Asked Questions & helpful info' },
  { key: 'location', name: 'Location & Map', badge: '#location', description: 'Visit Us at Pathadipalam directions' },
  { key: 'reservation', name: 'Table Reservation', badge: '#reserve', description: 'Direct table booking banner' },
  { key: 'footer', name: 'Footer Banner', badge: 'Bottom', description: 'Rooted in Nature brand statement' },
];

export const HeadingsManager: React.FC<HeadingsManagerProps> = ({ onSuccessNotice }) => {
  const [config, setConfig] = useState<SiteHeadingsConfig>(defaultHeadingsConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hero: true,
    brandIntro: true,
    menu: true,
  });

  // Subscribe to live Firestore headings config
  useEffect(() => {
    const unsubscribe = subscribeHeadingsConfig((liveConfig) => {
      setConfig(liveConfig);
    });
    return () => unsubscribe();
  }, []);

  const handleModePreset = (mode: HeadingsLanguageMode) => {
    let newSections: SiteSectionsHeadings;
    if (mode === 'ml') {
      newSections = { ...DEFAULT_HEADINGS_ML };
    } else if (mode === 'bilingual') {
      newSections = { ...DEFAULT_HEADINGS_BILINGUAL };
    } else {
      newSections = { ...DEFAULT_HEADINGS_EN };
    }

    setConfig({
      languageMode: mode,
      sections: newSections,
    });
  };

  const handleUpdateField = (
    sectionKey: keyof SiteSectionsHeadings,
    field: 'eyebrow' | 'title' | 'subtitle' | 'highlight',
    val: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      languageMode: 'custom',
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections[sectionKey],
          [field]: val,
        },
      },
    }));
  };

  const handleSetSectionMalayalam = (sectionKey: keyof SiteSectionsHeadings) => {
    setConfig((prev) => ({
      ...prev,
      languageMode: 'custom',
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...DEFAULT_HEADINGS_ML[sectionKey],
        },
      },
    }));
  };

  const handleSetSectionEnglish = (sectionKey: keyof SiteSectionsHeadings) => {
    setConfig((prev) => ({
      ...prev,
      languageMode: 'custom',
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...DEFAULT_HEADINGS_EN[sectionKey],
        },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveHeadingsConfig(config);
      setSaveSuccess(true);
      if (onSuccessNotice) {
        onSuccessNotice('Website headings successfully updated and published live!');
      }
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save headings:', err);
      alert('Failed to save headings. Please check permissions or network.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    SECTION_METAS.forEach((m) => (allExpanded[m.key] = true));
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const filteredSections = SECTION_METAS.filter((meta) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const sectionData = config.sections[meta.key];
    return (
      meta.name.toLowerCase().includes(q) ||
      meta.badge.toLowerCase().includes(q) ||
      (sectionData.title || '').toLowerCase().includes(q) ||
      (sectionData.eyebrow || '').toLowerCase().includes(q) ||
      (sectionData.subtitle || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header & Live Save Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <div className="text-xs sm:text-sm">
            <span className="font-semibold">Headings Published Live!</span> All section titles and eyebrows are synchronized across the website.
          </div>
        </div>
      )}

      {/* 2. Top Control Bar: Language Presets & Save Action */}
      <div className="p-6 rounded-3xl bg-[#050505] border border-[#262626]/60 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center lg:text-left">
          <div className="flex items-center gap-2.5 justify-center lg:justify-start">
            <Languages className="w-5 h-5 text-[#C5A46D]" />
            <h3 className="text-lg font-serif-display font-medium text-[#F8F6EE]">
              Website Headings &amp; Malayalam Language Manager
            </h3>
          </div>
          <p className="text-xs text-[#A3A3A3] max-w-xl">
            Switch website headings to natural Malayalam, standard English, or customize every section title individually.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Quick Language Mode Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-[#121212] border border-[#262626]/60">
            <button
              type="button"
              onClick={() => handleModePreset('en')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                config.languageMode === 'en'
                  ? 'bg-[#C5A46D] text-[#050505] shadow'
                  : 'text-[#E5E5E5] hover:text-[#F8F6EE]'
              }`}
            >
              <span>🇬🇧 English</span>
            </button>

            <button
              type="button"
              onClick={() => handleModePreset('ml')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                config.languageMode === 'ml'
                  ? 'bg-[#C5A46D] text-[#050505] shadow'
                  : 'text-[#E5E5E5] hover:text-[#F8F6EE]'
              }`}
            >
              <span>🌴 മലയാളം</span>
            </button>

            <button
              type="button"
              onClick={() => handleModePreset('bilingual')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                config.languageMode === 'bilingual'
                  ? 'bg-[#C5A46D] text-[#050505] shadow'
                  : 'text-[#E5E5E5] hover:text-[#F8F6EE]'
              }`}
            >
              <span>🌐 Bilingual</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5A46D] hover:bg-[#d8b982] text-[#050505] transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-[#050505]" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save &amp; Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Search & Quick Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#050505] border border-[#262626]/50">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
          <input
            type="text"
            placeholder="Search section or heading..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] placeholder-[#A3A3A3] focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg bg-[#121212] hover:bg-[#262626] text-[#A3A3A3] hover:text-[#F8F6EE] border border-[#262626]/50 transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg bg-[#121212] hover:bg-[#262626] text-[#A3A3A3] hover:text-[#F8F6EE] border border-[#262626]/50 transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 4. Section Heading Cards */}
      <div className="space-y-4">
        {filteredSections.map((meta) => {
          const sectionKey = meta.key;
          const heading = config.sections[sectionKey] || DEFAULT_HEADINGS_EN[sectionKey];
          const isExpanded = !!expandedSections[sectionKey];

          return (
            <div
              key={sectionKey}
              className="rounded-3xl bg-[#050505] border border-[#262626]/60 overflow-hidden transition-all shadow-md"
            >
              {/* Section Header Bar */}
              <div
                onClick={() => toggleSection(sectionKey)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-[#0c0c0c] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#121212] border border-[#262626] text-[10px] font-mono text-[#C5A46D] font-semibold">
                    {meta.badge}
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-serif-display font-medium text-[#F8F6EE] flex items-center gap-2">
                      <span>{meta.name}</span>
                    </h4>
                    <p className="text-[11px] text-[#A3A3A3] line-clamp-1 mt-0.5">
                      {heading.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quick Section Translate to Malayalam Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetSectionMalayalam(sectionKey);
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121212] hover:bg-[#262626] border border-[#262626]/60 text-[11px] text-[#C5A46D] transition-colors cursor-pointer"
                    title="Translate this section to Malayalam"
                  >
                    <span>🌴 മലയാളമാക്കുക</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetSectionEnglish(sectionKey);
                    }}
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#121212] hover:bg-[#262626] border border-[#262626]/60 text-[11px] text-[#A3A3A3] hover:text-[#F8F6EE] transition-colors cursor-pointer"
                    title="Reset to English"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>EN</span>
                  </button>

                  <div className="p-1.5 rounded-lg text-[#A3A3A3]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Form Body */}
              {isExpanded && (
                <div className="p-6 border-t border-[#262626]/40 bg-[#090909] space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-[#A3A3A3] pb-2 border-b border-[#262626]/30">
                    <span>{meta.description}</span>
                    <div className="flex items-center gap-2 sm:hidden">
                      <button
                        type="button"
                        onClick={() => handleSetSectionMalayalam(sectionKey)}
                        className="text-[#C5A46D] font-medium"
                      >
                        🌴 മലയാളം
                      </button>
                      <span>&bull;</span>
                      <button
                        type="button"
                        onClick={() => handleSetSectionEnglish(sectionKey)}
                        className="text-[#A3A3A3]"
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Eyebrow / Tagline Input (if applicable) */}
                    {heading.eyebrow !== undefined && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                          Badge / Eyebrow Tagline
                        </label>
                        <input
                          type="text"
                          value={heading.eyebrow || ''}
                          onChange={(e) => handleUpdateField(sectionKey, 'eyebrow', e.target.value)}
                          placeholder="e.g. AUTHENTIC KERALA SEAFOOD"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
                        />
                      </div>
                    )}

                    {/* Main Title Input */}
                    <div className={heading.eyebrow !== undefined ? 'space-y-1.5' : 'md:col-span-2 space-y-1.5'}>
                      <label className="text-xs font-mono uppercase tracking-wider text-[#C5A46D] font-semibold block">
                        Main Section Title (H2)
                      </label>
                      <input
                        type="text"
                        value={heading.title || ''}
                        onChange={(e) => handleUpdateField(sectionKey, 'title', e.target.value)}
                        placeholder="e.g. Fresh Catch from the Harbour"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] font-medium focus:outline-none focus:border-[#C5A46D]"
                      />
                    </div>

                    {/* Highlight (Used by BrandIntro) */}
                    {meta.hasHighlight && (
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                          Italic Highlight Motto (Accent Callout)
                        </label>
                        <input
                          type="text"
                          value={heading.highlight || ''}
                          onChange={(e) => handleUpdateField(sectionKey, 'highlight', e.target.value)}
                          placeholder="e.g. A living taste of Kerala."
                          className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
                        />
                      </div>
                    )}

                    {/* Subtitle / Description Input */}
                    {heading.subtitle !== undefined && (
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                          Subtitle / Narrative Description
                        </label>
                        <input
                          type="text"
                          value={heading.subtitle || ''}
                          onChange={(e) => handleUpdateField(sectionKey, 'subtitle', e.target.value)}
                          placeholder="e.g. Served on Living Banana Leaf"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#262626]/60 text-xs text-[#F8F6EE] focus:outline-none focus:border-[#C5A46D]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Live Visual Preview Card */}
                  <div className="p-4 rounded-2xl bg-[#050505] border border-[#262626]/50 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#C5A46D]">
                      <Eye className="w-3 h-3" />
                      <span>Live Section Preview</span>
                    </div>

                    <div className="text-center sm:text-left py-2 space-y-1">
                      {heading.eyebrow && (
                        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#C5A46D] block">
                          {heading.eyebrow}
                        </span>
                      )}
                      <h3 className="text-base sm:text-xl font-serif-display font-medium text-[#F8F6EE] leading-tight">
                        {heading.title}
                        {heading.highlight && (
                          <span className="block font-editorial italic text-transparent bg-clip-text bg-gradient-to-r from-[#D8B982] via-[#F8F6EE] to-[#C5A46D] pt-0.5">
                            {heading.highlight}
                          </span>
                        )}
                      </h3>
                      {heading.subtitle && (
                        <p className="text-xs text-[#A3A3A3] font-light max-w-xl">
                          {heading.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
