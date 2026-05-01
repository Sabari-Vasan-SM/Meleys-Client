import { useEffect, useRef, useState, useCallback } from 'react';

const fonts = [
    'Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS', 'Times New Roman',
    'Georgia', 'Garamond', 'Courier New', 'Brush Script MT', 'Impact', 'Comic Sans MS',
    'Consolas', 'Lucida Console', 'Monaco'
];

const fontSizes = [
    { label: 'Small', value: '2' },
    { label: 'Normal', value: '3' },
    { label: 'Medium', value: '4' },
    { label: 'Large', value: '5' },
    { label: 'X-Large', value: '6' },
    { label: 'Huge', value: '7' }
];

const paperTones = [
    { id: 'lavender', label: 'Lavender', background: '#ffffff', accent: '#d6c8ff' },
    { id: 'cream', label: 'Cream', background: '#fff8e9', accent: '#ffe8b7' },
    { id: 'sky', label: 'Sky', background: '#eef7ff', accent: '#d8ecff' },
    { id: 'mint', label: 'Mint', background: '#eefbf2', accent: '#d7f2df' },
    { id: 'rose', label: 'Rose', background: '#fff0f4', accent: '#ffd4df' },
    { id: 'silver', label: 'Silver', background: '#f3f4f7', accent: '#e1e5ed' },
];

const defaultEditorHtml = ``;

function getInitialTone() {
    return paperTones[0];
}

