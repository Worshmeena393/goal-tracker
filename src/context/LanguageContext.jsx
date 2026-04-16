import { createContext, useState, useEffect, useMemo } from "react";

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

export const LanguageContext = createContext();

/* -------------------------------------------------------------------------- */
/* Translations (EN + FA only)                                                */
/* -------------------------------------------------------------------------- */

const translations = {
  en: {
    dashboard: "Dashboard",
    goals: "Goals",
    newGoal: "New Goal",
    categories: "Categories",
    settings: "Settings",
    xp: "Experience Points",
    streak: "Streak",
    level: "Level",
    completionRate: "Completion Rate",
    completedGoals: "Completed Goals",
    addGoal: "Add Goal",
    goalAdded: "Goal added successfully",
    goalTitle: "Goal Title",
    category: "Category",
    target: "Target",
    submit: "Submit",
    logProgress: "Log Progress",
    delete: "Delete",
    edit: "Edit",
    pause: "Pause",
    resume: "Resume",
    active: "Active",
    completed: "Completed",
    paused: "Paused",
    all: "All",
    filter: "Filter",
    sort: "Sort",
    sortByProgress: "By Progress",
    sortByCategory: "By Category",
    activeGoals: "Active Goals",
    noActiveGoals: "No active goals yet. Create one!",
    ariaDashboard: "Goal Tracker Dashboard",
    noData: "No data available",
    total: "Total",
    progress: "Progress",
    lastUpdated: "Last Updated",
    toggleLanguage: "فارسی",
    light: "Light",
    dark: "Dark",
    theme: "Theme",
    language: "Language",
    confirmDelete: "Are you sure you want to delete this goal?",
    cancel: "Cancel",
    confirm: "Confirm",
    notFound: "Page Not Found",
    notFoundDesc: "The page you are looking for doesn't exist or has been moved.",
    navigation: "Navigation",
    welcomeBack: "Welcome back!",
    completionSummary: "You've completed",
    targetsSummary: "of your targets. Keep pushing forward!",
    export: "Export Data",
    exportData: "Export Data",
    goalStatus: "Goal Status",
    statusOverview: "Status Overview",
    goalDistribution: "Goal Distribution",
    overallDistribution: "Overall Distribution",
    visualSummary: "Visual summary of your journey",
    categoryBreakdown: "Category breakdown",
    progressBreakdown: "Progress breakdown",
    noGoalsFound: "No goals found yet",
    viewAll: "View All",
    totalGoals: "Total Goals",
    units: "units",
    days: "days",
    hours: "hours",
    confirmDeleteDesc: "Are you sure you want to delete this goal? This action cannot be undone.",
    levelAchiever: "Level {{level}} Achiever",
    notifications: "Notifications",
    manageJourney: "Manage Your Journey",
    searchPlaceholder: "Search your goals...",
    newest: "Newest",
    title: "Title",
    noGoalsMatch: "Try adjusting your filters or search.",
    editGoal: "Edit Goal",
    startNewGoal: "Start New Goal",
    saveChanges: "Save Changes",
    createGoal: "Create Goal",
    analytics: "Progress Analytics",
    history: "Progress History",
    logs: "LOGS",
    totalCaps: "TOTAL",
    back: "Back",
    add: "Add",
    clear: "Clear All",
    categoryOverview: "Category Overview",
    categoryDesc: "See how you're performing across different areas of your life. Every goal helps you grow!",
    quickStats: "Quick Stats",
    totalCategories: "Total Categories",
    totalCompleted: "Total Completed",
    avgProgress: "Avg. Progress",
    completedGoalsDesc: "Total goals successfully finished in this category",
    activeGoalsDesc: "Goals you're currently working on",
    rateDesc: "Average progress across all goals in this category",
    renameCategory: "Rename Category",
    renameCategoryDesc: "Renaming this category will update all associated goals.",
    newCategoryName: "New Category Name",
    rename: "Rename",
    filteringBy: "Filtering by:",
    performanceByCategory: "Performance by Category",
    appearance: "Appearance",
    customizeLook: "Customize how the app looks and feels",
    themeDesc: "Switch between light and dark mode",
    fontSize: "Font Size",
    fontSizeDesc: "Adjust the application text scale",
    recentlyCompleted: "Recently Completed",
    viewArchive: "View Archive",
    details: "Details",
    selectLanguage: "Select your preferred interface language",
    langDesc: "English / Persian (RTL Support)",
    confirmReset: "Are you sure you want to reset all settings?",
    confirmResetDesc: "This will reset all your settings (theme, font size, language) to default values. This action cannot be undone.",
    resetSettings: "Reset All Settings",
    startNewJourney: "Start a new journey today and track your progress.",
    goalTitlePlaceholder: "e.g. Read 20 books this year",
    notesOptional: "NOTES (OPTIONAL)",
    notesPlaceholder: "Add some details about your goal...",
    targetValue: "TARGET VALUE",
    goalType: "GOAL TYPE",
    startDate: "START DATE",
    endDate: "END DATE",
    errorRequired: "This field is required",
    errorMinLength: "Minimum length is 3 characters",
    errorInvalid: "Please enter a valid value",
    catPersonal: "Personal",
    catWork: "Work",
    catHealth: "Health",
    catStudy: "Study",
    catOther: "Other",
    catGeneral: "General",
    daily: "Daily",
    count: "Count-based",
    time: "Time-based",
    unit_count: "units",
    unit_time: "hours",
    unit_daily: "days",
    small: "Small",
    medium: "Medium",
    large: "Large",
    restore: "Restore",
    markAsComplete: "Mark as Complete",
    notificationUpdated: "Goal updated successfully!",
    notificationDeleted: "Goal deleted successfully!",
    updateYourProgress: "Update your journey details",
    footerDesc: "Your personal dashboard for tracking habits, achieving goals, and gamifying your productivity journey.",
    quickLinks: "Quick Links",
    support: "Support",
    help: "Help Center",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    allRights: "© {{year}} Goal Tracker. All rights reserved.",
    themeUpdated: "Theme updated",
    languageUpdated: "Language updated",
    fontSizeUpdated: "Font size updated",
    settingsReset: "Settings reset to default",
    goalNotFound: "Goal not found",
    madeWith: "Made with ❤️ for code to inspire",
    cannotRenamePredefined: "Cannot rename system categories",
  },

  fa: {
    dashboard: "داشبورد",
    goals: "اهداف",
    newGoal: "هدف جدید",
    categories: "دسته‌بندی‌ها",
    settings: "تنظیمات",
    xp: "امتیاز",
    streak: "رکورد",
    level: "سطح",
    completionRate: "نرخ تکمیل",
    completedGoals: "اهداف تکمیل شده",
    addGoal: "افزودن هدف",
    goalAdded: "هدف با موفقیت اضافه شد",
    goalTitle: "عنوان هدف",
    category: "دسته‌بندی",
    target: "هدف",
    submit: "ثبت",
    logProgress: "ثبت پیشرفت",
    delete: "حذف",
    edit: "ویرایش",
    pause: "توقف",
    resume: "ادامه",
    active: "فعال",
    completed: "تکمیل شده",
    paused: "متوقف شده",
    all: "همه",
    filter: "فیلتر",
    sort: "مرتب‌سازی",
    sortByProgress: "بر اساس پیشرفت",
    sortByCategory: "بر اساس دسته‌بندی",
    activeGoals: "اهداف فعال",
    noActiveGoals: "هنوز هدفی ایجاد نکرده‌اید!",
    ariaDashboard: "داشبورد مدیریت اهداف",
    noData: "داده‌ای وجود ندارد",
    total: "مجموع",
    progress: "پیشرفت",
    lastUpdated: "آخرین به‌روزرسانی",
    toggleLanguage: "English",
    light: "روشن",
    dark: "تاریک",
    theme: "تم",
    language: "زبان",
    confirmDelete: "آیا از حذف این هدف اطمینان دارید؟",
    cancel: "لغو",
    confirm: "تایید",
    notFound: "صفحه پیدا نشد",
    notFoundDesc: "صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.",
    navigation: "ناوبری",
    welcomeBack: "خوش آمدید!",
    completionSummary: "شما",
    targetsSummary: "از اهداف خود را تکمیل کرده‌اید. به تلاش خود ادامه دهید!",
    export: "خروجی داده‌ها",
    exportData: "خروجی داده‌ها",
    goalStatus: "وضعیت اهداف",
    statusOverview: "بررسی وضعیت",
    goalDistribution: "توزیع اهداف",
    overallDistribution: "توزیع کلی",
    visualSummary: "خلاصه بصری از مسیر شما",
    categoryBreakdown: "تفکیک بر اساس دسته‌بندی",
    progressBreakdown: "تفکیک بر اساس پیشرفت",
    noGoalsFound: "هدفی پیدا نشد",
    viewAll: "مشاهده همه",
    totalGoals: "مجموع اهداف",
    units: "واحد",
    days: "روز",
    hours: "ساعت",
    confirmDeleteDesc: "آیا از حذف این هدف اطمینان دارید؟ این عمل قابل بازگشت نیست.",
    levelAchiever: "قهرمان سطح {{level}}",
    notifications: "اعلان‌ها",
    manageJourney: "مدیریت مسیر شما",
    searchPlaceholder: "جستجوی اهداف شما...",
    newest: "جدیدترین",
    title: "عنوان",
    noGoalsMatch: "فیلترها یا جستجوی خود را تغییر دهید.",
    editGoal: "ویرایش هدف",
    startNewGoal: "شروع هدف جدید",
    saveChanges: "ذخیره تغییرات",
    createGoal: "ایجاد هدف",
    analytics: "تحلیل پیشرفت",
    history: "تاریخچه پیشرفت",
    logs: "ثبت‌ها",
    totalCaps: "مجموع",
    back: "بازگشت",
    add: "افزودن",
    clear: "پاکسازی همه",
    categoryOverview: "نمای کلی دسته‌بندی‌ها",
    categoryDesc: "ببینید در بخش‌های مختلف زندگی خود چگونه عمل می‌کنید. هر هدف به رشد شما کمک می‌کند!",
    quickStats: "آمار سریع",
    totalCategories: "تعداد دسته‌بندی‌ها",
    totalCompleted: "تعداد تکمیل شده",
    avgProgress: "میانگین پیشرفت",
    completedGoalsDesc: "تعداد کل اهدافی که در این دسته با موفقیت به پایان رسیده‌اند",
    activeGoalsDesc: "اهدافی که در حال حاضر روی آن‌ها کار می‌کنید",
    rateDesc: "میانگین پیشرفت در تمام اهداف این دسته",
    renameCategory: "تغییر نام دسته‌بندی",
    renameCategoryDesc: "تغییر نام این دسته‌بندی تمام اهداف مرتبط را به‌روزرسانی می‌کند.",
    newCategoryName: "نام جدید دسته‌بندی",
    rename: "تغییر نام",
    filteringBy: "فیلتر بر اساس:",
    performanceByCategory: "عملکرد بر اساس دسته‌بندی",
    appearance: "ظاهر",
    customizeLook: "شخصی‌سازی ظاهر برنامه",
    themeDesc: "تغییر بین حالت روشن و تاریک",
    fontSize: "اندازه متن",
    fontSizeDesc: "تنظیم مقیاس متن برنامه",
    recentlyCompleted: "به تازگی تکمیل شده",
    viewArchive: "مشاهده آرشیو",
    details: "جزئیات",
    selectLanguage: "زبان مورد نظر خود را انتخاب کنید",
    langDesc: "انگلیسی / فارسی (پشتیبانی از RTL)",
    confirmReset: "آیا از بازنشانی تمامی تنظیمات اطمینان دارید؟",
    confirmResetDesc: "این کار تمامی تنظیمات شما (تم، اندازه فونت، زبان) را به مقادیر پیش‌فرض برمی‌گرداند. این عمل قابل بازگشت نیست.",
    resetSettings: "بازنشانی تنظیمات",
    startNewJourney: "امروز مسیر جدیدی را شروع کنید و پیشرفت خود را دنبال کنید.",
    goalTitlePlaceholder: "مثلاً: مطالعه ۲۰ کتاب در سال",
    notesOptional: "یادداشت‌ها (اختیاری)",
    notesPlaceholder: "جزئیاتی در مورد هدف خود اضافه کنید...",
    targetValue: "مقدار هدف",
    goalType: "نوع هدف",
    startDate: "تاریخ شروع",
    endDate: "تاریخ پایان",
    errorRequired: "این فیلد اجباری است",
    errorMinLength: "حداقل طول ۳ کاراکتر است",
    errorInvalid: "لطفاً یک مقدار معتبر وارد کنید",
    catPersonal: "شخصی",
    catWork: "کاری",
    catHealth: "سلامتی",
    catStudy: "تحصیلی",
    catOther: "دیگر",
    catGeneral: "عمومی",
    daily: "روزانه",
    count: "عددی",
    time: "زمانی",
    unit_count: "واحد",
    unit_time: "ساعت",
    unit_daily: "روز",
    small: "کوچک",
    medium: "متوسط",
    large: "بزرگ",
    restore: "بازگردانی",
    markAsComplete: "علامت‌گذاری به عنوان تکمیل شده",
    notificationUpdated: "هدف با موفقیت به‌روزرسانی شد!",
    notificationDeleted: "هدف با موفقیت حذف شد!",
    updateYourProgress: "جزئیات مسیر خود را به‌روز کنید",
    footerDesc: "داشبورد شخصی شما برای ردیابی عادت‌ها، دستیابی به اهداف و بازی‌گونه‌سازی مسیر بهره‌وری شما.",
    quickLinks: "لینک‌های سریع",
    support: "پشتیبانی",
    help: "مرکز راهنما",
    privacy: "سیاست حریم خصوصی",
    terms: "شرایط خدمات",
    allRights: "© {{year}} هدف‌سنج. تمامی حقوق محفوظ است.",
    themeUpdated: "تم با موفقیت تغییر کرد",
    languageUpdated: "زبان با موفقیت تغییر کرد",
    fontSizeUpdated: "اندازه متن با موفقیت تغییر کرد",
    settingsReset: "تنظیمات به حالت پیش‌فرض بازگشت",
    goalNotFound: "هدف پیدا نشد",
    madeWith: "ساخته شده با ❤️ برای الهام بخشیدن به کدنویسی",
    cannotRenamePredefined: "دسته‌بندی‌های سیستم قابل تغییر نام نیستند",
  },
};

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

