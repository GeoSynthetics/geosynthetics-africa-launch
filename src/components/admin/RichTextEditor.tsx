import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Quote,
  RemoveFormatting,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write post content here...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeButtons, setActiveButtons] = useState<Record<string, boolean>>({});

  // Sync state from editor
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If editor is empty or contains only a break, set value to empty string
      if (html === "<br>" || html === "") {
        onChange("");
      } else {
        onChange(html);
      }
    }
  };

  // Sync state to editor on mount (or if the database loaded it)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, []);

  const executeCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    handleInput();
    updateActiveStates();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleLink = () => {
    const url = prompt("Enter link URL:");
    if (url !== null) {
      executeCommand("createLink", url);
    }
  };

  const updateActiveStates = () => {
    setActiveButtons({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  return (
    <div className="w-full border border-border/80 rounded-xl overflow-hidden bg-card focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 items-center p-2 border-b border-border/50 bg-muted/30 select-none">
        <Button
          type="button"
          variant={activeButtons.bold ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={activeButtons.italic ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={activeButtons.underline ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground font-semibold"
          onClick={() => executeCommand("formatBlock", "<h1>")}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground font-semibold"
          onClick={() => executeCommand("formatBlock", "<h2>")}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground font-semibold"
          onClick={() => executeCommand("formatBlock", "<h3>")}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground font-semibold"
          onClick={() => executeCommand("formatBlock", "<p>")}
          title="Paragraph"
        >
          <span className="text-xs font-bold font-sans">P</span>
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant={activeButtons.insertUnorderedList ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("insertUnorderedList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={activeButtons.insertOrderedList ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("insertOrderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("formatBlock", "<blockquote>")}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("justifyLeft")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("justifyCenter")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("justifyRight")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("justifyFull")}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={handleLink}
          title="Add Link"
        >
          <Link2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("removeFormat")}
          title="Clear Formatting"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>
      </div>

      {/* Editing Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={updateActiveStates}
        onMouseUp={updateActiveStates}
        className={cn(
          "min-h-[350px] p-4 bg-background outline-none overflow-y-auto cursor-text text-sm prose max-w-none text-foreground",
          "focus:outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:font-display [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:uppercase [&_h1]:tracking-wide",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:font-display [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:uppercase [&_h2]:tracking-tight",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-3",
          "[&_p]:mb-3 [&_p]:leading-relaxed",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-muted-foreground",
          "[&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary-hover",
        )}
        data-placeholder={placeholder}
      />
    </div>
  );
}
