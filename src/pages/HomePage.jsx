import { useEffect, useMemo, useState } from 'react';
import { AccountMenu } from '../components/AccountMenu';
import { NoteEditor } from '../components/NoteEditor';
import { sidebarNav } from '../data/dashboardContent';

const Icon = ({ name }) => (
    <span className="material-symbols-outlined">{name}</span>
);

const iconMap = {
    notes: 'description',
    trash: 'delete',
};

export function HomePage({ onLogout }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [savedNotes, setSavedNotes] = useState([]);

    useEffect(() => {
        document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
        return () => {
            document.documentElement.dataset.theme = 'light';
        };
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((value) => !value);
    };

    const handleSaveNote = (note) => {
        setSavedNotes((currentNotes) => [note, ...currentNotes]);
    };

    const renderedSavedNotes = useMemo(
        () =>
            savedNotes.map((note) => (
                <article key={note.id} className={`note-card note-card--saved note-tone-${note.tone.id}`}>
                    <span className="saved-note-label">Saved Note</span>
                    <h2>{note.title}</h2>
                    <div className="saved-note-preview" dangerouslySetInnerHTML={{ __html: note.content }} />
                    <span className="saved-note-meta">Updated {note.updatedAt}</span>
                </article>
            )),
        [savedNotes],
    );

    return (
        <main className="dashboard-shell">
            <aside className="sidebar">
                <div className="brand-block">
                    <div>
                        <h1>Meleys</h1>
                        
                    </div>
                </div>

                <nav className="sidebar-nav" aria-label="Primary">
                    {sidebarNav.map((item) => {
                        const iconName = iconMap[item.icon] || 'folder';

                        return (
                            <button key={item.label} type="button" className={item.active ? 'nav-item active' : 'nav-item'}>
                                <Icon name={iconName} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                    <button type="button" className="nav-item" onClick={() => setIsEditorOpen(true)}>
                        <Icon name="add" />
                        <span>New Note</span>
                    </button>
                </nav>
            </aside>

            <section className="workspace">
                <header className="topbar">
                    <label className="search-shell" aria-label="Search notes">
                        <Icon name="search" />
                        <input type="search" placeholder="Search your notes" />
                    </label>

                    <div className="topbar-actions">
                        <button type="button" className="ghost-icon-button" aria-label="Toggle theme" onClick={toggleDarkMode}>
                            <Icon name={isDarkMode ? 'light_mode' : 'dark_mode'} />
                        </button>
                        <button
                            type="button"
                            className="ghost-icon-button"
                            aria-label="Account menu"
                            onClick={() => setIsAccountMenuOpen((value) => !value)}
                        >
                            <Icon name="account_circle" />
                        </button>
                    </div>
                </header>

                <div className="dashboard-grid">
                    {renderedSavedNotes}
                </div>

                <button type="button" className="floating-action" aria-label="Create note" onClick={() => setIsEditorOpen(true)}>
                    <Icon name="add" />
                </button>
            </section>

            {isAccountMenuOpen ? (
                <AccountMenu
                    onOpenSettings={() => {
                        setIsAccountMenuOpen(false);
                        setIsSettingsOpen(true);
                    }}
                    onLogout={onLogout}
                    onClose={() => setIsAccountMenuOpen(false)}
                />
            ) : null}

            {isSettingsOpen ? (
                <div className="settings-backdrop" onClick={() => setIsSettingsOpen(false)} role="presentation">
                    <section className="settings-panel" role="dialog" aria-label="Settings panel" onClick={(event) => event.stopPropagation()}>
                        <div className="settings-panel__header">
                            <h2>Settings</h2>
                            <button type="button" className="settings-panel__close" onClick={() => setIsSettingsOpen(false)}>
                                Close
                            </button>
                        </div>

                        <div className="settings-card">
                            <div>
                                <strong>Dark mode</strong>
                                <p>Switch the interface between light and dark tones.</p>
                            </div>
                            <button
                                type="button"
                                className={isDarkMode ? 'theme-toggle theme-toggle--active' : 'theme-toggle'}
                                onClick={toggleDarkMode}
                            >
                                <span className="theme-toggle__thumb" />
                            </button>
                        </div>

                        <button type="button" className="settings-panel__logout" onClick={onLogout}>
                            Log out now
                        </button>
                    </section>
                </div>
            ) : null}

            <NoteEditor
                open={isEditorOpen}
                darkMode={isDarkMode}
                onClose={() => setIsEditorOpen(false)}
                onSave={handleSaveNote}
                onToggleDarkMode={toggleDarkMode}
            />
        </main>
    );
}
