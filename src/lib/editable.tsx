import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Move, Plus, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const TEXT_KEY = "cw-site-text-overrides";
const POS_KEY = "cw-site-position-overrides";
const BOX_KEY = "cw-site-custom-text-boxes";
const STYLE_KEY = "cw-site-text-styles";

type Overrides = Record<string, string>;
type Offset = { x: number; y: number };
type Offsets = Record<string, Offset>;
type CustomBox = Offset & { id: string; text: string };
type TextStyle = { font: "sans" | "serif" | "mono"; size: string };
type TextStyles = Record<string, TextStyle>;

type EditCtx = {
  moveMode: boolean;
  textRef: { current: Overrides };
  offsetRef: { current: Offsets };
  styles: TextStyles;
  selectedId: string | null;
  ready: boolean;
  setText: (id: string, value: string) => void;
  setOffset: (id: string, value: Offset) => void;
  selectText: (id: string) => void;
  setStyle: (id: string, value: TextStyle) => void;
};

const Ctx = createContext<EditCtx | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function EditProvider({ children }: { children: ReactNode }) {
  const textRef = useRef<Overrides>({});
  const offsetRef = useRef<Offsets>({});
  const [ready, setReady] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [placingBox, setPlacingBox] = useState(false);
  const [boxes, setBoxes] = useState<CustomBox[]>([]);
  const [styles, setStyles] = useState<TextStyles>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    textRef.current = readJSON<Overrides>(TEXT_KEY, {});
    offsetRef.current = readJSON<Offsets>(POS_KEY, {});
    setBoxes(readJSON<CustomBox[]>(BOX_KEY, []));
    setStyles(readJSON<TextStyles>(STYLE_KEY, {}));
    setReady(true);
  }, []);

  function persist(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }

  function setText(id: string, value: string) {
    textRef.current = { ...textRef.current, [id]: value };
    persist(TEXT_KEY, textRef.current);
  }

  function setOffset(id: string, value: Offset) {
    offsetRef.current = { ...offsetRef.current, [id]: value };
    persist(POS_KEY, offsetRef.current);
  }

  function saveBoxes(next: CustomBox[]) {
    setBoxes(next);
    persist(BOX_KEY, next);
  }

  function setStyle(id: string, value: TextStyle) {
    setStyles((current) => {
      const next = { ...current, [id]: value };
      persist(STYLE_KEY, next);
      return next;
    });
  }

  function placeBox(event: PointerEvent<HTMLDivElement>) {
    if (!placingBox || !canvasRef.current) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-editor-control]")) return;
    const bounds = canvasRef.current.getBoundingClientRect();
    const next: CustomBox = {
      id: `custom-${Date.now()}`,
      text: "Click to edit this text",
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    saveBoxes([...boxes, next]);
    setPlacingBox(false);
  }

  function resetAll() {
    try {
      localStorage.removeItem(TEXT_KEY);
      localStorage.removeItem(POS_KEY);
      localStorage.removeItem(BOX_KEY);
      localStorage.removeItem(STYLE_KEY);
    } catch {
      /* ignore */
    }
    window.location.reload();
  }

  return (
    <Ctx.Provider
      value={{
        moveMode,
        textRef,
        offsetRef,
        styles,
        selectedId,
        ready,
        setText,
        setOffset,
        selectText: setSelectedId,
        setStyle,
      }}
    >
      <div
        ref={canvasRef}
        className={placingBox ? "relative cursor-crosshair" : "relative"}
        onPointerDown={placeBox}
      >
        {children}
        {ready &&
          boxes.map((box) => (
            <FloatingTextBox
              key={box.id}
              box={box}
              moveMode={moveMode}
              onChange={(next) =>
                saveBoxes(boxes.map((item) => (item.id === next.id ? next : item)))
              }
              onDelete={() => saveBoxes(boxes.filter((item) => item.id !== box.id))}
            />
          ))}
      </div>
      {placingBox && (
        <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center print:hidden">
          <p className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-mist shadow-xl">
            Click anywhere on the page to place your text box
          </p>
        </div>
      )}
      <div
        data-editor-control
        className="fixed right-5 bottom-5 z-50 flex max-w-[calc(100vw-2.5rem)] flex-wrap items-center justify-end gap-2 print:hidden"
      >
        {selectedId && (
          <FontControls
            style={styles[selectedId] ?? { font: "sans", size: "inherit" }}
            onChange={(value) => setStyle(selectedId, value)}
          />
        )}
        <Button
          type="button"
          variant="outline"
          onClick={resetAll}
          className="glass-strong border-white/60 text-brand shadow-lg"
          title="Reset all text and positions"
        >
          <RotateCcw /> Reset all
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setPlacingBox((value) => !value);
            setMoveMode(false);
          }}
          className={placingBox ? "bg-accent-gold text-brand" : "glass-strong text-brand"}
        >
          <Plus /> {placingBox ? "Cancel adding" : "Add text box"}
        </Button>
        <Button
          type="button"
          onClick={() => {
            setMoveMode((value) => !value);
            setPlacingBox(false);
          }}
          className={moveMode ? "bg-accent-gold text-brand shadow-xl" : "bg-brand text-mist shadow-xl"}
        >
          <Move /> {moveMode ? "Done moving" : "Move text"}
        </Button>
      </div>
    </Ctx.Provider>
  );
}

