import { onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "../../../i18n/index.js";

export function useLanding() {
  const { t, locale, setLocale } = useI18n();
  const route = useRoute();
  const menuOpen = ref(false);

  function closeMenu() {
    menuOpen.value = false;
  }

  function toggleMenu() {
    menuOpen.value = !menuOpen.value;
  }

  function goToSection(id) {
    closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToContact() {
    goToSection("inscription");
  }

  function switchLocale(code) {
    setLocale(code);
  }

  watchEffect(() => {
    if (typeof document === "undefined") return;

    document.title = t("landing.meta.title");
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.append(description);
    }
    description.setAttribute("content", t("landing.meta.description"));

    void locale.value;
  });

  onMounted(() => {
    if (route.hash === "#inscription") {
      requestAnimationFrame(scrollToContact);
    }
  });

  return {
    menuOpen,
    locale,
    switchLocale,
    closeMenu,
    toggleMenu,
  };
}