export function NoteEditor({ open, darkMode, onClose, onSave, onToggleDarkMode }) {
    const editorRef = useRef(null);
    const [title, setTitle] = useState('');
    const [tone, setTone] = useState(getInitialTone());
    const [floatingToolbar, setFloatingToolbar] = useState({ visible: false, top: 0, left: 0 });

    useEffect(() => {
        if (!open) {
            setFloatingToolbar({ visible: false, top: 0, left: 0 });
            return;
        }

        setTitle('');
        setTone(getInitialTone());
        setTimeout(() => {
            if (editorRef.current) {
                document.execCommand('fontName', false, 'Arial');
                document.execCommand('fontSize', false, '4');
            }
        }, 100);
    }, [open]);

    useEffect(() => {
        if (open && editorRef.current) {
            editorRef.current.innerHTML = defaultEditorHtml;
        }
    }, [open]);

    const handleSelectionChange = useCallback(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0 && editorRef.current?.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setFloatingToolbar({
                visible: true,
                top: rect.top,
                left: rect.left + rect.width / 2
            });
        } else {
            setFloatingToolbar({ visible: false, top: 0, left: 0 });
        }
    }, []);

    useEffect(() => {
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [handleSelectionChange]);

    if (!open) {
        return null;
    }

    const runCommand = (command, value = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
    };

    const toggleBlock = () => {
        editorRef.current?.focus();
        const selection = window.getSelection();
        const anchor = selection?.anchorNode?.parentElement?.closest('h1, h2, h3, p, li');
        const nextTag = anchor?.tagName === 'H1' ? 'P' : 'H1';
        document.execCommand('formatBlock', false, nextTag);
    };

    const handleSave = () => {
        const content = editorRef.current?.innerHTML || '';
        onSave({
            id: crypto.randomUUID(),
            title: title.trim() || 'Untitled Note',
            content,
            tone,
            updatedAt: new Date().toLocaleString(),
        });
        onClose();
    };

    return (
        <div className="editor-backdrop" role="presentation" onClick={onClose}>
            {floatingToolbar.visible && (
                <div
                    className="floating-toolbar editor-toolbar"
                    style={{ top: floatingToolbar.top, left: floatingToolbar.left }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <select className="editor-select" onChange={(e) => runCommand('fontName', e.target.value)} defaultValue="Arial">
                        <option value="Arial">Font</option>
                        {fonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                        ))}
                    </select>
                    <select className="editor-select" onChange={(e) => runCommand('fontSize', e.target.value)} defaultValue="4">
                        <option value="4">Size</option>
                        {fontSizes.map(size => (
                            <option key={size.value} value={size.value}>{size.label}</option>
                        ))}
                    </select>
                    <button type="button" className="tool-button" onClick={() => runCommand('bold')} aria-label="Bold">
                        <span className="material-symbols-outlined">format_bold</span>
                    </button>
                    <button type="button" className="tool-button" onClick={() => runCommand('italic')} aria-label="Italic">
                        <span className="material-symbols-outlined">format_italic</span>
                    </button>
                    <button type="button" className="tool-button" onClick={() => runCommand('underline')} aria-label="Underline">
                        <span className="material-symbols-outlined">format_underlined</span>
                    </button>
                </div>
            )}
            <section
                className="editor-shell"
                role="dialog"
                aria-modal="true"
                aria-label="Note editor"
                onClick={(event) => event.stopPropagation()}
                style={{ '--editor-paper': tone.background, '--editor-accent': tone.accent }}
            >
                <header className="editor-topbar">
                    <div className="editor-topbar__left">
                        <button type="button" className="editor-icon-button" onClick={onClose} aria-label="Back to notes">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="editor-brand">
                            <span className="material-symbols-outlined">description</span>
                            <span>Meleys</span>
                        </div>
                    </div>

                    <div className="editor-topbar__right">
                        <button type="button" className="editor-icon-button" onClick={onToggleDarkMode} aria-label="Toggle dark mode">
                            <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <button type="button" className="editor-save-button" onClick={handleSave}>
                            <span className="material-symbols-outlined">save</span>
                            <span>Save</span>
                        </button>
                    </div>
                </header>

                <div className="editor-card">
                    <div className="editor-toolbar-row">
                        <div className="editor-toolbar" aria-label="Formatting tools">
                            <select className="editor-select" onChange={(e) => runCommand('fontName', e.target.value)} defaultValue="Arial">
                                <option value="Arial">Font</option>
                                {fonts.map(font => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </select>
                            <select className="editor-select" onChange={(e) => runCommand('fontSize', e.target.value)} defaultValue="4">
                                <option value="4">Size</option>
                                {fontSizes.map(size => (
                                    <option key={size.value} value={size.value}>{size.label}</option>
                                ))}
                            </select>
                            <button type="button" className="tool-button" onClick={() => runCommand('bold')} aria-label="Bold">
                                <span className="material-symbols-outlined">format_bold</span>
                            </button>
                            <button type="button" className="tool-button" onClick={() => runCommand('italic')} aria-label="Italic">
                                <span className="material-symbols-outlined">format_italic</span>
                            </button>
                            <button type="button" className="tool-button" onClick={() => runCommand('underline')} aria-label="Underline">
                                <span className="material-symbols-outlined">format_underlined</span>
                            </button>
                            <button type="button" className="tool-button" onClick={toggleBlock} aria-label="Text style">
                                <span className="material-symbols-outlined">title</span>
                            </button>
                            <button type="button" className="tool-button" onClick={() => runCommand('insertUnorderedList')} aria-label="List">
                                <span className="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </div>

                        <div className="paper-tone-control" aria-label="Paper tone">
                            <span>PAPER TONE</span>
                            <div className="paper-tone-swatches">
                                {paperTones.map((swatch) => (
                                    <button
                                        key={swatch.id}
                                        type="button"
                                        className={tone.id === swatch.id ? 'paper-tone-swatch active' : 'paper-tone-swatch'}
                                        style={{ background: swatch.accent }}
                                        aria-label={swatch.label}
                                        onClick={() => setTone(swatch)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="editor-paper" style={{ background: 'var(--editor-paper)' }}>
                        <div
                            ref={editorRef}
                            className="editor-body"
                            contentEditable
                            suppressContentEditableWarning
                            spellCheck={false}
                            aria-label="Note content"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}