const FONT_CLASSES: Record<TextStyle["font"], string> = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

const SIZE_CLASSES: Record<string, string> = {
  inherit: "",
  "12": "text-xs",
  "14": "text-sm",
  "16": "text-base",
  "18": "text-lg",
  "20": "text-xl",
  "24": "text-2xl",
  "30": "text-3xl",
  "36": "text-4xl",
  "48": "text-5xl",
  "60": "text-6xl",
};

function FontControls({
  style,
  onChange,
}: {
  style: TextStyle;
  onChange: (style: TextStyle) => void;
}) {
  const controlClass =
    "h-9 rounded-md border border-white/60 bg-mist/95 px-2 text-sm text-brand shadow-lg outline-none focus:border-brand-light";
  return (
    <div className="glass-strong flex items-center gap-2 rounded-md border border-white/60 p-1 shadow-lg">
      <select
        aria-label="Font type"
        className={controlClass}
        value={style.font}
        onChange={(event) => onChange({ ...style, font: event.target.value as TextStyle["font"] })}
      >
        <option value="sans">Sans</option>
        <option value="serif">Serif</option>
        <option value="mono">Mono</option>
      </select>
      <select
        aria-label="Font size"
        className={controlClass}
        value={style.size}
        onChange={(event) => onChange({ ...style, size: event.target.value })}
      >
        <option value="inherit">Size</option>
        {[12, 14, 16, 18, 20, 24, 30, 36, 48, 60].map((size) => (
          <option key={size} value={size}>{size}px</option>
        ))}
      </select>
    </div>
  );
}

