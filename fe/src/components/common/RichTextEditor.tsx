import React, { useEffect, useRef, useState } from "react";
import { Extension } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Eraser,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Palette,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
  Upload,
  X,
  ExternalLink,
} from "lucide-react";
import { uploadApi } from "@/services/api";

// Custom TipTap Extension: Hỗ trợ chọn cỡ chữ tuỳ ý (px)
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] as string[] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null as string | null,
            parseHTML: (el: HTMLElement) =>
              el.style.fontSize?.replace(/['"]+/g, "") || null,
            renderHTML: (attrs: { fontSize?: string | null }) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    } as any;
  },
});

const WORD_FONT_SIZES = [
  { size: 12, label: "12px" },
  { size: 13, label: "13px" },
  { size: 14, label: "14px (Văn bản chuẩn)" },
  { size: 16, label: "16px (Văn bản lớn)" },
  { size: 18, label: "18px (Tiêu đề 3 - H3)" },
  { size: 20, label: "20px" },
  { size: 22, label: "22px (Tiêu đề 2 - H2)" },
  { size: 24, label: "24px" },
  { size: 28, label: "28px (Tiêu đề 1 - H1)" },
  { size: 32, label: "32px" },
  { size: 36, label: "36px" },
  { size: 48, label: "48px" },
];

