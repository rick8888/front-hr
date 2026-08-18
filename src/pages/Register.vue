<template>
  <AuthLayout max-width="2xl">
    <div class="space-y-6">
      <header>
        <h2 class="flex items-center gap-2 text-2xl font-bold text-neutral-900">
          Start your journey here
          <span aria-hidden="true">🚀</span>
        </h2>
        <p class="mt-1 text-sm text-neutral-600">
          Create your account in just 2 simple steps
        </p>
      </header>

      <section
        class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs"
      >
        <RegisterStepper :current-step="currentStep" :steps="steps" />

        <RegisterPersonalInfoStep
          v-if="currentStep === 1"
          v-model="personalInfo"
          @next="onPersonalNext"
        />

        <RegisterCompanyInfoStep
          v-else-if="currentStep === 2"
          v-model="companyInfo"
          :submitting="isLoading"
          :error="errorMessage"
          @previous="currentStep = 1"
          @submit="onSubmitFinal"
        />
      </section>

      <p class="text-center text-sm text-neutral-600">
        Already have an account?
        <RouterLink
          to="/login"
          class="font-semibold text-primary-600 hover:text-primary-700"
        >
          Sign in instead
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "../components/layout/AuthLayout.vue";
import RegisterStepper from "../components/auth/RegisterStepper.vue";
import RegisterPersonalInfoStep from "../components/auth/RegisterPersonalInfoStep.vue";
import RegisterCompanyInfoStep from "../components/auth/RegisterCompanyInfoStep.vue";

const router = useRouter();

const steps = [
  { id: 1, title: "Personal Info", subtitle: "Your details" },
  { id: 2, title: "Company", subtitle: "Business info" },
];

const currentStep = ref(1);
const isLoading = ref(false);
const errorMessage = ref("");

const personalInfo = reactive({
  firstName: "",
  lastName: "",
  gender: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const companyInfo = reactive({
  companyName: "",
  subdomain: "",
  agreeToTerms: false,
});

function onPersonalNext() {
  errorMessage.value = "";
  currentStep.value = 2;
}

async function onSubmitFinal() {
  if (isLoading.value) return;
  errorMessage.value = "";
  isLoading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
    localStorage.setItem("token", "mock-jwt-token-" + Date.now());
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        gender: personalInfo.gender,
        company: companyInfo.companyName,
        subdomain: companyInfo.subdomain,
      }),
    );

    router.push("/");
  } catch (err) {
    errorMessage.value = "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
}
</script>