const supportedLangs = ["en", "fa"];

const loadLanguage = () => {
  try {
    const saved = localStorage.getItem("lang");
    return supportedLangs.includes(saved) ? saved : "en";
  } catch {
    return "en";
  }
};

const translate = (lang, key) =>
  translations[lang]?.[key] || translations.en[key] || key;

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => loadLanguage());

  const direction = lang === "fa" ? "rtl" : "ltr";

  /* ---------------------------- Side Effects ------------------------------ */

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch (err) {
      console.warn("Language save failed:", err);
    }

    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, direction]);

  /* ---------------------------- Actions ---------------------------------- */

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "fa" : "en"));
  };

  const resetLanguage = () => {
    setLang("en");
    try {
      localStorage.removeItem("lang");
    } catch (err) {
      console.warn("Language reset failed:", err);
    }
  };

  const t = (key) => translate(lang, key);

  /* ---------------------------- Helpers ---------------------------------- */

  const helpers = useMemo(() => {
    const locale = lang === "fa" ? "fa-IR" : "en-US";

    return {
      formatDate: (date) => {
        if (!date) return "—";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "—" : d.toLocaleDateString(locale);
      },

      formatNumber: (num) =>
        isNaN(num) ? "—" : new Intl.NumberFormat(locale).format(num),

      formatCurrency: (num, currency = "USD") =>
        isNaN(num)
          ? "—"
          : new Intl.NumberFormat(locale, {
              style: "currency",
              currency,
            }).format(num),

      formatRelativeTime: (date) => {
        const d = new Date(date);
        if (isNaN(d)) return "—";

        const diff = (Date.now() - d.getTime()) / 1000;
        const rtf = new Intl.RelativeTimeFormat(locale, {
          numeric: "auto",
        });

        if (diff < 60) return rtf.format(-Math.floor(diff), "seconds");
        if (diff < 3600)
          return rtf.format(-Math.floor(diff / 60), "minutes");
        if (diff < 86400)
          return rtf.format(-Math.floor(diff / 3600), "hours");

        return rtf.format(-Math.floor(diff / 86400), "days");
      },
    };
  }, [lang]);

  /* ---------------------------------------------------------------------- */

  return (
    <LanguageContext.Provider
      value={{
        lang,
        direction,
        toggleLang,
        resetLanguage,
        t,
        ...helpers,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};