const PRESET_COLORS = [
  "#000000",
  "#334155",
  "#64748b",
  "#94a3b8",
  "#059669",
  "#0d9488",
  "#0284c7",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#d97706",
];

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung bài viết chi tiết tại đây...",
  minHeight = 320,
  disabled = false,
}) => {
  const safeValue = value || "";
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const colorPaletteRef = useRef<HTMLDivElement | null>(null);
  const fontSizeWrapperRef = useRef<HTMLDivElement | null>(null);
  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [fontSizeInput, setFontSizeInput] = useState("");
  const [colorOpen, setColorOpen] = useState(false);
  const [customHex, setCustomHex] = useState("");

  // Link Modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Image Modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageTab, setImageTab] = useState<"file" | "url">("file");

  // Preview Modal
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleUploadImageFile = async (file: File): Promise<string> => {
    const res = await uploadApi.uploadImage(file, "news");
    return res.url;
  };

  const processAndInsertFiles = async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of imageFiles) {
        const url = await handleUploadImageFile(file);
        if (url && editor && !editor.isDestroyed) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    } catch (err) {
      console.error("Upload image error:", err);
      alert("Không thể tải ảnh lên máy chủ. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-emerald-600 font-semibold underline underline-offset-2 hover:text-emerald-800",
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-2xl my-4 max-w-full h-auto mx-auto border border-slate-200 shadow-md",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      TextStyle,
      Color,
      FontSize,
    ],
    content: safeValue,
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "prose-editor focus:outline-none px-5 py-4 text-sm text-slate-800 " +
          "[&_h1]:text-2xl [&_h1]:font-black [&_h1]:my-4 [&_h1]:text-slate-900 " +
          "[&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:my-3 [&_h2]:text-slate-900 " +
          "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2 [&_h3]:text-slate-900 " +
          "[&_p]:my-2 [&_p]:leading-relaxed " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:bg-emerald-50/50 [&_blockquote]:rounded-r-xl " +
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 " +
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 " +
          "[&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-emerald-800 " +
          "[&_pre]:rounded-2xl [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre]:my-3 " +
          "[&_hr]:my-4 [&_hr]:border-slate-200 " +
          "[&_u]:underline",
        style: `min-height: ${minHeight}px;`,
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length > 0) {
          event.preventDefault();
          processAndInsertFiles(files);
          return true;
        }
        return false;
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length > 0) {
          event.preventDefault();
          processAndInsertFiles(files);
          return true;
        }
        return false;
      },
    },
    onSelectionUpdate: ({ editor: ed }) => {
      const { from, to } = ed.state.selection;
      savedSelectionRef.current = { from, to };

      const sizeAttr = ed.getAttributes("textStyle").fontSize;
      if (sizeAttr) {
        setFontSizeInput(String(sizeAttr).replace("px", ""));
      } else if (ed.isActive("heading", { level: 1 })) {
        setFontSizeInput("28");
      } else if (ed.isActive("heading", { level: 2 })) {
        setFontSizeInput("22");
      } else if (ed.isActive("heading", { level: 3 })) {
        setFontSizeInput("18");
      } else {
        setFontSizeInput("");
      }
    },
    onUpdate: ({ editor: ed }) => {
      if (ed.isDestroyed) return;
      const html = ed.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (editor.getHTML() !== safeValue) {
      editor.commands.setContent(safeValue, { emitUpdate: false });
    }
  }, [editor, safeValue]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        colorPaletteRef.current &&
        !colorPaletteRef.current.contains(event.target as Node)
      ) {
        setColorOpen(false);
      }
      if (
        fontSizeWrapperRef.current &&
        !fontSizeWrapperRef.current.contains(event.target as Node)
      ) {
        setFontSizeOpen(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  if (!editor) return null;

  const handleToggleHeading = (level: 1 | 2 | 3) => {
    if (editor.isActive("heading", { level })) {
      editor.chain().focus().setParagraph().run();
      setFontSizeInput("");
      return;
    }

    const { state } = editor;
    const { from, to, $from } = state.selection;
    const blockStart = $from.start();
    const blockEnd = $from.end();
    const currentColor = editor.getAttributes("textStyle").color as string | undefined;

    const chain = editor.chain().focus().setHeading({ level });
    chain.setTextSelection({ from: blockStart, to: blockEnd }).unsetMark("textStyle");
    if (currentColor) chain.setColor(currentColor);
    chain.setTextSelection({ from, to }).run();

    if (level === 1) setFontSizeInput("28");
    else if (level === 2) setFontSizeInput("22");
    else if (level === 3) setFontSizeInput("18");
  };

  const applyFontSize = (sizePx: number | string) => {
    const val = typeof sizePx === "number" ? sizePx : parseInt(String(sizePx).trim(), 10);
    if (!val || isNaN(val) || val < 8 || val > 120) return;

    if (savedSelectionRef.current) {
      const { from, to } = savedSelectionRef.current;
      editor.chain().focus().setTextSelection({ from, to }).run();
    } else {
      editor.chain().focus().run();
    }

    (editor.chain().focus() as any).setFontSize(`${val}px`).run();
    setFontSizeInput(String(val));
    setFontSizeOpen(false);
  };

  const clearFontSize = () => {
    if (savedSelectionRef.current) {
      const { from, to } = savedSelectionRef.current;
      editor.chain().focus().setTextSelection({ from, to }).run();
    } else {
      editor.chain().focus().run();
    }
    (editor.chain().focus() as any).unsetFontSize().run();
    setFontSizeInput("");
    setFontSizeOpen(false);
  };

  const applyColor = (hex: string) => {
    if (savedSelectionRef.current) {
      const { from, to } = savedSelectionRef.current;
      editor.chain().focus().setTextSelection({ from, to }).run();
    } else {
      editor.chain().focus().run();
    }
    editor.chain().focus().setColor(hex).run();
    setColorOpen(false);
  };

  const openLinkModal = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setLinkModalOpen(true);
  };

  const saveLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      let finalUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
      editor.chain().focus().setLink({ href: finalUrl }).run();
    }
    setLinkModalOpen(false);
    setLinkUrl("");
  };

  const insertImageFromUrl = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
      setImageUrl("");
      setImageModalOpen(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processAndInsertFiles(Array.from(files));
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImageModalOpen(false);
    }
  };

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all flex flex-col"
      data-lenis-prevent
    >
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Editor Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200/90 p-2 sm:p-2.5 flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-700">
        {/* Undo / Redo */}
        <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
            title="Làm lại (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5" />

        {/* Headings */}
        <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5">
          <button
            type="button"
            onClick={() => handleToggleHeading(1)}
            className={`p-1.5 rounded-lg text-xs font-black transition-colors ${
              editor.isActive("heading", { level: 1 })
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Tiêu đề 1 (H1)"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleToggleHeading(2)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Tiêu đề 2 (H2)"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleToggleHeading(3)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Tiêu đề 3 (H3)"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Font Size Selector */}
        <div className="relative" ref={fontSizeWrapperRef}>
          <button
            type="button"
            onClick={() => setFontSizeOpen(!fontSizeOpen)}
            className="h-8 px-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors"
            title="Kích thước chữ"
          >
            <span>{fontSizeInput ? `${fontSizeInput}px` : "Cỡ chữ"}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {fontSizeOpen && (
            <div className="absolute top-10 left-0 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn">
              <div className="flex items-center gap-1 pb-2 mb-2 border-b border-slate-100">
                <input
                  type="number"
                  min={8}
                  max={120}
                  placeholder="Nhập px..."
                  value={fontSizeInput}
                  onChange={(e) => setFontSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyFontSize(fontSizeInput);
                    }
                  }}
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => applyFontSize(fontSizeInput)}
                  className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold"
                >
                  OK
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {WORD_FONT_SIZES.map((f) => (
                  <button
                    key={f.size}
                    type="button"
                    onClick={() => applyFontSize(f.size)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors flex items-center justify-between"
                  >
                    <span>{f.label}</span>
                    {fontSizeInput === String(f.size) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={clearFontSize}
                className="w-full mt-2 pt-1.5 border-t border-slate-100 text-[11px] text-slate-500 hover:text-rose-600 text-center font-bold block"
              >
                Mặc định cỡ chữ
              </button>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5" />

        {/* Text Styles */}
        <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("bold")
                ? "bg-emerald-600 text-white font-bold"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Đậm (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("italic")
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Nghiêng (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("underline")
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Gạch chân (Ctrl+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("strike")
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Gạch ngang"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("code")
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Mã nguồn inline"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Xóa định dạng"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Color Picker */}
        <div className="relative" ref={colorPaletteRef}>
          <button
            type="button"
            onClick={() => setColorOpen(!colorOpen)}
            className="h-8 px-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition-colors"
            title="Màu chữ"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-600" />
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {colorOpen && (
            <div className="absolute top-10 left-0 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-fadeIn">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Chọn màu chữ
              </span>
              <div className="grid grid-cols-6 gap-2 mb-3">
                {PRESET_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => applyColor(hex)}
                    style={{ backgroundColor: hex }}
                    className="w-6 h-6 rounded-lg border border-slate-200/80 hover:scale-115 transition-transform cursor-pointer"
                    title={hex}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="#059669"
                  value={customHex}
                  onChange={(e) => setCustomHex(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customHex.trim()) applyColor(customHex.trim());
                  }}
                  className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5" />

        {/* Text Alignment */}
        <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: "left" })
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Căn trái"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: "center" })
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Căn giữa"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: "right" })
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Căn phải"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: "justify" })
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Căn đều hai bên"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5" />

        {/* Lists & Quotes */}
        <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("bulletList")
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("orderedList")
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Danh sách đánh số"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("blockquote")
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Trích dẫn (Quote)"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
            title="Đường phân cách ngang"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 mx-0.5" />

        {/* Insert Media: Links & Images */}
        <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5">
          <button
            type="button"
            onClick={openLinkModal}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("link")
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Chèn liên kết"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setImageModalOpen(true)}
            disabled={isUploading}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors"
            title="Chèn hình ảnh (Upload hoặc dán URL)"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            )}
          </button>
        </div>

        {/* Live Preview Button */}
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors"
          title="Xem trước định dạng hiển thị thực tế"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Xem Trước</span>
        </button>
      </div>

      {/* Main TipTap Content Area */}
      <div className="relative flex-1 bg-white cursor-text">
        <EditorContent editor={editor} />
      </div>

      {/* Link Dialog Modal */}
      {linkModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          data-lenis-prevent
        >
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-600" />
                Chèn Liên Kết
              </h3>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Đường dẫn liên kết (URL)
              </label>
              <input
                type="url"
                autoFocus
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveLink();
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={saveLink}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                Áp Dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          data-lenis-prevent
        >
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Chèn Hình Ảnh
              </h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex border-b border-slate-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setImageTab("file")}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  imageTab === "file"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                Tải ảnh từ máy tính
              </button>
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  imageTab === "url"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                Dán đường dẫn ảnh (URL)
              </button>
            </div>

            {imageTab === "file" ? (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors"
                >
                  <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">
                    Bấm để chọn file ảnh hoặc kéo thả vào đây
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Hỗ trợ JPG, PNG, WEBP (Tự động tải lên máy chủ)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  URL Hình Ảnh
                </label>
                <input
                  type="url"
                  placeholder="https://... hoặc /uploads/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={insertImageFromUrl}
                  disabled={!imageUrl.trim()}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 transition-colors shadow-md shadow-emerald-600/20"
                >
                  Chèn Ảnh Này
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          data-lenis-prevent
        >
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                Xem Trước Định Dạng Bài Viết
              </h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto py-6 px-2 prose-content text-slate-800 leading-relaxed text-sm overscroll-contain"
              data-lenis-prevent
              dangerouslySetInnerHTML={{
                __html: editor.getHTML() || "<p class='text-slate-400 italic'>Chưa có nội dung để xem trước.</p>",
              }}
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Đóng Xem Trước
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
