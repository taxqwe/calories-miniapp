document.addEventListener('DOMContentLoaded', () => {
  // Поддерживаемые локали
  const supportedLocales = ["ar", "de", "es", "fr", "hi", "ru", "tr", "uk", "en"];
  
  const translations = {
    en: {
      mainTitle: "BMR and TDEE Calculator",
      formHeader: "Enter your data:",
      labelHeight: "Height (cm)",
      labelWeight: "Weight (kg)",
      labelAge: "Age (years)",
      labelGender: "Gender:",
      labelMale: "Male",
      labelFemale: "Female",
      labelActivity: "Physical Activity Level:",
      selectActivity: "Select level on the scale:",
      labelGoal: "Your goal:",
      goalSurplus: "Calorie surplus (mass gain)",
      goalDeficit: "Calorie deficit (weight loss)",
      calculateButton: "Calculate and Send",
      resultTitle: "Result:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Daily Calories:",
      kcal: "calories/day",
      heightPlaceholder: "Example: 175",
      weightPlaceholder: "Example: 70",
      agePlaceholder: "Example: 30",
      descBMR: "BMR — Basal Metabolic Rate.",
      descTDEE: "TDEE — Total Daily Energy Expenditure.",
      tooltipBMR: "BMR (Basal Metabolic Rate) is the number of calories your body burns at rest over 24 hours. It's the basic energy requirement to maintain vital functions.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) is the total number of calories your body uses in a day, including physical activities.",
      validationErrors: { 
        fillAll: "Please fill in all fields",
        heightRange: "The height must be between 100 and 250 cm",
        weightRange: "The weight must be between 30 and 300 kg",
        ageRange: "The age must be between 14 and 120 years"
      },
      sending: "Sending data...",
      success: "✅ Data successfully sent!",
      error: "❌ Error sending data:",
      criticalError: "❌ Critical error:",
      activityLevels: {
        1: { title: "Sedentary (minimal activity)", details: "You spend most of your day sitting and rarely exercise." },
        2: { title: "Light activity (1-3 workouts per week)", details: "You do some light exercise or walking several times a week." },
        3: { title: "Moderate activity (3-5 workouts per week)", details: "You exercise several times a week, maintaining good physical condition." },
        4: { title: "High activity (6-7 workouts per week)", details: "You regularly engage in sports, requiring good physical fitness." },
        5: { title: "Very high activity (intensive training)", details: "You have an intensive training regime, possibly with multiple workouts per day." }
      }
    },
    ru: {
      mainTitle: "Калькулятор BMR и TDEE",
      formHeader: "Внесите свои данные:",
      labelHeight: "Рост (см)",
      labelWeight: "Вес (кг)",
      labelAge: "Возраст (лет)",
      labelGender: "Пол:",
      labelMale: "Мужской",
      labelFemale: "Женский",
      labelActivity: "Уровень физической активности:",
      selectActivity: "Выберите уровень на шкале:",
      labelGoal: "Ваша цель:",
      goalSurplus: "Профицит калорий (набор массы)",
      goalDeficit: "Дефицит калорий (снижение веса)",
      calculateButton: "Рассчитать и отправить",
      resultTitle: "Результат:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Калорий в день:",
      kcal: "калорий/день",
      heightPlaceholder: "Например, 175",
      weightPlaceholder: "Например, 70",
      agePlaceholder: "Например, 30",
      descBMR: "BMR — базовый метаболический уровень.",
      descTDEE: "TDEE — общий дневной расход энергии.",
      tooltipBMR: "BMR (Basal Metabolic Rate) — это количество калорий, которое ваш организм сжигает в состоянии покоя за 24 часа. Это базовая потребность организма в энергии для поддержания жизнедеятельности.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) — это суммарное количество калорий, затрачиваемое организмом за день, включая физическую активность.",
      validationErrors: { 
        fillAll: "Пожалуйста, заполните все поля",
        heightRange: "Рост должен быть от 100 до 250 см",
        weightRange: "Вес должен быть от 30 до 300 кг",
        ageRange: "Возраст должен быть от 14 до 120 лет"
      },
      sending: "Отправка данных...",
      success: "✅ Данные успешно отправлены!",
      error: "❌ Ошибка отправки данных:",
      criticalError: "❌ Критическая ошибка:",
      activityLevels: {
        1: { title: "Сидячий образ жизни (минимальная активность)", details: "Вы проводите большую часть дня в сидячем положении и практически не занимаетесь спортом." },
        2: { title: "Легкая активность (1-3 тренировки в неделю)", details: "Вы немного двигаетесь, ходите пешком или занимаетесь легкими упражнениями." },
        3: { title: "Умеренная активность (3-5 тренировок в неделю)", details: "Вы тренируетесь несколько раз в неделю, поддерживая хорошую физическую форму." },
        4: { title: "Высокая активность (6-7 тренировок в неделю)", details: "Вы регулярно занимаетесь спортом, что требует хорошей физической подготовки." },
        5: { title: "Очень высокая активность (интенсивные тренировки)", details: "У вас интенсивный тренировочный режим, возможно, с несколькими тренировками в день." }
      }
    },
    ar: {
      mainTitle: "حساب BMR و TDEE",
      formHeader: "أدخل بياناتك:",
      labelHeight: "الطول (سم)",
      labelWeight: "الوزن (كجم)",
      labelAge: "العمر (سنة)",
      labelGender: "الجنس:",
      labelMale: "ذكر",
      labelFemale: "أنثى",
      labelActivity: "مستوى النشاط البدني:",
      selectActivity: "اختر المستوى على المقياس:",
      labelGoal: "هدفك:",
      goalSurplus: "فائض السعرات (زيادة الكتلة)",
      goalDeficit: "عجز السعرات (فقدان الوزن)",
      calculateButton: "احسب وأرسل",
      resultTitle: "النتيجة:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "السعرات الحرارية اليومية:",
      kcal: "سعر حراري/اليوم",
      heightPlaceholder: "مثال: 175",
      weightPlaceholder: "مثال: 70",
      agePlaceholder: "مثال: 30",
      descBMR: "BMR — معدل الأيض الأساسي.",
      descTDEE: "TDEE — إجمالي استهلاك الطاقة اليومي.",
      tooltipBMR: "BMR (Basal Metabolic Rate) هو عدد السعرات الحرارية التي يحرقها جسمك أثناء الراحة على مدار 24 ساعة. إنه الحد الأدنى من الطاقة المطلوبة للحفاظ على الوظائف الحيوية.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) هو إجمالي السعرات الحرارية التي يستهلكها جسمك في اليوم، بما في ذلك النشاط البدني.",
      validationErrors: { 
        fillAll: "يرجى ملء جميع الحقول",
        heightRange: "الطول يجب أن يكون بين 100 و 250 سم",
        weightRange: "الوزن يجب أن يكون بين 30 و 300 كجم",
        ageRange: "يجب أن يكون العمر بين 14 و 120 عامًا"
      },
      sending: "جاري إرسال البيانات...",
      success: "✅ تم إرسال البيانات بنجاح!",
      error: "❌ خطأ في إرسال البيانات:",
      criticalError: "❌ خطأ حرج:",
      activityLevels: {
        1: { title: "نمط حياة خامل (نشاط بسيط)", details: "تقضي معظم وقتك جالسًا ونادرًا ما تمارس الرياضة." },
        2: { title: "نشاط خفيف (1-3 تمارين في الأسبوع)", details: "تمارس بعض التمارين الخفيفة أو المشي عدة مرات في الأسبوع." },
        3: { title: "نشاط معتدل (3-5 تمارين في الأسبوع)", details: "تمارس الرياضة عدة مرات في الأسبوع وتحافظ على لياقة بدنية جيدة." },
        4: { title: "نشاط عالي (6-7 تمارين في الأسبوع)", details: "تمارس الرياضة بانتظام مما يتطلب لياقة بدنية عالية." },
        5: { title: "نشاط مرتفع جدًا (تدريب مكثف)", details: "لديك نظام تدريبي مكثف، ربما مع عدة جلسات تدريبية في اليوم." }
      }
    },
    de: {
      mainTitle: "BMR- und TDEE-Rechner",
      formHeader: "Geben Sie Ihre Daten ein:",
      labelHeight: "Körpergröße (cm)",
      labelWeight: "Gewicht (kg)",
      labelAge: "Alter (Jahre)",
      labelGender: "Geschlecht:",
      labelMale: "Männlich",
      labelFemale: "Weiblich",
      labelActivity: "Körperliches Aktivitätsniveau:",
      selectActivity: "Wählen Sie den Level auf der Skala:",
      labelGoal: "Dein Ziel:",
      goalSurplus: "Kalorienüberschuss (Masseaufbau)",
      goalDeficit: "Kaloriendefizit (Gewichtsverlust)",
      calculateButton: "Berechnen und Senden",
      resultTitle: "Ergebnis:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Tägliche Kalorien:",
      kcal: "kcal/Tag",
      heightPlaceholder: "Beispiel: 175",
      weightPlaceholder: "Beispiel: 70",
      agePlaceholder: "Beispiel: 30",
      descBMR: "BMR — Grundumsatz.",
      descTDEE: "TDEE — Gesamtumsatz pro Tag.",
      tooltipBMR: "Der BMR (Basal Metabolic Rate) ist die Menge an Kalorien, die Ihr Körper in Ruhe über 24 Stunden verbrennt. Dies ist der grundlegende Energiebedarf zur Aufrechterhaltung lebenswichtiger Funktionen.",
      tooltipTDEE: "Der TDEE (Total Daily Energy Expenditure) ist die Gesamtzahl der Kalorien, die Ihr Körper an einem Tag verbraucht, einschließlich körperlicher Aktivitäten.",
      validationErrors: { 
        fillAll: "Bitte füllen Sie alle Felder aus",
        heightRange: "Die Körpergröße muss zwischen 100 und 250 cm liegen",
        weightRange: "Das Gewicht muss zwischen 30 und 300 kg liegen",
        ageRange: "Das Alter muss zwischen 14 und 120 Jahren liegen"
      },
      sending: "Daten werden gesendet...",
      success: "✅ Daten erfolgreich gesendet!",
      error: "❌ Fehler beim Senden der Daten:",
      criticalError: "❌ Kritischer Fehler:",
      activityLevels: {
        1: { title: "Sitzender Lebensstil (minimale Aktivität)", details: "Sie verbringen den größten Teil des Tages sitzend und treiben selten Sport." },
        2: { title: "Leichte Aktivität (1-3 Workouts pro Woche)", details: "Gelegentlich machen Sie leichte Übungen oder gehen mehrmals pro Woche spazieren." },
        3: { title: "Mäßige Aktivität (3-5 Workouts pro Woche)", details: "Sie trainieren mehrere Male pro Woche und halten eine gute Fitness." },
        4: { title: "Hohe Aktivität (6-7 Workouts pro Woche)", details: "Sie treiben regelmäßig Sport, was eine gute körperliche Verfassung erfordert." },
        5: { title: "Sehr hohe Aktivität (intensives Training)", details: "Sie haben ein intensives Trainingsprogramm, möglicherweise mit mehreren Trainingseinheiten pro Tag." }
      }
    },
    es: {
      mainTitle: "Calculadora de BMR y TDEE",
      formHeader: "Ingrese sus datos:",
      labelHeight: "Estatura (cm)",
      labelWeight: "Peso (kg)",
      labelAge: "Edad (años)",
      labelGender: "Género:",
      labelMale: "Hombre",
      labelFemale: "Mujer",
      labelActivity: "Nivel de actividad física:",
      selectActivity: "Seleccione el nivel en la escala:",
      labelGoal: "Tu objetivo:",
      goalSurplus: "Superávit calórico (ganancia de masa)",
      goalDeficit: "Déficit calórico (pérdida de peso)",
      calculateButton: "Calcular y Enviar",
      resultTitle: "Resultado:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Calorías diarias:",
      kcal: "kcal/día",
      heightPlaceholder: "Ejemplo: 175",
      weightPlaceholder: "Ejemplo: 70",
      agePlaceholder: "Ejemplo: 30",
      descBMR: "BMR — Tasa Metabólica Basal.",
      descTDEE: "TDEE — Gasto Energético Total Diario.",
      tooltipBMR: "La BMR (Tasa Metabólica Basal) es la cantidad de calorías que tu cuerpo quema en reposo durante 24 horas. Es el requerimiento básico de energía para mantener las funciones vitales.",
      tooltipTDEE: "El TDEE (Gasto Energético Total Diario) es la cantidad total de calorías que tu cuerpo usa en un día, incluyendo actividades físicas.",
      validationErrors: { 
        fillAll: "Por favor, complete todos los campos",
        heightRange: "La altura debe estar entre 100 y 250 cm",
        weightRange: "El peso debe estar entre 30 y 300 kg",
        ageRange: "La edad debe estar entre 14 y 120 años"
      },
      sending: "Enviando datos...",
      success: "✅ ¡Datos enviados con éxito!",
      error: "❌ Error al enviar los datos:",
      criticalError: "❌ Error crítico:",
      activityLevels: {
        1: { title: "Estilo de vida sedentario (actividad mínima)", details: "Pasa la mayor parte del día sentado y rara vez haces ejercicio." },
        2: { title: "Actividad ligera (1-3 entrenamientos por semana)", details: "Realizas ejercicios ligeros o caminas varias veces a la semana." },
        3: { title: "Actividad moderada (3-5 entrenamientos por semana)", details: "Haces ejercicio varias veces por semana, manteniendo una buena condición física." },
        4: { title: "Alta actividad (6-7 entrenamientos por semana)", details: "Practicas deporte de forma regular, lo que requiere una buena forma física." },
        5: { title: "Muy alta actividad (entrenamiento intensivo)", details: "Tienes un régimen de entrenamiento intensivo, posiblemente con varias sesiones al día." }
      }
    },
    fr: {
      mainTitle: "Calculateur de BMR et TDEE",
      formHeader: "Entrez vos informations :",
      labelHeight: "Taille (cm)",
      labelWeight: "Poids (kg)",
      labelAge: "Âge (ans)",
      labelGender: "Sexe :",
      labelMale: "Homme",
      labelFemale: "Femme",
      labelActivity: "Niveau d'activité physique :",
      selectActivity: "Sélectionnez le niveau sur l'échelle :",
      labelGoal: "Votre objectif :",
      goalSurplus: "Surplus calorique (prise de masse)",
      goalDeficit: "Déficit calorique (perte de poids)",
      calculateButton: "Calculer et Envoyer",
      resultTitle: "Résultat :",
      bmrResult: "BMR :",
      dailyCaloriesResult: "Calories quotidiennes :",
      kcal: "kcal/jour",
      heightPlaceholder: "Exemple : 175",
      weightPlaceholder: "Exemple : 70",
      agePlaceholder: "Exemple : 30",
      descBMR: "BMR — Taux métabolique de base.",
      descTDEE: "TDEE — Dépense énergétique quotidienne totale.",
      tooltipBMR: "Le BMR (Basal Metabolic Rate) est la quantité de calories que votre corps brûle au repos pendant 24 heures. C'est le besoin énergétique de base pour maintenir les fonctions vitales.",
      tooltipTDEE: "Le TDEE (Total Daily Energy Expenditure) est la quantité totale de calories que votre corps utilise en une journée, y compris les activités physiques.",
      validationErrors: { 
        fillAll: "Veuillez remplir tous les champs",
        heightRange: "La taille doit être entre 100 et 250 cm",
        weightRange: "Le poids doit être entre 30 et 300 kg",
        ageRange: "L'âge doit être entre 14 et 120 ans"
      },
      sending: "Envoi des données...",
      success: "✅ Données envoyées avec succès !",
      error: "❌ Erreur lors de l'envoi des données :",
      criticalError: "❌ Erreur critique :",
      activityLevels: {
        1: { title: "Mode de vie sédentaire (activité minimale)", details: "Vous passez la majeure partie de la journée assis et faites rarement de l'exercice." },
        2: { title: "Activité légère (1-3 entraînements par semaine)", details: "Vous faites quelques exercices légers ou marchez plusieurs fois par semaine." },
        3: { title: "Activité modérée (3-5 entraînements par semaine)", details: "Vous vous entraînez plusieurs fois par semaine, maintenant une bonne condition physique." },
        4: { title: "Activité élevée (6-7 entraînements par semaine)", details: "Vous pratiquez régulièrement du sport, ce qui nécessite une bonne forme physique." },
        5: { title: "Activité très élevée (entraînement intensif)", details: "Vous avez un programme d'entraînement intensif, avec possiblement plusieurs séances par jour." }
      }
    },
    hi: {
      mainTitle: "BMR और TDEE कैलकुलेटर",
      formHeader: "अपनी जानकारी दर्ज करें:",
      labelHeight: "ऊँचाई (सेमी)",
      labelWeight: "वज़न (किग्रा)",
      labelAge: "उम्र (साल)",
      labelGender: "लिंग:",
      labelMale: "पुरुष",
      labelFemale: "महिला",
      labelActivity: "शारीरिक गतिविधि का स्तर:",
      selectActivity: "स्केल पर स्तर चुनें:",
      labelGoal: "आपका लक्ष्य:",
      goalSurplus: "कैलोरी सरप्लस (वज़न बढ़ाना)",
      goalDeficit: "कैलोरी डेफिसिट (वज़न घटाना)",
      calculateButton: "गणना करें और भेजें",
      resultTitle: "परिणाम:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "दैनिक कैलोरी:",
      kcal: "कैलोरी/दिन",
      heightPlaceholder: "उदाहरण: 175",
      weightPlaceholder: "उदाहरण: 70",
      agePlaceholder: "उदाहरण: 30",
      descBMR: "BMR — बेसल मेटाबॉलिक रेट.",
      descTDEE: "TDEE — कुल दैनिक ऊर्जा व्यय.",
      tooltipBMR: "BMR (Basal Metabolic Rate) वह कैलोरी की मात्रा है जो आपका शरीर 24 घंटे के आराम में जलाता है। यह महत्वपूर्ण शारीरिक कार्यों को बनाए रखने के लिए आवश्यक मूलभूत ऊर्जा है।",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) वह कुल कैलोरी है जो आपका शरीर एक दिन में उपयोग करता है, जिसमें शारीरिक गतिविधियाँ शामिल हैं।",
      validationErrors: { 
        fillAll: "कृपया सभी फ़ील्ड भरें",
        heightRange: "ऊँचाई 100 से 250 सेमी के बीच होनी चाहिए",
        weightRange: "वज़न 30 से 300 किग्रा के बीच होना चाहिए",
        ageRange: "उम्र 14 से 120 वर्षों के बीच होनी चाहिए"
      },
      sending: "डेटा भेजे जा रहे हैं...",
      success: "✅ डेटा सफलतापूर्वक भेजे गए!",
      error: "❌ डेटा भेजने में त्रुटि:",
      criticalError: "❌ गंभीर त्रुटि:",
      activityLevels: {
        1: { title: "बैठे रहने वाला जीवन (न्यूनतम गतिविधि)", details: "आप अपना अधिकांश दिन बैठकर बिताते हैं और शायद ही कभी व्यायाम करते हैं।" },
        2: { title: "हल्की गतिविधि (सप्ताह में 1-3 वर्कआउट)", details: "आप कभी-कभार हल्का व्यायाम करते हैं या सप्ताह में कई बार पैदल चलते हैं।" },
        3: { title: "मध्यम गतिविधि (सप्ताह में 3-5 वर्कआउट)", details: "आप सप्ताह में कई बार व्यायाम करते हैं और अच्छी शारीरिक स्थिति बनाए रखते हैं।" },
        4: { title: "उच्च गतिविधि (सप्ताह में 6-7 वर्कआउट)", details: "आप नियमित रूप से व्यायाम करते हैं, जिसके लिए अच्छी फिटनेस आवश्यक होती है।" },
        5: { title: "बहुत उच्च गतिविधि (गहन प्रशिक्षण)", details: "आपका प्रशिक्षण बहुत गहन है, संभवतः दिन में कई सत्र होते हैं।" }
      }
    },
    tr: {
      mainTitle: "BMR ve TDEE Hesaplayıcı",
      formHeader: "Verilerinizi girin:",
      labelHeight: "Boy (cm)",
      labelWeight: "Kilo (kg)",
      labelAge: "Yaş (yıl)",
      labelGender: "Cinsiyet:",
      labelMale: "Erkek",
      labelFemale: "Kadın",
      labelActivity: "Fiziksel Aktivite Seviyesi:",
      selectActivity: "Ölçekteki seviyeyi seçin:",
      labelGoal: "Hedefiniz:",
      goalSurplus: "Kalori fazlası (kütle kazanımı)",
      goalDeficit: "Kalori açığı (kilo verme)",
      calculateButton: "Hesapla ve Gönder",
      resultTitle: "Sonuç:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Günlük Kalori:",
      kcal: "kalori/gün",
      heightPlaceholder: "Örneğin: 175",
      weightPlaceholder: "Örneğin: 70",
      agePlaceholder: "Örneğin: 30",
      descBMR: "BMR — Bazal Metabolizma Hızı.",
      descTDEE: "TDEE — Toplam Günlük Enerji Harcaması.",
      tooltipBMR: "BMR (Bazal Metabolizma Hızı), vücudunuzun 24 saatlik dinlenme süresince yaktığı kalori miktarıdır. Hayati fonksiyonları sürdürmek için gereken temel enerji ihtiyacıdır.",
      tooltipTDEE: "TDEE (Toplam Günlük Enerji Harcaması), fiziksel aktiviteler dahil olmak üzere vücudunuzun bir günde kullandığı toplam kalori miktarıdır.",
      validationErrors: { 
        fillAll: "Lütfen tüm alanları doldurun",
        heightRange: "Boy 100 ile 250 cm arasında olmalı",
        weightRange: "Kilo 30 ile 300 kg arasında olmalı",
        ageRange: "Yaş 14 ile 120 yaş arasında olmalı"
      },
      sending: "Veriler gönderiliyor...",
      success: "✅ Veriler başarıyla gönderildi!",
      error: "❌ Veriler gönderilirken hata:",
      criticalError: "❌ Kritik hata:",
      activityLevels: {
        1: { title: "Hareketsiz yaşam tarzı (minimum aktivite)", details: "Günün büyük bir kısmını oturarak geçirirsiniz ve nadiren egzersiz yaparsınız." },
        2: { title: "Hafif aktivite (haftada 1-3 antrenman)", details: "Haftada birkaç kez hafif egzersiz yapar veya yürüyüşe çıkar, az miktarda hareket edersiniz." },
        3: { title: "Orta düzey aktivite (haftada 3-5 antrenman)", details: "Haftada birkaç kez egzersiz yapar, iyi bir fiziksel durumunuzu korursunuz." },
        4: { title: "Yüksek aktivite (haftada 6-7 antrenman)", details: "Düzenli olarak spor yaparsınız, bu da iyi bir fiziksel form gerektirir." },
        5: { title: "Çok yüksek aktivite (yoğun antrenman)", details: "Yoğun bir antrenman programınız var, muhtemelen günde birkaç seans yaparsınız." }
      }
    },
    uk: {
      mainTitle: "Калькулятор BMR та TDEE",
      formHeader: "Введіть ваші дані:",
      labelHeight: "Зріст (см)",
      labelWeight: "Вага (кг)",
      labelAge: "Вік (років)",
      labelGender: "Стать:",
      labelMale: "Чоловіча",
      labelFemale: "Жіноча",
      labelActivity: "Рівень фізичної активності:",
      selectActivity: "Оберіть рівень на шкалі:",
      labelGoal: "Ваша мета:",
      goalSurplus: "Профіцит калорій (набір маси)",
      goalDeficit: "Дефіцит калорій (зниження ваги)",
      calculateButton: "Розрахувати і відправити",
      resultTitle: "Результат:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Денна кількість калорій:",
      kcal: "ккал/день",
      heightPlaceholder: "Наприклад: 175",
      weightPlaceholder: "Наприклад: 70",
      agePlaceholder: "Наприклад: 30",
      descBMR: "BMR — базальний метаболічний рівень.",
      descTDEE: "TDEE — загальні добові витрати енергії.",
      tooltipBMR: "BMR (Basal Metabolic Rate) — це кількість калорій, які організм спалює в стані спокою за 24 години. Це базова потреба в енергії для підтримання життєво важливих функцій.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) — це загальна кількість калорій, які організм витрачає за день, враховуючи фізичну активність.",
      validationErrors: { 
        fillAll: "Будь ласка, заповніть усі поля",
        heightRange: "Зріст повинен бути від 100 до 250 см",
        weightRange: "Вага повинна бути від 30 до 300 кг",
        ageRange: "Вік повинен бути від 14 до 120 років"
      },
      sending: "Відправка даних...",
      success: "✅ Дані успішно відправлено!",
      error: "❌ Помилка відправки даних:",
      criticalError: "❌ Критична помилка:",
      activityLevels: {
        1: { title: "Малорухливий спосіб життя (мінімальна активність)", details: "Ви проводите більшу частину дня сидячи та рідко займаєтеся спортом." },
        2: { title: "Низька активність (1-3 тренування на тиждень)", details: "Ви трохи рухаєтеся або виконуєте легкі вправи кілька разів на тиждень." },
        3: { title: "Помірна активність (3-5 тренувань на тиждень)", details: "Ви тренуєтеся кілька разів на тиждень, підтримуючи хорошу фізичну форму." },
        4: { title: "Висока активність (6-7 тренувань на тиждень)", details: "Ви регулярно займаєтеся спортом, що вимагає гарної фізичної підготовки." },
        5: { title: "Дуже висока активність (інтенсивні тренування)", details: "У вас інтенсивний режим тренувань, можливо, з кількома заняттями на день." }
      }
    },
    pt: {
      mainTitle: "Calculadora de BMR e TDEE",
      formHeader: "Digite seus dados:",
      labelHeight: "Altura (cm)",
      labelWeight: "Peso (kg)",
      labelAge: "Idade (anos)",
      labelGender: "Gênero:",
      labelMale: "Masculino",
      labelFemale: "Feminino",
      labelActivity: "Nível de Atividade Física:",
      selectActivity: "Selecione o nível na escala:",
      labelGoal: "Seu objetivo:",
      goalSurplus: "Superávit calórico (ganho de massa)",
      goalDeficit: "Déficit calórico (perda de peso)",
      calculateButton: "Calcular e Enviar",
      resultTitle: "Resultado:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Calorias Diárias:",
      kcal: "calorias/dia",
      heightPlaceholder: "Exemplo: 175",
      weightPlaceholder: "Exemplo: 70",
      agePlaceholder: "Exemplo: 30",
      descBMR: "BMR — Taxa Metabólica Basal.",
      descTDEE: "TDEE — Despesa Energética Total Diária.",
      tooltipBMR: "BMR (Taxa Metabólica Basal) é o número de calorias que seu corpo queima em repouso durante 24 horas. É o requisito energético básico para manter as funções vitais.",
      tooltipTDEE: "TDEE (Despesa Energética Total Diária) é o total de calorias que seu corpo utiliza em um dia, incluindo atividades físicas.",
      validationErrors: { 
        fillAll: "Por favor, preencha todos os campos",
        heightRange: "A altura deve estar entre 100 e 250 cm",
        weightRange: "O peso deve estar entre 30 e 300 kg",
        ageRange: "A idade deve estar entre 14 e 120 anos"
      },
      sending: "Enviando dados...",
      success: "✅ Dados enviados com sucesso!",
      error: "❌ Erro ao enviar dados:",
      criticalError: "❌ Erro crítico:",
      activityLevels: {
        1: { title: "Estilo de vida sedentário (atividade mínima)", details: "Você passa a maior parte do dia sentado e raramente se exercita." },
        2: { title: "Atividade leve (1-3 treinos por semana)", details: "Você pratica exercícios leves ou faz caminhadas algumas vezes por semana." },
        3: { title: "Atividade moderada (3-5 treinos por semana)", details: "Você se exercita várias vezes por semana, mantendo uma boa condição física." },
        4: { title: "Alta atividade (6-7 treinos por semana)", details: "Você pratica esportes regularmente, o que exige boa forma física." },
        5: { title: "Muito alta atividade (treino intensivo)", details: "Você segue um regime de treinamento intensivo, possivelmente com várias sessões por dia." }
      }
    }
  }

  // DOM-элементы
  const mainTitleEl = document.getElementById('main-title');
  const descBmrEl = document.getElementById('desc-bmr');
  const descTdeeEl = document.getElementById('desc-tdee');
  const formHeaderEl = document.getElementById('form-header');
  const heightEl = document.getElementById('height');
  const weightEl = document.getElementById('weight');
  const ageEl = document.getElementById('age');
  const labelGenderEl = document.getElementById('label-gender');
  const labelMaleEl = document.getElementById('label-male');
  const labelFemaleEl = document.getElementById('label-female');
  const labelActivityEl = document.getElementById('label-activity');
  const selectActivityEl = document.getElementById('select-activity');
  const activityRangeEl = document.getElementById('activityRange');
  activityRangeEl.addEventListener('input', updateActivityDescription);
  const activityDescriptionEl = document.getElementById('activityDescription');
  const labelGoalEl = document.getElementById('label-goal');
  const goalSurplusLabelEl = document.getElementById('goal-surplus-label');
  const goalDeficitLabelEl = document.getElementById('goal-deficit-label');
  const calculateButtonEl = document.getElementById('calculate-button');
  const resultEl = document.getElementById('result');
  const tooltipBmrEl = document.getElementById('tooltip-bmr');
  const tooltipTdeeEl = document.getElementById('tooltip-tdee');

  // Состояние
  const urlParams = new URLSearchParams(window.location.search || '');
  let isDebugMode = urlParams.get('debug') === 'true';
  let currentDate = new Date();
  let chatId = null;
  let initDataRaw = null;
  const langParam = urlParams.get('lang');
  const lang = (langParam && supportedLocales.includes(langParam)) ? langParam : "en";

  // Диапазоны валидации
  const validationRanges = {
    height: { min: 100, max: 250 },
    weight: { min: 30, max: 300 },
    age: { min: 14, max: 120 }
  };

  // Функция обновления текста на странице
  function updateText() {
    const t = translations[lang] || translations["en"];
    document.title = t.mainTitle;
    mainTitleEl.innerText = t.mainTitle;
    formHeaderEl.innerText = t.formHeader;
    
  // Создаем динамически содержимое для описания
    descBmrEl.innerHTML = t.descBMR + ' <span class="info-tooltip"><span class="info-icon">i</span><span class="tooltip-text" id="tooltip-bmr"></span></span>';
    descTdeeEl.innerHTML = t.descTDEE + ' <span class="info-tooltip"><span class="info-icon">i</span><span class="tooltip-text" id="tooltip-tdee"></span></span>';
    
  // Получаем элементы после установки innerHTML
    const tooltipBmrEl = document.getElementById('tooltip-bmr');
    const tooltipTdeeEl = document.getElementById('tooltip-tdee');
    tooltipBmrEl.innerText = t.tooltipBMR;
    tooltipTdeeEl.innerText = t.tooltipTDEE;
    
    document.getElementById('label-height').innerText = t.labelHeight;
    document.getElementById('label-weight').innerText = t.labelWeight;
    document.getElementById('label-age').innerText = t.labelAge;
    labelGenderEl.innerText = t.labelGender;
    labelMaleEl.innerText = t.labelMale;
    labelFemaleEl.innerText = t.labelFemale;
    labelActivityEl.innerText = t.labelActivity;
    selectActivityEl.innerText = t.selectActivity;
    labelGoalEl.innerText = t.labelGoal;
    goalSurplusLabelEl.innerText = t.goalSurplus;
    goalDeficitLabelEl.innerText = t.goalDeficit;
    calculateButtonEl.innerText = t.calculateButton;
    heightEl.placeholder = t.heightPlaceholder;
    weightEl.placeholder = t.weightPlaceholder;
    ageEl.placeholder = t.agePlaceholder;
    updateActivityDescription();
    setupTooltips();
  }


  // Функция обновления описания активности
  function updateActivityDescription() {
    const t = translations[lang] || translations["en"];
    const levels = t.activityLevels || {
      1: { title: "Sedentary (minimal activity)", details: "You spend most of your day sitting and rarely exercise." },
      2: { title: "Light activity (1-3 workouts per week)", details: "You do some light exercise or walking several times a week." },
      3: { title: "Moderate activity (3-5 workouts per week)", details: "You exercise several times a week, maintaining good physical condition." },
      4: { title: "High activity (6-7 workouts per week)", details: "You regularly engage in sports, requiring good physical fitness." },
      5: { title: "Very high activity (intensive training)", details: "You have an intensive training regime, possibly with multiple workouts per day." }
    };
    const level = activityRangeEl.value;
    const activity = levels[level];
    activityDescriptionEl.innerHTML = `<div class="activity-level">${activity.title}</div>
    <div class="activity-details">${activity.details}</div>`;
  }

  // Обработка всплывающих подсказок
  function setupTooltips() {
    document.querySelectorAll('.info-icon').forEach(icon => {
      icon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const tooltipContainer = this.parentNode;
        document.querySelectorAll('.info-tooltip.active').forEach(tip => {
          if (tip !== tooltipContainer) {
            tip.classList.remove('active');
          }
        });
        tooltipContainer.classList.toggle('active');
      });
    });
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.info-tooltip')) {
        document.querySelectorAll('.info-tooltip.active').forEach(tip => tip.classList.remove('active'));
      }
    });
  }

  let tg;

  // Инициализация приложения
  function init() {
    updateText();
    tg = window.Telegram.WebApp;
    tg.expand();
    initDataRaw = tg.initData;
    if (tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) {
      chatId = tg.initDataUnsafe.user.id;
    } else {
      const initData = JSON.parse(tg.initData);
      if (initData.user && initData.user.id) {
        chatId = initData.user.id;
      }
    }
    if (!chatId) {
      throw new Error('Не удалось получить идентификатор пользователя');
    }
  }

  // Обработка отправки формы – расчет BMR и ежедневных калорий
  document.getElementById('bmr-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    document.activeElement.blur();
    
    const height = parseFloat(heightEl.value);
    const weight = parseFloat(weightEl.value);
    const age = parseFloat(ageEl.value);
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const activityLevel = parseInt(activityRangeEl.value, 10);
    const t = translations[lang] || translations["en"];
    
    // Очистка предыдущих ошибок
    heightEl.classList.remove('error');
    weightEl.classList.remove('error');
    ageEl.classList.remove('error');
    
    // Удаляем предыдущие сообщения об ошибках
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    let hasErrors = false;
    
    // Проверка заполнения полей
    if (!height || !weight || !age || !gender) {
      alert(t.validationErrors.fillAll);
      return;
    }
    
    // Валидация диапазонов значений
    if (height < validationRanges.height.min || height > validationRanges.height.max) {
      displayError(heightEl, t.validationErrors.heightRange);
      hasErrors = true;
    }
    
    if (weight < validationRanges.weight.min || weight > validationRanges.weight.max) {
      displayError(weightEl, t.validationErrors.weightRange);
      hasErrors = true;
    }
    
    if (age < validationRanges.age.min || age > validationRanges.age.max) {
      displayError(ageEl, t.validationErrors.ageRange);
      hasErrors = true;
    }
    
    if (hasErrors) {
      return;
    }
    
    let bmr;
    if (gender === 'm' || gender === 'м') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const tdee = bmr * multipliers[activityLevel - 1];
    
    const payload = {
      data: {
        height: height,
        weight: weight,
        age: age,
        gender: gender,
        activityLevel: activityLevel,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee) // именно tdee, как было раньше
      },
      initData: window.Telegram.WebApp.initData
    };

    if (typeof chatId === 'number' && chatId > 0) {
      payload.data.chatId = chatId;
    }
    
    resultEl.innerHTML = `<h3>${t.resultTitle}</h3>
      <p>${t.bmrResult} <strong>${Math.round(bmr)}</strong> ${t.kcal}</p>
      <p>${t.dailyCaloriesResult} <strong>${Math.round(tdee)}</strong> ${t.kcal}</p>
    <p class="sending-status">${t.sending}</p>`;
    resultEl.classList.add('visible');
    
    try {
      const response = await fetch('https://calories-bot.duckdns.org:8443/bot/mbr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source-App': 'BMR-Calculator'
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });
      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status} - ${response.statusText}`);
      }
      resultEl.innerHTML += `<p class="success-status">${t.success}</p>`;
      tg.close();
    } catch (error) {
      console.error("Ошибка отправки:", error);
      resultEl.innerHTML += `<p class="error-status">${t.error} ${error.message}</p>`;
      alert(`Критическая ошибка: ${error.message}`);
    }
  });
  
  function updateCalendarSize() {
    const containerWidth = document.querySelector('.container').offsetWidth;
    const daySize = (containerWidth - 10) / 7;
    document.documentElement.style.setProperty('--day-size', `${daySize}px`);
  }
  
  // Функция для отображения ошибки под полем ввода
  function displayError(inputElement, message) {
    inputElement.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    inputElement.parentNode.appendChild(errorDiv);
  }
  
  window.addEventListener('resize', updateCalendarSize);
  
  updateCalendarSize();
  init();
});
