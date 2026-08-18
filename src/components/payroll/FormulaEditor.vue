<template>
  <div class="formula-editor space-y-2">
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="chip in quickChips"
        :key="chip.insert"
        type="button"
        class="px-2 py-1 text-xs font-medium rounded-md border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-secondary-400 transition-colors"
        @mousedown.prevent="insertQuick(chip)"
      >
        {{ chip.label }}
      </button>
    </div>

    <div class="relative">
      <input
        ref="inputRef"
        type="text"
        class="input-base font-mono text-sm w-full"
        :class="validation.ok ? '' : 'border-error-500 focus:border-error-500 focus:ring-error-500/20'"
        :value="modelValue"
        placeholder="Ex. : MIN(BASE_SALARY, GROSS * 0.1)"
        autocomplete="off"
        spellcheck="false"
        @input="onInput"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="onBlur"
      />
      <ul
        v-if="showSuggestions && filteredSuggestions.length"
        class="absolute z-30 left-0 right-0 mt-1 max-h-44 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg text-sm"
        role="listbox"
        @mousedown.prevent
      >
        <li
          v-for="(s, idx) in filteredSuggestions"
          :key="s.kind + s.value"
          class="px-3 py-2 cursor-pointer flex items-center gap-2"
          :class="idx === activeIndex ? 'bg-secondary-50 text-secondary-900' : 'text-neutral-800 hover:bg-neutral-50'"
          role="option"
          @mousedown.prevent="applySuggestion(s)"
        >
          <span
            class="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
            :class="s.kind === 'var' ? 'bg-sky-100 text-sky-800' : 'bg-violet-100 text-violet-800'"
          >
            {{ s.kind === "var" ? "VAR" : "FUNC" }}
          </span>
          <span class="font-mono">{{ s.display }}</span>
        </li>
      </ul>
    </div>

    <p v-if="!validation.ok && validation.error" class="text-xs text-error-600">
      {{ validation.error }}
    </p>
    <p v-else-if="modelValue?.trim()" class="text-xs text-success-700">Formule valide (contrôles locaux).</p>

    <div
      v-if="modelValue?.trim()"
      class="rounded-md border border-neutral-100 bg-neutral-50/80 px-2 py-1.5 text-xs font-mono leading-relaxed break-all"
      aria-hidden="true"
    >
      <template v-for="(part, i) in previewParts" :key="i">
        <span v-if="part.type === 'op'" class="text-neutral-600">{{ part.text }}</span>
        <span v-else-if="part.type === 'num'" class="text-amber-800">{{ part.text }}</span>
        <span v-else-if="part.type === 'var'" class="text-sky-700 font-semibold">{{ part.text }}</span>
        <span v-else-if="part.type === 'func'" class="text-violet-700 font-semibold">{{ part.text }}</span>
        <span v-else class="text-error-600">{{ part.text }}</span>
      </template>
    </div>

    <div class="text-xs text-neutral-500 space-y-1 border-t border-neutral-100 pt-2">
      <p>
        <span class="font-medium text-neutral-700">Variables :</span>
        {{ variables.join(", ") }}
      </p>
      <p>
        <span class="font-medium text-neutral-700">Fonctions :</span>
        {{ functionsDisplay }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";

const variables = ["BASE_SALARY", "GROSS", "TAXABLE", "CNSS", "AMO", "IR"];

const functions = ["MIN", "MAX", "IF"];

const ALLOWED = new Set([...variables, ...functions]);

const props = defineProps({
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const inputRef = ref(null);
const showSuggestions = ref(false);
const activeIndex = ref(-1);
let blurTimer = null;

const functionsDisplay = computed(() => functions.map((f) => `${f}()`).join(", "));

const quickChips = [
  { label: "BASE_SALARY", insert: "BASE_SALARY", isFunc: false },
  { label: "GROSS", insert: "GROSS", isFunc: false },
  { label: "+", insert: "+", isFunc: false },
  { label: "−", insert: "-", isFunc: false },
  { label: "×", insert: "*", isFunc: false },
  { label: "MIN()", insert: "MIN", isFunc: true },
];

const allSuggestions = computed(() => {
  const vars = variables.map((value) => ({
    kind: "var",
    value,
    display: value,
    filter: value,
  }));
  const funcs = functions.map((value) => ({
    kind: "func",
    value,
    display: `${value}()`,
    filter: value,
  }));
  return [...vars, ...funcs];
});

const currentWord = computed(() => {
  const el = inputRef.value;
  const s = props.modelValue || "";
  if (!el) return "";
  const caret = el.selectionStart ?? s.length;
  return wordBeforeCaret(s, caret);
});

const filteredSuggestions = computed(() => {
  const w = currentWord.value.toUpperCase();
  if (!w) return allSuggestions.value.slice(0, 8);
  return allSuggestions.value
    .filter((item) => item.filter.startsWith(w))
    .slice(0, 12);
});

const validation = computed(() => validateFormula(props.modelValue || ""));

const previewParts = computed(() => buildPreviewParts(props.modelValue || ""));

watch(
  () => props.modelValue,
  () => {
    activeIndex.value = -1;
  }
);

function validateFormula(formula) {
  const raw = formula ?? "";
  if (!raw.trim()) return { ok: true, error: null };

  const charRegex = /^[0-9+\-*/().\sA-Z_]+$/;
  if (!charRegex.test(raw)) {
    return { ok: false, error: "Caractère invalide" };
  }

  let depth = 0;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === "(") depth++;
    else if (c === ")") {
      depth--;
      if (depth < 0) return { ok: false, error: "Parenthèses non équilibrées" };
    }
  }
  if (depth !== 0) return { ok: false, error: "Parenthèses non équilibrées" };

  const re = /[A-Z_][A-Z0-9_]*/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const token = m[0].toUpperCase();
    const end = m.index + m[0].length;
    if (!ALLOWED.has(token)) {
      if (end === raw.length && isPrefixOfAllowed(m[0])) {
        continue;
      }
      return { ok: false, error: "Variable inconnue" };
    }
  }

  return { ok: true, error: null };
}