function FloatingTextBox({
  box,
  moveMode,
  onChange,
  onDelete,
}: {
  box: CustomBox;
  moveMode: boolean;
  onChange: (box: CustomBox) => void;
  onDelete: () => void;
}) {
  const ctx = useContext(Ctx);
  const ref = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ sx: number; sy: number; x: number; y: number } | null>(null);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!moveMode) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current = { sx: event.clientX, sy: event.clientY, x: box.x, y: box.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !ref.current) return;
    const x = drag.current.x + event.clientX - drag.current.sx;
    const y = drag.current.y + event.clientY - drag.current.sy;
    ref.current.style.left = `${x}px`;
    ref.current.style.top = `${y}px`;
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const x = drag.current.x + event.clientX - drag.current.sx;
    const y = drag.current.y + event.clientY - drag.current.sy;
    drag.current = null;
    onChange({ ...box, x, y });
  }

  return (
    <div
      ref={ref}
      data-editor-control
      className={`group absolute z-40 min-w-40 max-w-sm touch-none rounded-md border border-accent-gold/60 bg-mist/95 px-4 py-3 text-ink shadow-xl ${
        moveMode ? "cursor-move outline-2 outline-dashed outline-brand/50" : "cursor-text"
      } ${FONT_CLASSES[ctx?.styles[box.id]?.font ?? "sans"]} ${SIZE_CLASSES[ctx?.styles[box.id]?.size ?? "inherit"] ?? ""}`}
      style={{ left: box.x, top: box.y }}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <div
        contentEditable={!moveMode}
        suppressContentEditableWarning
        className="min-h-6 outline-none"
        onFocus={() => ctx?.selectText(box.id)}
        onInput={(event: FormEvent<HTMLDivElement>) =>
          onChange({ ...box, text: event.currentTarget.textContent ?? "" })
        }
        onBlur={(event: FocusEvent<HTMLDivElement>) =>
          onChange({ ...box, text: event.currentTarget.textContent ?? "" })
        }
      >
        {box.text}
      </div>
      {!moveMode && (
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="absolute -top-3 -right-3 size-7 opacity-0 shadow-md group-focus-within:opacity-100 group-hover:opacity-100"
          title="Delete text box"
          onClick={onDelete}
        >
          <Trash2 />
        </Button>
      )}
    </div>
  );
}

/** Always click-to-edit text. Give every instance a unique id. */
export function Ed({
  id,
  children,
  as: Tag = "span",
  className,
}: {
  id: string;
  children: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  className?: string;
}) {
  const ctx = useContext(Ctx);
  const ref = useRef<HTMLElement | null>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  const moveMode = ctx?.moveMode ?? false;
  const textStyle = ctx?.styles[id];

  // Apply saved text + position once storage has loaded.
  useEffect(() => {
    if (!ctx?.ready || !ref.current) return;
    const saved = ctx.textRef.current[id];
    if (typeof saved === "string" && ref.current.textContent !== saved) {
      ref.current.textContent = saved;
    }
    const off = ctx.offsetRef.current[id];
    if (off) {
      ref.current.style.transform = `translate(${off.x}px, ${off.y}px)`;
    }
  }, [ctx?.ready, id]);

  function onPointerDown(e: PointerEvent<HTMLElement>) {
    if (!moveMode || !ctx || !ref.current) return;
    e.preventDefault();
    const off = ctx.offsetRef.current[id] ?? { x: 0, y: 0 };
    drag.current = { sx: e.clientX, sy: e.clientY, ox: off.x, oy: off.y };
    ref.current.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (!drag.current || !ref.current) return;
    const x = drag.current.ox + (e.clientX - drag.current.sx);
    const y = drag.current.oy + (e.clientY - drag.current.sy);
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  }

  function onPointerUp(e: PointerEvent<HTMLElement>) {
    if (!drag.current || !ctx) return;
    const x = drag.current.ox + (e.clientX - drag.current.sx);
    const y = drag.current.oy + (e.clientY - drag.current.sy);
    drag.current = null;
    ctx.setOffset(id, { x, y });
  }

  const editing = !moveMode;

  return (
    <Tag
      ref={ref as never}
      data-editor-control
      className={`${className ?? ""} ${
        moveMode
          ? "inline-block touch-none cursor-move rounded-sm outline-2 outline-offset-2 outline-dashed outline-brand/50 select-none"
          : "cursor-text rounded-sm hover:outline-1 hover:outline-offset-2 hover:outline-dashed hover:outline-accent-gold/50 focus:bg-white/70 focus:outline-2 focus:outline-solid focus:outline-accent-gold/70"
      } ${textStyle ? FONT_CLASSES[textStyle.font] : ""} ${textStyle ? (SIZE_CLASSES[textStyle.size] ?? "") : ""}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onFocus={() => ctx?.selectText(id)}
      onInput={(e: FormEvent<HTMLElement>) =>
        ctx?.setText(id, e.currentTarget.textContent ?? "")
      }
      onBlur={(e: FocusEvent<HTMLElement>) =>
        ctx?.setText(id, e.currentTarget.textContent ?? "")
      }
    >
      {children}
    </Tag>
  );
}
