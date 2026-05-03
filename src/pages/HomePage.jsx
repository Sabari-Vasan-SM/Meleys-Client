import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Moon, Sun, Settings, LogOut, FileText, Trash2, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoteEditor } from '@/components/NoteEditor';
import { AccountMenu } from '@/components/AccountMenu';

export function HomePage({ onLogout, user }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [savedNotes, setSavedNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, [isDarkMode]);

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('/api/notes', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.success) {
                    const formattedNotes = data.notes.map(note => ({
                        id: note.id,
                        title: note.title,
                        content: note.content,
                        tone: getInitialTone(),
                        updatedAt: new Date(note.updated_at).toLocaleString(),
                    }));
                    setSavedNotes(formattedNotes);
                }
            } catch (error) {
                console.error('Error loading notes:', error);
            }
        };

        loadNotes();
    }, []);

    const getInitialTone = () => ({
        id: 'lavender',
        label: 'Lavender',
        background: '#ffffff',
        accent: '#d6c8ff'
    });

    const toggleDarkMode = () => {
        setIsDarkMode((value) => !value);
    };

    const handleSaveNote = async (note) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: note.title,
                    content: note.content,
                }),
            });

            const data = await response.json();
            if (data.success) {
                const savedNote = {
                    ...note,
                    id: data.note.id,
                    updatedAt: new Date().toLocaleString(),
                };
                setSavedNotes((currentNotes) => [savedNote, ...currentNotes]);
            } else {
                console.error('Failed to save note:', data.error);
                setSavedNotes((currentNotes) => [note, ...currentNotes]);
            }
        } catch (error) {
            console.error('Error saving note:', error);
            setSavedNotes((currentNotes) => [note, ...currentNotes]);
        }
    };

    const filteredNotes = useMemo(() => {
        if (!searchQuery) return savedNotes;
        return savedNotes.filter(note =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [savedNotes, searchQuery]);

    const renderedSavedNotes = useMemo(
        () =>
            filteredNotes.map((note) => (
                <Card key={note.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-sm text-muted-foreground line-clamp-3 mb-3"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                        <div className="text-xs text-muted-foreground">
                            Updated {note.updatedAt}
                        </div>
                    </CardContent>
                </Card>
            )),
        [filteredNotes],
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <FileText className="h-4 w-4" />
                            </div>
                            <h1 className="text-xl font-semibold">Meleys</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>

                        <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
                            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}>
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={cn(
                    "w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
                    "hidden md:block",
                    !isSidebarOpen && "md:hidden"
                )}>
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">Meleys</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    All Notes
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Trash
                                </Button>
                            </nav>
                        </div>
                        <div className="p-4">
                            <Button
                                onClick={() => setIsEditorOpen(true)}
                                className="w-full"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                New Note
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">Your Notes</h2>
                        <p className="text-muted-foreground">
                            {filteredNotes.length === 0
                                ? "No notes yet. Create your first note to get started."
                                : `${filteredNotes.length} ${filteredNotes.length === 1 ? 'note' : 'notes'}`
                            }
                        </p>
                    </div>

                    {filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                                <FileText className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
                            <p className="text-muted-foreground mb-4 text-center max-w-md">
                                Create your first note to get started with organizing your thoughts and ideas.
                            </p>
                            <Button onClick={() => setIsEditorOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First Note
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {renderedSavedNotes}
                        </div>
                    )}
                </main>
            </div>

            {/* Floating Action Button */}
            <Button
                onClick={() => setIsEditorOpen(true)}
                size="lg"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            >
                <Plus className="h-6 w-6" />
            </Button>

            {/* Account Menu */}
            {isAccountMenuOpen && (
                <div className="fixed inset-0 z-50" onClick={() => setIsAccountMenuOpen(false)}>
                    <div className="absolute right-4 top-16 w-64 rounded-lg border bg-background p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-semibold">{user?.fullName || 'User'}</h4>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                            <div className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsSettingsOpen(true)}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-destructive" onClick={onLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}>
                    <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Settings</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Dark Mode</h4>
                                    <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={toggleDarkMode}>
                                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                </Button>
                            </div>
                            <Button variant="destructive" className="w-full" onClick={onLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Note Editor */}
            <NoteEditor
                open={isEditorOpen}
                darkMode={isDarkMode}
                onClose={() => setIsEditorOpen(false)}
                onSave={handleSaveNote}
                onToggleDarkMode={toggleDarkMode}
            />
        </div>
    );
}