function isPrefixOfAllowed(partial) {
  const p = partial.toUpperCase();
  for (const v of variables) {
    if (v.startsWith(p) && v.length > p.length) return true;
  }
  for (const f of functions) {
    if (f.startsWith(p) && f.length > p.length) return true;
  }
  return false;
}

function wordBeforeCaret(s, caret) {
  let i = Math.min(caret, s.length) - 1;
  if (i < 0) return "";
  while (i >= 0 && /[A-Za-z0-9_]/.test(s[i])) i--;
  return s.slice(i + 1, Math.min(caret, s.length));
}

function sanitizeAndUpper(s) {
  return (s || "").toUpperCase().replace(/[^0-9+\-*/().\sA-Z_]/g, "");
}

function onInput(e) {
  const el = e.target;
  const raw = el.value;
  const caret = el.selectionStart ?? raw.length;
  const cleaned = sanitizeAndUpper(raw);
  const lost = raw.length - cleaned.length;
  emit("update:modelValue", cleaned);
  showSuggestions.value = true;
  activeIndex.value = -1;
  nextTick(() => {
    const input = inputRef.value;
    if (!input) return;
    const pos = Math.max(0, Math.min(cleaned.length, caret - lost));
    input.setSelectionRange(pos, pos);
  });
}

function onKeydown(e) {
  if (!showSuggestions.value || !filteredSuggestions.value.length) {
    if (e.key === "Escape") showSuggestions.value = false;
    return;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, filteredSuggestions.value.length - 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, -1);
  } else if (e.key === "Enter" && activeIndex.value >= 0) {
    e.preventDefault();
    applySuggestion(filteredSuggestions.value[activeIndex.value]);
  } else if (e.key === "Escape") {
    showSuggestions.value = false;
    activeIndex.value = -1;
  }
}

function onFocus() {
  showSuggestions.value = true;
}

function onBlur() {
  blurTimer = setTimeout(() => {
    showSuggestions.value = false;
    activeIndex.value = -1;
  }, 150);
}

function insertAtCursor(insertText, cursorOffsetFromEnd = 0) {
  const el = inputRef.value;
  const text = props.modelValue || "";
  if (!el) {
    emit("update:modelValue", sanitizeAndUpper(text + insertText));
    return;
  }
  const start = el.selectionStart ?? text.length;
  const end = el.selectionEnd ?? text.length;
  const ins = sanitizeAndUpper(insertText);
  const next = sanitizeAndUpper(text.slice(0, start) + ins + text.slice(end));
  emit("update:modelValue", next);
  const newPos = start + ins.length - cursorOffsetFromEnd;
  nextTick(() => {
    el.focus();
    el.setSelectionRange(newPos, newPos);
  });
}

function insertQuick(chip) {
  if (blurTimer) clearTimeout(blurTimer);
  if (chip.isFunc) {
    insertAtCursor(`${chip.insert}()`, 1);
  } else {
    insertAtCursor(chip.insert, 0);
  }
  showSuggestions.value = true;
}

function applySuggestion(s) {
  if (blurTimer) clearTimeout(blurTimer);
  const el = inputRef.value;
  const text = props.modelValue || "";
  if (!el) return;
  const caret = el.selectionStart ?? text.length;
  const word = wordBeforeCaret(text, caret);
  const start = caret - word.length;
  const insert = s.kind === "func" ? `${s.value}()` : s.value;
  const tail = s.kind === "func" ? 1 : 0;
  const before = text.slice(0, start);
  const after = text.slice(caret);
  const next = sanitizeAndUpper(before + insert + after);
  emit("update:modelValue", next);
  const newPos = start + insert.length - tail;
  nextTick(() => {
    el.focus();
    el.setSelectionRange(newPos, newPos);
    showSuggestions.value = true;
  });
}

function buildPreviewParts(s) {
  const upper = (s || "").toUpperCase().trim();
  if (!upper) return [];
  const parts = [];
  const re = /(\d+\.?\d*)|([A-Z_][A-Z0-9_]*)|(\s+)|([+\-*/()])/g;
  let last = 0;
  let m;
  while ((m = re.exec(upper)) !== null) {
    if (m.index > last) {
      parts.push({ type: "bad", text: upper.slice(last, m.index) });
    }
    const tok = m[0];
    if (/^\d/.test(tok)) parts.push({ type: "num", text: tok });
    else if (/^\s+$/.test(tok)) parts.push({ type: "op", text: tok });
    else if (/^[+\-*/()]$/.test(tok)) parts.push({ type: "op", text: tok });
    else if (variables.includes(tok)) parts.push({ type: "var", text: tok });
    else if (functions.includes(tok)) parts.push({ type: "func", text: tok });
    else parts.push({ type: "bad", text: tok });
    last = m.index + tok.length;
  }
  if (last < upper.length) parts.push({ type: "bad", text: upper.slice(last) });
  return parts;
}

function isFormulaValid() {
  return validateFormula(props.modelValue || "").ok;
}

defineExpose({
  isFormulaValid,
  validateFormula,
});
</script>
