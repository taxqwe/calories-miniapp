// Поддерживаемые локали
const supportedLocales = ["ar", "de", "es", "fr", "ru", "tr", "uk", "uz", "en"];

const translations = {
  en: {
    mainTitle: "Calories Editor",
    tooltipMain: "Edit consumed calories by day. Select a date on the calendar and enter or adjust the number of calories using the quick edit buttons.",
    caloriesPlaceholder: "Enter calories",
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    cal: "cal",
    loading: "Loading...",
    error: {
      init: "App initialization error",
      load: "Failed to load data",
      update: "Failed to update data"
    }
  },
  ru: {
    mainTitle: "Редактирование калорий",
    tooltipMain: "Редактирование потребленных калорий по дням. Выберите дату в календаре и введите или скорректируйте количество калорий с помощью кнопок быстрого изменения.",
    caloriesPlaceholder: "Введите калории",
    monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    cal: "ккал",
    loading: "Загрузка...",
    error: {
      init: "Ошибка инициализации приложения",
      load: "Не удалось загрузить данные",
      update: "Не удалось обновить данные"
    }
  },
  de: {
    mainTitle: "Kalorien-Editor",
    tooltipMain: "Bearbeiten Sie verbrauchte Kalorien nach Tag. Wählen Sie ein Datum im Kalender und geben Sie die Kalorien ein oder passen Sie sie mit den Schnellbearbeitungsschaltflächen an.",
    caloriesPlaceholder: "Kalorien eingeben",
    monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    cal: "kcal",
    loading: "Wird geladen...",
    error: {
      init: "Fehler bei der App-Initialisierung",
      load: "Daten konnten nicht geladen werden",
      update: "Daten konnten nicht aktualisiert werden"
    }
  },
  es: {
    mainTitle: "Editor de Calorías",
    tooltipMain: "Edite las calorías consumidas por día. Seleccione una fecha en el calendario e ingrese o ajuste la cantidad de calorías utilizando los botones de edición rápida.",
    caloriesPlaceholder: "Ingrese calorías",
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    weekdays: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
    cal: "cal",
    loading: "Cargando...",
    error: {
      init: "Error de inicialización de la aplicación",
      load: "No se pudieron cargar los datos",
      update: "No se pudieron actualizar los datos"
    }
  },
  fr: {
    mainTitle: "Éditeur de Calories",
    tooltipMain: "Modifiez les calories consommées par jour. Sélectionnez une date dans le calendrier et entrez ou ajustez le nombre de calories à l'aide des boutons d'édition rapide.",
    caloriesPlaceholder: "Entrez les calories",
    monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    weekdays: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
    cal: "cal",
    loading: "Chargement...",
    error: {
      init: "Erreur d'initialisation de l'application",
      load: "Échec du chargement des données",
      update: "Échec de la mise à jour des données"
    }
  },
  tr: {
    mainTitle: "Kalori Düzenleyici",
    tooltipMain: "Günlük tüketilen kalorileri düzenleyin. Takvimde bir tarih seçin ve hızlı düzenleme düğmelerini kullanarak kalori miktarını girin veya ayarlayın.",
    caloriesPlaceholder: "Kalori girin",
    monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
    weekdays: ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"],
    cal: "kal",
    loading: "Yükleniyor...",
    error: {
      init: "Uygulama başlatma hatası",
      load: "Veriler yüklenemedi",
      update: "Veriler güncellenemedi"
    }
  },
  uk: {
    mainTitle: "Редагування калорій",
    tooltipMain: "Редагуйте спожиті калорії за день. Виберіть дату в календарі та введіть або відкоригуйте кількість калорій за допомогою кнопок швидкого редагування.",
    caloriesPlaceholder: "Введіть калорії",
    monthNames: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
    cal: "ккал",
    loading: "Завантаження...",
    error: {
      init: "Помилка ініціалізації програми",
      load: "Не вдалося завантажити дані",
      update: "Не вдалося оновити дані"
    }
  },
  uz: {
    mainTitle: "Kaloriya tahrirlash",
    tooltipMain: "Kunlar boʻyicha isteʼmol qilingan kaloriyalarni tahrirlang. Taqvimdan sanani tanlang va tezkor tahrirlash tugmalari bilan kaloriya miqdorini kiriting yoki oʻzgartiring.",
    caloriesPlaceholder: "Kaloriyani kiriting",
    monthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    weekdays: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
    cal: "kkal",
    loading: "Yuklanmoqda...",
    error: {
      init: "Ilovani ishga tushirishda xatolik",
      load: "Maʼlumotlarni yuklab boʻlmadi",
      update: "Maʼlumotlarni yangilab boʻlmadi"
    }
  },
  ar: {
    mainTitle: "محرر السعرات الحرارية",
    tooltipMain: "تحرير السعرات الحرارية المستهلكة يوميًا. حدد تاريخًا في التقويم وأدخل أو عدل عدد السعرات الحرارية باستخدام أزرار التحرير السريع.",
    caloriesPlaceholder: "أدخل السعرات الحرارية",
    monthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    weekdays: ["إث", "ثل", "أر", "خم", "جم", "سب", "أح"],
    cal: "سعرة",
    loading: "جاري التحميل...",
    error: {
      init: "خطأ في تهيئة التطبيق",
      load: "فشل في تحميل البيانات",
      update: "فشل في تحديث البيانات"
    }
  }
};

// Получаем параметр языка из URL
const urlParams = new URLSearchParams(window.location.search || '');
const langParam = urlParams.get('lang');
const lang = (langParam && supportedLocales.includes(langParam)) ? langParam : "en";

// Глобальное хранение переводов для доступа из других скриптов
window.translations = translations;
window.currentLang = lang;

document.addEventListener('DOMContentLoaded', () => {
  // Функция обновления текста на странице
  function updateText() {
    const t = translations[lang] || translations["en"];
    
    // Обновление заголовка
    document.title = t.mainTitle;
    const mainTitleEl = document.querySelector('h1');
    if (mainTitleEl) {
      mainTitleEl.childNodes[0].textContent = t.mainTitle;
    }
    
    // Обновление подсказки заголовка
    const tooltipTextEl = document.querySelector('h1 .tooltip-text');
    if (tooltipTextEl) {
      tooltipTextEl.textContent = t.tooltipMain;
    }
    
    // Обновление плейсхолдера ввода
    const caloriesInputEl = document.getElementById('caloriesInput');
    if (caloriesInputEl) {
      caloriesInputEl.placeholder = t.caloriesPlaceholder;
    }
    
    // Обновление дней недели
    const weekdayEls = document.querySelectorAll('.weekday');
    if (weekdayEls && weekdayEls.length === 7) {
      weekdayEls.forEach((el, i) => {
        el.textContent = t.weekdays[i];
      });
    }
  }
  
  // Вызываем функцию обновления текста
  updateText();
});
