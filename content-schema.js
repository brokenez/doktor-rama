(function(root, factory) { if (typeof module === 'object' && module.exports) module.exports = factory(); else root.SiteSchema = factory(); })(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  return {
  "pages": [
    {
      "id": "hero",
      "title": "Главный экран"
    },
    {
      "id": "services",
      "title": "Услуги и цены"
    },
    {
      "id": "cases",
      "title": "Работы и фотографии"
    },
    {
      "id": "reviews",
      "title": "Отзывы"
    },
    {
      "id": "contacts",
      "title": "Контакты и адрес"
    },
    {
      "id": "about",
      "title": "О нас"
    },
    {
      "id": "process",
      "title": "Процесс ремонта"
    },
    {
      "id": "cta",
      "title": "Баннер"
    },
    {
      "id": "form",
      "title": "Форма заявки"
    },
    {
      "id": "brand",
      "title": "Бренд и меню"
    },
    {
      "id": "footer",
      "title": "Подвал"
    },
    {
      "id": "seo",
      "title": "Поисковики"
    }
  ],
  "fields": [
    {
      "page": "brand",
      "key": "brand.name",
      "label": "Название сервиса",
      "type": "text"
    },
    {
      "page": "brand",
      "key": "brand.tagline",
      "label": "Подпись под названием",
      "type": "text"
    },
    {
      "page": "brand",
      "key": "brand.logo",
      "label": "Логотип",
      "type": "image"
    },
    {
      "page": "brand",
      "key": "navigation.services",
      "label": "Услуги",
      "type": "text"
    },
    {
      "page": "brand",
      "key": "navigation.why",
      "label": "О нас",
      "type": "text"
    },
    {
      "page": "brand",
      "key": "navigation.process",
      "label": "Процесс",
      "type": "text"
    },
    {
      "page": "brand",
      "key": "navigation.cases",
      "label": "Работы",
      "type": "text"
    },
    {
      "page": "brand",
      "key": "navigation.reviews",
      "label": "Отзывы",
      "type": "text"
    },
    {
      "page": "brand",
      "key": "navigation.contact",
      "label": "Записаться",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.eyebrow",
      "label": "Надпись над заголовком",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.title",
      "label": "Заголовок",
      "type": "textarea"
    },
    {
      "page": "hero",
      "key": "hero.desc",
      "label": "Описание",
      "type": "textarea"
    },
    {
      "page": "hero",
      "key": "hero.primaryButton",
      "label": "Основная кнопка",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.secondaryButton",
      "label": "Кнопка работ",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.stat1_num",
      "label": "Статистика 1: значение",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.stat1_label",
      "label": "Статистика 1: подпись",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.stat2_num",
      "label": "Статистика 2: значение",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.stat2_label",
      "label": "Статистика 2: подпись",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.stat3_num",
      "label": "Статистика 3: значение",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.stat3_label",
      "label": "Статистика 3: подпись",
      "type": "text"
    },
    {
      "page": "hero",
      "key": "hero.scrollLabel",
      "label": "Подпись прокрутки",
      "type": "text"
    },
    {
      "page": "services",
      "key": "sections.services.label",
      "label": "Надпись над заголовком",
      "type": "text"
    },
    {
      "page": "services",
      "key": "sections.services.title",
      "label": "Заголовок раздела",
      "type": "text"
    },
    {
      "page": "services",
      "key": "sections.services.desc",
      "label": "Описание раздела",
      "type": "textarea"
    },
    {
      "page": "about",
      "key": "sections.why.label",
      "label": "Надпись над заголовком",
      "type": "text"
    },
    {
      "page": "about",
      "key": "sections.why.title",
      "label": "Заголовок раздела",
      "type": "text"
    },
    {
      "page": "process",
      "key": "sections.process.label",
      "label": "Надпись над заголовком",
      "type": "text"
    },
    {
      "page": "process",
      "key": "sections.process.title",
      "label": "Заголовок раздела",
      "type": "text"
    },
    {
      "page": "process",
      "key": "sections.process.desc",
      "label": "Описание раздела",
      "type": "textarea"
    },
    {
      "page": "cases",
      "key": "sections.cases.label",
      "label": "Надпись над заголовком",
      "type": "text"
    },
    {
      "page": "cases",
      "key": "sections.cases.title",
      "label": "Заголовок раздела",
      "type": "text"
    },
    {
      "page": "cases",
      "key": "sections.cases.desc",
      "label": "Описание раздела",
      "type": "textarea"
    },
    {
      "page": "reviews",
      "key": "sections.reviews.label",
      "label": "Надпись над заголовком",
      "type": "text"
    },
    {
      "page": "reviews",
      "key": "sections.reviews.title",
      "label": "Заголовок раздела",
      "type": "text"
    },
    {
      "page": "form",
      "key": "sections.contact.label",
      "label": "Надпись над заголовком",
      "type": "text"
    },
    {
      "page": "form",
      "key": "sections.contact.title",
      "label": "Заголовок раздела",
      "type": "text"
    },
    {
      "page": "cta",
      "key": "cta.title",
      "label": "Заголовок баннера",
      "type": "textarea"
    },
    {
      "page": "cta",
      "key": "cta.desc",
      "label": "Описание баннера",
      "type": "textarea"
    },
    {
      "page": "cta",
      "key": "cta.button",
      "label": "Кнопка баннера",
      "type": "text"
    },
    {
      "page": "contacts",
      "key": "contacts.phone",
      "label": "Телефон",
      "type": "text"
    },
    {
      "page": "contacts",
      "key": "contacts.email",
      "label": "Электронная почта",
      "type": "email"
    },
    {
      "page": "contacts",
      "key": "contacts.city",
      "label": "Город",
      "type": "text"
    },
    {
      "page": "contacts",
      "key": "contacts.address",
      "label": "Улица, дом и строение",
      "type": "text"
    },
    {
      "page": "contacts",
      "key": "contacts.hours",
      "label": "Режим работы",
      "type": "textarea"
    },
    {
      "page": "contacts",
      "key": "contacts.vk",
      "label": "Ссылка ВКонтакте",
      "type": "url"
    },
    {
      "page": "contacts",
      "key": "contacts.telegram",
      "label": "Ссылка Telegram",
      "type": "url"
    },
    {
      "page": "contacts",
      "key": "contactLabels.phone",
      "label": "Подпись: телефон",
      "type": "text"
    },
    {
      "page": "contacts",
      "key": "contactLabels.address",
      "label": "Подпись: адрес",
      "type": "text"
    },
    {
      "page": "contacts",
      "key": "contactLabels.hours",
      "label": "Подпись: режим работы",
      "type": "text"
    },
    {
      "page": "contacts",
      "key": "contactLabels.email",
      "label": "Подпись: почта",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.nameLabel",
      "label": "Подпись поля: Имя",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.namePlaceholder",
      "label": "Подсказка поля: Имя",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.phoneLabel",
      "label": "Подпись поля: Телефон",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.phonePlaceholder",
      "label": "Подсказка поля: Телефон",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.carLabel",
      "label": "Подпись поля: Автомобиль",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.carPlaceholder",
      "label": "Подсказка поля: Автомобиль",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.serviceLabel",
      "label": "Подпись поля: Услуга",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.messageLabel",
      "label": "Подпись поля: Описание проблемы",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.messagePlaceholder",
      "label": "Подсказка поля: Описание проблемы",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.servicePlaceholder",
      "label": "Подсказка выбора услуги",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.consultation",
      "label": "Вариант консультации",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.submit",
      "label": "Кнопка отправки",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.sending",
      "label": "Отправка заявки",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.success",
      "label": "Заявка отправлена",
      "type": "text"
    },
    {
      "page": "form",
      "key": "form.error",
      "label": "Ошибка отправки",
      "type": "text"
    },
    {
      "page": "footer",
      "key": "footer.desc",
      "label": "Описание сервиса в подвале",
      "type": "textarea"
    },
    {
      "page": "footer",
      "key": "footer.copyright",
      "label": "Авторские права",
      "type": "text"
    },
    {
      "page": "footer",
      "key": "footer.servicesTitle",
      "label": "Заголовок колонки: services",
      "type": "text"
    },
    {
      "page": "footer",
      "key": "footer.companyTitle",
      "label": "Заголовок колонки: company",
      "type": "text"
    },
    {
      "page": "footer",
      "key": "footer.contactsTitle",
      "label": "Заголовок колонки: contacts",
      "type": "text"
    },
    {
      "page": "footer",
      "key": "footer.link_why",
      "label": "Ссылка: why",
      "type": "text"
    },
    {
      "page": "footer",
      "key": "footer.link_cases",
      "label": "Ссылка: cases",
      "type": "text"
    },
    {
      "page": "footer",
      "key": "footer.link_reviews",
      "label": "Ссылка: reviews",
      "type": "text"
    },
    {
      "page": "footer",
      "key": "footer.link_process",
      "label": "Ссылка: process",
      "type": "text"
    },
    {
      "page": "footer",
      "key": "footer.link_contact",
      "label": "Ссылка: contact",
      "type": "text"
    },
    {
      "page": "seo",
      "key": "seo.title",
      "label": "Заголовок страницы",
      "type": "text"
    },
    {
      "page": "seo",
      "key": "seo.description",
      "label": "Описание для поисковиков",
      "type": "textarea"
    },
    {
      "page": "seo",
      "key": "seo.keywords",
      "label": "Ключевые слова",
      "type": "textarea"
    },
    {
      "page": "seo",
      "key": "seo.url",
      "label": "Основной URL сайта",
      "type": "url"
    }
  ],
  "lists": [
    {
      "page": "services",
      "key": "services",
      "title": "Услуги",
      "singular": "Услуга",
      "fields": [
        {
          "key": "title",
          "label": "Название",
          "type": "text"
        },
        {
          "key": "desc",
          "label": "Описание",
          "type": "textarea"
        },
        {
          "key": "price",
          "label": "Стоимость услуги",
          "type": "text",
          "hint": "Укажите цену с валютой или «Бесплатно»."
        }
      ]
    },
    {
      "page": "cases",
      "key": "cases",
      "title": "Работы",
      "singular": "Работа",
      "fields": [
        {
          "key": "tag",
          "label": "Автомобиль",
          "type": "text"
        },
        {
          "key": "title",
          "label": "Описание работы",
          "type": "text"
        },
        {
          "key": "image",
          "label": "Фотография",
          "type": "image"
        },
        {
          "key": "large",
          "label": "Широкая карточка",
          "type": "checkbox"
        }
      ]
    },
    {
      "page": "reviews",
      "key": "reviews",
      "title": "Отзывы",
      "singular": "Отзыв",
      "fields": [
        {
          "key": "name",
          "label": "Имя клиента",
          "type": "text"
        },
        {
          "key": "car",
          "label": "Автомобиль",
          "type": "text"
        },
        {
          "key": "text",
          "label": "Текст отзыва",
          "type": "textarea"
        },
        {
          "key": "stars",
          "label": "Оценка от 1 до 5",
          "type": "rating"
        },
        {
          "key": "image",
          "label": "Фотография клиента",
          "type": "image"
        }
      ]
    },
    {
      "page": "about",
      "key": "aboutStats",
      "title": "Статистика о сервисе",
      "singular": "Показатель",
      "fields": [
        {
          "key": "value",
          "label": "Значение",
          "type": "text"
        },
        {
          "key": "label",
          "label": "Подпись",
          "type": "text"
        }
      ]
    },
    {
      "page": "about",
      "key": "aboutPoints",
      "title": "Преимущества",
      "singular": "Преимущество",
      "fields": [
        {
          "key": "title",
          "label": "Название",
          "type": "text"
        },
        {
          "key": "text",
          "label": "Описание",
          "type": "textarea"
        }
      ]
    },
    {
      "page": "process",
      "key": "steps",
      "title": "Этапы ремонта",
      "singular": "Этап",
      "fields": [
        {
          "key": "title",
          "label": "Название",
          "type": "text"
        },
        {
          "key": "desc",
          "label": "Описание",
          "type": "textarea"
        }
      ]
    }
  ],
  "defaults": {
    "hero": {
      "title": "РЕМОНТ РАМ ВНЕДОРОЖНИКОВ",
      "desc": "Единственный в регионе сервис, специализирующийся исключительно на ремонте, усилении и восстановлении рам внедорожников. Никаких компромиссов — только надёжный металл.",
      "stat1_num": "10+",
      "stat1_label": "Лет опыта",
      "stat2_num": "500+",
      "stat2_label": "Отремонтировано рам",
      "stat3_num": "100%",
      "stat3_label": "Гарантия на сварку",
      "eyebrow": "Специализированный сервис",
      "primaryButton": "Записаться на диагностику",
      "secondaryButton": "Смотреть работы",
      "scrollLabel": "Скролл"
    },
    "services": [
      {
        "id": 1,
        "title": "Диагностика рамы",
        "desc": "Полный визуальный и инструментальный осмотр рамы. Выявляем трещины, деформации, коррозию и скрытые повреждения. Отчёт с фотофиксацией.",
        "price": "Бесплатно"
      },
      {
        "id": 2,
        "title": "Сварочные работы",
        "desc": "Профессиональная аргонодуговая и полуавтоматическая сварка. Заварка трещин, вварка усилителей, восстановление геометрии рамы после ДТП.",
        "price": "от 8 000 ₽"
      },
      {
        "id": 3,
        "title": "Усиление рамы",
        "desc": "Установка дополнительных усилителей и косынок. Подготовка рамы к езде в тяжёлом бездорожье, буксировке и повышенным нагрузкам.",
        "price": "от 12 000 ₽"
      },
      {
        "id": 4,
        "title": "Антикоррозийная обработка",
        "desc": "Комплексная защита рамы от ржавчины после ремонта. Пескоструйная очистка, грунтование, нанесение антикора и защитного покрытия.",
        "price": "от 10 000 ₽"
      },
      {
        "id": 5,
        "title": "Полное восстановление",
        "desc": "Комплексный ремонт рамы «под ключ»: диагностика, сварка, покраска и антикор. Возвращаем раму к заводским параметрам.",
        "price": "от 35 000 ₽"
      }
    ],
    "cases": [
      {
        "id": 1,
        "tag": "Toyota Land Cruiser 80",
        "title": "Восстановление рамы после ДТП",
        "image": "",
        "large": true
      },
      {
        "id": 2,
        "tag": "Jeep Wrangler JK",
        "title": "Усиление рамы для офф-роуда",
        "image": "",
        "large": false
      },
      {
        "id": 3,
        "tag": "Nissan Patrol Y61",
        "title": "Сварка трещины лонжерона",
        "image": "",
        "large": false
      },
      {
        "id": 4,
        "tag": "Land Rover Defender",
        "title": "Правка геометрии рамы",
        "image": "",
        "large": false
      },
      {
        "id": 5,
        "tag": "Mitsubishi Pajero 3",
        "title": "Полное восстановление + антикор",
        "image": "",
        "large": true
      }
    ],
    "reviews": [
      {
        "id": 1,
        "text": "Привёз Prado 150 с трещиной в раме после серьёзного диагонального скручивания. Думал — машине конец. Ребята сделали диагностику, показали всё на фото, объяснили план работ. Результат превзошёл ожидания — рама как новая, сварные швы аккуратнее заводских.",
        "name": "Александр К.",
        "car": "Toyota Land Cruiser Prado 150",
        "stars": 5
      },
      {
        "id": 2,
        "text": "Усиливали раму Дефендера под экспедиционные задачи. Обсудили все нюансы, предложили несколько вариантов усиления с разной ценой. Работу сделали быстро и качественно. Машина прошла уже 30 000 км по тяжёлому бездорожью — без нареканий.",
        "name": "Михаил В.",
        "car": "Land Rover Defender 110",
        "stars": 5
      },
      {
        "id": 3,
        "text": "Обратился с гнилой рамой Patrol'а. Думал придётся покупать новую — цены кусаются. Доктор Рама полностью восстановили раму с заменой сгнивших секций, сделали пескоструй и антикор. Цена разумная, гарантия год. Очень доволен.",
        "name": "Дмитрий С.",
        "car": "Nissan Patrol Y61",
        "stars": 5
      }
    ],
    "brand": {
      "name": "Доктор Рама",
      "tagline": "Ремонт рам внедорожников",
      "logo": "logo.png"
    },
    "navigation": {
      "services": "Услуги",
      "why": "О нас",
      "process": "Процесс",
      "cases": "Работы",
      "reviews": "Отзывы",
      "contact": "Записаться"
    },
    "sections": {
      "services": {
        "label": "Что мы делаем",
        "title": "НАШИ УСЛУГИ",
        "desc": "Полный спектр работ по рамам внедорожников: от диагностики до полного восстановления. Работаем с любыми марками и годами выпуска."
      },
      "why": {
        "label": "Почему мы",
        "title": "ОПЫТ И ПРОФЕССИОНАЛИЗМ"
      },
      "process": {
        "label": "Как мы работаем",
        "title": "ПРОЦЕСС РЕМОНТА",
        "desc": "Прозрачный и понятный процесс от первого звонка до выдачи автомобиля."
      },
      "cases": {
        "label": "Портфолио",
        "title": "НАШИ РАБОТЫ",
        "desc": "Реальные примеры ремонтов. От небольших трещин до полного восстановления после серьёзных аварий."
      },
      "reviews": {
        "label": "Отзывы клиентов",
        "title": "ЧТО ГОВОРЯТ КЛИЕНТЫ"
      },
      "contact": {
        "label": "Связаться с нами",
        "title": "ЗАПИСАТЬСЯ НА РЕМОНТ"
      }
    },
    "aboutStats": [
      {
        "value": "10+",
        "label": "Лет опыта"
      },
      {
        "value": "500+",
        "label": "Рам отремонтировано"
      },
      {
        "value": "40+",
        "label": "Марок внедорожников"
      },
      {
        "value": "12",
        "label": "Мес. гарантия"
      }
    ],
    "aboutPoints": [
      {
        "title": "Узкая специализация",
        "text": "Только рамы внедорожников — ничего лишнего. Это позволяет нам решать самые сложные случаи."
      },
      {
        "title": "Прозрачная диагностика",
        "text": "Подробный фотоотчёт с описанием всех дефектов до начала работ. Вы знаете за что платите."
      },
      {
        "title": "Гарантия на все работы",
        "text": "12 месяцев гарантии на сварочные швы. Устраним за свой счёт, если что-то пойдёт не так."
      },
      {
        "title": "Чёткие сроки",
        "text": "Большинство работ выполняем за 1–3 дня. Срочный ремонт — за 24 часа."
      }
    ],
    "steps": [
      {
        "title": "Заявка",
        "desc": "Звонок или форма на сайте. Предварительная оценка по фото — бесплатно и без обязательств."
      },
      {
        "title": "Диагностика",
        "desc": "Полный осмотр рамы. Фотоотчёт с детальным описанием всех найденных дефектов."
      },
      {
        "title": "Согласование",
        "desc": "Смета и сроки. Утверждаем план работ вместе с вами — никаких скрытых доплат."
      },
      {
        "title": "Ремонт",
        "desc": "Выполняем работы с фотофиксацией каждого этапа. Вы можете следить за процессом."
      },
      {
        "title": "Выдача автомобиля",
        "desc": "Контроль качества всех выполненных работ. Гарантийные документы на руки. Автомобиль готов к эксплуатации."
      }
    ],
    "cta": {
      "title": "РАМА ТРЕБУЕТ ВНИМАНИЯ?\nНЕ ОТКЛАДЫВАЙ",
      "desc": "Бесплатная предварительная консультация по фото",
      "button": "Записаться сейчас"
    },
    "contacts": {
      "phone": "+7 (953) 691-99-57",
      "email": "info@doktor-rama.ru",
      "city": "Москва",
      "address": "Шоссе Энтузиастов 2с41",
      "hours": "Пн–Сб: 10:00–20:00\nВс: по записи",
      "vk": "https://vk.ru/doctorrama",
      "telegram": "https://t.me/doctor_rama"
    },
    "contactLabels": {
      "phone": "Телефон",
      "address": "Адрес",
      "hours": "Режим работы",
      "email": "Email"
    },
    "form": {
      "nameLabel": "Ваше имя *",
      "namePlaceholder": "Иван Иванов",
      "phoneLabel": "Телефон *",
      "phonePlaceholder": "+7 (___) ___-__-__",
      "carLabel": "Марка и модель автомобиля",
      "carPlaceholder": "Например: Toyota Land Cruiser 80",
      "serviceLabel": "Необходимая услуга",
      "messageLabel": "Описание проблемы",
      "messagePlaceholder": "Опишите симптомы или проблему. Можно прикрепить фото при звонке.",
      "servicePlaceholder": "Выберите услугу",
      "consultation": "Не знаю, нужна консультация",
      "submit": "Отправить заявку",
      "sending": "Отправляем…",
      "success": "✓ Заявка отправлена!",
      "error": "Не удалось отправить заявку. Позвоните нам."
    },
    "footer": {
      "desc": "Специализированный сервис по ремонту, усилению и восстановлению рам внедорожников. Более 10 лет опыта. Гарантия на все работы.",
      "copyright": "© 2026 Доктор Рама. Все права защищены.",
      "servicesTitle": "Услуги",
      "companyTitle": "Компания",
      "contactsTitle": "Контакты",
      "link_why": "О нас",
      "link_cases": "Наши работы",
      "link_reviews": "Отзывы",
      "link_process": "Как работаем",
      "link_contact": "Контакты"
    },
    "seo": {
      "title": "Доктор Рама — Ремонт и переварка рам внедорожников в Москве",
      "description": "Специализированный сервис по ремонту, переварке и усилению рам внедорожников в Москве. Опыт более 10 лет. Гарантия на все работы. Звоните: +7 (953) 691-99-57",
      "keywords": "ремонт рамы внедорожника, переварка рамы, усиление рамы, ремонт рамы Москва, сварка рамы внедорожника, восстановление рамы, антикор рамы, Land Cruiser рама, УАЗ рама, Patrol рама, ремонт рамы цена",
      "url": "https://doctorrama.ru/"
    }
  }
};
});
