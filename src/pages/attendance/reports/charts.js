import { h } from "vue";
import { translate as t } from "../../../i18n/index.js";

/**
 * Mini-graphiques SVG/CSS sans dépendance externe, partagés
 * par les pages de rapports de présence.
 */

function emptyState() {
  return h(
    "div",
    { class: "h-56 flex items-center justify-center text-sm text-neutral-400" },
    t("admin.attendance.reports.noData")
  );
}

/** Barres verticales avec labels en bas. Items: [{ label, value }] */
export const BarChart = {
  props: { items: { type: Array, default: () => [] } },
  setup(props) {
    return () => {
      const max = Math.max(1, ...props.items.map((i) => i.value));
      return h(
        "div",
        { class: "h-56 flex items-end gap-2 px-2" },
        props.items.map((item) =>
          h("div", { class: "flex-1 flex flex-col items-center gap-1 min-w-0" }, [
            h(
              "span",
              { class: "text-xs text-neutral-600" },
              item.valueLabel ?? (item.value || "")
            ),
            h("div", {
              class: "w-full max-w-[42px] rounded-t bg-secondary-400",
              style: { height: `${Math.round((item.value / max) * 160)}px` },
            }),
            h(
              "span",
              { class: "text-[10px] text-neutral-500 truncate w-full text-center" },
              item.label
            ),
          ])
        )
      );
    };
  },
};

/** Courbe SVG simple. Points: [{ date|label, count }] */
export const LineChart = {
  props: { points: { type: Array, default: () => [] } },
  setup(props) {
    return () => {
      const width = 560;
      const height = 200;
      const pad = 28;
      const pts = props.points;
      if (!pts.length) return emptyState();
      const max = Math.max(1, ...pts.map((p) => p.count));
      const stepX = pts.length > 1 ? (width - pad * 2) / (pts.length - 1) : 0;
      const coords = pts.map((p, i) => ({
        x: pad + i * stepX,
        y: height - pad - (p.count / max) * (height - pad * 2),
      }));
      const path = coords.map((c, i) => `${i ? "L" : "M"}${c.x},${c.y}`).join(" ");
      return h("svg", { viewBox: `0 0 ${width} ${height}`, class: "w-full h-56" }, [
        h("path", { d: path, fill: "none", stroke: "#8b5cf6", "stroke-width": "2" }),
        ...coords.map((c) => h("circle", { cx: c.x, cy: c.y, r: 3, fill: "#8b5cf6" })),
      ]);
    };
  },
};

/** Barres horizontales. Items: [{ label, value }], valueLabel optionnel par item. */
export const HorizontalBarChart = {
  props: { items: { type: Array, default: () => [] } },
  setup(props) {
    return () => {
      if (!props.items.length) return emptyState();
      const max = Math.max(1, ...props.items.map((i) => i.value));
      return h(
        "div",
        { class: "space-y-2.5 py-2" },
        props.items.map((item) =>
          h("div", { class: "flex items-center gap-3" }, [
            h(
              "span",
              { class: "w-36 text-xs text-neutral-600 truncate text-right shrink-0" },
              item.label
            ),
            h("div", { class: "flex-1 bg-neutral-100 rounded h-4 overflow-hidden" }, [
              h("div", {
                class: "h-full rounded bg-secondary-400",
                style: { width: `${Math.round((item.value / max) * 100)}%` },
              }),
            ]),
            h(
              "span",
              { class: "text-xs text-neutral-600 w-12 shrink-0" },
              item.valueLabel ?? item.value
            ),
          ])
        )
      );
    };
  },
};

/**
 * Donut SVG avec texte central et légende.
 * Segments: [{ label, value, color }]
 */
