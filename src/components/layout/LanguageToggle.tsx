import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="language-toggle" className="text-sm font-medium text-foreground cursor-pointer">
        {t('language.english')}
      </Label>
      <Switch
        id="language-toggle"
        checked={language === 'ta'}
        onCheckedChange={toggleLanguage}
      />
      <Label htmlFor="language-toggle" className="text-sm font-medium text-foreground cursor-pointer">
        {t('language.tamil')}
      </Label>
    </div>
  );
}
