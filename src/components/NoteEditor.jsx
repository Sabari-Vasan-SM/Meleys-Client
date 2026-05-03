import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Save,
    X,
    Type,
    Palette,
    Eye,
    EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const Icon = ({ name }) => (
    <span className="material-symbols-outlined">{name}</span>
);

export function NoteEditor({ open, darkMode, onClose, onSave, onToggleDarkMode }) {
    const editorRef = useRef(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [textAlign, setTextAlign] = useState('left');
    const [selectedFont, setSelectedFont] = useState('Arial');
    const [selectedSize, setSelectedSize] = useState('16px');
    const [tone, setTone] = useState(getInitialTone());

    useEffect(() => {
        if (!open) {
            setTitle('');
            setContent('');
            setTone(getInitialTone());
            return;
        }
    }, [open]);

    const runCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        updateFormattingState();
    };

    const updateFormattingState = () => {
        setIsBold(document.queryCommandState('bold'));
        setIsItalic(document.queryCommandState('italic'));
        setIsUnderline(document.queryCommandState('underline'));
    };

    const handleSave = () => {
        const editorContent = editorRef.current?.innerHTML || '';
        const noteContent = content || editorContent;
        onSave({
            id: crypto.randomUUID(),
            title: title.trim() || 'Untitled Note',
            content: noteContent,
            tone,
            updatedAt: new Date().toLocaleString(),
        });
        onClose();
    };

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={onClose}>
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Type className="h-4 w-4" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">New Note</CardTitle>
                                <p className="text-sm text-muted-foreground">Create and format your note</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={onToggleDarkMode}>
                                {darkMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Title Input */}
                    <div className="p-6 pb-0">
                        <Input
                            placeholder="Note title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-xl font-semibold border-0 px-0 focus-visible:ring-0"
                        />
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-2 p-4 border-b overflow-x-auto">
                        <div className="flex items-center gap-1 border-r pr-2">
                            <Button
                                variant={isBold ? "default" : "ghost"}
                                size="sm"
                                onClick={() => runCommand('bold')}
                            >
                                <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={isItalic ? "default" : "ghost"}
                                size="sm"
                                onClick={() => runCommand('italic')}
                            >
                                <Italic className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={isUnderline ? "default" : "ghost"}
                                size="sm"
                                onClick={() => runCommand('underline')}
                            >
                                <Underline className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-1 border-r pr-2">
                            <Button
                                variant={textAlign === 'left' ? "default" : "ghost"}
                                size="sm"
                                onClick={() => {
                                    runCommand('justifyLeft');
                                    setTextAlign('left');
                                }}
                            >
                                <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={textAlign === 'center' ? "default" : "ghost"}
                                size="sm"
                                onClick={() => {
                                    runCommand('justifyCenter');
                                    setTextAlign('center');
                                }}
                            >
                                <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={textAlign === 'right' ? "default" : "ghost"}
                                size="sm"
                                onClick={() => {
                                    runCommand('justifyRight');
                                    setTextAlign('right');
                                }}
                            >
                                <AlignRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-1 border-r pr-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => runCommand('insertUnorderedList')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => runCommand('insertOrderedList')}
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={selectedFont} onValueChange={setSelectedFont}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Font" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Arial">Arial</SelectItem>
                                    <SelectItem value="Times New Roman">Times</SelectItem>
                                    <SelectItem value="Georgia">Georgia</SelectItem>
                                    <SelectItem value="Courier New">Courier</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={selectedSize} onValueChange={setSelectedSize}>
                                <SelectTrigger className="w-20">
                                    <SelectValue placeholder="Size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12px">12px</SelectItem>
                                    <SelectItem value="14px">14px</SelectItem>
                                    <SelectItem value="16px">16px</SelectItem>
                                    <SelectItem value="18px">18px</SelectItem>
                                    <SelectItem value="20px">20px</SelectItem>
                                    <SelectItem value="24px">24px</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 p-6">
                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            className="min-h-[300px] max-h-[400px] overflow-y-auto rounded-lg border p-4 focus:outline-none focus:ring-2 focus:ring-ring"
                            style={{
                                fontFamily: selectedFont,
                                fontSize: selectedSize,
                                backgroundColor: tone.background,
                                color: darkMode ? '#ffffff' : '#000000',
                            }}
                            onInput={(e) => setContent(e.target.innerHTML)}
                            onSelect={updateFormattingState}
                        />
                    </div>

                    {/* Paper Tone Selector */}
                    <div className="p-6 pt-0">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Palette className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Paper Tone:</span>
                            </div>
                            <div className="flex gap-2">
                                {paperTones.map((paperTone) => (
                                    <button
                                        key={paperTone.id}
                                        className={cn(
                                            "w-6 h-6 rounded-full border-2 transition-all",
                                            tone.id === paperTone.id
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-border"
                                        )}
                                        style={{ backgroundColor: paperTone.background }}
                                        onClick={() => setTone(paperTone)}
                                        aria-label={paperTone.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t">
                    <div className="text-sm text-muted-foreground">
                        {content.length} characters
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Note
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}