export const DonutChart = {
  props: {
    segments: { type: Array, default: () => [] },
    centerLabel: { type: String, default: "" },
    centerValue: { type: String, default: "" },
  },
  setup(props) {
    return () => {
      const size = 180;
      const radius = 70;
      const stroke = 22;
      const center = size / 2;
      const circumference = 2 * Math.PI * radius;
      const total = props.segments.reduce((sum, s) => sum + s.value, 0);

      let offset = 0;
      const arcs = total
        ? props.segments
            .filter((s) => s.value > 0)
            .map((segment) => {
              const fraction = segment.value / total;
              const arc = h("circle", {
                cx: center,
                cy: center,
                r: radius,
                fill: "none",
                stroke: segment.color,
                "stroke-width": stroke,
                "stroke-dasharray": `${fraction * circumference} ${circumference}`,
                "stroke-dashoffset": -offset * circumference,
                transform: `rotate(-90 ${center} ${center})`,
              });
              offset += fraction;
              return arc;
            })
        : [];

      return h("div", { class: "flex flex-col items-center gap-4 py-4" }, [
        h("div", { class: "relative" }, [
          h("svg", { width: size, height: size }, arcs),
          h(
            "div",
            { class: "absolute inset-0 flex flex-col items-center justify-center text-center" },
            [
              h("span", { class: "text-sm font-medium text-neutral-700" }, props.centerLabel),
              h("span", { class: "text-sm text-neutral-500 mt-1" }, props.centerValue),
            ]
          ),
        ]),
        h(
          "div",
          { class: "flex flex-wrap items-center justify-center gap-4" },
          props.segments.map((segment) =>
            h("span", { class: "inline-flex items-center gap-1.5 text-xs text-neutral-600" }, [
              h("span", {
                class: "w-2.5 h-2.5 rounded-full",
                style: { backgroundColor: segment.color },
              }),
              segment.label,
            ])
          )
        ),
      ]);
    };
  },
};

/**
 * Graphique combiné barres + courbe (double axe implicite).
 * Items: [{ label, barValue, lineValue }]
 */
export const ComboChart = {
  props: {
    items: { type: Array, default: () => [] },
    barLabel: { type: String, default: "" },
    lineLabel: { type: String, default: "" },
  },
  setup(props) {
    return () => {
      const width = 720;
      const height = 240;
      const pad = { top: 20, right: 30, bottom: 30, left: 30 };
      const items = props.items;

      const legend = h(
        "div",
        { class: "flex items-center justify-center gap-5 text-xs text-neutral-600 mb-2" },
        [
          h("span", { class: "inline-flex items-center gap-1.5" }, [
            h("span", { class: "w-2.5 h-2.5 rounded-full bg-secondary-400" }),
            props.barLabel,
          ]),
          h("span", { class: "inline-flex items-center gap-1.5" }, [
            h("span", { class: "w-2.5 h-2.5 rounded-full bg-success-500" }),
            props.lineLabel,
          ]),
        ]
      );

      if (!items.length) return h("div", null, [legend, emptyState()]);

      const innerWidth = width - pad.left - pad.right;
      const innerHeight = height - pad.top - pad.bottom;
      const slot = innerWidth / items.length;
      const barWidth = Math.min(80, slot * 0.6);
      const maxBar = Math.max(1, ...items.map((i) => i.barValue));
      const maxLine = Math.max(1, ...items.map((i) => i.lineValue));

      const bars = items.map((item, i) => {
        const barHeight = (item.barValue / maxBar) * innerHeight;
        return h("rect", {
          x: pad.left + i * slot + (slot - barWidth) / 2,
          y: pad.top + innerHeight - barHeight,
          width: barWidth,
          height: barHeight,
          rx: 2,
          fill: "#a78bfa",
        });
      });

      const linePoints = items.map((item, i) => ({
        x: pad.left + i * slot + slot / 2,
        y: pad.top + innerHeight - (item.lineValue / maxLine) * innerHeight,
        value: item.lineValue,
      }));
      const linePath = linePoints
        .map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`)
        .join(" ");

      const labels = items.map((item, i) =>
        h(
          "text",
          {
            x: pad.left + i * slot + slot / 2,
            y: height - 8,
            "text-anchor": "middle",
            class: "fill-neutral-500",
            "font-size": "11",
          },
          item.label
        )
      );

      return h("div", null, [
        legend,
        h("svg", { viewBox: `0 0 ${width} ${height}`, class: "w-full" }, [
          ...bars,
          h("path", { d: linePath, fill: "none", stroke: "#22c55e", "stroke-width": "2" }),
          ...linePoints.map((p) =>
            h("circle", { cx: p.x, cy: p.y, r: 4, fill: "#22c55e" })
          ),
          ...labels,
        ]),
      ]);
    };
  },
};
