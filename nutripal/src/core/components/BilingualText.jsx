// Shared bilingual text component — displays Myanmar and English
// TODO: Implement per spec — bilingual by design, every user-facing string ships in both languages
export default function BilingualText({ my, en }) {
  return (
    <div>
      <span>{my}</span>
      <br />
      <span>{en}</span>
    </div>
  );
}
