document.getElementById('bmr-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Получаем значения из формы
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const age = parseFloat(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const activityLevel = parseInt(document.getElementById('activity').value);
  
  // Расчёт BMR по формуле Mifflin-St Jeor:
  // Для мужчин: BMR = 10 * вес + 6.25 * рост - 5 * возраст + 5
  // Для женщин: BMR = 10 * вес + 6.25 * рост - 5 * возраст - 161
  let bmr;
  if (gender === 'м') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Определяем множитель активности:
  // 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9
  let multiplier;
  switch(activityLevel) {
    case 1:
      multiplier = 1.2;
      break;
    case 2:
      multiplier = 1.375;
      break;
    case 3:
      multiplier = 1.55;
      break;
    case 4:
      multiplier = 1.725;
      break;
    case 5:
      multiplier = 1.9;
      break;
    default:
      multiplier = 1.0;
  }
  
  // Расчёт TDEE (общее количество сжигаемых калорий с учётом активности)
  const tdee = bmr * multiplier;
  
  // Вывод результатов
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <h3>Результат:</h3>
    <p>BMR (базальный уровень метаболизма): <strong>${Math.round(bmr)}</strong> калорий/день</p>
    <p>TDEE (с учётом активности): <strong>${Math.round(tdee)}</strong> калорий/день</p>
  `;
});
