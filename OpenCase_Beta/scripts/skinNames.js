function getSkinName(skin, loc) {
	if (typeof loc == "undefined" || !Localization.supportedLanguages.skinNames.regExp.test(loc)) loc = "EN";
	if (typeof skin == 'undefined') return "Error! Make screenshot and send it to developer."
	
	if (skin.match(/[a-z]/g) != null && skin.match(/[a-z]/g).length > 2 && loc == "EN") return skin;
	if (skin.match(/[а-я]/g) != null && skin.match(/[а-я]/g).length > 2 && loc == "RU") return skin;
	
	var sk = skinNames.filter(function(obj){
		if (obj.RU.toLowerCase() == skin.toLowerCase()) return obj.EN;
		if (obj.EN.toLowerCase() == skin.toLowerCase()) return obj.EN;
	})
	if (sk.length != 0) {
		if (sk[0][loc] != "") 
			return sk[0][loc];
		else
			return sk[0]["EN"];
	} else {
		console.error("Wrong skin name! '"+skin+"'");
		return skin;
	}
}

var skinNames = [{
	"RU" : "Бульдозер",
	"EN" : "Bulldozer"
}, {
	"RU" : "Карамельное яблоко",
	"EN" : "Candy Apple"
}, {
	"RU" : "Ультрафиолет",
	"EN" : "Ultraviolet"
}, {
	"RU" : "Ночь",
	"EN" : "Night"
}, {
	"RU" : "Карамель",
	"EN" : "Caramel"
}, {
	"RU" : "Цвет луга",
	"EN" : "Grassland"
}, {
	"RU" : "Песчаные дюны",
	"EN" : "Sand Dune"
}, {
	"RU" : "Смерч",
	"EN" : "Tornado"
}, {
	"RU" : "Снежная мгла",
	"EN" : "Whiteout"
}, {
	"RU" : "Джунгли",
	"EN" : "Jungle"
}, {
	"RU" : "Подрыв",
	"EN" : "Demolition"
}, {
	"RU" : "Смертоносные кошечки",
	"EN" : "Death by Kitty"
}, {
	"RU" : "Смертенок",
	"EN" : "Doomkitty"
}, {
	"RU" : "Пиксельный камуфляж «Лес»",
	"EN" : "Forest DDPAT"
}, {
	"RU" : "Пиксельный камуфляж «Город»",
	"EN" : "Urban DDPAT"
}, {
	"RU" : "Пиксельный камуфляж «Ржавчина»",
	"EN" : "Orange DDPAT"
}, {
	"RU" : "Арктический камуфляж",
	"EN" : "Arctic Camo"
}, {
	"RU" : "Лесной камуфляж",
	"EN" : "Wood Camo"
}, {
	"RU" : "Зимний лес",
	"EN" : "Winter Forest"
}, {
	"RU" : "Северный лес",
	"EN" : "Boreal Forest"
}, {
	"RU" : "Песчаная буря",
	"EN" : "Desert Storm"
}, {
	"RU" : "Медянка",
	"EN" : "Copperhead"
}, {
	"RU" : "Черепа",
	"EN" : "Skulls"
}, {
	"RU" : "Кровавая паутина",
	"EN" : "Crimson Web"
}, {
	"RU" : "Красный глянец",
	"EN" : "Red Laminate"
}, {
	"RU" : "Черный глянец",
	"EN" : "Black Laminate"
}, {
	"RU" : "Пороховой дым",
	"EN" : "Gunsmoke"
}, {
	"RU" : "Тигр в джунглях",
	"EN" : "Jungle Tiger"
}, {
	"RU" : "Мраморный буран",
	"EN" : "Blizzard Marbleized"
}, {
	"RU" : "Контрастные цвета",
	"EN" : "Contrast Spray"
}, {
	"RU" : "Цвет джунглей",
	"EN" : "Jungle Spray"
}, {
	"RU" : "Городская перфорация",
	"EN" : "Urban Perforated"
}, {
	"RU" : "Лесные листья",
	"EN" : "Forest Leaves"
}, {
	"RU" : "Лишайниковая штриховка",
	"EN" : "Lichen Dashed"
}, {
	"RU" : "Городская штриховка",
	"EN" : "Urban Dashed"
}, {
	"RU" : "Городская маскировка",
	"EN" : "Urban Masked"
}, {
	"RU" : "Африканская сетка",
	"EN" : "Safari Mesh"
}, {
	"RU" : "Арктическая сетка",
	"EN" : "Glacier Mesh"
}, {
	"RU" : "Змеиная кожа",
	"EN" : "Snake Camo"
}, {
	"RU" : "Серебро",
	"EN" : "Silver"
}, {
	"RU" : "Хот-род",
	"EN" : "Hot Rod"
}, {
	"RU" : "Анодированная синева",
	"EN" : "Anodized Navy"
}, {
	"RU" : "Пиксельный камуфляж «Металлический»",
	"EN" : "Metallic DDPAT"
}, {
	"RU" : "Золотой тигр",
	"EN" : "Gold Tiger"
}, {
	"RU" : "Татуировка дракона",
	"EN" : "Dragon Tattoo"
}, {
	"RU" : "Каустика",
	"EN" : "Caustics"
}, {
	"RU" : "Удар молнии",
	"EN" : "Lightning Strike"
}, {
	"RU" : "Окостеневший",
	"EN" : "Ossified"
}, {
	"RU" : "Пламя",
	"EN" : "Blaze"
}, {
	"RU" : "Брызги",
	"EN" : "Splash"
}, {
	"RU" : "Градиент",
	"EN" : "Fade"
}, {
	"RU" : "Медь",
	"EN" : "Copper"
}, {
	"RU" : "Вороненая сталь",
	"EN" : "Blue Steel"
}, {
	"RU" : "Патина",
	"EN" : "Stained"
}, {
	"RU" : "Поверхностная закалка",
	"EN" : "Case Hardened"
}, {
	"RU" : "Убийство",
	"EN" : "Slaughter"
}, {
	"RU" : "Темная вода",
	"EN" : "Dark Water"
}, {
	"RU" : "Гипнотический",
	"EN" : "Hypnotic"
}, {
	"RU" : "Ржавчина",
	"EN" : "Rusty"
}, {
	"RU" : "Углепластик",
	"EN" : "Carbon Fiber"
}, {
	"RU" : "Скорпион",
	"EN" : "Scorpion"
}, {
	"RU" : "Крылья",
	"EN" : "Wings"
}, {
	"RU" : "Пальма",
	"EN" : "Palm"
}, {
	"RU" : "Грецкий орех",
	"EN" : "Walnut"
}, {
	"RU" : "Латунь",
	"EN" : "Brass"
}, {
	"RU" : "БАБАХ!",
	"EN" : "KABOOM!"
}, {
	"RU" : "БАХ",
	"EN" : "BOOM"
}, {
	"RU" : "Сажа",
	"EN" : "Scorched"
}, {
	"RU" : "Пятно",
	"EN" : "Splash"
}, {
	"RU" : "Современный охотник",
	"EN" : "Modern Hunter"
}, {
	"RU" : "Пятна от краски",
	"EN" : "Splash Jam"
}, {
	"RU" : "Оранжевое пламя",
	"EN" : "Blaze Orange"
}, {
	"RU" : "Радиоактивная опасность",
	"EN" : "Irradiated Alert"
}, {
	"RU" : "Радиоактивные осадки",
	"EN" : "Fallout Warning"
}, {
	"RU" : "Радиационная опасность",
	"EN" : "Radiation Hazard"
}, {
	"RU" : "Ядерная угроза",
	"EN" : "Nuclear Threat"
}, {
	"RU" : "Хищник",
	"EN" : "Predator"
}, {
	"RU" : "Тусклые полосы",
	"EN" : "Faded Zebra"
}, {
	"RU" : "Камуфляж GO",
	"EN" : "GO Camo"
}, {
	"RU" : "Объемные шестиугольники",
	"EN" : "Memento"
}, {
	"RU" : "Грунтовая вода",
	"EN" : "Groundwater"
}, {
	"RU" : "Пиксельный камуфляж «Джунгли»",
	"EN" : "Jungle DDPAT"
}, {
	"RU" : "Чистая вода",
	"EN" : "Bright Water"
}, {
	"RU" : "Брызги волны",
	"EN" : "Wave Spray"
}, {
	"RU" : "Сезон засухи",
	"EN" : "Dry Season"
}, {
	"RU" : "Луговые листья",
	"EN" : "Grassland Leaves"
}, {
	"RU" : "Анодированный металл",
	"EN" : "Anodized Gunmetal"
}, {
	"RU" : "Истребитель",
	"EN" : "Spitfire"
}, {
	"RU" : "Желто-черные полосы",
	"EN" : "Hazard"
}, {
	"RU" : "Огненный змей",
	"EN" : "Fire Serpent"
}, {
	"RU" : "Изумрудный дракон",
	"EN" : "Emerald Dragon"
}, {
	"RU" : "Камуфляж",
	"EN" : "Overgrowth"
}, {
	"RU" : "Золотой Карп",
	"EN" : "Golden Koi"
}, {
	"RU" : "Гравировка",
	"EN" : "Graven"
}, {
	"RU" : "Черная лимба",
	"EN" : "Black Limba"
}, {
	"RU" : "Буря",
	"EN" : "Tempest"
}, {
	"RU" : "Грани",
	"EN" : "Facets"
}, {
	"RU" : "Осколки",
	"EN" : "Shattered"
}, {
	"RU" : "Витраж",
	"EN" : "Demeter"
}, {
	"RU" : "Мозаика",
	"EN" : "Mosaico"
}, {
	"RU" : "Изумруд",
	"EN" : "Emerald"
}, {
	"RU" : "Мечты Майя",
	"EN" : "Mayan Dreams"
}, {
	"RU" : "Океанская пена",
	"EN" : "Ocean Foam"
}, {
	"RU" : "Графит",
	"EN" : "Graphite"
}, {
	"RU" : "Груда костей",
	"EN" : "Bone Pile"
}, {
	"RU" : "Зірка",
	"EN" : "Zirka"
}, {
	"RU" : "Пыльник",
	"EN" : "Rust Coat"
}, {
	"RU" : "Кровавый тигр",
	"EN" : "Blood Tiger"
}, {
	"RU" : "Хладнокровный",
	"EN" : "Cold Blooded"
}, {
	"RU" : "Синий титан",
	"EN" : "Blue Titanium"
}, {
	"RU" : "Гексан",
	"EN" : "Hexane"
}, {
	"RU" : "Улей",
	"EN" : "Hive"
}, {
	"RU" : "Гемоглобин",
	"EN" : "Hemoglobin"
}, {
	"RU" : "Сыворотка",
	"EN" : "Serum"
}, {
	"RU" : "Кровь в воде",
	"EN" : "Blood in the Water"
}, {
	"RU" : "Голубая хвоя",
	"EN" : "Blue Spruce"
}, {
	"RU" : "Гроза",
	"EN" : "Storm"
}, {
	"RU" : "Колония",
	"EN" : "Colony"
}, {
	"RU" : "Наемник",
	"EN" : "Contractor"
}, {
	"RU" : "Нитро",
	"EN" : "Nitro"
}, {
	"RU" : "Остаточное изображение",
	"EN" : "Afterimage"
}, {
	"RU" : "Полярный камуфляж",
	"EN" : "Polar Camo"
}, {
	"RU" : "Лесная ночь",
	"EN" : "Forest Night"
}, {
	"RU" : "Синий глянец",
	"EN" : "Blue Laminate"
}, {
	"RU" : "Мраморный гранит",
	"EN" : "Granite Marbleized"
}, {
	"RU" : "Осадок",
	"EN" : "Mudder"
}, {
	"RU" : "Голубые брызги",
	"EN" : "Cyanospatter"
}, {
	"RU" : "Белое напыление",
	"EN" : "Sage Spray"
}, {
	"RU" : "Песчаное напыление",
	"EN" : "Sand Spray"
}, {
	"RU" : "Армейский спецназ",
	"EN" : "Army Recon"
}, {
	"RU" : "Перфорированные волны",
	"EN" : "Waves Perforated"
}, {
	"RU" : "Тропическая штриховка",
	"EN" : "Jungle Dashed"
}, {
	"RU" : "Песчаная штриховка",
	"EN" : "Sand Dashed"
}, {
	"RU" : "Костяная маска",
	"EN" : "Bone Mask"
}, {
	"RU" : "Апельсиновая корка",
	"EN" : "Orange Peel"
}, {
	"RU" : "Полярная сетка",
	"EN" : "Polar Mesh"
}, {
	"RU" : "Осужденный",
	"EN" : "Condemned"
}, {
	"RU" : "Песчаная сетка",
	"EN" : "Sand Mesh"
}, {
	"RU" : "Янтарный градиент",
	"EN" : "Amber Fade"
}, {
	"RU" : "Кислотный градиент",
	"EN" : "Acid Fade"
}, {
	"RU" : "Тропическая гроза",
	"EN" : "Tropical Storm"
}, {
	"RU" : "Лазурная зебра",
	"EN" : "Azure Zebra"
}, {
	"RU" : "Рентген",
	"EN" : "X-Ray"
}, {
	"RU" : "Электрический улей",
	"EN" : "Electric Hive"
}, {
	"RU" : "Паслен",
	"EN" : "Nightshade"
}, {
	"RU" : "Знак воды",
	"EN" : "Water Sigil"
}, {
	"RU" : "Слепое пятно",
	"EN" : "Blind Spot"
}, {
	"RU" : "Призрачный камуфляж",
	"EN" : "Ghost Camo"
}, {
	"RU" : "Ржавая сталь",
	"EN" : "Steel Disruption"
}, {
	"RU" : "Ржавый кобальт",
	"EN" : "Cobalt Disruption"
}, {
	"RU" : "Ясень",
	"EN" : "Ash Wood"
}, {
	"RU" : "Смешанный камуфляж",
	"EN" : "VariCamo"
}, {
	"RU" : "Ночные операции",
	"EN" : "Night Ops"
}, {
	"RU" : "Городской щебень",
	"EN" : "Urban Rubble"
}, {
	"RU" : "Калифорнийский камуфляж",
	"EN" : "CaliCamo"
}, {
	"RU" : "Полная остановка",
	"EN" : "Full Stop"
}, {
	"RU" : "Охотничья будка",
	"EN" : "Hunting Blind"
}, {
	"RU" : "Демонтаж",
	"EN" : "Teardown"
}, {
	"RU" : "Крокодиловая сетка",
	"EN" : "Gator Mesh"
}, {
	"RU" : "Армейская сетка",
	"EN" : "Army Mesh"
}, {
	"RU" : "Дамасская сталь",
	"EN" : "Damascus Steel"
}, {
	"RU" : "Красный кварц",
	"EN" : "Red Quartz"
}, {
	"RU" : "Синий кварц",
	"EN" : "Cobalt Quartz"
}, {
	"RU" : "Серебряный кварц",
	"EN" : "Silver Quartz"
}, {
	"RU" : "Гадюка",
	"EN" : "Pit Viper"
}, {
	"RU" : "Азимов",
	"EN" : "Asiimov"
}, {
	"RU" : "Кракен",
	"EN" : "The Kraken"
}, {
	"RU" : "Страж",
	"EN" : "Guardian"
}, {
	"RU" : "Роспись",
	"EN" : "Mehndi"
}, {
	"RU" : "Красная линия",
	"EN" : "Redline"
}, {
	"RU" : "Пульс",
	"EN" : "Pulse"
}, {
	"RU" : "Причал",
	"EN" : "Marina"
}, {
	"RU" : "Железная роза",
	"EN" : "Rose Iron"
}, {
	"RU" : "Восходящий череп",
	"EN" : "Rising Skull"
}, {
	"RU" : "Песчаная буря",
	"EN" : "Sandstorm"
}, {
	"RU" : "Ками",
	"EN" : "Kami"
}, {
	"RU" : "Магма",
	"EN" : "Magma"
}, {
	"RU" : "Синие полутона",
	"EN" : "Cobalt Halftone"
}, {
	"RU" : "Новая фуксия",
	"EN" : "The Fuschia Is Now"
}, {
	"RU" : "Виктория",
	"EN" : "Victoria"
}, {
	"RU" : "Цвета прибоя",
	"EN" : "Undertow"
}, {
	"RU" : "Частица титана",
	"EN" : "Titanium Bit"
}, {
	"RU" : "Наследие",
	"EN" : "Heirloom"
}, {
	"RU" : "Медная галактика",
	"EN" : "Copper Galaxy"
}, {
	"RU" : "Листовая сталь",
	"EN" : "Tread Plate"
}, {
	"RU" : "Пантера",
	"EN" : "Panther"
}, {
	"RU" : "Нержавейка",
	"EN" : "Stainless"
}, {
	"RU" : "Синяя трещина",
	"EN" : "Blue Fissure"
}, {
	"RU" : "Красные фрагменты",
	"EN" : "Red FragCam"
}, {
	"RU" : "Пустынные фрагменты",
	"EN" : "Desert FragCam"
}, {
	"RU" : "Хамелеон",
	"EN" : "Chameleon"
}, {
	"RU" : "Капрал",
	"EN" : "Corporal"
}, {
	"RU" : "Треугольник",
	"EN" : "Trigon"
}, {
	"RU" : "Жар",
	"EN" : "Heat"
}, {
	"RU" : "Почва",
	"EN" : "Terrain"
}, {
	"RU" : "Антиквариат",
	"EN" : "Antique"
}, {
	"RU" : "Сержант",
	"EN" : "Sergeant"
}, {
	"RU" : "Райский страж",
	"EN" : "Heaven Guard"
}, {
	"RU" : "Метеорит",
	"EN" : "Meteorite"
}, {
	"RU" : "Гремучая смерть",
	"EN" : "Death Rattle"
}, {
	"RU" : "Зеленое яблоко",
	"EN" : "Green Apple"
}, {
	"RU" : "Франклин",
	"EN" : "Franklin"
}, {
	"RU" : "Смокинг",
	"EN" : "Tuxedo"
}, {
	"RU" : "Армейский блеск",
	"EN" : "Army Sheen"
}, {
	"RU" : "Клетчатая сталь",
	"EN" : "Caged Steel"
}, {
	"RU" : "Изумрудные завитки",
	"EN" : "Emerald Pinstripe"
}, {
	"RU" : "Айзек",
	"EN" : "Isaac"
}, {
	"RU" : "Атомный сплав",
	"EN" : "Atomic Alloy"
}, {
	"RU" : "Вулкан",
	"EN" : "Vulcan"
}, {
	"RU" : "Когти",
	"EN" : "Slashed"
}, {
	"RU" : "Закрученный",
	"EN" : "Torque"
}, {
	"RU" : "Возмездие",
	"EN" : "Retribution"
}, {
	"RU" : "Вой",
	"EN" : "Howl"
}, {
	"RU" : "Проклятие",
	"EN" : "Curse"
}, {
	"RU" : "Война в пустыне",
	"EN" : "Desert Warfare"
}, {
	"RU" : "Сайрекс",
	"EN" : "Cyrex"
}, {
	"RU" : "Орион",
	"EN" : "Orion"
}, {
	"RU" : "Отравленный дротик",
	"EN" : "Poison Dart"
}, {
	"RU" : "Пиксельный камуфляж «Розовый»",
	"EN" : "Pink DDPAT"
}, {
	"RU" : "Смешанный синий камуфляж",
	"EN" : "VariCamo Blue"
}, {
	"RU" : "Спираль",
	"EN" : "Twist"
}, {
	"RU" : "Модуль",
	"EN" : "Module"
}, {
	"RU" : "Пустынная атака",
	"EN" : "Desert-Strike"
}, {
	"RU" : "Клочья",
	"EN" : "Tatter"
}, {
	"RU" : "Кайман",
	"EN" : "Caiman"
}, {
	"RU" : "Осирис",
	"EN" : "Osiris"
}, {
	"RU" : "Тигр",
	"EN" : "Tigris"
}, {
	"RU" : "Заговор",
	"EN" : "Conspiracy"
}, {
	"RU" : "Птичьи игры",
	"EN" : "Fowl Play"
}, {
	"RU" : "Дух воды",
	"EN" : "Water Elemental"
}, {
	"RU" : "Городская опасность",
	"EN" : "Urban Hazard"
}, {
	"RU" : "Карп кои",
	"EN" : "Koi"
}, {
	"RU" : "Слоновая кость",
	"EN" : "Ivory"
}, {
	"RU" : "Сверхновая",
	"EN" : "Supernova"
}, {
	"RU" : "Пучина",
	"EN" : "Abyss"
}, {
	"RU" : "Лабиринт",
	"EN" : "Labyrinth"
}, {
	"RU" : "Следы асфальта",
	"EN" : "Road Rash"
}, {
	"RU" : "Объезд",
	"EN" : "Detour"
}, {
	"RU" : "Чаша",
	"EN" : "Chalice"
}, {
	"RU" : "Рыцарь",
	"EN" : "Knight"
}, {
	"RU" : "Кольчуга",
	"EN" : "Chainmail"
}, {
	"RU" : "Пищаль",
	"EN" : "Hand Cannon"
}, {
	"RU" : "Темный век",
	"EN" : "Dark Age"
}, {
	"RU" : "Терн",
	"EN" : "Briar"
}, {
	"RU" : "Королевский синий",
	"EN" : "Royal Blue"
}, {
	"RU" : "Индиго",
	"EN" : "Indigo"
}, {
	"RU" : "Путешественник",
	"EN" : "Jet Set"
}, {
	"RU" : "Первый класс",
	"EN" : "First Class"
}, {
	"RU" : "Кожа",
	"EN" : "Leather"
}, {
	"RU" : "Пассажир",
	"EN" : "Commuter"
}, {
	"RU" : "История о Драконе",
	"EN" : "Dragon Lore"
}, {
	"RU" : "Эконом-класс",
	"EN" : "Coach Class"
}, {
	"RU" : "Пилот",
	"EN" : "Pilot"
}, {
	"RU" : "Красная кожа",
	"EN" : "Red Leather"
}, {
	"RU" : "Странник",
	"EN" : "Traveler"
}, {
	"RU" : "Бизнес-класс",
	"EN" : "Business Class"
}, {
	"RU" : "Оливковая клетка",
	"EN" : "Olive Plaid"
}, {
	"RU" : "Зеленая клетка",
	"EN" : "Green Plaid"
}, {
	"RU" : "Шедевр",
	"EN" : "Master Piece"
}, {
	"RU" : "Дождь из пуль",
	"EN" : "Bullet Rain"
}, {
	"RU" : "Бенгальский тигр",
	"EN" : "Bengal Tiger"
}, {
	"RU" : "Синяя струя",
	"EN" : "Blue Streak"
}, {
	"RU" : "Вирус",
	"EN" : "Virus"
}, {
	"RU" : "Расцветающая ветка",
	"EN" : "Bloomstick"
}, {
	"RU" : "Кортисейра",
	"EN" : "Corticera"
}, {
	"RU" : "Красный питон",
	"EN" : "Red Python"
}, {
	"RU" : "Ягуар",
	"EN" : "Jaguar"
}, {
	"RU" : "Тра-та-та",
	"EN" : "Bratatat"
}, {
	"RU" : "Реактор",
	"EN" : "Reactor"
}, {
	"RU" : "Закат",
	"EN" : "Setting Sun"
}, {
	"RU" : "Радиоактивные отходы",
	"EN" : "Nuclear Waste"
}, {
	"RU" : "Костемолка",
	"EN" : "Bone Machine"
}, {
	"RU" : "Стикс",
	"EN" : "Styx"
}, {
	"RU" : "Ядерный сад",
	"EN" : "Nuclear Garden"
}, {
	"RU" : "Заражение",
	"EN" : "Contamination"
}, {
	"RU" : "Токсичность",
	"EN" : "Toxic"
}, {
	"RU" : "Химический зеленый",
	"EN" : "Chemical Green"
}, {
	"RU" : "Лихач",
	"EN" : "Hot Shot"
}, {
	"RU" : "Цербер",
	"EN" : "Cerberus"
}, {
	"RU" : "Пустынный повстанец",
	"EN" : "Wasteland Rebel"
}, {
	"RU" : "Жернов",
	"EN" : "Grinder"
}, {
	"RU" : "Мрак",
	"EN" : "Murky"
}, {
	"RU" : "Василиск",
	"EN" : "Basilisk"
}, {
	"RU" : "Грифон",
	"EN" : "Griffin"
}, {
	"RU" : "Поджигатель",
	"EN" : "Firestarter"
}, {
	"RU" : "Дротик",
	"EN" : "Dart"
}, {
	"RU" : "Картель",
	"EN" : "Cartel"
}, {
	"RU" : "Дух огня",
	"EN" : "Fire Elemental"
}, {
	"RU" : "Разбойник",
	"EN" : "Highwayman"
}, {
	"RU" : "Кардио",
	"EN" : "Cardiac"
}, {
	"RU" : "Заблуждение",
	"EN" : "Delusion"
}, {
	"RU" : "Спокойствие",
	"EN" : "Tranquility"
}, {
	"RU" : "Боец",
	"EN" : "Man-o'-war"
}, {
	"RU" : "Городской шок",
	"EN" : "Urban Shock"
}, {
	"RU" : "Нага",
	"EN" : "Naga"
}, {
	"RU" : "Щелкунчик",
	"EN" : "Chatterbox"
}, {
	"RU" : "Захоронение",
	"EN" : "Catacombs"
}, {
	"RU" : "龍王 (Король драконов)",
	"EN" : "龍王 (Dragon King)"
}, {
	"RU" : "Блокировка",
	"EN" : "System Lock"
}, {
	"RU" : "Малахит",
	"EN" : "Malachite"
}, {
	"RU" : "Смертельный яд",
	"EN" : "Deadly Poison"
}, {
	"RU" : "Покойник",
	"EN" : "Muertos"
}, {
	"RU" : "Безмятежность",
	"EN" : "Serenity"
}, {
	"RU" : "Грот",
	"EN" : "Grotto"
}, {
	"RU" : "Ртуть",
	"EN" : "Quicksilver"
}, {
	"RU" : "Зуб тигра",
	"EN" : "Tiger Tooth"
}, {
	"RU" : "Мраморный градиент",
	"EN" : "Marble Fade"
}, {
	"RU" : "Волны",
	"EN" : "Doppler"
}, {
	"RU" : "Ледниковый камуфляж",
	"EN" : "Arctic Glacier Camo"
}, {
	"RU" : "Подводный камуфляж",
	"EN" : "Dive Camo"
}, {
	"RU" : "Древесная сетка",
	"EN" : "Driftwood Mesh"
}, {
	"RU" : "Элитное снаряжение",
	"EN" : "Elite Build"
}, {
	"RU" : "Броня",
	"EN" : "Armor Core"
}, {
	"RU" : "Бог Червей",
	"EN" : "Worm God"
}, {
	"RU" : "Бронзовая декорация",
	"EN" : "Bronze Deco"
}, {
	"RU" : "Валентность",
	"EN" : "Valence"
}, {
	"RU" : "Обезьянье дело",
	"EN" : "Monkey Business"
}, {
	"RU" : "Эко",
	"EN" : "Eco"
}, {
	"RU" : "Джинн",
	"EN" : "Djinn"
}, {
	"RU" : "Скоростной зверь",
	"EN" : "Hyper Beast"
}, {
	"RU" : "Неоновый Гонщик",
	"EN" : "Neon Rider"
}, {
	"RU" : "Оригами",
	"EN" : "Origami"
}, {
	"RU" : "Поул-позиция",
	"EN" : "Pole Position"
}, {
	"RU" : "Гран-при",
	"EN" : "Grand Prix"
}, {
	"RU" : "Сумеречная галактика",
	"EN" : "Twilight Galaxy"
}, {
	"RU" : "Хронос",
	"EN" : "Chronos"
}, {
	"RU" : "Аид",
	"EN" : "Hades"
}, {
	"RU" : "Падение Икара",
	"EN" : "Icarus Fell"
}, {
	"RU" : "Лабиринт минотавра",
	"EN" : "Minotaur's Labyrinth"
}, {
	"RU" : "Астерион",
	"EN" : "Asterion"
}, {
	"RU" : "Лабиринт",
	"EN" : "Pathfinder"
}, {
	"RU" : "Дедал",
	"EN" : "Daedalus"
}, {
	"RU" : "Медуза",
	"EN" : "Medusa"
}, {
	"RU" : "Дуэлист",
	"EN" : "Duelist"
}, {
	"RU" : "Ящик Пандоры",
	"EN" : "Pandora's Box"
}, {
	"RU" : "Посейдон",
	"EN" : "Poseidon"
}, {
	"RU" : "Луна в знаке Весов",
	"EN" : "Moon in Libra"
}, {
	"RU" : "Солнце в знаке Льва",
	"EN" : "Sun in Leo"
}, {
	"RU" : "Приморский прогноз",
	"EN" : "Shipping Forecast"
}, {
	"RU" : "Едва зеленый",
	"EN" : "Para Green"
}, {
	"RU" : "Акихабара",
	"EN" : "Akihabara Accept"
}, {
	"RU" : "Гидропоника",
	"EN" : "Hydroponic"
}, {
	"RU" : "Бамбук",
	"EN" : "Bamboo Print"
}, {
	"RU" : "Тень бамбука",
	"EN" : "Bamboo Shadow"
}, {
	"RU" : "Бамбуковые заросли",
	"EN" : "Bamboo Forest"
}, {
	"RU" : "Водная терраса",
	"EN" : "Aqua Terrace"
}, {
	"RU" : "Геометрия",
	"EN" : "Geo Steps"
}, {
	"RU" : "Антитерраса",
	"EN" : "Counter Terrace"
}, {
	"RU" : "Терраса",
	"EN" : "Terrace"
}, {
	"RU" : "Неоновое кимоно",
	"EN" : "Neon Kimono"
}, {
	"RU" : "Оранжевое кимоно",
	"EN" : "Orange Kimono"
}, {
	"RU" : "Малиновое кимоно",
	"EN" : "Crimson Kimono"
}, {
	"RU" : "Кимоно цвета мяты",
	"EN" : "Mint Kimono"
}, {
	"RU" : "Ночная буря",
	"EN" : "Midnight Storm"
}, {
	"RU" : "Буря на закате 壱",
	"EN" : "Sunset Storm 壱"
}, {
	"RU" : "Буря на закате 弐",
	"EN" : "Sunset Storm 弐"
}, {
	"RU" : "Рассвет",
	"EN" : "Daybreak"
}, {
	"RU" : "Ударная дрель",
	"EN" : "Impact Drill"
}, {
	"RU" : "Чайка",
	"EN" : "Seabird"
}, {
	"RU" : "Аквамариновая месть",
	"EN" : "Aquamarine Revenge"
}, {
	"RU" : "Желтый жакет",
	"EN" : "Yellow Jacket"
}, {
	"RU" : "Нейронная сеть",
	"EN" : "Neural Net"
}, {
	"RU" : "Леденец",
	"EN" : "Rocket Pop"
}, {
	"RU" : "Горелка Бунзена",
	"EN" : "Bunsen Burner"
}, {
	"RU" : "Злобный дайме",
	"EN" : "Evil Daimyo"
}, {
	"RU" : "Заклятый враг",
	"EN" : "Nemesis"
}, {
	"RU" : "Рубиновый ядовитый дротик",
	"EN" : "Ruby Poison Dart"
}, {
	"RU" : "Крикун",
	"EN" : "Loudmouth"
}, {
	"RU" : "Лесничий",
	"EN" : "Ranger"
}, {
	"RU" : "Пистолет",
	"EN" : "Handgun"
}, {
	"RU" : "Бунт",
	"EN" : "Riot"
}, {
	"RU" : "Закрученный",
	"EN" : "Torque"
}, {
	"RU" : "Снежный вихрь",
	"EN" : "Frontside Misty"
}, {
	"RU" : "Драконий дуэт",
	"EN" : "Dualing Dragons"
}, {
	"RU" : "Выживший",
	"EN" : "Survivor Z"
}, {
	"RU" : "Поток",
	"EN" : "Flux"
}, {
	"RU" : "Невозмутимость",
	"EN" : "Stone Cold"
}, {
	"RU" : "Призраки",
	"EN" : "Wraiths"
}, {
	"RU" : "Космический воитель",
	"EN" : "Nebula Crusader"
}, {
	"RU" : "Золотая спираль",
	"EN" : "Golden Coil"
}, {
	"RU" : "Хроматика",
	"EN" : "Rangeen"
}, {
	"RU" : "Ядро кобальта",
	"EN" : "Cobalt Core"
}, {
	"RU" : "Особая доставка",
	"EN" : "Special Delivery"
}, {
	"RU" : "Охотник",
	"EN" : "Wingshot"
}, {
	"RU" : "Зеленый морпех",
	"EN" : "Green Marine"
}, {
	"RU" : "Большая пушка",
	"EN" : "Big Iron"
}, {
	"RU" : "Подтвержденное убийство",
	"EN" : "Kill Confirmed"
}, {
	"RU" : "Скумбрия",
	"EN" : "Scumbria"
}, {
	"RU" : "Буйство красок",
	"EN" : "Point Disarray"
}, {
	"RU" : "Рикошет",
	"EN" : "Ricochet"
}, {
	"RU" : "Топливный стержень",
	"EN" : "Fuel Rod"
}, {
	"RU" : "Послание коринфянам",
	"EN" : "Corinthian"
}, {
	"RU" : "Дань прошлому",
	"EN" : "Retrobution"
}, {
	"RU" : "Палач",
	"EN" : "The Executioner"
}, {
	"RU" : "Преданный паладин",
	"EN" : "Royal Paladin"
}, {
	"RU" : "Погрузчик",
	"EN" : "Power Loader"
}, {
	"RU" : "Защитник империи",
	"EN" : "Imperial"
}, {
	"RU" : "Резной приклад",
	"EN" : "Shapewood"
}, {
	"RU" : "Йорик",
	"EN" : "Yorick"
}, {
	"RU" : "Эпидемия",
	"EN" : "Outbreak"
}, {
	"RU" : "Дикая моль",
	"EN" : "Tiger Moth"
}, {
	"RU" : "Лавина",
	"EN" : "Avalanche"
}, {
	"RU" : "Горелка Теклу",
	"EN" : "Teclu Burner"
}, {
	"RU" : "Топливный инжектор",
	"EN" : "Fuel Injector"
}, {
	"RU" : "Океанская глубина",
	"EN" : "Photic Zone"
}, {
	"RU" : "Дракон-предводитель",
	"EN" : "Kumicho Dragon"
}, {
	"RU" : "Триумвират",
	"EN" : "Triumvirate"
}, {
	"RU" : "Королевский легион",
	"EN" : "Royal Legion"
}, {
	"RU" : "Звездный крейсер",
	"EN" : "The Battlestar"
}, {
	"RU" : "Лазурный хищник",
	"EN" : "Lapis Gator"
}, {
	"RU" : "Преторианец",
	"EN" : "Praetorian"
}, {
	"RU" : "Чертята",
	"EN" : "Impire"
}, {
	"RU" : "Некромант",
	"EN" : "Necropos"
}, {
	"RU" : "Джамбия",
	"EN" : "Jambiya"
}, {
	"RU" : "Проводник",
	"EN" : "Lead Conduit"
}, { //CHROMA 3
	"RU" : "Атлас",
	"EN" : "Atlas",
}, {
	"RU" : "Ветеран",
	"EN" : "Fubar",
}, {
	"RU" : "Океанские мотивы",
	"EN" : "Oceanic",
}, {
	"RU" : "Утечка отходов",
	"EN" : "Bioleak",
}, {
	"RU" : "Призрак",
	"EN" : "Spectre",
}, {
	"RU" : "Оранжевые осколки",
	"EN" : "Orange Crash",
}, {
	"RU" : "Духовики",
	"EN" : "Ventilators",
}, {
	"RU" : "Черный галстук",
	"EN" : "Black Tie",
}, {
	"RU" : "Возвращение",
	"EN" : "Re-Entry",
}, {
	"RU" : "Призрачный фанатик",
	"EN" : "Ghost Crusader",
}, {
	"RU" : "Перестрелка",
	"EN" : "Firefight",
}, {
	"RU" : "Красный ястреб",
	"EN" : "Red Astor",
}, {
	"RU" : "Первобытный саблезуб",
	"EN" : "Primal Saber",
}, {
	"RU" : "Скорая стая",
	"EN" : "Fleet Flock",
}, {
	"RU" : "Огонь Чантико",
	"EN" : "Chantico's Fire",
}, {
	"RU" : "Суд Анубиса",
	"EN" : "Judgement of Anubis",
}, { // GAMMA
	"RU" : "Полет",
	"EN" : "Aerial",
}, {
	"RU" : "Ледниковый покров",
	"EN" : "Ice Cap",
}, {
	"RU" : "Жнец",
	"EN" : "Harvester",
}, {
	"RU" : "Железное покрытие",
	"EN" : "Iron Clad",
}, {
	"RU" : "Экзо",
	"EN" : "Exo",
}, {
	"RU" : "Плотоядный",
	"EN" : "Carnivore",
}, {
	"RU" : "Неистовый даймё",
	"EN" : "Violent Daimyo",
}, {
	"RU" : "Перезагрузка",
	"EN" : "Reboot",
}, {
	"RU" : "В центре внимания",
	"EN" : "Limelight",
}, {
	"RU" : "Воин дорог",
	"EN" : "Chopper",
}, {
	"RU" : "Аристократ",
	"EN" : "Aristocrat",
}, {
	"RU" : "Фобос",
	"EN" : "Phobos",
}, {
	"RU" : "Императорский дракон",
	"EN" : "Imperial Dragon",
}, {
	"RU" : "Кровавый спорт",
	"EN" : "Bloodsport",
}, {
	"RU" : "Безлюдный космос",
	"EN" : "Desolate Space",
}, {
	"RU" : "Механо-пушка",
	"EN" : "Mecha Industries",
}, {
	"RU" : "Гамма-волны",
	"EN" : "Gamma Doppler",
}, {
	"RU" : "Легенды",
	"EN" : "Lore",
}, {
	"RU" : "Черный глянец",
	"EN" : "Black Laminate",
}, {
	"RU" : "Автотроника",
	"EN" : "Autotronic",
}, {
	"RU" : "Ручная роспись",
	"EN" : "Freehand",
},
]