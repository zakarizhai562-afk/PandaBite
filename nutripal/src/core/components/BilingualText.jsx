// Shared bilingual text component — displays Myanmar and English
import { useState } from 'react';

export default function BilingualText({ my, en }) {
  const [lang, setLang] = useState('en');

  return (
    <div>
      <button
        onClick={() => setLang(lang === 'en' ? 'my' : 'en')}
        style={{
          fontSize: '11px',
          background: 'none',
          border: 'none',
          color: '#5B6B61',
          textDecoration: 'underline',
          cursor: 'pointer',
          marginBottom: '4px',
        }}
      >
        {lang === 'en' ? 'မြန်မာ' : 'EN'}
      </button>
      <p>{lang === 'en' ? en : my}</p>
    </div>
  );
}
