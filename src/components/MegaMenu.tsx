import { useEffect, useRef, useState } from 'react';

interface MegaMenuProps {
  onSelectCategory: (genre: string) => void;
}

const CATEGORY_TAGS = [
  'Action', 'Adventure', 'Cars', 'Comedy',
  'Dementia', 'Demons', 'Drama', 'Ecchi',
  'Fantasy', 'Game', 'Harem', 'Historical',
  'Horror', 'Josei', 'Kids', 'Magic',
  'Martial Arts', 'Mecha', 'Military', 'Music',
  'Mystery', 'Parody', 'Police', 'Psychological',
  'Romance', 'Samurai', 'School', 'Sci-Fi',
  'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai',
  'Slice of Life', 'Space', 'Sports', 'Super Power',
  'Supernatural', 'Thriller', 'Vampire', 'Yaoi',
  'Yuri',
];

export function MegaMenu({ onSelectCategory }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Toggle open/close
  const toggle = () => setOpen((prev) => !prev);

  // Outside click handler
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={toggle}
        style={{
          background: open ? 'var(--accent)' : 'transparent',
          color: open ? '#fff' : 'var(--text-muted)',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          padding: '6px 14px',
          borderRadius: '6px',
          transition: 'background 0.2s, color 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        Filter ▾
      </button>

      {/* Overlay + Dropdown */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '80px',
            background: 'rgba(0,0,0,0.45)',
          }}
        >
          <div
            ref={menuRef}
            style={{
              width: '780px',
              maxWidth: 'calc(100vw - 48px)',
              background: 'rgba(24, 24, 27, 0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              padding: '20px',
            }}
          >
            {/* Category Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {CATEGORY_TAGS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid transparent',
                    background: 'rgba(39, 39, 42, 0.8)',
                    color: 'var(--text)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(63, 63, 70, 1)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(39, 39, 42, 0.8)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <span>{cat}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>→</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '14px' }} />
          </div>
        </div>
      )}
    </>
  );
}