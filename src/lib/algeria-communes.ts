/**
 * Algeria 1541 communes grouped by wilaya code (zero-padded).
 * Source: kossa/algerian-cities.
 */

export interface Commune {
  name: string;
  ar: string;
  lat: number;
  lng: number;
}

export const COMMUNES_BY_WILAYA: Record<string, Commune[]> = 
{
 "01": [
  {
   "name": "Adrar",
   "ar": "أدرار",
   "lat": 28.01744,
   "lng": -0.26425
  },
  {
   "name": "Tamest",
   "ar": "تأماست",
   "lat": 27.423744,
   "lng": -0.24338
  },
  {
   "name": "Reggane",
   "ar": "رڨان",
   "lat": 26.724265,
   "lng": 0.165729
  },
  {
   "name": "In Zghmir",
   "ar": "ان زغمير",
   "lat": 27.025358,
   "lng": -1.404825
  },
  {
   "name": "Tit",
   "ar": "تــيـــت",
   "lat": 26.937329,
   "lng": 1.489852
  },
  {
   "name": "Tsabit",
   "ar": "تسابيت",
   "lat": 28.400768,
   "lng": -0.23577
  },
  {
   "name": "Zaouiet Kounta",
   "ar": "زاوية كنتة",
   "lat": 27.227286,
   "lng": -0.18997
  },
  {
   "name": "Aoulef",
   "ar": "أولف",
   "lat": 26.972326,
   "lng": 1.081003
  },
  {
   "name": "Timekten",
   "ar": "تيمقتن",
   "lat": 27.021876,
   "lng": 1.014336
  },
  {
   "name": "Tamantit",
   "ar": "تامنطيت",
   "lat": 27.768849,
   "lng": -0.269017
  },
  {
   "name": "Fenoughil",
   "ar": "فنوغيل",
   "lat": 27.563798,
   "lng": -0.294983
  },
  {
   "name": "Sali",
   "ar": "سالى",
   "lat": 26.960922,
   "lng": -0.027638
  },
  {
   "name": "Akabli",
   "ar": "أقبلي",
   "lat": 26.712428,
   "lng": 1.370952
  },
  {
   "name": "Ouled Ahmed Timmi",
   "ar": "أولاد أحمد تيمى",
   "lat": 27.840397,
   "lng": -0.28642
  },
  {
   "name": "Bouda",
   "ar": "بودة",
   "lat": 28.028122,
   "lng": -0.46056
  },
  {
   "name": "Sebaa",
   "ar": "السبع",
   "lat": 28.203842,
   "lng": -0.172781
  }
 ],
 "49": [
  {
   "name": "Charouine",
   "ar": "شروين",
   "lat": 29.088744,
   "lng": -0.657284
  },
  {
   "name": "Ksar Kaddour",
   "ar": "قصر قدور",
   "lat": 29.582634,
   "lng": 0.373508
  },
  {
   "name": "Timimoun",
   "ar": "تيميمون",
   "lat": 29.261691,
   "lng": 0.241596
  },
  {
   "name": "Ouled Said",
   "ar": "أولاد سعيد",
   "lat": 29.413617,
   "lng": 0.244812
  },
  {
   "name": "Tinerkouk",
   "ar": "زاوية دباغ",
   "lat": 29.71321,
   "lng": 0.711956
  },
  {
   "name": "Metarfa",
   "ar": "المطارفة",
   "lat": 28.90236,
   "lng": -0.175426
  },
  {
   "name": "Aougrout",
   "ar": "أوقروت",
   "lat": 28.92981,
   "lng": 0.721725
  },
  {
   "name": "Talmine",
   "ar": "ﻃﺎﻟﻤﻴﻦ",
   "lat": 29.296696,
   "lng": -0.901701
  }
 ],
 "17": [
  {
   "name": "Deldoul",
   "ar": "دﻟﺪول",
   "lat": 28.814329,
   "lng": 0.034714
  },
  {
   "name": "Djelfa",
   "ar": "الجلفة",
   "lat": 34.670396,
   "lng": 3.250376
  },
  {
   "name": "Moudjebara",
   "ar": "مجبرة",
   "lat": 34.502904,
   "lng": 3.471885
  },
  {
   "name": "El Guedid",
   "ar": "القديد",
   "lat": 34.648472,
   "lng": 2.618318
  },
  {
   "name": "Hassi Bahbah",
   "ar": "حاسي بحبح",
   "lat": 35.076254,
   "lng": 3.026723
  },
  {
   "name": "Ain Maabed",
   "ar": "عين معبد",
   "lat": 34.804489,
   "lng": 3.127783
  },
  {
   "name": "Sed Rahal",
   "ar": "سد رحال",
   "lat": 33.949061,
   "lng": 3.221679
  },
  {
   "name": "Faidh El Botma",
   "ar": "فيض البطمة",
   "lat": 34.529197,
   "lng": 3.780398
  },
  {
   "name": "Birine",
   "ar": "البيرين",
   "lat": 35.635628,
   "lng": 3.224032
  },
  {
   "name": "Bouira Lahdab",
   "ar": "بويرة الأحداب",
   "lat": 35.245261,
   "lng": 3.142761
  },
  {
   "name": "Zaccar",
   "ar": "زكار",
   "lat": 34.430607,
   "lng": 3.327927
  },
  {
   "name": "El Khemis",
   "ar": "الخميس",
   "lat": 35.287842,
   "lng": 2.595135
  },
  {
   "name": "Sidi Baizid",
   "ar": "سيدي بايزيد",
   "lat": 34.97395,
   "lng": 3.3945
  },
  {
   "name": "M Liliha",
   "ar": "المليليحة",
   "lat": 34.754602,
   "lng": 3.482142
  },
  {
   "name": "El Idrissia",
   "ar": "الإدريسية",
   "lat": 34.453102,
   "lng": 2.530719
  },
  {
   "name": "Douis",
   "ar": "الدويس",
   "lat": 34.367371,
   "lng": 2.700196
  },
  {
   "name": "Hassi El Euch",
   "ar": "حاسي العش",
   "lat": 35.15303,
   "lng": 3.249312
  },
  {
   "name": "Messaad",
   "ar": "مسعد",
   "lat": 34.154062,
   "lng": 3.492286
  },
  {
   "name": "Guettara",
   "ar": "قتارة",
   "lat": 33.161228,
   "lng": 4.684286
  },
  {
   "name": "Sidi Ladjel",
   "ar": "سيدي لعجال",
   "lat": 35.444933,
   "lng": 2.521332
  },
  {
   "name": "Had Sahary",
   "ar": "حد الصحاري",
   "lat": 35.352285,
   "lng": 3.366093
  },
  {
   "name": "Guernini",
   "ar": "القرنيني",
   "lat": 35.199967,
   "lng": 2.682039
  },
  {
   "name": "Selmana",
   "ar": "سلمانة",
   "lat": 33.797532,
   "lng": 3.815252
  },
  {
   "name": "Ain Chouhada",
   "ar": "عين الشهداء",
   "lat": 34.241927,
   "lng": 2.520716
  },
  {
   "name": "Oum Laadham",
   "ar": "ام العظام",
   "lat": 33.719373,
   "lng": 4.528836
  },
  {
   "name": "Dar Chioukh",
   "ar": "دار الشيوخ",
   "lat": 34.653982,
   "lng": 3.284556
  },
  {
   "name": "Charef",
   "ar": "الشارف",
   "lat": 34.619474,
   "lng": 2.807618
  },
  {
   "name": "Benyagoub",
   "ar": "بن يعقوب",
   "lat": 34.466283,
   "lng": 2.785236
  },
  {
   "name": "Zaafrane",
   "ar": "الزعفران",
   "lat": 34.851133,
   "lng": 2.85511
  },
  {
   "name": "Deldoul",
   "ar": "دلدول",
   "lat": 28.802928,
   "lng": -0.104453
  },
  {
   "name": "Ain El Ibel",
   "ar": "عين الابل",
   "lat": 34.3578,
   "lng": 3.224991
  },
  {
   "name": "Ain Oussera",
   "ar": "عين وسارة",
   "lat": 35.448716,
   "lng": 2.907355
  },
  {
   "name": "Benhar",
   "ar": "بنهار",
   "lat": 35.486938,
   "lng": 3.012036
  },
  {
   "name": "Hassi Fedoul",
   "ar": "حاسي فدول",
   "lat": 35.437805,
   "lng": 2.21151
  },
  {
   "name": "Amourah",
   "ar": "عمورة",
   "lat": 34.299651,
   "lng": 3.933018
  },
  {
   "name": "Ain Fekka",
   "ar": "عين افقة",
   "lat": 35.427184,
   "lng": 3.581512
  },
  {
   "name": "Tadmit",
   "ar": "تعضميت",
   "lat": 34.285972,
   "lng": 2.987578
  }
 ],
 "50": [
  {
   "name": "Bordj Badji Mokhtar",
   "ar": "برج باجي مختار",
   "lat": 21.32551,
   "lng": 0.95248
  },
  {
   "name": "Timiaouine",
   "ar": "تيمياوين",
   "lat": 20.439792,
   "lng": 1.807816
  }
 ],
 "35": [
  {
   "name": "Ouled Aissa",
   "ar": "أولاد عيسى",
   "lat": 29.642546,
   "lng": -0.730319
  },
  {
   "name": "Sidi Daoud",
   "ar": "سيدي داود",
   "lat": 35.116429,
   "lng": -0.910844
  },
  {
   "name": "Boumerdes",
   "ar": "بومرداس",
   "lat": 36.75107,
   "lng": 3.478891
  },
  {
   "name": "Boudouaou",
   "ar": "بودواو",
   "lat": 36.720476,
   "lng": 3.396615
  },
  {
   "name": "Afir",
   "ar": "أفير",
   "lat": 36.845269,
   "lng": 3.988047
  },
  {
   "name": "Bordj Menaiel",
   "ar": "برج منايل",
   "lat": 36.745088,
   "lng": 3.719257
  },
  {
   "name": "Baghlia",
   "ar": "بغلية",
   "lat": 36.818008,
   "lng": 3.859242
  },
  {
   "name": "Sidi Daoud",
   "ar": "سيدي داود",
   "lat": 36.853947,
   "lng": 3.861412
  },
  {
   "name": "Naciria",
   "ar": "الناصرية",
   "lat": 36.745624,
   "lng": 3.831081
  },
  {
   "name": "Djinet",
   "ar": "جنات",
   "lat": 36.877298,
   "lng": 3.722796
  },
  {
   "name": "Isser",
   "ar": "يسر",
   "lat": 36.721957,
   "lng": 3.668844
  },
  {
   "name": "Zemmouri",
   "ar": "زموري",
   "lat": 36.787379,
   "lng": 3.603356
  },
  {
   "name": "Si Mustapha",
   "ar": "سي مصطفى",
   "lat": 36.722231,
   "lng": 3.619779
  },
  {
   "name": "Tidjelabine",
   "ar": "تيجلابين",
   "lat": 36.729981,
   "lng": 3.498458
  },
  {
   "name": "Chabet El Ameur",
   "ar": "شعبة العامر",
   "lat": 36.637183,
   "lng": 3.695369
  },
  {
   "name": "Thenia",
   "ar": "الثنية",
   "lat": 36.725078,
   "lng": 3.556637
  },
  {
   "name": "Timezrit",
   "ar": "تمزريت",
   "lat": 36.673253,
   "lng": 3.806157
  },
  {
   "name": "Corso",
   "ar": "قورصو",
   "lat": 36.744232,
   "lng": 3.436848
  },
  {
   "name": "Ouled Moussa",
   "ar": "أولاد موسى",
   "lat": 36.688749,
   "lng": 3.374601
  },
  {
   "name": "Larbatache",
   "ar": "الأربعطاش",
   "lat": 36.637939,
   "lng": 3.371074
  },
  {
   "name": "Bouzegza Keddara",
   "ar": "بوزقزة قدارة",
   "lat": 36.62895,
   "lng": 3.483222
  },
  {
   "name": "Taourga",
   "ar": "تورقة",
   "lat": 36.795201,
   "lng": 3.945321
  },
  {
   "name": "Ouled Aissa",
   "ar": "أولاد عيسى",
   "lat": 36.806238,
   "lng": 3.813119
  },
  {
   "name": "Ben Choud",
   "ar": "بن شود",
   "lat": 36.863732,
   "lng": 3.880282
  },
  {
   "name": "Dellys",
   "ar": "دلس",
   "lat": 36.912657,
   "lng": 3.912457
  },
  {
   "name": "Ammal",
   "ar": "عمال",
   "lat": 36.628348,
   "lng": 3.616098
  },
  {
   "name": "Beni Amrane",
   "ar": "بنى عمران",
   "lat": 36.668717,
   "lng": 3.590001
  },
  {
   "name": "Souk El Haad",
   "ar": "سوق الحد",
   "lat": 36.691153,
   "lng": 3.588125
  },
  {
   "name": "Boudouaou El Bahri",
   "ar": "بودواو البحرى",
   "lat": 36.764438,
   "lng": 3.388047
  },
  {
   "name": "Ouled Hedadj",
   "ar": "أولاد ھداج",
   "lat": 36.717034,
   "lng": 3.339871
  },
  {
   "name": "Leghata",
   "ar": "لقاطة",
   "lat": 36.804509,
   "lng": 3.667074
  },
  {
   "name": "Hammedi",
   "ar": "حمادى",
   "lat": 36.667816,
   "lng": 3.247686
  },
  {
   "name": "Khemis El Khechna",
   "ar": "خميس الخشنة",
   "lat": 36.650513,
   "lng": 3.331689
  },
  {
   "name": "El Kharrouba",
   "ar": "الخروبة",
   "lat": 36.570258,
   "lng": 3.421008
  }
 ],
 "02": [
  {
   "name": "Chlef",
   "ar": "الشلف",
   "lat": 36.157966,
   "lng": 1.337282
  },
  {
   "name": "Tenes",
   "ar": "تنس",
   "lat": 36.508116,
   "lng": 1.307823
  },
  {
   "name": "Benairia",
   "ar": "بنايرية",
   "lat": 36.353423,
   "lng": 1.37337
  },
  {
   "name": "El Karimia",
   "ar": "الكريمية",
   "lat": 36.111108,
   "lng": 1.553563
  },
  {
   "name": "Tadjena",
   "ar": "تاجنة",
   "lat": 36.322659,
   "lng": 1.136438
  },
  {
   "name": "Taougrite",
   "ar": "تاوقريت",
   "lat": 36.264354,
   "lng": 0.912733
  },
  {
   "name": "Beni Haoua",
   "ar": "بني حواء",
   "lat": 36.528145,
   "lng": 1.573661
  },
  {
   "name": "Sobha",
   "ar": "صبحة",
   "lat": 36.117374,
   "lng": 1.049037
  },
  {
   "name": "Harchoun",
   "ar": "حرشون",
   "lat": 36.114941,
   "lng": 1.505695
  },
  {
   "name": "Ouled Fares",
   "ar": "أولاد فارس",
   "lat": 36.230929,
   "lng": 1.234185
  },
  {
   "name": "Sidi Akkacha",
   "ar": "سيدي عكاشة",
   "lat": 36.462521,
   "lng": 1.302085
  },
  {
   "name": "Boukadir",
   "ar": "بوقدير",
   "lat": 36.060248,
   "lng": 1.130581
  },
  {
   "name": "Beni Rached",
   "ar": "بني راشد",
   "lat": 36.276902,
   "lng": 1.521799
  },
  {
   "name": "Talassa",
   "ar": "تلعصة",
   "lat": 36.427852,
   "lng": 1.083841
  },
  {
   "name": "Herenfa",
   "ar": "الهرنفة",
   "lat": 36.24843,
   "lng": 1.048431
  },
  {
   "name": "Oued Goussine",
   "ar": "واد ڨوسين",
   "lat": 36.491486,
   "lng": 1.451764
  },
  {
   "name": "Dahra",
   "ar": "الظهرة",
   "lat": 36.255768,
   "lng": 0.850165
  },
  {
   "name": "Ouled Abbes",
   "ar": "أولاد عباس",
   "lat": 36.215137,
   "lng": 1.486312
  },
  {
   "name": "Sendjas",
   "ar": "سنجاس",
   "lat": 36.063661,
   "lng": 1.399709
  },
  {
   "name": "Zeboudja",
   "ar": "الزبوجة",
   "lat": 36.353359,
   "lng": 1.431375
  },
  {
   "name": "Oued Sly",
   "ar": "واد سلي",
   "lat": 36.099474,
   "lng": 1.200691
  },
  {
   "name": "Abou El Hassan",
   "ar": "أبو الحسن",
   "lat": 36.419705,
   "lng": 1.187127
  },
  {
   "name": "El Marsa",
   "ar": "المرصى",
   "lat": 36.40281,
   "lng": 0.915512
  },
  {
   "name": "Chettia",
   "ar": "الشطية",
   "lat": 36.194432,
   "lng": 1.25688
  },
  {
   "name": "Sidi Abderrahmane",
   "ar": "سيدي عبد الرحمان",
   "lat": 36.493006,
   "lng": 1.094029
  },
  {
   "name": "Moussadek",
   "ar": "مصدق",
   "lat": 36.354371,
   "lng": 1.007305
  },
  {
   "name": "El Hadjadj",
   "ar": "الحجاج",
   "lat": 36.017432,
   "lng": 1.377395
  },
  {
   "name": "Labiod Medjadja",
   "ar": "الأبيض مجاجة",
   "lat": 36.252056,
   "lng": 1.393206
  },
  {
   "name": "Oued Fodda",
   "ar": "واد الفضة",
   "lat": 36.188419,
   "lng": 1.532808
  },
  {
   "name": "Ouled Ben Abdelkader",
   "ar": "أولاد بن عبد القادر",
   "lat": 36.023879,
   "lng": 1.274525
  },
  {
   "name": "Bouzeghaia",
   "ar": "بوزغاية",
   "lat": 36.338745,
   "lng": 1.240543
  },
  {
   "name": "Ain Merane",
   "ar": "عين مران",
   "lat": 36.162014,
   "lng": 0.970358
  },
  {
   "name": "Oum Drou",
   "ar": "أم الذروع",
   "lat": 36.197701,
   "lng": 1.39032
  },
  {
   "name": "Breira",
   "ar": "بريرة",
   "lat": 36.449125,
   "lng": 1.615735
  },
  {
   "name": "Beni Bouattab",
   "ar": "بني بوعتاب",
   "lat": 35.994544,
   "lng": 1.619417
  },
  {
   "name": "Sidi Abderrahmane",
   "ar": "سيدي عبدالرحمان",
   "lat": 34.8001,
   "lng": 1.129069
  }
 ],
 "03": [
  {
   "name": "Laghouat",
   "ar": "الأغواط",
   "lat": 33.807834,
   "lng": 2.862829
  },
  {
   "name": "Ksar El Hirane",
   "ar": "قصر الحيران",
   "lat": 33.789316,
   "lng": 3.145909
  },
  {
   "name": "Benacer Benchohra",
   "ar": "بن ناصر بن شهرة",
   "lat": 33.754043,
   "lng": 2.997559
  },
  {
   "name": "Sidi Makhlouf",
   "ar": "سيدي مخلوف",
   "lat": 34.131475,
   "lng": 3.014157
  },
  {
   "name": "Hassi Delaa",
   "ar": "حاسي دلاعة",
   "lat": 33.417346,
   "lng": 3.551187
  },
  {
   "name": "Hassi R'mel",
   "ar": "حاسي الرمل",
   "lat": 32.927612,
   "lng": 3.271265
  },
  {
   "name": "Ain Mahdi",
   "ar": "عــيــن مـــاضــي",
   "lat": 33.798678,
   "lng": 2.307441
  },
  {
   "name": "Tadjemout",
   "ar": "تاجموت",
   "lat": 33.880607,
   "lng": 2.526156
  },
  {
   "name": "Kheneg",
   "ar": "الخنق",
   "lat": 33.744802,
   "lng": 2.794623
  },
  {
   "name": "Gueltat Sidi Saad",
   "ar": "قلتة سيدي سعد",
   "lat": 34.297815,
   "lng": 1.949491
  },
  {
   "name": "Ain Sidi Ali",
   "ar": "عين سيدي علي",
   "lat": 34.156975,
   "lng": 1.543123
  },
  {
   "name": "Beidha",
   "ar": "بيضاء",
   "lat": 34.476451,
   "lng": 2.171334
  },
  {
   "name": "Brida",
   "ar": "بريدة",
   "lat": 33.906382,
   "lng": 1.784574
  },
  {
   "name": "El Ghicha",
   "ar": "الغيشة",
   "lat": 33.930993,
   "lng": 2.143749
  },
  {
   "name": "Hadj Mechri",
   "ar": "الحاج المشري",
   "lat": 33.958401,
   "lng": 1.599214
  },
  {
   "name": "Sebgag",
   "ar": "سبقاق",
   "lat": 34.029023,
   "lng": 1.930271
  },
  {
   "name": "Taouiala",
   "ar": "تاويالة",
   "lat": 33.87006,
   "lng": 1.855655
  },
  {
   "name": "Tadjrouna",
   "ar": "تاجرونة",
   "lat": 33.504863,
   "lng": 2.103946
  },
  {
   "name": "Aflou",
   "ar": "أفلو",
   "lat": 34.113952,
   "lng": 2.097385
  },
  {
   "name": "El Assafia",
   "ar": "العسافية",
   "lat": 33.824988,
   "lng": 2.99153
  },
  {
   "name": "Oued Morra",
   "ar": "وادي مرة",
   "lat": 34.164536,
   "lng": 2.323379
  },
  {
   "name": "Oued M'zi",
   "ar": "وادي مزي",
   "lat": 34.1523,
   "lng": 2.185153
  },
  {
   "name": "El Haouaita",
   "ar": "الهوارية",
   "lat": 33.646466,
   "lng": 2.448793
  },
  {
   "name": "Sidi Bouzid",
   "ar": "سيدي بوزيد",
   "lat": 34.297928,
   "lng": 2.236175
  },
  {
   "name": "Ain Mahdi",
   "ar": "عين المهدي",
   "lat": 36.203318,
   "lng": 2.775538
  }
 ],
 "04": [
  {
   "name": "Oum El Bouaghi",
   "ar": "أم البواقي",
   "lat": 35.868879,
   "lng": 7.110827
  },
  {
   "name": "Ain Beida",
   "ar": "عين البيضاء",
   "lat": 35.796101,
   "lng": 7.390353
  },
  {
   "name": "Ain M'lila",
   "ar": "عين مليلة",
   "lat": 36.034397,
   "lng": 6.573786
  },
  {
   "name": "Behir Chergui",
   "ar": "بحير الشرڨي",
   "lat": 35.79339,
   "lng": 7.717415
  },
  {
   "name": "El Amiria",
   "ar": "العامرية",
   "lat": 36.111789,
   "lng": 6.882055
  },
  {
   "name": "Sigus",
   "ar": "سيقوس",
   "lat": 36.124066,
   "lng": 6.788511
  },
  {
   "name": "El Belala",
   "ar": "البلالة",
   "lat": 35.666155,
   "lng": 7.788255
  },
  {
   "name": "Ain Babouche",
   "ar": "عين بابوش",
   "lat": 35.941266,
   "lng": 7.186873
  },
  {
   "name": "Berriche",
   "ar": "بريش",
   "lat": 35.919183,
   "lng": 7.37642
  },
  {
   "name": "Ouled Hamla",
   "ar": "أولاد حملة",
   "lat": 36.082777,
   "lng": 6.466406
  },
  {
   "name": "Dhala",
   "ar": "الضلعة",
   "lat": 35.460305,
   "lng": 7.548171
  },
  {
   "name": "Ain Kercha",
   "ar": "عين كرشة",
   "lat": 35.924848,
   "lng": 6.695971
  },
  {
   "name": "Hanchir Toumghani",
   "ar": "هنشير تومغني",
   "lat": 35.93813,
   "lng": 6.736888
  },
  {
   "name": "El Djazia",
   "ar": "الجازيـــــــة",
   "lat": 35.664775,
   "lng": 7.510192
  },
  {
   "name": "Ain Diss",
   "ar": "عين الديس",
   "lat": 35.995153,
   "lng": 7.053703
  },
  {
   "name": "Fkirina",
   "ar": "فكرينة",
   "lat": 35.667187,
   "lng": 7.301406
  },
  {
   "name": "Souk Naamane",
   "ar": "سوق نعمان",
   "lat": 35.898704,
   "lng": 6.387833
  },
  {
   "name": "Zorg",
   "ar": "الزرڨ",
   "lat": 35.828796,
   "lng": 7.511644
  },
  {
   "name": "El Fedjoudj Boughrara Sa",
   "ar": "الفجوج بوغرارة سعودى",
   "lat": 35.709938,
   "lng": 6.820379
  },
  {
   "name": "Ouled Zouai",
   "ar": "أولاد زواي",
   "lat": 35.84177,
   "lng": 6.510184
  },
  {
   "name": "Bir Chouhada",
   "ar": "بئر الشهداء",
   "lat": 35.894668,
   "lng": 6.290022
  },
  {
   "name": "Ksar Sbahi",
   "ar": "قصر صباحي",
   "lat": 36.083028,
   "lng": 7.259687
  },
  {
   "name": "Oued Nini",
   "ar": "وادي نيني",
   "lat": 35.569136,
   "lng": 7.348139
  },
  {
   "name": "Meskiana",
   "ar": "مسكيانة",
   "lat": 35.633834,
   "lng": 7.666122
  },
  {
   "name": "Ain Fekroune",
   "ar": "عين فكرون",
   "lat": 35.97721,
   "lng": 6.873371
  },
  {
   "name": "Rahia",
   "ar": "الراحية",
   "lat": 35.76176,
   "lng": 7.644136
  },
  {
   "name": "Ain Zitoun",
   "ar": "عين الزيتون",
   "lat": 35.714983,
   "lng": 7.01434
  },
  {
   "name": "Ouled Gacem",
   "ar": "أولاد ڨاسم",
   "lat": 36.033935,
   "lng": 6.667046
  },
  {
   "name": "El Harmilia",
   "ar": "الحرملية",
   "lat": 35.924817,
   "lng": 6.622843
  }
 ],
 "05": [
  {
   "name": "Batna",
   "ar": "باتنة",
   "lat": 35.596595,
   "lng": 5.898714
  },
  {
   "name": "Ghassira",
   "ar": "غسيرة",
   "lat": 35.101099,
   "lng": 6.226888
  },
  {
   "name": "Maafa",
   "ar": "معافة",
   "lat": 35.290068,
   "lng": 5.860942
  },
  {
   "name": "Merouana",
   "ar": "مروانة",
   "lat": 35.629946,
   "lng": 5.911871
  },
  {
   "name": "Seriana",
   "ar": "سريانة",
   "lat": 35.69777,
   "lng": 6.187974
  },
  {
   "name": "Menaa",
   "ar": "منعة",
   "lat": 35.161671,
   "lng": 6.04951
  },
  {
   "name": "El Madher",
   "ar": "المعذر",
   "lat": 35.627419,
   "lng": 6.373399
  },
  {
   "name": "Tazoult",
   "ar": "تازولت",
   "lat": 35.563419,
   "lng": 6.189
  },
  {
   "name": "N Gaous",
   "ar": "نڨاوس",
   "lat": 35.547288,
   "lng": 5.62962
  },
  {
   "name": "Guigba",
   "ar": "قيقبة",
   "lat": 35.734192,
   "lng": 5.590233
  },
  {
   "name": "Inoughissen",
   "ar": "إينوغيسن",
   "lat": 35.304838,
   "lng": 6.548974
  },
  {
   "name": "Ouyoun El Assafir",
   "ar": "عيون العصافير",
   "lat": 35.553573,
   "lng": 6.307393
  },
  {
   "name": "Djerma",
   "ar": "جرمة",
   "lat": 35.663529,
   "lng": 6.307302
  },
  {
   "name": "Bitam",
   "ar": "بيطام",
   "lat": 35.307618,
   "lng": 5.374191
  },
  {
   "name": "Azil Abedelkader",
   "ar": "عزيل عبد القادر",
   "lat": 35.501733,
   "lng": 5.070472
  },
  {
   "name": "Arris",
   "ar": "اريس",
   "lat": 35.258253,
   "lng": 6.345806
  },
  {
   "name": "Kimmel",
   "ar": "كيمل",
   "lat": 35.217567,
   "lng": 6.544868
  },
  {
   "name": "Tilatou",
   "ar": "تيلاطو",
   "lat": 35.35693,
   "lng": 5.713596
  },
  {
   "name": "Ain Djasser",
   "ar": "عين جاسر",
   "lat": 35.860972,
   "lng": 6.0036
  },
  {
   "name": "Ouled Sellem",
   "ar": "أولاد سلام",
   "lat": 35.824651,
   "lng": 5.882379
  },
  {
   "name": "Tigharghar",
   "ar": "تيغرغار",
   "lat": 35.113748,
   "lng": 5.927971
  },
  {
   "name": "Ain Yagout",
   "ar": "عين ياقوت",
   "lat": 35.777269,
   "lng": 6.415402
  },
  {
   "name": "Fesdis",
   "ar": "فسديس",
   "lat": 35.617575,
   "lng": 6.247072
  },
  {
   "name": "Sefiane",
   "ar": "سفيان",
   "lat": 35.437887,
   "lng": 5.558419
  },
  {
   "name": "Rahbat",
   "ar": "الرحبات",
   "lat": 35.711992,
   "lng": 5.655117
  },
  {
   "name": "Tighanimine",
   "ar": "تيغانمين",
   "lat": 35.212473,
   "lng": 6.303026
  },
  {
   "name": "Lemsane",
   "ar": "لمسان",
   "lat": 35.654641,
   "lng": 5.794649
  },
  {
   "name": "Ksar Bellezma",
   "ar": "قصر بلازمة",
   "lat": 35.676671,
   "lng": 5.903323
  },
  {
   "name": "Seggana",
   "ar": "سقانة",
   "lat": 35.365,
   "lng": 5.574368
  },
  {
   "name": "Ichmoul",
   "ar": "ايشمول",
   "lat": 35.310712,
   "lng": 6.508885
  },
  {
   "name": "Foum Toub",
   "ar": "فم الطوب",
   "lat": 35.403422,
   "lng": 6.54971
  },
  {
   "name": "Beni Foudhala El Hakania",
   "ar": "بنى فضالة الحقانية",
   "lat": 35.387584,
   "lng": 6.050448
  },
  {
   "name": "Oued El Ma",
   "ar": "واد الماء",
   "lat": 35.635575,
   "lng": 6.02455
  },
  {
   "name": "Talkhamt",
   "ar": "تالخمت",
   "lat": 35.707785,
   "lng": 5.715893
  },
  {
   "name": "Bouzina",
   "ar": "بوزينة",
   "lat": 35.268617,
   "lng": 6.100709
  },
  {
   "name": "Chemora",
   "ar": "الشمرة",
   "lat": 35.668528,
   "lng": 6.642974
  },
  {
   "name": "Oued Chaaba",
   "ar": "واد الشعبة",
   "lat": 35.540059,
   "lng": 6.081734
  },
  {
   "name": "Taxlent",
   "ar": "تاكسلانت",
   "lat": 35.605162,
   "lng": 5.802438
  },
  {
   "name": "Gosbat",
   "ar": "القصبات",
   "lat": 35.647738,
   "lng": 5.459726
  },
  {
   "name": "Ouled Aouf",
   "ar": "أولاد عوف",
   "lat": 35.439052,
   "lng": 5.776242
  },
  {
   "name": "Boumagueur",
   "ar": "بــومقر",
   "lat": 35.511986,
   "lng": 5.558643
  },
  {
   "name": "Barika",
   "ar": "بريكة",
   "lat": 35.387775,
   "lng": 5.370363
  },
  {
   "name": "Djezzar",
   "ar": "الجزار",
   "lat": 35.511776,
   "lng": 5.26858
  },
  {
   "name": "T Kout",
   "ar": "تكوت",
   "lat": 35.142611,
   "lng": 6.30524
  },
  {
   "name": "Ain Touta",
   "ar": "عين التوتة",
   "lat": 35.380807,
   "lng": 5.902013
  },
  {
   "name": "Hidoussa",
   "ar": "حيدوسة",
   "lat": 35.527839,
   "lng": 5.937763
  },
  {
   "name": "Teniet El Abed",
   "ar": "نية العابد",
   "lat": 35.283502,
   "lng": 6.250727
  },
  {
   "name": "Oued Taga",
   "ar": "وادي الطاقة",
   "lat": 35.431375,
   "lng": 6.414192
  },
  {
   "name": "Ouled Fadel",
   "ar": "أولاد فاضل",
   "lat": 35.484171,
   "lng": 6.625505
  },
  {
   "name": "Timgad",
   "ar": "تيمقاد",
   "lat": 35.494912,
   "lng": 6.468013
  },
  {
   "name": "Ras El Aioun",
   "ar": "رأس العيون",
   "lat": 35.681438,
   "lng": 5.654531
  },
  {
   "name": "Chir",
   "ar": "شير",
   "lat": 35.227357,
   "lng": 6.1322
  },
  {
   "name": "Ouled Si Slimane",
   "ar": "أولاد سي سليمان",
   "lat": 35.611932,
   "lng": 5.632816
  },
  {
   "name": "Zanet El Beida",
   "ar": "زانة البيضاء",
   "lat": 35.779111,
   "lng": 6.085056
  },
  {
   "name": "M Doukal",
   "ar": "أمدوكال",
   "lat": 35.120295,
   "lng": 5.178705
  },
  {
   "name": "Ouled Ammar",
   "ar": "أولاد عمار",
   "lat": 35.462351,
   "lng": 5.156348
  },
  {
   "name": "El Hassi",
   "ar": "الحاسي",
   "lat": 35.80261,
   "lng": 5.940513
  },
  {
   "name": "Lazrou",
   "ar": "لازرو",
   "lat": 35.842939,
   "lng": 6.216656
  },
  {
   "name": "Boumia",
   "ar": "بومية",
   "lat": 35.67819,
   "lng": 6.482585
  },
  {
   "name": "Boulhilat",
   "ar": "بولهيلات",
   "lat": 35.726573,
   "lng": 6.662489
  },
  {
   "name": "Larbaa",
   "ar": "الاربعاء",
   "lat": 35.35432,
   "lng": 6.14052
  }
 ],
 "06": [
  {
   "name": "Bejaia",
   "ar": "بجاية",
   "lat": 36.751526,
   "lng": 5.055684
  },
  {
   "name": "Amizour",
   "ar": "اميزور",
   "lat": 36.643932,
   "lng": 4.903658
  },
  {
   "name": "Feraoun",
   "ar": "فرعون",
   "lat": 36.558393,
   "lng": 4.860331
  },
  {
   "name": "Taourit Ighil",
   "ar": "تاوريرت اغيل",
   "lat": 36.699147,
   "lng": 4.696342
  },
  {
   "name": "Chellata",
   "ar": "شلاطة",
   "lat": 36.514946,
   "lng": 4.501932
  },
  {
   "name": "Tamokra",
   "ar": "تامقرة",
   "lat": 36.406332,
   "lng": 4.657055
  },
  {
   "name": "Timezrit",
   "ar": "تيمزريت",
   "lat": 36.620123,
   "lng": 4.768479
  },
  {
   "name": "Souk El Tenine",
   "ar": "ﺳﻮق اﻻﺛﻨﻴﻦ",
   "lat": 36.627973,
   "lng": 5.33519
  },
  {
   "name": "M'cisna",
   "ar": "مسيسنة",
   "lat": 36.56333,
   "lng": 4.710419
  },
  {
   "name": "Tinebdar",
   "ar": "تينبذار",
   "lat": 36.625827,
   "lng": 4.685691
  },
  {
   "name": "Tichy",
   "ar": "تيشي",
   "lat": 36.655046,
   "lng": 5.163894
  },
  {
   "name": "Smaoun",
   "ar": "سمعون",
   "lat": 36.608594,
   "lng": 4.82183
  },
  {
   "name": "Kendira",
   "ar": "كنديرة",
   "lat": 36.541013,
   "lng": 5.011048
  },
  {
   "name": "Tifra",
   "ar": "تيفرة",
   "lat": 36.666725,
   "lng": 4.69778
  },
  {
   "name": "Ighram",
   "ar": "إغرم",
   "lat": 36.476201,
   "lng": 4.462375
  },
  {
   "name": "Amalou",
   "ar": "امالو",
   "lat": 36.477927,
   "lng": 4.631876
  },
  {
   "name": "Ighil Ali",
   "ar": "إغيل على",
   "lat": 36.338161,
   "lng": 4.469623
  },
  {
   "name": "Fenaia Il Maten",
   "ar": "افناين الماثن",
   "lat": 36.665632,
   "lng": 4.770215
  },
  {
   "name": "Toudja",
   "ar": "توجة",
   "lat": 36.752559,
   "lng": 4.894965
  },
  {
   "name": "Darghina",
   "ar": "درقينة",
   "lat": 36.564252,
   "lng": 5.306154
  },
  {
   "name": "Sidi Ayad",
   "ar": "سيدي عياد",
   "lat": 36.612143,
   "lng": 4.71504
  },
  {
   "name": "Aokas",
   "ar": "أوقاس",
   "lat": 36.637635,
   "lng": 5.245245
  },
  {
   "name": "Beni Dejllil",
   "ar": "آيث جليل",
   "lat": 36.566982,
   "lng": 4.800233
  },
  {
   "name": "Adekar",
   "ar": "آدكار",
   "lat": 36.693285,
   "lng": 4.670908
  },
  {
   "name": "Akbou",
   "ar": "أقبو",
   "lat": 36.45564,
   "lng": 4.536509
  },
  {
   "name": "Seddouk",
   "ar": "صدوق",
   "lat": 36.546787,
   "lng": 4.686702
  },
  {
   "name": "Tazmalt",
   "ar": "تازمالت",
   "lat": 36.390382,
   "lng": 4.395497
  },
  {
   "name": "Ait R'zine",
   "ar": "آيت أرزين",
   "lat": 36.371265,
   "lng": 4.485753
  },
  {
   "name": "Chemini",
   "ar": "شميني",
   "lat": 36.593284,
   "lng": 4.614908
  },
  {
   "name": "Souk Oufella",
   "ar": "سوق أوفلة",
   "lat": 36.603678,
   "lng": 4.636929
  },
  {
   "name": "Taskriout",
   "ar": "تاسقريوت",
   "lat": 36.554875,
   "lng": 5.28607
  },
  {
   "name": "Tibane",
   "ar": "طيبان",
   "lat": 36.611565,
   "lng": 4.6502
  },
  {
   "name": "Tala Hamza",
   "ar": "ثالة حمزة",
   "lat": 36.681354,
   "lng": 5.014469
  },
  {
   "name": "Barbacha",
   "ar": "برباشة",
   "lat": 36.570766,
   "lng": 4.973517
  },
  {
   "name": "Beni K'sila",
   "ar": "بنى كسيلة",
   "lat": 36.882112,
   "lng": 4.661605
  },
  {
   "name": "Ouzellaguene",
   "ar": "أوزلاقن",
   "lat": 36.540038,
   "lng": 4.611869
  },
  {
   "name": "Bouhamza",
   "ar": "بوحمزة",
   "lat": 36.445583,
   "lng": 4.686012
  },
  {
   "name": "Beni Mallikeche",
   "ar": "بنى مليكش",
   "lat": 36.445689,
   "lng": 4.413423
  },
  {
   "name": "Sidi Aich",
   "ar": "سيدي عيش",
   "lat": 36.609718,
   "lng": 4.690172
  },
  {
   "name": "El Kseur",
   "ar": "القصر",
   "lat": 36.677538,
   "lng": 4.84929
  },
  {
   "name": "Melbou",
   "ar": "ملبو",
   "lat": 36.640332,
   "lng": 5.362539
  },
  {
   "name": "Akfadou",
   "ar": "اكفادو",
   "lat": 36.660504,
   "lng": 4.614048
  },
  {
   "name": "Leflaye",
   "ar": "لفلاى",
   "lat": 36.608015,
   "lng": 4.66598
  },
  {
   "name": "Kherrata",
   "ar": "خراطة",
   "lat": 36.49364,
   "lng": 5.277071
  },
  {
   "name": "Dra El Caid",
   "ar": "ذراع القايد",
   "lat": 36.418607,
   "lng": 5.263732
  },
  {
   "name": "Tamridjet",
   "ar": "تامريجت",
   "lat": 36.572271,
   "lng": 5.373555
  },
  {
   "name": "Ait Smail",
   "ar": "آيت سماعيل",
   "lat": 36.554139,
   "lng": 5.237882
  },
  {
   "name": "Boukhelifa",
   "ar": "بوخليفة",
   "lat": 36.650808,
   "lng": 5.07214
  },
  {
   "name": "Tizi N'berber",
   "ar": "تيزى نبربر",
   "lat": 36.612533,
   "lng": 5.216992
  },
  {
   "name": "Benimaouche",
   "ar": "بني معوش",
   "lat": 36.505269,
   "lng": 4.762345
  },
  {
   "name": "Oued Ghir",
   "ar": "وادي غير",
   "lat": 36.705501,
   "lng": 4.979038
  },
  {
   "name": "Boudjellil",
   "ar": "بوجليل",
   "lat": 36.337267,
   "lng": 4.378994
  }
 ],
 "07": [
  {
   "name": "Biskra",
   "ar": "بسكرة",
   "lat": 34.844944,
   "lng": 5.724857
  },
  {
   "name": "Oumache",
   "ar": "أوماش",
   "lat": 34.693816,
   "lng": 5.698071
  },
  {
   "name": "Branis",
   "ar": "البرانس",
   "lat": 34.980217,
   "lng": 5.712637
  },
  {
   "name": "Chetma",
   "ar": "شتمة",
   "lat": 34.849785,
   "lng": 5.788848
  },
  {
   "name": "Sidi Okba",
   "ar": "سيدي عقبة",
   "lat": 34.750587,
   "lng": 5.908408
  },
  {
   "name": "M'chouneche",
   "ar": "مشونش",
   "lat": 34.936967,
   "lng": 5.990063
  },
  {
   "name": "El Haouch",
   "ar": "الحوش",
   "lat": 34.563942,
   "lng": 6.046158
  },
  {
   "name": "Ain Naga",
   "ar": "عين الناقة",
   "lat": 34.683076,
   "lng": 6.208666
  },
  {
   "name": "Zeribet El Oued",
   "ar": "زريبة الوادي",
   "lat": 34.685617,
   "lng": 6.493414
  },
  {
   "name": "El Feidh",
   "ar": "الفيض",
   "lat": 34.521824,
   "lng": 6.522696
  },
  {
   "name": "El Kantara",
   "ar": "القنطرة",
   "lat": 35.218027,
   "lng": 5.710247
  },
  {
   "name": "Ain Zaatout",
   "ar": "عين زعطوط",
   "lat": 35.14635,
   "lng": 5.837316
  },
  {
   "name": "El Outaya",
   "ar": "لوطاية",
   "lat": 35.032801,
   "lng": 5.58716
  },
  {
   "name": "Djemorah",
   "ar": "جمورة",
   "lat": 35.071302,
   "lng": 5.845819
  },
  {
   "name": "Tolga",
   "ar": "طولقة",
   "lat": 34.934611,
   "lng": 5.130513
  },
  {
   "name": "Lioua",
   "ar": "لواء",
   "lat": 34.638336,
   "lng": 5.395908
  },
  {
   "name": "Lichana",
   "ar": "لشانة",
   "lat": 34.724729,
   "lng": 5.432553
  },
  {
   "name": "Ourlal",
   "ar": "أورلال",
   "lat": 34.655656,
   "lng": 5.512895
  },
  {
   "name": "M'lili",
   "ar": "مليلي",
   "lat": 34.669221,
   "lng": 5.563921
  },
  {
   "name": "Foughala",
   "ar": "فوغالة",
   "lat": 34.728734,
   "lng": 5.329351
  },
  {
   "name": "Bordj Ben Azzouz",
   "ar": "برج بن عزوز",
   "lat": 34.700258,
   "lng": 5.358875
  },
  {
   "name": "Meziraa",
   "ar": "مزيرعة",
   "lat": 34.721195,
   "lng": 6.293085
  },
  {
   "name": "Bouchagroun",
   "ar": "بوشقرون",
   "lat": 34.724544,
   "lng": 5.466032
  },
  {
   "name": "Mekhadma",
   "ar": "مخادمة",
   "lat": 34.651865,
   "lng": 5.472655
  },
  {
   "name": "El Ghrous",
   "ar": "الغروس",
   "lat": 34.720767,
   "lng": 5.283282
  },
  {
   "name": "El Hadjab",
   "ar": "الحاجب",
   "lat": 34.790961,
   "lng": 5.597429
  },
  {
   "name": "Khenguet Sidi Nadji",
   "ar": "خنڨة سيدي ناجي",
   "lat": 34.805914,
   "lng": 6.706841
  }
 ],
 "51": [
  {
   "name": "Ouled Djellal",
   "ar": "أولاد جلال",
   "lat": 34.429429,
   "lng": 5.068116
  },
  {
   "name": "Ras El Miad",
   "ar": "راس الميعاد",
   "lat": 34.184566,
   "lng": 4.453281
  },
  {
   "name": "Doucen",
   "ar": "الدوسن",
   "lat": 34.609948,
   "lng": 5.121448
  }
 ],
 "36": [
  {
   "name": "Besbes",
   "ar": "البسباس",
   "lat": 34.148135,
   "lng": 4.993355
  },
  {
   "name": "El Tarf",
   "ar": "الطارف",
   "lat": 36.757668,
   "lng": 8.307634
  },
  {
   "name": "Bouhadjar",
   "ar": "بوحجار",
   "lat": 36.507573,
   "lng": 8.105845
  },
  {
   "name": "Ben M Hidi",
   "ar": "بن مهيدى",
   "lat": 36.766637,
   "lng": 7.905582
  },
  {
   "name": "Bougous",
   "ar": "بوقوس",
   "lat": 36.659811,
   "lng": 8.373033
  },
  {
   "name": "El Kala",
   "ar": "القالة",
   "lat": 36.885675,
   "lng": 8.440819
  },
  {
   "name": "Ain El Assel",
   "ar": "عين العسل",
   "lat": 36.782609,
   "lng": 8.3793
  },
  {
   "name": "El Aioun",
   "ar": "العيون",
   "lat": 36.825241,
   "lng": 8.601414
  },
  {
   "name": "Bouteldja",
   "ar": "بوثلجة",
   "lat": 36.789473,
   "lng": 8.197849
  },
  {
   "name": "Souarekh",
   "ar": "السوارخ",
   "lat": 36.882519,
   "lng": 8.566483
  },
  {
   "name": "Berrihane",
   "ar": "برحان",
   "lat": 36.837632,
   "lng": 8.127009
  },
  {
   "name": "Lac Des Oiseaux",
   "ar": "بحيرة الطيور",
   "lat": 36.778152,
   "lng": 8.117716
  },
  {
   "name": "Chefia",
   "ar": "الشافية",
   "lat": 36.659764,
   "lng": 8.104569
  },
  {
   "name": "Drean",
   "ar": "الذرعان",
   "lat": 36.686563,
   "lng": 7.720806
  },
  {
   "name": "Chihani",
   "ar": "شهانى",
   "lat": 36.647262,
   "lng": 7.776489
  },
  {
   "name": "Chebaita Mokhtar",
   "ar": "شبيطة مختار",
   "lat": 36.754236,
   "lng": 7.742064
  },
  {
   "name": "Besbes",
   "ar": "البسباس",
   "lat": 36.702084,
   "lng": 7.84644
  },
  {
   "name": "Asfour",
   "ar": "عصفور",
   "lat": 36.677952,
   "lng": 7.977181
  },
  {
   "name": "Echatt",
   "ar": "الشط",
   "lat": 36.804898,
   "lng": 7.823917
  },
  {
   "name": "Zerizer",
   "ar": "زريزر",
   "lat": 36.726045,
   "lng": 7.897252
  },
  {
   "name": "Zitouna",
   "ar": "الزيتونة",
   "lat": 36.666817,
   "lng": 8.233066
  },
  {
   "name": "Ain Kerma",
   "ar": "عين الكرمة",
   "lat": 36.591975,
   "lng": 8.199492
  },
  {
   "name": "Oued Zitoun",
   "ar": "وادى الزيتون",
   "lat": 36.462356,
   "lng": 8.058138
  },
  {
   "name": "Hammam Beni Salah",
   "ar": "حمام بنى صالح",
   "lat": 36.520241,
   "lng": 8.034343
  },
  {
   "name": "Raml Souk",
   "ar": "رمل سوق",
   "lat": 36.812216,
   "lng": 8.539835
  }
 ],
 "22": [
  {
   "name": "Sidi Khaled",
   "ar": "سيدي خالد",
   "lat": 34.397074,
   "lng": 4.997093
  },
  {
   "name": "Sidi Bel Abbes",
   "ar": "سيدي بلعباس",
   "lat": 35.210588,
   "lng": -0.629983
  },
  {
   "name": "Tessala",
   "ar": "تسالة",
   "lat": 35.244275,
   "lng": -0.774483
  },
  {
   "name": "Sidi Brahim",
   "ar": "سيدي ابراهيم",
   "lat": 35.257405,
   "lng": -0.566141
  },
  {
   "name": "Mostefa Ben Brahim",
   "ar": "مصطفى بن ابراهيم",
   "lat": 35.191429,
   "lng": -0.360803
  },
  {
   "name": "Telagh",
   "ar": "تلاغ",
   "lat": 34.782677,
   "lng": -0.573731
  },
  {
   "name": "Mezaourou",
   "ar": "مزاورو",
   "lat": 34.817997,
   "lng": -0.620059
  },
  {
   "name": "Boukhanafis",
   "ar": "بوخنفيس",
   "lat": 35.058669,
   "lng": -0.713291
  },
  {
   "name": "Sidi Ali Boussidi",
   "ar": "سيدي علي بوسيدي",
   "lat": 35.112986,
   "lng": -0.838925
  },
  {
   "name": "Badredine El Mokrani",
   "ar": "بدر الدين المقراني",
   "lat": 35.009104,
   "lng": -0.849718
  },
  {
   "name": "Marhoum",
   "ar": "مرحوم",
   "lat": 34.447612,
   "lng": -0.19473
  },
  {
   "name": "Tafissour",
   "ar": "تفسور",
   "lat": 34.692962,
   "lng": -0.20203
  },
  {
   "name": "Amarnas",
   "ar": "العمارنة",
   "lat": 35.092963,
   "lng": -0.63183
  },
  {
   "name": "Tilmouni",
   "ar": "تلموني",
   "lat": 35.172258,
   "lng": -0.552007
  },
  {
   "name": "Sidi Lahcene",
   "ar": "سيدي لحسن",
   "lat": 35.162584,
   "lng": -0.697531
  },
  {
   "name": "Ain Thrid",
   "ar": "عين التريد",
   "lat": 35.285495,
   "lng": -0.676203
  },
  {
   "name": "Makedra",
   "ar": "مكدرة",
   "lat": 35.441856,
   "lng": -0.43234
  },
  {
   "name": "Tenira",
   "ar": "تنيرة",
   "lat": 35.021027,
   "lng": -0.525923
  },
  {
   "name": "Moulay Slissen",
   "ar": "مولاي سليسن",
   "lat": 34.818454,
   "lng": -0.761262
  },
  {
   "name": "El Hacaiba",
   "ar": "الحصيبة",
   "lat": 34.700124,
   "lng": -0.759231
  },
  {
   "name": "Hassi Zahana",
   "ar": "حاسي زهانة",
   "lat": 35.026755,
   "lng": -0.890995
  },
  {
   "name": "Tabia",
   "ar": "طابية",
   "lat": 35.019972,
   "lng": -0.732056
  },
  {
   "name": "Merine",
   "ar": "مرين",
   "lat": 34.780827,
   "lng": -0.451001
  },
  {
   "name": "Ras El Ma",
   "ar": "رأس الماء",
   "lat": 34.499172,
   "lng": -0.811944
  },
  {
   "name": "Ain Tindamine",
   "ar": "عين تندامين",
   "lat": 34.689726,
   "lng": -0.720488
  },
  {
   "name": "Ain Kada",
   "ar": "عين قادة",
   "lat": 35.137098,
   "lng": -0.85777
  },
  {
   "name": "M'cid",
   "ar": "مسيد",
   "lat": 35.139691,
   "lng": -0.247337
  },
  {
   "name": "Sidi Khaled",
   "ar": "سيدي خالد",
   "lat": 35.112141,
   "lng": -0.719212
  },
  {
   "name": "Ain El Berd",
   "ar": "عين البرد",
   "lat": 35.366004,
   "lng": -0.513142
  },
  {
   "name": "Sfissef",
   "ar": "سفيزف",
   "lat": 35.235105,
   "lng": -0.242702
  },
  {
   "name": "Ain Adden",
   "ar": "عين عدان",
   "lat": 35.330736,
   "lng": -0.262504
  },
  {
   "name": "Oued Taourira",
   "ar": "واد تاوريرة",
   "lat": 34.802639,
   "lng": -0.326607
  },
  {
   "name": "Dhaya",
   "ar": "الظاية",
   "lat": 34.673435,
   "lng": -0.62273
  },
  {
   "name": "Zerouala",
   "ar": "زروالة",
   "lat": 35.241317,
   "lng": -0.523825
  },
  {
   "name": "Lamtar",
   "ar": "لمطار",
   "lat": 35.069346,
   "lng": -0.79892
  },
  {
   "name": "Sidi Chaib",
   "ar": "سيدي شعيب",
   "lat": 34.59227,
   "lng": -0.545478
  },
  {
   "name": "Oued Sebaa",
   "ar": "واد السبع",
   "lat": 34.58717,
   "lng": -0.708133
  },
  {
   "name": "Boudjebaa El Bordj",
   "ar": "بوجبهة البرج",
   "lat": 35.350662,
   "lng": -0.323612
  },
  {
   "name": "Sehala Thaoura",
   "ar": "سهالة الثورة",
   "lat": 35.233178,
   "lng": -0.849965
  },
  {
   "name": "Sidi Yacoub",
   "ar": "سيدي يعقوب",
   "lat": 35.135107,
   "lng": -0.786394
  },
  {
   "name": "Sidi Hamadouche",
   "ar": "سيدي حمادوش",
   "lat": 35.29941,
   "lng": -0.54845
  },
  {
   "name": "Belarbi",
   "ar": "بلعربي",
   "lat": 35.151905,
   "lng": -0.456322
  },
  {
   "name": "Oued Sefioun",
   "ar": "واد سفيون",
   "lat": 35.064712,
   "lng": -0.357438
  },
  {
   "name": "Teghalimet",
   "ar": "تغاليمت",
   "lat": 34.886572,
   "lng": -0.549768
  },
  {
   "name": "Ben Badis",
   "ar": "ابن باديس",
   "lat": 34.952302,
   "lng": -0.915768
  },
  {
   "name": "Sidi Ali Benyoub",
   "ar": "سيدي علي بن يوب",
   "lat": 34.946146,
   "lng": -0.719406
  },
  {
   "name": "Chetouane Belaila",
   "ar": "شطوان بلايلة",
   "lat": 34.949721,
   "lng": -0.836699
  },
  {
   "name": "Bir El Hammam",
   "ar": "بئر الحمام",
   "lat": 34.418614,
   "lng": -0.499017
  },
  {
   "name": "Taoudmout",
   "ar": "تاودموت",
   "lat": 34.5876,
   "lng": -0.110415
  },
  {
   "name": "Redjem Demouche",
   "ar": "رجم دموش",
   "lat": 34.427579,
   "lng": -0.811459
  },
  {
   "name": "Benachiba Chelia",
   "ar": "بن عشيبة شلية",
   "lat": 34.963705,
   "lng": -0.613009
  },
  {
   "name": "Hassi Dahou",
   "ar": "حاسي دحو",
   "lat": 35.071614,
   "lng": -0.54652
  }
 ],
 "42": [
  {
   "name": "Chaiba",
   "ar": "شعيبة",
   "lat": 34.783302,
   "lng": 5.045178
  },
  {
   "name": "Tipaza",
   "ar": "تيبازة",
   "lat": 36.590672,
   "lng": 2.443372
  },
  {
   "name": "Menaceur",
   "ar": "مناصر",
   "lat": 36.504577,
   "lng": 2.26879
  },
  {
   "name": "Larhat",
   "ar": "الأرهاط",
   "lat": 36.556579,
   "lng": 1.801834
  },
  {
   "name": "Douaouda",
   "ar": "دواودة",
   "lat": 36.677043,
   "lng": 2.795592
  },
  {
   "name": "Bourkika",
   "ar": "بورقيقة",
   "lat": 36.494647,
   "lng": 2.477634
  },
  {
   "name": "Khemisti",
   "ar": "خميستي",
   "lat": 36.617073,
   "lng": 2.683478
  },
  {
   "name": "Aghbal",
   "ar": "أغابال",
   "lat": 36.739547,
   "lng": 3.050258
  },
  {
   "name": "Hadjout",
   "ar": "حجوط",
   "lat": 36.512184,
   "lng": 2.414299
  },
  {
   "name": "Sidi Amar",
   "ar": "سيدي عمر",
   "lat": 36.543981,
   "lng": 2.306285
  },
  {
   "name": "Gouraya",
   "ar": "ڨورايا",
   "lat": 36.571966,
   "lng": 1.903059
  },
  {
   "name": "Nador",
   "ar": "الناظور",
   "lat": 36.569341,
   "lng": 2.393526
  },
  {
   "name": "Chaiba",
   "ar": "الشعيبة",
   "lat": 36.603035,
   "lng": 2.736421
  },
  {
   "name": "Ain Tagourait",
   "ar": "عين تڨورايت",
   "lat": 36.602762,
   "lng": 2.609115
  },
  {
   "name": "Cherchell",
   "ar": "شرشال",
   "lat": 36.595574,
   "lng": 2.252502
  },
  {
   "name": "Damous",
   "ar": "الداموس",
   "lat": 36.548138,
   "lng": 1.703982
  },
  {
   "name": "Merad",
   "ar": "مراد",
   "lat": 36.476361,
   "lng": 2.427306
  },
  {
   "name": "Fouka",
   "ar": "فوكة",
   "lat": 36.661519,
   "lng": 2.74235
  },
  {
   "name": "Bou Ismail",
   "ar": "بو اسماعيل",
   "lat": 36.639285,
   "lng": 2.696272
  },
  {
   "name": "Ahmer El Ain",
   "ar": "أحمر العين",
   "lat": 36.477482,
   "lng": 2.564662
  },
  {
   "name": "Bou Haroun",
   "ar": "بوهارون",
   "lat": 36.623705,
   "lng": 2.655454
  },
  {
   "name": "Sidi Ghiles",
   "ar": "سيدي غيلاس",
   "lat": 36.58391,
   "lng": 2.124817
  },
  {
   "name": "Messelmoun",
   "ar": "مسلمون",
   "lat": 36.474796,
   "lng": 1.992521
  },
  {
   "name": "Sidi Rached",
   "ar": "سيدي راشد",
   "lat": 36.562002,
   "lng": 2.53054
  },
  {
   "name": "Kolea",
   "ar": "القليعة",
   "lat": 36.638162,
   "lng": 2.766976
  },
  {
   "name": "Attatba",
   "ar": "الحطاطبة",
   "lat": 36.573076,
   "lng": 2.676623
  },
  {
   "name": "Sidi Semiane",
   "ar": "سيدي سميان",
   "lat": 36.503369,
   "lng": 2.069183
  },
  {
   "name": "Beni Mileuk",
   "ar": "بني ميلك",
   "lat": 36.417815,
   "lng": 1.738226
  },
  {
   "name": "Hadjret Ennous",
   "ar": "حجرة النص",
   "lat": 36.573164,
   "lng": 2.052065
  }
 ],
 "08": [
  {
   "name": "Bechar",
   "ar": "بشار",
   "lat": 31.62381,
   "lng": -2.216244
  },
  {
   "name": "Erg Ferradj",
   "ar": "عرق فراج",
   "lat": 31.035044,
   "lng": -2.792018
  },
  {
   "name": "Meridja",
   "ar": "مريجة",
   "lat": 31.548969,
   "lng": -2.946079
  },
  {
   "name": "Lahmar",
   "ar": "لحمر",
   "lat": 31.931706,
   "lng": -2.258314
  },
  {
   "name": "Mechraa H.boumediene",
   "ar": "مشرع ھوارى بومدين",
   "lat": 30.932247,
   "lng": -2.737545
  },
  {
   "name": "Kenadsa",
   "ar": "القنادسة",
   "lat": 31.554898,
   "lng": -2.425653
  },
  {
   "name": "Taghit",
   "ar": "تــــاغـيــث",
   "lat": 30.879216,
   "lng": -2.010365
  },
  {
   "name": "Boukais",
   "ar": "بوكايس",
   "lat": 32.066565,
   "lng": -2.489973
  },
  {
   "name": "Mogheul",
   "ar": "موغل",
   "lat": 32.021624,
   "lng": -2.219393
  },
  {
   "name": "Abadla",
   "ar": "العبادلة",
   "lat": 31.00231,
   "lng": -2.745868
  },
  {
   "name": "Beni Ounif",
   "ar": "بني ونيف",
   "lat": 31.282904,
   "lng": -0.693295
  }
 ],
 "52": [
  {
   "name": "Ouled Khoudir",
   "ar": "أولاد خدير",
   "lat": 29.666679,
   "lng": -1.893514
  },
  {
   "name": "Timoudi",
   "ar": "تيمودى",
   "lat": 29.366353,
   "lng": -1.173699
  },
  {
   "name": "Beni Abbes",
   "ar": "بني عباس",
   "lat": 30.131222,
   "lng": -2.166226
  },
  {
   "name": "Beni Ikhlef",
   "ar": "بني يخلف",
   "lat": 29.575786,
   "lng": -1.605812
  },
  {
   "name": "Igli",
   "ar": "إقلي",
   "lat": 30.478214,
   "lng": -3.145342
  },
  {
   "name": "Tabelbala",
   "ar": "تبلبالة",
   "lat": 29.406941,
   "lng": -3.257159
  },
  {
   "name": "El Ouata",
   "ar": "الوطى",
   "lat": 29.858882,
   "lng": -1.837122
  },
  {
   "name": "Kerzaz",
   "ar": "كرزاز",
   "lat": 30.131222,
   "lng": -2.166226
  },
  {
   "name": "Ksabi",
   "ar": "قصابى",
   "lat": 29.102557,
   "lng": -0.971678
  },
  {
   "name": "Tamtert",
   "ar": "تامترت",
   "lat": 29.909624,
   "lng": -1.888392
  }
 ],
 "09": [
  {
   "name": "Blida",
   "ar": "البليدة‎",
   "lat": 36.473572,
   "lng": 2.832315
  },
  {
   "name": "Chebli",
   "ar": "الشبلي",
   "lat": 36.577382,
   "lng": 3.009176
  },
  {
   "name": "Bouinan",
   "ar": "بوعينان",
   "lat": 36.532428,
   "lng": 2.993968
  },
  {
   "name": "Oued El Alleug",
   "ar": "واد العلايڨ",
   "lat": 36.555896,
   "lng": 2.789631
  },
  {
   "name": "Ouled Yaich",
   "ar": "اولاد يعيش",
   "lat": 36.494155,
   "lng": 2.862698
  },
  {
   "name": "Chrea",
   "ar": "الشريعة",
   "lat": 36.42676,
   "lng": 2.876538
  },
  {
   "name": "El Affroun",
   "ar": "العفرون",
   "lat": 36.470159,
   "lng": 2.625741
  },
  {
   "name": "Chiffa",
   "ar": "الشفة",
   "lat": 36.46249,
   "lng": 2.741055
  },
  {
   "name": "Benkhelil",
   "ar": "بني خليل",
   "lat": 36.620411,
   "lng": 2.876616
  },
  {
   "name": "Souma",
   "ar": "صومعة",
   "lat": 36.518839,
   "lng": 2.907785
  },
  {
   "name": "Mouzaia",
   "ar": "موزاية",
   "lat": 36.466912,
   "lng": 2.68986
  },
  {
   "name": "Souhane",
   "ar": "صوحان",
   "lat": 36.507414,
   "lng": 3.237767
  },
  {
   "name": "Meftah",
   "ar": "مفتاح",
   "lat": 36.622387,
   "lng": 3.22613
  },
  {
   "name": "Ouled Slama",
   "ar": "أولاد سلامة",
   "lat": 36.552706,
   "lng": 3.108668
  },
  {
   "name": "Boufarik",
   "ar": "بوفاريك",
   "lat": 36.583241,
   "lng": 2.912126
  },
  {
   "name": "Larbaa",
   "ar": "الاربعاء",
   "lat": 36.565153,
   "lng": 3.153996
  },
  {
   "name": "Oued Djer",
   "ar": "واد جر",
   "lat": 36.426482,
   "lng": 2.561006
  },
  {
   "name": "Beni Tamou",
   "ar": "بني تامو",
   "lat": 36.53422,
   "lng": 2.821195
  },
  {
   "name": "Bouarfa",
   "ar": "بوعرفة",
   "lat": 36.466645,
   "lng": 2.815952
  },
  {
   "name": "Beni Mered",
   "ar": "بني مراد",
   "lat": 36.52077,
   "lng": 2.860275
  },
  {
   "name": "Bougara",
   "ar": "بوڨرة",
   "lat": 36.541927,
   "lng": 3.082845
  },
  {
   "name": "Guerrouaou",
   "ar": "ڨرواو",
   "lat": 36.525933,
   "lng": 2.881798
  },
  {
   "name": "Ain Romana",
   "ar": "عين الرمانة",
   "lat": 36.429181,
   "lng": 2.694317
  },
  {
   "name": "Djebabra",
   "ar": "جبابرة",
   "lat": 36.581868,
   "lng": 3.265424
  },
  {
   "name": "Oued Djer",
   "ar": "واد جر",
   "lat": 35.370869,
   "lng": 1.321785
  },
  {
   "name": "Bougara",
   "ar": "بوقرة",
   "lat": 35.555078,
   "lng": 1.965866
  },
  {
   "name": "Hammam Melouane",
   "ar": "حمام ملوان",
   "lat": 36.460787,
   "lng": 7.265924
  }
 ],
 "24": [
  {
   "name": "Hamam Debagh",
   "ar": "حمام دباغ",
   "lat": 36.487117,
   "lng": 3.044019
  },
  {
   "name": "Guelma",
   "ar": "قالمة",
   "lat": 36.462744,
   "lng": 7.433083
  },
  {
   "name": "Nechmaya",
   "ar": "نشماية",
   "lat": 36.609997,
   "lng": 7.514677
  },
  {
   "name": "Bouati Mahmoud",
   "ar": "بوعاتي محمود",
   "lat": 36.598257,
   "lng": 7.327694
  },
  {
   "name": "Oued Zenati",
   "ar": "وادي الزناتي",
   "lat": 36.310035,
   "lng": 7.165736
  },
  {
   "name": "Tamlouka",
   "ar": "تاملوكة",
   "lat": 36.157981,
   "lng": 7.14057
  },
  {
   "name": "Oued Fragha",
   "ar": "وادي فراغة",
   "lat": 36.55725,
   "lng": 7.712031
  },
  {
   "name": "Sidi Sandel",
   "ar": "سيدي صندل",
   "lat": 36.244126,
   "lng": 7.514322
  },
  {
   "name": "Ras El Agba",
   "ar": "راس العقبة",
   "lat": 36.373073,
   "lng": 7.22405
  },
  {
   "name": "Dahouara",
   "ar": "الدهوارة",
   "lat": 36.352282,
   "lng": 7.733532
  },
  {
   "name": "Belkheir",
   "ar": "بلخير",
   "lat": 36.462437,
   "lng": 7.476838
  },
  {
   "name": "Ben Djarah",
   "ar": "بن جراح",
   "lat": 36.43302,
   "lng": 7.369922
  },
  {
   "name": "Bou Hamdane",
   "ar": "بوحمدان",
   "lat": 36.464716,
   "lng": 7.112943
  },
  {
   "name": "Ain Makhlouf",
   "ar": "عين مخلوف",
   "lat": 36.246578,
   "lng": 7.250228
  },
  {
   "name": "Ain Ben Beida",
   "ar": "عين بن بيضاء",
   "lat": 36.615221,
   "lng": 7.697673
  },
  {
   "name": "Khezara",
   "ar": "خزارة",
   "lat": 36.370291,
   "lng": 7.527271
  },
  {
   "name": "Beni Mezline",
   "ar": "بني مزلين",
   "lat": 36.481549,
   "lng": 7.603561
  },
  {
   "name": "Bou Hachana",
   "ar": "بوحشانة",
   "lat": 36.306835,
   "lng": 7.508087
  },
  {
   "name": "Guelaat Bou Sbaa",
   "ar": "قلعة بوصبع",
   "lat": 36.547238,
   "lng": 7.475531
  },
  {
   "name": "El Fedjoudj",
   "ar": "الفجوج",
   "lat": 36.506383,
   "lng": 7.399677
  },
  {
   "name": "Bordj Sabat",
   "ar": "برج صباط",
   "lat": 36.403821,
   "lng": 7.044835
  },
  {
   "name": "Hammam N'bail",
   "ar": "حمام النبايل",
   "lat": 36.324308,
   "lng": 7.642422
  },
  {
   "name": "Ain Larbi",
   "ar": "عين العربى",
   "lat": 36.264827,
   "lng": 7.399371
  },
  {
   "name": "Medjez Amar",
   "ar": "مجاز عمار",
   "lat": 36.445606,
   "lng": 7.311812
  },
  {
   "name": "Bouchegouf",
   "ar": "بوشقوف",
   "lat": 36.471705,
   "lng": 7.727604
  },
  {
   "name": "Heliopolis",
   "ar": "ھيليوبوليس",
   "lat": 36.50838,
   "lng": 7.436194
  },
  {
   "name": "Roknia",
   "ar": "الركنية",
   "lat": 36.546175,
   "lng": 7.234725
  },
  {
   "name": "Sellaoua Announa",
   "ar": "سلاوة عنونة",
   "lat": 36.386554,
   "lng": 7.249793
  },
  {
   "name": "Medjez Sfa",
   "ar": "مجاز الصفاء",
   "lat": 36.433361,
   "lng": 7.784127
  },
  {
   "name": "Bouhamra Ahmed",
   "ar": "بومهرة أحمد",
   "lat": 36.460014,
   "lng": 7.515126
  },
  {
   "name": "Ain Reggada",
   "ar": "عين رقادة",
   "lat": 36.261796,
   "lng": 7.073226
  },
  {
   "name": "Oued Cheham",
   "ar": "وادي الشحم",
   "lat": 36.378303,
   "lng": 7.764866
  },
  {
   "name": "Djeballah Khemissi",
   "ar": "جبالة لخميسي",
   "lat": 36.465657,
   "lng": 7.568882
  }
 ],
 "10": [
  {
   "name": "Bouira",
   "ar": "البويرة",
   "lat": 36.369185,
   "lng": 3.900619
  },
  {
   "name": "El Asnam",
   "ar": "الأصنام",
   "lat": 36.322947,
   "lng": 4.008553
  },
  {
   "name": "Guerrouma",
   "ar": "قرومة",
   "lat": 36.484883,
   "lng": 3.451989
  },
  {
   "name": "Souk El Khemis",
   "ar": "سوق الخميس",
   "lat": 36.38511,
   "lng": 3.636876
  },
  {
   "name": "Kadiria",
   "ar": "قادرية",
   "lat": 36.534008,
   "lng": 3.683037
  },
  {
   "name": "Hanif",
   "ar": "احنيف",
   "lat": 36.33753,
   "lng": 4.268714
  },
  {
   "name": "Dirah",
   "ar": "ديــرة",
   "lat": 36.003186,
   "lng": 3.755143
  },
  {
   "name": "Ait Laaziz",
   "ar": "آيت لعزيز",
   "lat": 36.45182,
   "lng": 3.87048
  },
  {
   "name": "Taghzout",
   "ar": "تاغزوت",
   "lat": 36.417574,
   "lng": 3.963317
  },
  {
   "name": "Raouraoua",
   "ar": "الروراوة",
   "lat": 36.213494,
   "lng": 3.638614
  },
  {
   "name": "Mezdour",
   "ar": "مسدور",
   "lat": 36.081697,
   "lng": 4.070585
  },
  {
   "name": "Haizer",
   "ar": "حيزر",
   "lat": 36.396464,
   "lng": 4.000208
  },
  {
   "name": "Lakhdaria",
   "ar": "الأخضرية",
   "lat": 36.566065,
   "lng": 3.596021
  },
  {
   "name": "Maala",
   "ar": "معالة",
   "lat": 36.439604,
   "lng": 3.867835
  },
  {
   "name": "El Hachimia",
   "ar": "الھاشمية",
   "lat": 36.219445,
   "lng": 3.815733
  },
  {
   "name": "Aomar",
   "ar": "أعمر",
   "lat": 36.491772,
   "lng": 3.768423
  },
  {
   "name": "Chorfa",
   "ar": "الشرفاء",
   "lat": 36.360552,
   "lng": 4.329034
  },
  {
   "name": "Bordj Okhriss",
   "ar": "برج أوخريص",
   "lat": 36.083879,
   "lng": 3.975965
  },
  {
   "name": "El Adjiba",
   "ar": "العجيبة",
   "lat": 36.328365,
   "lng": 4.158673
  },
  {
   "name": "El Hakimia",
   "ar": "الحاكمية",
   "lat": 36.090592,
   "lng": 3.78072
  },
  {
   "name": "El Khabouzia",
   "ar": "الخبوزية",
   "lat": 36.316403,
   "lng": 3.600835
  },
  {
   "name": "Ahl El Ksar",
   "ar": "أھل القصر",
   "lat": 36.249165,
   "lng": 4.043325
  },
  {
   "name": "Bouderbala",
   "ar": "بودربالة",
   "lat": 36.566251,
   "lng": 3.484408
  },
  {
   "name": "Z'barbar",
   "ar": "زبربر",
   "lat": 36.484759,
   "lng": 3.525448
  },
  {
   "name": "Ain El Hadjar",
   "ar": "عين الحجر",
   "lat": 36.339515,
   "lng": 3.809953
  },
  {
   "name": "Djebahia",
   "ar": "الجباحية",
   "lat": 36.477344,
   "lng": 3.75852
  },
  {
   "name": "Aghbalou",
   "ar": "أغبالو",
   "lat": 36.418302,
   "lng": 4.338878
  },
  {
   "name": "Taguedite",
   "ar": "تاڨديت",
   "lat": 36.019119,
   "lng": 3.992107
  },
  {
   "name": "Ain Turk",
   "ar": "عين الترك",
   "lat": 36.416082,
   "lng": 3.80228
  },
  {
   "name": "Saharidj",
   "ar": "الصهاريج",
   "lat": 36.396539,
   "lng": 4.248837
  },
  {
   "name": "Dechmia",
   "ar": "الدشمية",
   "lat": 36.130596,
   "lng": 3.576155
  },
  {
   "name": "Ridane",
   "ar": "ريدان",
   "lat": 36.07813,
   "lng": 3.48983
  },
  {
   "name": "Bechloul",
   "ar": "بشلول",
   "lat": 36.312104,
   "lng": 4.074986
  },
  {
   "name": "Boukram",
   "ar": "بوكرام",
   "lat": 36.543738,
   "lng": 3.394422
  },
  {
   "name": "Ain Bessem",
   "ar": "عين بسام",
   "lat": 36.333751,
   "lng": 3.687402
  },
  {
   "name": "Bir Ghbalou",
   "ar": "بئر غبالو",
   "lat": 36.263586,
   "lng": 3.587003
  },
  {
   "name": "M Chedallah",
   "ar": "مشدا الله",
   "lat": 36.364496,
   "lng": 4.269681
  },
  {
   "name": "Sour El Ghozlane",
   "ar": "سور الغزلان",
   "lat": 36.15088,
   "lng": 3.707419
  },
  {
   "name": "Mamora",
   "ar": "المعمورة",
   "lat": 36.033522,
   "lng": 3.551315
  },
  {
   "name": "Ouled Rached",
   "ar": "أولاد راشد",
   "lat": 36.183819,
   "lng": 4.101482
  },
  {
   "name": "Ain Laloui",
   "ar": "عين العلوي",
   "lat": 36.321734,
   "lng": 3.748309
  },
  {
   "name": "Hadjera Zerga",
   "ar": "الحجرة الزرقاء",
   "lat": 35.956779,
   "lng": 3.849542
  },
  {
   "name": "El Mokrani",
   "ar": "المقراني",
   "lat": 36.425161,
   "lng": 3.60999
  },
  {
   "name": "Oued El Berdi",
   "ar": "وادى البردي",
   "lat": 36.289186,
   "lng": 3.91783
  },
  {
   "name": "Souk El Khemis",
   "ar": "سوق الخميس",
   "lat": 35.172537,
   "lng": -1.557306
  },
  {
   "name": "Ain El Hadjar",
   "ar": "عين الحجر",
   "lat": 34.761116,
   "lng": 0.146271
  }
 ],
 "15": [
  {
   "name": "Ait Mahmoud",
   "ar": "آث محمود",
   "lat": 36.329059,
   "lng": 4.325462
  },
  {
   "name": "Tizi Ouzou",
   "ar": "تيزي وزو",
   "lat": 36.713548,
   "lng": 4.047308
  },
  {
   "name": "Ain El Hammam",
   "ar": "عين الحمام",
   "lat": 36.569819,
   "lng": 4.312032
  },
  {
   "name": "Akbil",
   "ar": "أقبيل",
   "lat": 36.52326,
   "lng": 4.303517
  },
  {
   "name": "Freha",
   "ar": "فريحة",
   "lat": 36.756888,
   "lng": 4.316034
  },
  {
   "name": "Souamaa",
   "ar": "صوامع",
   "lat": 36.641344,
   "lng": 4.340917
  },
  {
   "name": "Mechtras",
   "ar": "مشطراس",
   "lat": 36.544789,
   "lng": 4.005007
  },
  {
   "name": "Irdjen",
   "ar": "إرجن",
   "lat": 36.660905,
   "lng": 4.15161
  },
  {
   "name": "Timizart",
   "ar": "تيميزارت",
   "lat": 36.794092,
   "lng": 4.244943
  },
  {
   "name": "Makouda",
   "ar": "ماكودة",
   "lat": 36.791453,
   "lng": 4.06332
  },
  {
   "name": "Draa El Mizan",
   "ar": "ذراع الميزان",
   "lat": 36.53572,
   "lng": 3.836436
  },
  {
   "name": "Tizi Ghenif",
   "ar": "تيزي غنيف",
   "lat": 36.588314,
   "lng": 3.773715
  },
  {
   "name": "Bounouh",
   "ar": "بونوح",
   "lat": 36.499399,
   "lng": 3.936398
  },
  {
   "name": "Ait Chafaa",
   "ar": "آيت شفعة",
   "lat": 36.819092,
   "lng": 4.532436
  },
  {
   "name": "Frikat",
   "ar": "فريقات",
   "lat": 36.511584,
   "lng": 3.885073
  },
  {
   "name": "Beni Aissi",
   "ar": "بني عيسي",
   "lat": 36.663628,
   "lng": 4.084879
  },
  {
   "name": "Beni Zmenzer",
   "ar": "أيت زمنزر",
   "lat": 36.633071,
   "lng": 4.040829
  },
  {
   "name": "Iferhounene",
   "ar": "إيفرحونن",
   "lat": 36.533584,
   "lng": 4.370673
  },
  {
   "name": "Azazga",
   "ar": "عزازقة",
   "lat": 36.745395,
   "lng": 4.3714
  },
  {
   "name": "Illoula Oumalou",
   "ar": "إيلولة أمالو",
   "lat": 36.580803,
   "lng": 4.442785
  },
  {
   "name": "Yakourene",
   "ar": "اعكورن",
   "lat": 36.734577,
   "lng": 4.438983
  },
  {
   "name": "Larba Nath Irathen",
   "ar": "الأربعاء نايت إيراثن",
   "lat": 36.638868,
   "lng": 4.203158
  },
  {
   "name": "Tizi Rached",
   "ar": "تيزي راشد",
   "lat": 36.678519,
   "lng": 4.208034
  },
  {
   "name": "Zekri",
   "ar": "زكري",
   "lat": 36.782356,
   "lng": 4.589342
  },
  {
   "name": "Ouaguenoune",
   "ar": "واقنون",
   "lat": 36.770175,
   "lng": 4.175015
  },
  {
   "name": "Ain Zaouia",
   "ar": "عين الزاوية",
   "lat": 36.553183,
   "lng": 3.895407
  },
  {
   "name": "M'kira",
   "ar": "مكيرة",
   "lat": 36.625311,
   "lng": 3.792719
  },
  {
   "name": "Ait Yahia",
   "ar": "أيت يحي",
   "lat": 36.578542,
   "lng": 4.327022
  },
  {
   "name": "Ait Mahmoud",
   "ar": "أيت محمود",
   "lat": 36.608599,
   "lng": 4.112472
  },
  {
   "name": "Maatkas",
   "ar": "المعاتقة",
   "lat": 36.604794,
   "lng": 3.984369
  },
  {
   "name": "Ait Boumehdi",
   "ar": "آيت بومھدى",
   "lat": 36.501857,
   "lng": 4.200091
  },
  {
   "name": "Abi Youcef",
   "ar": "أبي يوسف",
   "lat": 36.537061,
   "lng": 4.344536
  },
  {
   "name": "Beni Douala",
   "ar": "بني دوالة",
   "lat": 36.620871,
   "lng": 4.081758
  },
  {
   "name": "Illilten",
   "ar": "إليلتن",
   "lat": 36.515124,
   "lng": 4.394267
  },
  {
   "name": "Bouzeguene",
   "ar": "بوزقن",
   "lat": 36.617695,
   "lng": 4.476776
  },
  {
   "name": "Ait Aggouacha",
   "ar": "أيت أقواشة",
   "lat": 36.617158,
   "lng": 4.232723
  },
  {
   "name": "Ouadhias",
   "ar": "واضية",
   "lat": 36.556,
   "lng": 4.088293
  },
  {
   "name": "Azeffoun",
   "ar": "أزفون",
   "lat": 36.888918,
   "lng": 4.422162
  },
  {
   "name": "Tigzirt",
   "ar": "تقزيرت",
   "lat": 36.89192,
   "lng": 4.129222
  },
  {
   "name": "Djebel Aissa Mimoun",
   "ar": "آيت عيسى ميمون",
   "lat": 36.750937,
   "lng": 4.130381
  },
  {
   "name": "Boghni",
   "ar": "بوغني",
   "lat": 36.53293,
   "lng": 3.961114
  },
  {
   "name": "Ifigha",
   "ar": "ايفيغاء",
   "lat": 36.670897,
   "lng": 4.409858
  },
  {
   "name": "Ait Oumalou",
   "ar": "آيت أومالو",
   "lat": 36.644179,
   "lng": 4.218712
  },
  {
   "name": "Tirmitine",
   "ar": "ترمتين",
   "lat": 36.675431,
   "lng": 3.958709
  },
  {
   "name": "Akerrou",
   "ar": "أقرو",
   "lat": 36.818668,
   "lng": 4.445355
  },
  {
   "name": "Yatafene",
   "ar": "يطافن",
   "lat": 36.528879,
   "lng": 4.280915
  },
  {
   "name": "Beni Zikki",
   "ar": "بنى زيكى",
   "lat": 36.564021,
   "lng": 4.505047
  },
  {
   "name": "Draa Ben Khedda",
   "ar": "ذراع بن خدة",
   "lat": 36.729257,
   "lng": 3.966937
  },
  {
   "name": "Ouacif",
   "ar": "واسيف",
   "lat": 36.52424,
   "lng": 4.204923
  },
  {
   "name": "Idjeur",
   "ar": "آجر",
   "lat": 36.666103,
   "lng": 4.520468
  },
  {
   "name": "Mekla",
   "ar": "مقلع",
   "lat": 36.687128,
   "lng": 4.266922
  },
  {
   "name": "Tizi N'tleta",
   "ar": "تيزي نثلاثة",
   "lat": 36.575496,
   "lng": 4.037288
  },
  {
   "name": "Beni Yenni",
   "ar": "بني يني",
   "lat": 36.583014,
   "lng": 4.1955
  },
  {
   "name": "Aghribs",
   "ar": "أغريب",
   "lat": 36.809455,
   "lng": 4.318016
  },
  {
   "name": "Iflissen",
   "ar": "إفليسن",
   "lat": 36.863441,
   "lng": 4.220275
  },
  {
   "name": "Boudjima",
   "ar": "بوجيمة",
   "lat": 36.814624,
   "lng": 4.159721
  },
  {
   "name": "Ait Yahia Moussa",
   "ar": "أيت يحي موسى",
   "lat": 36.658795,
   "lng": 3.887476
  },
  {
   "name": "Souk El Thenine",
   "ar": "سوق الإثنين",
   "lat": 36.59444,
   "lng": 4.008571
  },
  {
   "name": "Ait Khellili",
   "ar": "أيت خليلي",
   "lat": 36.658071,
   "lng": 4.307427
  },
  {
   "name": "Sidi Naamane",
   "ar": "سيدي نعمان",
   "lat": 36.758688,
   "lng": 3.981479
  },
  {
   "name": "Iboudrarene",
   "ar": "أبودرارن",
   "lat": 36.502397,
   "lng": 4.249612
  },
  {
   "name": "Agouni Gueghrane",
   "ar": "آقنى قغران",
   "lat": 36.5152,
   "lng": 4.115385
  },
  {
   "name": "Mizrana",
   "ar": "مزرانة",
   "lat": 36.845721,
   "lng": 4.09645
  },
  {
   "name": "Imsouhal",
   "ar": "إمسوحال",
   "lat": 36.569262,
   "lng": 4.38797
  },
  {
   "name": "Tadmait",
   "ar": "تادمايت",
   "lat": 36.74325,
   "lng": 3.901043
  },
  {
   "name": "Ait Bouaddou",
   "ar": "أيت بوعدو",
   "lat": 36.508073,
   "lng": 4.058279
  },
  {
   "name": "Assi Youcef",
   "ar": "أسي يوسف",
   "lat": 36.506631,
   "lng": 4.013773
  },
  {
   "name": "Ait Toudert",
   "ar": "أيت تودرت",
   "lat": 36.507295,
   "lng": 4.17968
  }
 ],
 "11": [
  {
   "name": "Tamanrasset",
   "ar": "تمنراست",
   "lat": 22.790297,
   "lng": 5.519327
  },
  {
   "name": "Abalessa",
   "ar": "أبلسة",
   "lat": 22.889787,
   "lng": 4.847726
  },
  {
   "name": "Idles",
   "ar": "إدلس",
   "lat": 23.817397,
   "lng": 5.934366
  },
  {
   "name": "Tazrouk",
   "ar": "تاظروك",
   "lat": 22.790297,
   "lng": 5.519327
  },
  {
   "name": "Ain Amguel",
   "ar": "ان أمقل",
   "lat": 24.936805,
   "lng": 4.03415
  }
 ],
 "53": [
  {
   "name": "In Ghar",
   "ar": "عـيـن غــار",
   "lat": 27.103059,
   "lng": 1.904122
  },
  {
   "name": "In Salah",
   "ar": "عين صالح",
   "lat": 27.202631,
   "lng": 2.487849
  },
  {
   "name": "Foggaret Azzaouia",
   "ar": "فقارة الزوى",
   "lat": 27.361182,
   "lng": 2.847621
  }
 ],
 "54": [
  {
   "name": "In Guezzam",
   "ar": "عين قزام",
   "lat": 19.563226,
   "lng": 5.771795
  },
  {
   "name": "Tin Zouatine",
   "ar": "تين زاوتين",
   "lat": 20.433338,
   "lng": 2.098864
  }
 ],
 "12": [
  {
   "name": "Tebessa",
   "ar": "تبسة",
   "lat": 35.40108,
   "lng": 8.117296
  },
  {
   "name": "Bir El Ater",
   "ar": "بئر العاتر",
   "lat": 34.749839,
   "lng": 8.057753
  },
  {
   "name": "Cheria",
   "ar": "الــشــريــعـة",
   "lat": 35.27095,
   "lng": 7.751293
  },
  {
   "name": "Stah Guentis",
   "ar": "سطح قنطيس",
   "lat": 34.999651,
   "lng": 7.307302
  },
  {
   "name": "El Aouinet",
   "ar": "العوينات",
   "lat": 35.86805,
   "lng": 7.88617
  },
  {
   "name": "El Houidjbet",
   "ar": "الحويجبات",
   "lat": 35.29259,
   "lng": 8.280367
  },
  {
   "name": "Saf Saf El Ouesra",
   "ar": "صفصاف الوسرة",
   "lat": 34.955858,
   "lng": 8.207819
  },
  {
   "name": "Hammamet",
   "ar": "الحمامات",
   "lat": 35.449191,
   "lng": 7.950278
  },
  {
   "name": "Negrine",
   "ar": "نقرين",
   "lat": 34.48478,
   "lng": 7.520411
  },
  {
   "name": "Bir Mokkadem",
   "ar": "بــئــر مــقـدم",
   "lat": 35.372556,
   "lng": 7.805502
  },
  {
   "name": "El Kouif",
   "ar": "الكويف",
   "lat": 35.48081,
   "lng": 8.243175
  },
  {
   "name": "Morssot",
   "ar": "مرسط",
   "lat": 35.667541,
   "lng": 8.011332
  },
  {
   "name": "El Ogla",
   "ar": "العقلة",
   "lat": 35.188506,
   "lng": 7.464919
  },
  {
   "name": "Bir Dheheb",
   "ar": "بٔير الذھب",
   "lat": 35.524939,
   "lng": 7.937854
  },
  {
   "name": "El Ogla",
   "ar": "العقلة",
   "lat": 35.188506,
   "lng": 7.464919
  },
  {
   "name": "Guorriguer",
   "ar": "قوريقر",
   "lat": 35.129069,
   "lng": 7.959286
  },
  {
   "name": "Bekkaria",
   "ar": "بكارية",
   "lat": 35.373738,
   "lng": 8.242137
  },
  {
   "name": "Boukhadra",
   "ar": "بوخضرة",
   "lat": 35.801824,
   "lng": 8.056682
  },
  {
   "name": "Ouenza",
   "ar": "الونزة",
   "lat": 35.951835,
   "lng": 8.132528
  },
  {
   "name": "El Malabiod",
   "ar": "الماء الأبيض",
   "lat": 35.268861,
   "lng": 8.155707
  },
  {
   "name": "Oum Ali",
   "ar": "أم على",
   "lat": 35.009818,
   "lng": 8.302429
  },
  {
   "name": "Telidjen",
   "ar": "ثليجان",
   "lat": 35.118621,
   "lng": 7.767845
  },
  {
   "name": "Ain Zerga",
   "ar": "عين الزرقاء",
   "lat": 35.648499,
   "lng": 8.258932
  },
  {
   "name": "El Meridj",
   "ar": "المريج",
   "lat": 35.796206,
   "lng": 8.229932
  },
  {
   "name": "Boulhaf Dyr",
   "ar": "بولحاف الدير",
   "lat": 35.488653,
   "lng": 8.078132
  },
  {
   "name": "Bedjene",
   "ar": "بجن",
   "lat": 35.349744,
   "lng": 7.473937
  },
  {
   "name": "El Mezeraa",
   "ar": "المزرعة",
   "lat": 35.168056,
   "lng": 7.641389
  },
  {
   "name": "Ferkane",
   "ar": "فـــــــركـــــان",
   "lat": 34.555137,
   "lng": 7.41152
  }
 ],
 "13": [
  {
   "name": "Tlemcen",
   "ar": "تلمسان",
   "lat": 34.882886,
   "lng": -1.316682
  },
  {
   "name": "Beni Mester",
   "ar": "بني مستار",
   "lat": 34.866303,
   "lng": -1.421446
  },
  {
   "name": "Ain Tallout",
   "ar": "عين تالوت",
   "lat": 34.926913,
   "lng": -0.963154
  },
  {
   "name": "Remchi",
   "ar": "الرمشي",
   "lat": 35.064069,
   "lng": -1.42638
  },
  {
   "name": "El Fehoul",
   "ar": "الفحول",
   "lat": 35.117844,
   "lng": -1.290726
  },
  {
   "name": "Sabra",
   "ar": "صبرة",
   "lat": 34.827903,
   "lng": -1.529165
  },
  {
   "name": "Ghazaouet",
   "ar": "الغزوات",
   "lat": 35.093654,
   "lng": -1.861861
  },
  {
   "name": "Souani",
   "ar": "السواني",
   "lat": 34.920927,
   "lng": -1.913909
  },
  {
   "name": "Djebala",
   "ar": "جبالة",
   "lat": 34.974347,
   "lng": -1.79276
  },
  {
   "name": "El Gor",
   "ar": "الغور",
   "lat": 34.637887,
   "lng": -1.156964
  },
  {
   "name": "Oued Chouly",
   "ar": "وادى الشولى",
   "lat": 34.835213,
   "lng": -1.179004
  },
  {
   "name": "Ain Fezza",
   "ar": "عين فزّة",
   "lat": 34.878772,
   "lng": -1.235701
  },
  {
   "name": "Ouled Mimoun",
   "ar": "أولاد ميمون",
   "lat": 34.904412,
   "lng": -1.034236
  },
  {
   "name": "Amieur",
   "ar": "عمير",
   "lat": 35.030819,
   "lng": -1.239276
  },
  {
   "name": "Ain Youcef",
   "ar": "عين يوسف",
   "lat": 35.048382,
   "lng": -1.375591
  },
  {
   "name": "Zenata",
   "ar": "زناتة",
   "lat": 34.984644,
   "lng": -1.459178
  },
  {
   "name": "Beni Snous",
   "ar": "بنى سنوس",
   "lat": 34.663369,
   "lng": -1.539483
  },
  {
   "name": "Bab El Assa",
   "ar": "باب العسة",
   "lat": 34.965196,
   "lng": -2.031245
  },
  {
   "name": "Dar Yaghmouracene",
   "ar": "دار يغمراسن",
   "lat": 35.100478,
   "lng": -1.800573
  },
  {
   "name": "Fellaoucene",
   "ar": "فلاوسن",
   "lat": 35.034844,
   "lng": -1.599145
  },
  {
   "name": "Azails",
   "ar": "العزايل",
   "lat": 34.680599,
   "lng": -1.476484
  },
  {
   "name": "Sebbaa Chioukh",
   "ar": "سبعة شيوخ",
   "lat": 35.155072,
   "lng": -1.357568
  },
  {
   "name": "Terny Beni Hediel",
   "ar": "تيرني بني هديل",
   "lat": 34.795302,
   "lng": -1.354569
  },
  {
   "name": "Bensekrane",
   "ar": "بن سكران",
   "lat": 35.071876,
   "lng": -1.228173
  },
  {
   "name": "Ain Nehala",
   "ar": "عين نحالة",
   "lat": 35.027687,
   "lng": -0.931314
  },
  {
   "name": "Hennaya",
   "ar": "الحناية",
   "lat": 34.95231,
   "lng": -1.372365
  },
  {
   "name": "Maghnia",
   "ar": "مغنية",
   "lat": 34.84866,
   "lng": -1.729354
  },
  {
   "name": "Hammam Boughrara",
   "ar": "حمام بوغرارة",
   "lat": 34.89152,
   "lng": -1.646105
  },
  {
   "name": "Souahlia",
   "ar": "تونان",
   "lat": 35.040866,
   "lng": -1.891295
  },
  {
   "name": "Msirda Fouaga",
   "ar": "مسيردة الفواقة",
   "lat": 35.013981,
   "lng": -2.058855
  },
  {
   "name": "Ain Fettah",
   "ar": "عين فتاح",
   "lat": 34.965894,
   "lng": -1.637887
  },
  {
   "name": "El Aricha",
   "ar": "العريشة",
   "lat": 34.481044,
   "lng": -1.264773
  },
  {
   "name": "Souk Tleta",
   "ar": "سوق الثلاثاء",
   "lat": 35.022977,
   "lng": -1.998249
  },
  {
   "name": "Sidi Abdelli",
   "ar": "سيدي العبدلي",
   "lat": 35.060921,
   "lng": -1.131893
  },
  {
   "name": "Sebdou",
   "ar": "سبدو",
   "lat": 34.637665,
   "lng": -1.332968
  },
  {
   "name": "Beni Ouarsous",
   "ar": "برج عريمة",
   "lat": 35.083383,
   "lng": -1.557618
  },
  {
   "name": "Sidi Medjahed",
   "ar": "سيدي مجاهد",
   "lat": 34.773819,
   "lng": -1.667193
  },
  {
   "name": "Beni Boussaid",
   "ar": "بني بوسعيد",
   "lat": 34.648701,
   "lng": -1.753041
  },
  {
   "name": "Marsa Ben M'hidi",
   "ar": "مرسى بن مھيدي",
   "lat": 35.053138,
   "lng": -2.135204
  },
  {
   "name": "Nedroma",
   "ar": "ندرومة",
   "lat": 35.029292,
   "lng": -1.766694
  },
  {
   "name": "Sidi Djilali",
   "ar": "سيدي الجيلالي",
   "lat": 34.447107,
   "lng": -1.568986
  },
  {
   "name": "Beni Bahdel",
   "ar": "بني بهدل",
   "lat": 34.692884,
   "lng": -1.520411
  },
  {
   "name": "Bouihi",
   "ar": "البويھي",
   "lat": 34.415148,
   "lng": -1.687838
  },
  {
   "name": "Honaine",
   "ar": "هنين",
   "lat": 35.154113,
   "lng": -1.673231
  },
  {
   "name": "Tianet",
   "ar": "تيانت",
   "lat": 35.050851,
   "lng": -1.838654
  },
  {
   "name": "Ouled Riyah",
   "ar": "أولاد رياح",
   "lat": 34.960385,
   "lng": -1.497892
  },
  {
   "name": "Bouhlou",
   "ar": "بوحلو",
   "lat": 34.778822,
   "lng": -1.578152
  },
  {
   "name": "Ain Ghoraba",
   "ar": "عين غرابة",
   "lat": 34.716734,
   "lng": -1.389918
  },
  {
   "name": "Chetouane",
   "ar": "شتوان",
   "lat": 34.923912,
   "lng": -1.299604
  },
  {
   "name": "Mansourah",
   "ar": "المنصورة",
   "lat": 32.023733,
   "lng": 2.780149
  },
  {
   "name": "Beni Mester",
   "ar": "بني مستار",
   "lat": 34.81844,
   "lng": -1.026132
  },
  {
   "name": "Ain Kebira",
   "ar": "عين الكبيرة",
   "lat": 35.030692,
   "lng": -1.676236
  }
 ],
 "14": [
  {
   "name": "Tiaret",
   "ar": "تيارت‎",
   "lat": 35.370869,
   "lng": 1.321785
  },
  {
   "name": "Medroussa",
   "ar": "مدروسة",
   "lat": 35.188708,
   "lng": 1.149912
  },
  {
   "name": "Ain Bouchekif",
   "ar": "بوشقيف",
   "lat": 35.356054,
   "lng": 1.508446
  },
  {
   "name": "Sidi Ali Mellal",
   "ar": "سيدي علي ملال",
   "lat": 35.564543,
   "lng": 1.225204
  },
  {
   "name": "Ain Zarit",
   "ar": "عين زاريت",
   "lat": 35.353239,
   "lng": 1.669343
  },
  {
   "name": "Ain Deheb",
   "ar": "عين الذهب",
   "lat": 34.847127,
   "lng": 1.545077
  },
  {
   "name": "Sidi Bakhti",
   "ar": "سيدي بختي",
   "lat": 35.24166,
   "lng": 0.97836
  },
  {
   "name": "Medrissa",
   "ar": "مدريسة",
   "lat": 34.895036,
   "lng": 1.247432
  },
  {
   "name": "Zmalet El Emir Abdelkade",
   "ar": "زمالة الأمير عبد القادر",
   "lat": 34.8968,
   "lng": 2.309013
  },
  {
   "name": "Madna",
   "ar": "مادنة",
   "lat": 34.755028,
   "lng": 0.983692
  },
  {
   "name": "Sebt",
   "ar": "السبت",
   "lat": 35.619531,
   "lng": 1.35147
  },
  {
   "name": "Mellakou",
   "ar": "ملاكو",
   "lat": 35.253224,
   "lng": 1.235001
  },
  {
   "name": "Dahmouni",
   "ar": "دحموني",
   "lat": 35.416323,
   "lng": 1.426561
  },
  {
   "name": "Rahouia",
   "ar": "رحوية",
   "lat": 35.537098,
   "lng": 1.02642
  },
  {
   "name": "Mahdia",
   "ar": "المھدية",
   "lat": 35.429752,
   "lng": 1.755142
  },
  {
   "name": "Sougueur",
   "ar": "سوقر",
   "lat": 35.185742,
   "lng": 1.493503
  },
  {
   "name": "Si Abdelghani",
   "ar": "سي عبد الغنى",
   "lat": 35.23058,
   "lng": 1.633801
  },
  {
   "name": "Ain El Hadid",
   "ar": "عين الحديد",
   "lat": 35.05783,
   "lng": 0.88945
  },
  {
   "name": "Naima",
   "ar": "نعيمة",
   "lat": 35.047941,
   "lng": 1.489156
  },
  {
   "name": "Meghila",
   "ar": "مغيلة",
   "lat": 35.597131,
   "lng": 1.417392
  },
  {
   "name": "Guertoufa",
   "ar": "قرطوفة",
   "lat": 35.390936,
   "lng": 1.255124
  },
  {
   "name": "Sidi Hosni",
   "ar": "سيدي حسني",
   "lat": 35.471859,
   "lng": 1.519959
  },
  {
   "name": "Djillali Ben Amar",
   "ar": "جيلالي بن عمار",
   "lat": 35.430871,
   "lng": 0.87111
  },
  {
   "name": "Sebaine",
   "ar": "سبعين",
   "lat": 35.456666,
   "lng": 1.60367
  },
  {
   "name": "Tousnina",
   "ar": "توسنينة",
   "lat": 35.11523,
   "lng": 1.310377
  },
  {
   "name": "Frenda",
   "ar": "فرندة",
   "lat": 35.063842,
   "lng": 1.057207
  },
  {
   "name": "Ain Kermes",
   "ar": "عين كرمس",
   "lat": 34.908577,
   "lng": 1.109327
  },
  {
   "name": "Ksar Chellala",
   "ar": "قصر الشلالة",
   "lat": 35.218107,
   "lng": 2.315358
  },
  {
   "name": "Rechaiga",
   "ar": "الرشايقة",
   "lat": 35.40764,
   "lng": 1.971573
  },
  {
   "name": "Nadorah",
   "ar": "ملاكو",
   "lat": 35.291316,
   "lng": 1.886671
  },
  {
   "name": "Tagdemt",
   "ar": "تاقدمت",
   "lat": 35.334967,
   "lng": 1.229201
  },
  {
   "name": "Oued Lilli",
   "ar": "وادى ليلى",
   "lat": 35.51208,
   "lng": 1.270429
  },
  {
   "name": "Mechraa Safa",
   "ar": "مشرع الصفاء",
   "lat": 35.384327,
   "lng": 1.055342
  },
  {
   "name": "Hamadia",
   "ar": "الحمادية",
   "lat": 35.459099,
   "lng": 1.872781
  },
  {
   "name": "Chehaima",
   "ar": "شحيمة",
   "lat": 34.899466,
   "lng": 1.302634
  },
  {
   "name": "Takhemaret",
   "ar": "تاخمرت",
   "lat": 35.108999,
   "lng": 0.68599
  },
  {
   "name": "Serghine",
   "ar": "سرغين",
   "lat": 35.253364,
   "lng": 2.485328
  },
  {
   "name": "Faidja",
   "ar": "الفايجة",
   "lat": 34.973097,
   "lng": 1.764428
  },
  {
   "name": "Tidda",
   "ar": "تيدة",
   "lat": 35.582042,
   "lng": 1.268434
  }
 ],
 "16": [
  {
   "name": "Alger Centre",
   "ar": "الجزائر الوسطى",
   "lat": 36.771225,
   "lng": 3.061224
  },
  {
   "name": "Sidi M'hamed",
   "ar": "سيدي امحمد",
   "lat": 36.761654,
   "lng": 3.056515
  },
  {
   "name": "El Madania",
   "ar": "المدنية",
   "lat": 36.741972,
   "lng": 3.066658
  },
  {
   "name": "Mohamed Belouzdad",
   "ar": "بلوزداد",
   "lat": 36.752252,
   "lng": 3.06738
  },
  {
   "name": "Bab El Oued",
   "ar": "باب الواد",
   "lat": 36.794384,
   "lng": 3.052363
  },
  {
   "name": "Bologhine Ibnou Ziri",
   "ar": "بولوغين",
   "lat": 36.802194,
   "lng": 3.036236
  },
  {
   "name": "Casbah",
   "ar": "القصبة",
   "lat": 36.784893,
   "lng": 3.061196
  },
  {
   "name": "Oued Koriche",
   "ar": "وادي قريش",
   "lat": 36.7816,
   "lng": 3.044105
  },
  {
   "name": "Bir Mourad Rais",
   "ar": "بير مراد رايس",
   "lat": 36.732355,
   "lng": 3.049761
  },
  {
   "name": "El Biar",
   "ar": "الآبيار",
   "lat": 36.769485,
   "lng": 3.03099
  },
  {
   "name": "Bouzareah",
   "ar": "بوزريعة",
   "lat": 36.790436,
   "lng": 3.017321
  },
  {
   "name": "Birkhadem",
   "ar": "بئر خادم",
   "lat": 36.716068,
   "lng": 3.04967
  },
  {
   "name": "El Harrach",
   "ar": "الحراش",
   "lat": 36.720967,
   "lng": 3.137663
  },
  {
   "name": "Baraki",
   "ar": "براقي",
   "lat": 36.66857,
   "lng": 3.102558
  },
  {
   "name": "Oued Smar",
   "ar": "وادي سمار",
   "lat": 36.707128,
   "lng": 3.165056
  },
  {
   "name": "Bourouba",
   "ar": "بوروبة",
   "lat": 36.713832,
   "lng": 3.112563
  },
  {
   "name": "Hussein Dey",
   "ar": "حسين داي",
   "lat": 36.740617,
   "lng": 3.096192
  },
  {
   "name": "Kouba",
   "ar": "القبة",
   "lat": 36.732213,
   "lng": 3.084495
  },
  {
   "name": "Bachedjerah",
   "ar": "باش جراح",
   "lat": 36.724483,
   "lng": 3.116742
  },
  {
   "name": "Dar El Beida",
   "ar": "الدار البيضاء",
   "lat": 36.718476,
   "lng": 3.20987
  },
  {
   "name": "Bab Ezzouar",
   "ar": "باب الزوار",
   "lat": 36.722018,
   "lng": 3.185681
  },
  {
   "name": "Ben Aknoun",
   "ar": "بن عكنون",
   "lat": 36.75977,
   "lng": 3.013834
  },
  {
   "name": "Dely Ibrahim",
   "ar": "دالي ابراهيم",
   "lat": 36.760322,
   "lng": 2.988004
  },
  {
   "name": "Bains Romains",
   "ar": "الحمامات",
   "lat": 36.812,
   "lng": 2.973782
  },
  {
   "name": "Rais Hamidou",
   "ar": "الرايس حميدو",
   "lat": 36.817456,
   "lng": 3.011442
  },
  {
   "name": "Djasr Kasentina",
   "ar": "جسر قسنطينة",
   "lat": 36.697255,
   "lng": 3.074719
  },
  {
   "name": "El Mouradia",
   "ar": "المرادية",
   "lat": 36.753569,
   "lng": 3.042518
  },
  {
   "name": "Hydra",
   "ar": "حيدرة",
   "lat": 36.744912,
   "lng": 3.028874
  },
  {
   "name": "Mohammadia",
   "ar": "المحمدية",
   "lat": 36.729573,
   "lng": 3.157156
  },
  {
   "name": "Bordj El Kiffan",
   "ar": "برج الكيفان",
   "lat": 36.761161,
   "lng": 3.232259
  },
  {
   "name": "El Magharia",
   "ar": "المقرية",
   "lat": 36.730423,
   "lng": 3.110024
  },
  {
   "name": "Beni Messous",
   "ar": "بني مسوس",
   "lat": 36.779436,
   "lng": 2.977396
  },
  {
   "name": "Les Eucalyptus",
   "ar": "الكليتوس",
   "lat": 36.663792,
   "lng": 3.150732
  },
  {
   "name": "Bir Touta",
   "ar": "بئر توتة",
   "lat": 36.642948,
   "lng": 2.992909
  },
  {
   "name": "Tessala El Merdja",
   "ar": "تسالة المرجة",
   "lat": 36.630713,
   "lng": 2.945631
  },
  {
   "name": "Ouled Chebel",
   "ar": "أولاد الشبل",
   "lat": 36.592387,
   "lng": 2.989766
  },
  {
   "name": "Sidi Moussa",
   "ar": "سيدي موسى",
   "lat": 36.616579,
   "lng": 3.103211
  },
  {
   "name": "Ain Taya",
   "ar": "عين طاية",
   "lat": 36.792946,
   "lng": 3.288245
  },
  {
   "name": "Bordj El Bahri",
   "ar": "برج البحري",
   "lat": 36.787361,
   "lng": 3.237683
  },
  {
   "name": "El Merssa",
   "ar": "المرسى",
   "lat": 36.805908,
   "lng": 3.237279
  },
  {
   "name": "Herraoua",
   "ar": "هراوة",
   "lat": 36.771637,
   "lng": 3.313548
  },
  {
   "name": "Rouiba",
   "ar": "رويبة",
   "lat": 36.735893,
   "lng": 3.277988
  },
  {
   "name": "Reghaia",
   "ar": "الرغاية",
   "lat": 36.738664,
   "lng": 3.34255
  },
  {
   "name": "Ain Benian",
   "ar": "عين بنيان",
   "lat": 36.800402,
   "lng": 2.918143
  },
  {
   "name": "Setaouali",
   "ar": "سطاوالي",
   "lat": 36.753249,
   "lng": 2.888129
  },
  {
   "name": "Zeralda",
   "ar": "زرالدة",
   "lat": 36.713746,
   "lng": 2.844996
  },
  {
   "name": "Maalma",
   "ar": "محالمة",
   "lat": 36.687089,
   "lng": 2.874728
  },
  {
   "name": "Rahmania",
   "ar": "رحمانية",
   "lat": 36.681234,
   "lng": 2.906456
  },
  {
   "name": "Souidania",
   "ar": "سويدانية",
   "lat": 36.708552,
   "lng": 2.911912
  },
  {
   "name": "Cheraga",
   "ar": "شراقة",
   "lat": 36.766854,
   "lng": 2.960201
  },
  {
   "name": "Ouled Fayet",
   "ar": "أولاد فايت",
   "lat": 36.734002,
   "lng": 2.93398
  },
  {
   "name": "El Achour",
   "ar": "العاشور",
   "lat": 36.738133,
   "lng": 2.986826
  },
  {
   "name": "Draria",
   "ar": "درارية",
   "lat": 36.720057,
   "lng": 2.995111
  },
  {
   "name": "Douira",
   "ar": "دويرة",
   "lat": 36.672213,
   "lng": 2.943728
  },
  {
   "name": "Baba Hesen",
   "ar": "بابا حسن",
   "lat": 36.694293,
   "lng": 2.973318
  },
  {
   "name": "Kheraisia",
   "ar": "خرايسية",
   "lat": 36.667911,
   "lng": 2.998277
  },
  {
   "name": "Sehaoula",
   "ar": "السحاولة",
   "lat": 36.703247,
   "lng": 3.024264
  }
 ],
 "18": [
  {
   "name": "Jijel",
   "ar": "جيجل",
   "lat": 36.821014,
   "lng": 5.763413
  },
  {
   "name": "Erraguene",
   "ar": "إراڨن",
   "lat": 36.587297,
   "lng": 5.583227
  },
  {
   "name": "El Aouana",
   "ar": "العوانة",
   "lat": 36.772611,
   "lng": 5.607862
  },
  {
   "name": "Ziama Mansouria",
   "ar": "زيامة منصورية",
   "lat": 36.661164,
   "lng": 5.438632
  },
  {
   "name": "Taher",
   "ar": "الطاهير",
   "lat": 36.770079,
   "lng": 5.897815
  },
  {
   "name": "Emir Abdelkader",
   "ar": "الامير عبد القادر",
   "lat": 36.752784,
   "lng": 5.843265
  },
  {
   "name": "Chekfa",
   "ar": "الشقفة",
   "lat": 36.770568,
   "lng": 5.962163
  },
  {
   "name": "Chahna",
   "ar": "الشحنة",
   "lat": 36.672665,
   "lng": 5.953162
  },
  {
   "name": "El Milia",
   "ar": "الميلية",
   "lat": 36.753121,
   "lng": 6.267673
  },
  {
   "name": "Sidi Marouf",
   "ar": "سيدي معروف",
   "lat": 36.640036,
   "lng": 6.27426
  },
  {
   "name": "Settara",
   "ar": "السطارة",
   "lat": 36.719732,
   "lng": 6.335837
  },
  {
   "name": "El Ancer",
   "ar": "العنصر",
   "lat": 36.800052,
   "lng": 6.156704
  },
  {
   "name": "Sidi Abdelaziz",
   "ar": "سيدي عبد العزيز",
   "lat": 36.857264,
   "lng": 6.059574
  },
  {
   "name": "Kouas",
   "ar": "قاوس",
   "lat": 36.771323,
   "lng": 5.811322
  },
  {
   "name": "Ghebala",
   "ar": "غبالة",
   "lat": 36.628297,
   "lng": 6.388185
  },
  {
   "name": "Bouraoui Belhadef",
   "ar": "بوراوي بلهادف",
   "lat": 36.700359,
   "lng": 6.101997
  },
  {
   "name": "Djimla",
   "ar": "جيملة",
   "lat": 36.801098,
   "lng": 5.751657
  },
  {
   "name": "Selma Benziada",
   "ar": "سلمى بن زيادة",
   "lat": 36.616806,
   "lng": 5.657364
  },
  {
   "name": "Boussif Ouled Askeur",
   "ar": "أولاد عسكر",
   "lat": 36.6456,
   "lng": 6.017675
  },
  {
   "name": "El Kennar Nouchfi",
   "ar": "القنار",
   "lat": 36.827145,
   "lng": 5.970757
  },
  {
   "name": "Ouled Yahia Khadrouch",
   "ar": "اولاد يحيى",
   "lat": 36.711108,
   "lng": 6.200596
  },
  {
   "name": "Boudria Beniyadjis",
   "ar": "بودريعة بن ياجيس",
   "lat": 36.598915,
   "lng": 5.808556
  },
  {
   "name": "Khiri Oued Adjoul",
   "ar": "بني بلعيد",
   "lat": 36.882351,
   "lng": 6.134187
  },
  {
   "name": "Texena",
   "ar": "تاكسنة",
   "lat": 36.659857,
   "lng": 5.788704
  },
  {
   "name": "Djemaa Beni Habibi",
   "ar": "الجمعة بني حبيبي",
   "lat": 36.809406,
   "lng": 6.125838
  },
  {
   "name": "Bordj Tahar",
   "ar": "برج الطهر",
   "lat": 36.748769,
   "lng": 6.0317
  },
  {
   "name": "Ouled Rabah",
   "ar": "ولاد رابح",
   "lat": 36.604801,
   "lng": 6.185264
  },
  {
   "name": "Oudjana",
   "ar": "وجانة",
   "lat": 36.712888,
   "lng": 5.89591
  }
 ],
 "19": [
  {
   "name": "Setif",
   "ar": "سطيف‎",
   "lat": 36.189759,
   "lng": 5.410798
  },
  {
   "name": "Ain El Kebira",
   "ar": "عين الكبيرة",
   "lat": 36.369568,
   "lng": 5.507511
  },
  {
   "name": "Beni Aziz",
   "ar": "بني عزيز",
   "lat": 36.464288,
   "lng": 5.647044
  },
  {
   "name": "Ouled Si Ahmed",
   "ar": "أولاد سي أحمد",
   "lat": 36.420425,
   "lng": 5.72877
  },
  {
   "name": "Boutaleb",
   "ar": "بوطالب",
   "lat": 35.668627,
   "lng": 5.324284
  },
  {
   "name": "Ain Roua",
   "ar": "عين الروى",
   "lat": 36.333737,
   "lng": 5.181919
  },
  {
   "name": "Draa Kebila",
   "ar": "ذراع قبيلة",
   "lat": 36.436495,
   "lng": 4.996463
  },
  {
   "name": "Bir El Arch",
   "ar": "بئر العرش",
   "lat": 36.133951,
   "lng": 5.839159
  },
  {
   "name": "Beni Chebana",
   "ar": "بني شبانة",
   "lat": 36.472637,
   "lng": 4.878207
  },
  {
   "name": "Ouled Tebben",
   "ar": "أولاد تبــان",
   "lat": 35.810935,
   "lng": 5.104599
  },
  {
   "name": "Hamma",
   "ar": "حــامة",
   "lat": 35.684248,
   "lng": 5.374363
  },
  {
   "name": "Maaouia",
   "ar": "معـاويـة",
   "lat": 36.387465,
   "lng": 5.709161
  },
  {
   "name": "Ain Legradj",
   "ar": "عين لڨراج",
   "lat": 36.408619,
   "lng": 4.892304
  },
  {
   "name": "Ain Abessa",
   "ar": "عين عباسـة",
   "lat": 36.296471,
   "lng": 5.292619
  },
  {
   "name": "Dehamcha",
   "ar": "الدهامشة",
   "lat": 36.383958,
   "lng": 5.591986
  },
  {
   "name": "Babor",
   "ar": "بابور",
   "lat": 36.489801,
   "lng": 5.535168
  },
  {
   "name": "Guidjel",
   "ar": "قجــال",
   "lat": 36.118604,
   "lng": 5.530678
  },
  {
   "name": "Ain Lahdjar",
   "ar": "عين لحجـر",
   "lat": 35.93786,
   "lng": 5.536656
  },
  {
   "name": "Bousselam",
   "ar": "بوسلام",
   "lat": 36.497328,
   "lng": 5.040196
  },
  {
   "name": "El Eulma",
   "ar": "العلمة",
   "lat": 36.15051,
   "lng": 5.699946
  },
  {
   "name": "Djemila",
   "ar": "جميلـة",
   "lat": 36.34329,
   "lng": 5.74357
  },
  {
   "name": "Beni Ouartilane",
   "ar": "بني ورتيلان",
   "lat": 36.441325,
   "lng": 4.850557
  },
  {
   "name": "Rosfa",
   "ar": "الرصفة",
   "lat": 35.811933,
   "lng": 5.265868
  },
  {
   "name": "Ouled Addouane",
   "ar": "أولاد عدوان",
   "lat": 36.336301,
   "lng": 5.437843
  },
  {
   "name": "Bellaa",
   "ar": "البلاعة",
   "lat": 36.202564,
   "lng": 5.85407
  },
  {
   "name": "Ain Arnat",
   "ar": "عين أرنـات",
   "lat": 36.185058,
   "lng": 5.313721
  },
  {
   "name": "Amoucha",
   "ar": "عموشة",
   "lat": 36.387944,
   "lng": 5.411062
  },
  {
   "name": "Ain Oulmane",
   "ar": "عين ولمان",
   "lat": 35.919792,
   "lng": 5.297253
  },
  {
   "name": "Beidha Bordj",
   "ar": "بيضاء برج",
   "lat": 35.890331,
   "lng": 5.664062
  },
  {
   "name": "Bouandas",
   "ar": "بوعنداس",
   "lat": 36.510928,
   "lng": 5.111941
  },
  {
   "name": "Bazer Sakra",
   "ar": "بازر الصخرة",
   "lat": 36.11326,
   "lng": 5.6742
  },
  {
   "name": "Hamam Soukhna",
   "ar": "حمــام السخنة",
   "lat": 35.976992,
   "lng": 5.809391
  },
  {
   "name": "Mezloug",
   "ar": "مزلوق",
   "lat": 36.108406,
   "lng": 5.337274
  },
  {
   "name": "Bir Haddada",
   "ar": "بئر حدادة",
   "lat": 35.963447,
   "lng": 5.4275
  },
  {
   "name": "Serdj El Ghoul",
   "ar": "سرج الغول",
   "lat": 36.477515,
   "lng": 5.578647
  },
  {
   "name": "Harbil",
   "ar": "حربيل",
   "lat": 36.32682,
   "lng": 4.914997
  },
  {
   "name": "El Ouricia",
   "ar": "الأورسية",
   "lat": 36.283878,
   "lng": 5.409501
  },
  {
   "name": "Tizi N'bechar",
   "ar": "تيزي نبشار",
   "lat": 36.431792,
   "lng": 5.356826
  },
  {
   "name": "Salah Bey",
   "ar": "صـالح باي",
   "lat": 35.856825,
   "lng": 5.292918
  },
  {
   "name": "Ain Azel",
   "ar": "عين أزال",
   "lat": 35.820175,
   "lng": 5.510552
  },
  {
   "name": "Guenzet",
   "ar": "ڨنزات",
   "lat": 36.319315,
   "lng": 4.836773
  },
  {
   "name": "Tala Ifacene",
   "ar": "تالة إيفاسن",
   "lat": 35.95098,
   "lng": 5.737806
  },
  {
   "name": "Bougaa",
   "ar": "بوقاعـة",
   "lat": 36.333092,
   "lng": 5.089846
  },
  {
   "name": "Beni Fouda",
   "ar": "بني فودة",
   "lat": 36.285895,
   "lng": 5.608222
  },
  {
   "name": "Tachouda",
   "ar": "تاشودة",
   "lat": 36.262362,
   "lng": 5.714021
  },
  {
   "name": "Beni Mouhli",
   "ar": "إيث موحلي",
   "lat": 36.516444,
   "lng": 4.909444
  },
  {
   "name": "Ouled Sabor",
   "ar": "أولاد صـابر",
   "lat": 36.199232,
   "lng": 5.511352
  },
  {
   "name": "Guellal",
   "ar": "قلال",
   "lat": 36.034955,
   "lng": 5.338323
  },
  {
   "name": "Ain Sebt",
   "ar": "عين السبت",
   "lat": 36.485047,
   "lng": 5.711046
  },
  {
   "name": "Hammam Guergour",
   "ar": "حمام قرقور",
   "lat": 36.323501,
   "lng": 5.054946
  },
  {
   "name": "Ait Naoual Mezada",
   "ar": "آيت نوال مزادة",
   "lat": 36.545287,
   "lng": 5.083382
  },
  {
   "name": "Ksar El Abtal",
   "ar": "قصرالأبطال",
   "lat": 35.971818,
   "lng": 5.266373
  },
  {
   "name": "Beni Oussine",
   "ar": "بني حسين",
   "lat": 36.25098,
   "lng": 5.114391
  },
  {
   "name": "Ait Tizi",
   "ar": "آيت تيزي",
   "lat": 36.558505,
   "lng": 5.128274
  },
  {
   "name": "Maouaklane",
   "ar": "موكلان",
   "lat": 36.396376,
   "lng": 5.074423
  },
  {
   "name": "Guelta Zerka",
   "ar": "القلتة الزرقاء",
   "lat": 36.210378,
   "lng": 5.683744
  },
  {
   "name": "Oued El Barad",
   "ar": "واد البارد",
   "lat": 36.476742,
   "lng": 5.402586
  },
  {
   "name": "Taya",
   "ar": "طاية",
   "lat": 35.95893,
   "lng": 5.966212
  },
  {
   "name": "El Ouldja",
   "ar": "الولجـة",
   "lat": 36.078278,
   "lng": 5.913246
  },
  {
   "name": "Tella",
   "ar": "التلة",
   "lat": 36.007382,
   "lng": 5.718016
  }
 ],
 "20": [
  {
   "name": "Saida",
   "ar": "سعيدة",
   "lat": 34.841521,
   "lng": 0.145606
  },
  {
   "name": "Doui Thabet",
   "ar": "دوى ثابت",
   "lat": 36.755798,
   "lng": 3.039115
  },
  {
   "name": "Ouled Khaled",
   "ar": "أولاد خالد",
   "lat": 34.876742,
   "lng": 0.152822
  },
  {
   "name": "Moulay Larbi",
   "ar": "موالي العربي",
   "lat": 34.619269,
   "lng": 0.018656
  },
  {
   "name": "Youb",
   "ar": "يوب",
   "lat": 34.920475,
   "lng": -0.21099
  },
  {
   "name": "Hounet",
   "ar": "هونت",
   "lat": 35.053803,
   "lng": -0.213565
  },
  {
   "name": "Sidi Amar",
   "ar": "يدي عمر",
   "lat": 35.02561,
   "lng": 0.106474
  },
  {
   "name": "Sidi Boubekeur",
   "ar": "سيدي بوبكر",
   "lat": 35.030544,
   "lng": 0.053659
  },
  {
   "name": "El Hassasna",
   "ar": "حساسنة",
   "lat": 34.825828,
   "lng": 0.320849
  },
  {
   "name": "Maamora",
   "ar": "معمورة",
   "lat": 36.033522,
   "lng": 3.551315
  },
  {
   "name": "Sidi Ahmed",
   "ar": "سيدي أحمد",
   "lat": 34.551607,
   "lng": 0.262622
  },
  {
   "name": "Ain Sekhouna",
   "ar": "العين السخونة",
   "lat": 34.506912,
   "lng": 0.846784
  },
  {
   "name": "Ouled Brahim",
   "ar": "أولاد ابراھيم",
   "lat": 35.016647,
   "lng": 0.499286
  },
  {
   "name": "Tircine",
   "ar": "تيرسين",
   "lat": 34.901191,
   "lng": 0.554782
  },
  {
   "name": "Ain Soltane",
   "ar": "عين السلطان",
   "lat": 34.967626,
   "lng": 0.308571
  },
  {
   "name": "Sidi Amar",
   "ar": "سيدي عمار",
   "lat": 36.820313,
   "lng": 7.715137
  },
  {
   "name": "Ain Soltane",
   "ar": "عين السلطان",
   "lat": 36.179494,
   "lng": 7.368619
  }
 ],
 "21": [
  {
   "name": "Skikda",
   "ar": "سكيكدة",
   "lat": 36.866266,
   "lng": 6.906256
  },
  {
   "name": "Ain Zouit",
   "ar": "عين زويت",
   "lat": 36.888585,
   "lng": 6.785007
  },
  {
   "name": "El Hadaiek",
   "ar": "الحدايق",
   "lat": 36.823417,
   "lng": 6.887969
  },
  {
   "name": "Azzaba",
   "ar": "عزابة",
   "lat": 36.741103,
   "lng": 7.111663
  },
  {
   "name": "Djendel Saadi Mohamed",
   "ar": "جندل سعدي محمد",
   "lat": 36.781094,
   "lng": 7.171151
  },
  {
   "name": "Ain Charchar",
   "ar": "عين شرشار",
   "lat": 36.730785,
   "lng": 7.222791
  },
  {
   "name": "Bekkouche Lakhdar",
   "ar": "بكوش لخضر",
   "lat": 36.703155,
   "lng": 7.304122
  },
  {
   "name": "Ben Azzouz",
   "ar": "بن عزوز",
   "lat": 36.861481,
   "lng": 7.29152
  },
  {
   "name": "Es Sebt",
   "ar": "السبت",
   "lat": 36.662772,
   "lng": 7.07771
  },
  {
   "name": "Collo",
   "ar": "القل",
   "lat": 36.998161,
   "lng": 6.555717
  },
  {
   "name": "Beni Zid",
   "ar": "بنى زيد",
   "lat": 36.820386,
   "lng": 6.505396
  },
  {
   "name": "Kerkera",
   "ar": "كركرة",
   "lat": 36.932263,
   "lng": 6.578948
  },
  {
   "name": "Ouled Attia",
   "ar": "أولاد عطية",
   "lat": 36.995887,
   "lng": 6.34691
  },
  {
   "name": "Oued Zhour",
   "ar": "وادي الزهور",
   "lat": 36.924004,
   "lng": 6.315843
  },
  {
   "name": "Zitouna",
   "ar": "الزيتونة",
   "lat": 36.987201,
   "lng": 6.462504
  },
  {
   "name": "El Arrouch",
   "ar": "الحروش",
   "lat": 36.654556,
   "lng": 6.832963
  },
  {
   "name": "Zerdezas",
   "ar": "زردازة",
   "lat": 36.597061,
   "lng": 6.895203
  },
  {
   "name": "Ouled Habbeba",
   "ar": "أولاد حبابة",
   "lat": 36.498543,
   "lng": 6.957164
  },
  {
   "name": "Sidi Mezghiche",
   "ar": "سيدي مزغيش",
   "lat": 36.685869,
   "lng": 6.727042
  },
  {
   "name": "Emjez Edchich",
   "ar": "مجاز الدشيش",
   "lat": 36.704379,
   "lng": 6.806346
  },
  {
   "name": "Beni Oulbane",
   "ar": "بني والبان",
   "lat": 36.629955,
   "lng": 6.64344
  },
  {
   "name": "Ain Bouziane",
   "ar": "عين بوزيان",
   "lat": 36.595701,
   "lng": 6.748454
  },
  {
   "name": "Ramdane Djamel",
   "ar": "رمضان جمال",
   "lat": 36.754761,
   "lng": 6.896289
  },
  {
   "name": "Beni Bechir",
   "ar": "بني بشير",
   "lat": 36.80898,
   "lng": 6.961585
  },
  {
   "name": "Salah Bouchaour",
   "ar": "صالح بوالشعور",
   "lat": 36.701724,
   "lng": 6.859865
  },
  {
   "name": "Tamalous",
   "ar": "تمالوس",
   "lat": 36.838456,
   "lng": 6.642737
  },
  {
   "name": "Ain Kechera",
   "ar": "عين قشرة",
   "lat": 36.748975,
   "lng": 6.43438
  },
  {
   "name": "Oum Toub",
   "ar": "أم الطوب",
   "lat": 36.691359,
   "lng": 6.577004
  },
  {
   "name": "Bin El Ouiden",
   "ar": "بين الويدان",
   "lat": 36.809813,
   "lng": 6.56302
  },
  {
   "name": "Filfila",
   "ar": "فلفلة",
   "lat": 36.898517,
   "lng": 7.052453
  },
  {
   "name": "Cheraia",
   "ar": "الشرايع",
   "lat": 37.004109,
   "lng": 6.513526
  },
  {
   "name": "Kanoua",
   "ar": "قنواع",
   "lat": 37.037767,
   "lng": 6.405865
  },
  {
   "name": "El Ghedir",
   "ar": "الغدير",
   "lat": 36.686541,
   "lng": 6.975817
  },
  {
   "name": "Bouchetata",
   "ar": "بوشطاطة",
   "lat": 36.793988,
   "lng": 6.797126
  },
  {
   "name": "Ouldja Boulbalout",
   "ar": "الولجة بو البلوط",
   "lat": 36.784693,
   "lng": 6.37411
  },
  {
   "name": "Khenag Mayoum",
   "ar": "خنق مايوم",
   "lat": 37.008094,
   "lng": 6.284561
  },
  {
   "name": "Hamadi Krouma",
   "ar": "حمادي كرومة",
   "lat": 36.846329,
   "lng": 6.928964
  },
  {
   "name": "El Marsa",
   "ar": "المرسى",
   "lat": 37.03107,
   "lng": 7.256403
  },
  {
   "name": "Ouled Attia",
   "ar": "اولاد عتية",
   "lat": 35.147583,
   "lng": 3.690871
  }
 ],
 "23": [
  {
   "name": "Annaba",
   "ar": "عنابة",
   "lat": 36.914208,
   "lng": 7.742667
  },
  {
   "name": "Berrahel",
   "ar": "برحال",
   "lat": 36.834638,
   "lng": 7.455952
  },
  {
   "name": "El Hadjar",
   "ar": "الحجار",
   "lat": 36.807471,
   "lng": 7.738913
  },
  {
   "name": "Eulma",
   "ar": "العلمة",
   "lat": 36.737748,
   "lng": 7.467199
  },
  {
   "name": "El Bouni",
   "ar": "البوني",
   "lat": 36.854822,
   "lng": 7.741302
  },
  {
   "name": "Oued El Aneb",
   "ar": "وادي العنب",
   "lat": 36.880047,
   "lng": 7.489709
  },
  {
   "name": "Cheurfa",
   "ar": "الشرفة",
   "lat": 36.721279,
   "lng": 7.553839
  },
  {
   "name": "Seraidi",
   "ar": "سرايدي",
   "lat": 36.91145,
   "lng": 7.677026
  },
  {
   "name": "Ain Berda",
   "ar": "عين الباردة",
   "lat": 36.646014,
   "lng": 7.588639
  },
  {
   "name": "Chetaibi",
   "ar": "شطايبي",
   "lat": 37.065025,
   "lng": 7.37994
  },
  {
   "name": "Treat",
   "ar": "التريعات",
   "lat": 36.895833,
   "lng": 7.420638
  }
 ],
 "46": [
  {
   "name": "Sidi Boumediene",
   "ar": " سيدي بومدين",
   "lat": 36.415997,
   "lng": 7.283589
  },
  {
   "name": "Ain Temouchent",
   "ar": "عـيـن تـمـوشـنـت",
   "lat": 35.29927,
   "lng": -1.139279
  },
  {
   "name": "Chaabat El Ham",
   "ar": "شعبة اللحم",
   "lat": 35.337124,
   "lng": -1.098377
  },
  {
   "name": "Ain Kihal",
   "ar": "عين الكيحل",
   "lat": 35.202694,
   "lng": -1.196701
  },
  {
   "name": "Hammam Bouhadjar",
   "ar": "حمام بو حجر",
   "lat": 35.378998,
   "lng": -0.970994
  },
  {
   "name": "Bouzedjar",
   "ar": "بوزجار",
   "lat": 35.581801,
   "lng": -1.14292
  },
  {
   "name": "Oued Berkeche",
   "ar": "وادى برقش",
   "lat": 35.222433,
   "lng": -0.984725
  },
  {
   "name": "Aghlal",
   "ar": "أغلال",
   "lat": 35.200457,
   "lng": -1.07029
  },
  {
   "name": "Terga",
   "ar": "تارقة",
   "lat": 35.418478,
   "lng": -1.177522
  },
  {
   "name": "Ain El Arbaa",
   "ar": "عين الاربعاء",
   "lat": 35.40799,
   "lng": -0.880084
  },
  {
   "name": "Tamzoura",
   "ar": "تامزوغة",
   "lat": 35.409771,
   "lng": -0.656181
  },
  {
   "name": "Chentouf",
   "ar": "شنتوف",
   "lat": 35.303804,
   "lng": -1.029007
  },
  {
   "name": "Sidi Ben Adda",
   "ar": "سيدي بن عدة",
   "lat": 35.304827,
   "lng": -1.18157
  },
  {
   "name": "Aoubellil",
   "ar": "عقب الليل",
   "lat": 35.13663,
   "lng": -0.992248
  },
  {
   "name": "El Malah",
   "ar": "المالح",
   "lat": 35.387033,
   "lng": -1.097672
  },
  {
   "name": "Sidi Boumediene",
   "ar": "سيدي بومدين",
   "lat": 35.316261,
   "lng": -0.871292
  },
  {
   "name": "Oued Sebbah",
   "ar": "وادى الصباح",
   "lat": 35.372302,
   "lng": -0.812631
  },
  {
   "name": "Ouled Boudjemaa",
   "ar": "أولاد بوجمعة",
   "lat": 35.473011,
   "lng": -1.192417
  },
  {
   "name": "Ain Tolba",
   "ar": "عين الطلبة",
   "lat": 35.250953,
   "lng": -1.254208
  },
  {
   "name": "El Amria",
   "ar": "العامرية",
   "lat": 35.52391,
   "lng": -1.01663
  },
  {
   "name": "Hassi El Ghella",
   "ar": "حاسى الغلة",
   "lat": 35.456496,
   "lng": -1.051965
  },
  {
   "name": "Hassasna",
   "ar": "الحساسنة",
   "lat": 35.274283,
   "lng": -0.989511
  },
  {
   "name": "Ouled Kihal",
   "ar": "أولاد الكيحل",
   "lat": 35.369415,
   "lng": -1.233958
  },
  {
   "name": "Beni Saf",
   "ar": "بني صاف",
   "lat": 35.289786,
   "lng": -1.376886
  },
  {
   "name": "Sidi Safi",
   "ar": "سيدي الصافي",
   "lat": 35.280366,
   "lng": -1.313613
  },
  {
   "name": "Oulhaca El Gheraba",
   "ar": "ولهاصة الغرابة",
   "lat": 35.233653,
   "lng": -1.505399
  },
  {
   "name": "Sidi Ouriache",
   "ar": "سيدي وريلش",
   "lat": 35.188599,
   "lng": -1.506588
  },
  {
   "name": "Emir Abdelkader",
   "ar": "الأمير عبد القادر",
   "lat": 35.230601,
   "lng": -1.378518
  },
  {
   "name": "El Messaid",
   "ar": "المساعيد",
   "lat": 35.542638,
   "lng": -1.120513
  }
 ],
 "25": [
  {
   "name": "Constantine",
   "ar": "قسنطينة",
   "lat": 36.357005,
   "lng": 6.639028
  },
  {
   "name": "Hamma Bouziane",
   "ar": "حامة بوزيان",
   "lat": 36.422096,
   "lng": 6.598889
  },
  {
   "name": "Ben Badis",
   "ar": "إبن باديس",
   "lat": 36.31797,
   "lng": 6.830261
  },
  {
   "name": "Zighoud Youcef",
   "ar": "زيغود يوسف",
   "lat": 36.532254,
   "lng": 6.710245
  },
  {
   "name": "Didouche Mourad",
   "ar": "ديدوش مراد",
   "lat": 36.447654,
   "lng": 6.636404
  },
  {
   "name": "El Khroub",
   "ar": "الخروب",
   "lat": 36.259331,
   "lng": 6.701454
  },
  {
   "name": "Ain Abid",
   "ar": "عين عبيد",
   "lat": 36.233716,
   "lng": 6.943181
  },
  {
   "name": "Beni Hamidene",
   "ar": "بني حميدان",
   "lat": 36.506607,
   "lng": 6.548918
  },
  {
   "name": "Ouled Rahmouni",
   "ar": "أولاد رحمون",
   "lat": 36.177043,
   "lng": 6.69913
  },
  {
   "name": "Ain Smara",
   "ar": "عين سمارة",
   "lat": 36.28034,
   "lng": 6.517626
  },
  {
   "name": "Messaoud Boujeriou",
   "ar": "مسعود بوجريو",
   "lat": 36.426438,
   "lng": 6.471321
  },
  {
   "name": "Ibn Ziad",
   "ar": "ابن زياد",
   "lat": 36.377876,
   "lng": 6.475911
  }
 ],
 "26": [
  {
   "name": "Medea",
   "ar": "المدية",
   "lat": 36.263708,
   "lng": 2.758786
  },
  {
   "name": "Ouzera",
   "ar": "وزرة",
   "lat": 36.253515,
   "lng": 2.84501
  },
  {
   "name": "Ouled Maaref",
   "ar": "أولاد معرف",
   "lat": 35.817762,
   "lng": 3.034496
  },
  {
   "name": "Ain Boucif",
   "ar": "عين بوسيف",
   "lat": 35.889676,
   "lng": 3.154962
  },
  {
   "name": "Aissaouia",
   "ar": "العيساوية",
   "lat": 36.419157,
   "lng": 3.21588
  },
  {
   "name": "Ouled Deid",
   "ar": "أولاد دايد",
   "lat": 36.112105,
   "lng": 3.013971
  },
  {
   "name": "El Omaria",
   "ar": "العمارية",
   "lat": 36.268572,
   "lng": 3.026272
  },
  {
   "name": "Derrag",
   "ar": "دراڨ",
   "lat": 35.862506,
   "lng": 2.361106
  },
  {
   "name": "El Guelbelkebir",
   "ar": "القلب الكبير",
   "lat": 36.254579,
   "lng": 3.415962
  },
  {
   "name": "Bouaiche",
   "ar": "بوعيش",
   "lat": 35.552508,
   "lng": 2.360384
  },
  {
   "name": "Mezerana",
   "ar": "مزغنة",
   "lat": 36.361061,
   "lng": 3.355994
  },
  {
   "name": "Ouled Brahim",
   "ar": "أولاد إبراهيم",
   "lat": 36.245385,
   "lng": 2.981333
  },
  {
   "name": "Sidi Ziane",
   "ar": "سيدي زيان",
   "lat": 36.034631,
   "lng": 3.248306
  },
  {
   "name": "Tamesguida",
   "ar": "تمزڨيدة",
   "lat": 36.332244,
   "lng": 2.681782
  },
  {
   "name": "El Hamdania",
   "ar": "الحمدانية",
   "lat": 36.362179,
   "lng": 2.766393
  },
  {
   "name": "Kef Lakhdar",
   "ar": "الكاف الأخضر",
   "lat": 35.92676,
   "lng": 3.293455
  },
  {
   "name": "Chelalet El Adhaoura",
   "ar": "شلالة العذاورة",
   "lat": 35.940375,
   "lng": 3.417032
  },
  {
   "name": "Bouskene",
   "ar": "بوسكن",
   "lat": 36.191269,
   "lng": 3.235777
  },
  {
   "name": "Rebaia",
   "ar": "الربعية",
   "lat": 36.030489,
   "lng": 3.13993
  },
  {
   "name": "Bouchrahil",
   "ar": "بوشراحيل",
   "lat": 36.252369,
   "lng": 3.158126
  },
  {
   "name": "Ouled Hellal",
   "ar": "أولاد هلال",
   "lat": 35.966968,
   "lng": 2.534632
  },
  {
   "name": "Tafraout",
   "ar": "تافراوت",
   "lat": 35.9715,
   "lng": 3.352009
  },
  {
   "name": "Baata",
   "ar": "بعطة",
   "lat": 36.347941,
   "lng": 3.114828
  },
  {
   "name": "Boghar",
   "ar": "بوغار",
   "lat": 35.910194,
   "lng": 2.716101
  },
  {
   "name": "Sidi Naamane",
   "ar": "سيدي نعمان",
   "lat": 36.213045,
   "lng": 3.113786
  },
  {
   "name": "Ouled Bouachra",
   "ar": "أولاد بوعشرة",
   "lat": 36.102009,
   "lng": 2.712287
  },
  {
   "name": "Sidi Zahar",
   "ar": "سيدي زهار",
   "lat": 36.065964,
   "lng": 3.333212
  },
  {
   "name": "Oued Harbil",
   "ar": "وادي حربيل",
   "lat": 36.225687,
   "lng": 2.629513
  },
  {
   "name": "Ben Chicao",
   "ar": "بن شكاو",
   "lat": 36.1993,
   "lng": 2.850858
  },
  {
   "name": "Sidi Demed",
   "ar": "سيدي دامد",
   "lat": 35.825032,
   "lng": 3.347974
  },
  {
   "name": "Aziz",
   "ar": "عزيز",
   "lat": 35.823755,
   "lng": 2.451602
  },
  {
   "name": "Souagui",
   "ar": "السواڨي",
   "lat": 36.125753,
   "lng": 3.266127
  },
  {
   "name": "Zoubiria",
   "ar": "الزبيرية",
   "lat": 36.069327,
   "lng": 2.903608
  },
  {
   "name": "Ksar El Boukhari",
   "ar": "قصر البخاري",
   "lat": 35.876377,
   "lng": 2.748845
  },
  {
   "name": "El Azizia",
   "ar": "العزيزية",
   "lat": 36.285187,
   "lng": 3.495817
  },
  {
   "name": "Djouab",
   "ar": "جواب",
   "lat": 36.138526,
   "lng": 3.424076
  },
  {
   "name": "Chabounia",
   "ar": "الشهبونية",
   "lat": 35.543489,
   "lng": 2.602622
  },
  {
   "name": "Maghraoua",
   "ar": "مغراوة",
   "lat": 36.351222,
   "lng": 3.535694
  },
  {
   "name": "Cheniguel",
   "ar": "شنيڨل",
   "lat": 35.922185,
   "lng": 3.566626
  },
  {
   "name": "Ain Ouksir",
   "ar": "عين القصير",
   "lat": 35.853467,
   "lng": 3.470984
  },
  {
   "name": "Oum El Djellil",
   "ar": "أم الجليل",
   "lat": 35.826884,
   "lng": 2.623506
  },
  {
   "name": "Ouamri",
   "ar": "عوامري",
   "lat": 36.231493,
   "lng": 2.561963
  },
  {
   "name": "Si Mahdjoub",
   "ar": "سى المحجوب",
   "lat": 36.161088,
   "lng": 2.721864
  },
  {
   "name": "Tletat Ed Douair",
   "ar": "ثلاثة الدوائر",
   "lat": 35.980579,
   "lng": 2.963679
  },
  {
   "name": "Beni Slimane",
   "ar": "بني سليمان",
   "lat": 36.227232,
   "lng": 3.307181
  },
  {
   "name": "Berrouaghia",
   "ar": "البرواڨية",
   "lat": 36.139798,
   "lng": 2.918994
  },
  {
   "name": "Seghouane",
   "ar": "سغوان",
   "lat": 36.000933,
   "lng": 2.905188
  },
  {
   "name": "Meftaha",
   "ar": "المفاتحة",
   "lat": 35.885693,
   "lng": 2.932868
  },
  {
   "name": "Mihoub",
   "ar": "ميهوب",
   "lat": 36.351532,
   "lng": 3.475565
  },
  {
   "name": "Boughzoul",
   "ar": "بوغزول",
   "lat": 35.704449,
   "lng": 2.843727
  },
  {
   "name": "Tablat",
   "ar": "تابلاط",
   "lat": 36.413182,
   "lng": 3.311071
  },
  {
   "name": "Deux Bassins",
   "ar": "فج الحوضين",
   "lat": 36.467935,
   "lng": 3.301929
  },
  {
   "name": "Draa Essamar",
   "ar": "ذراع السمار",
   "lat": 36.272837,
   "lng": 2.717999
  },
  {
   "name": "Sidi Rabie",
   "ar": "سيدي الربيع",
   "lat": 36.279226,
   "lng": 3.324695
  },
  {
   "name": "Bir Ben Laabed",
   "ar": "بئر بن العابد",
   "lat": 36.194018,
   "lng": 3.416802
  },
  {
   "name": "El Ouinet",
   "ar": "العوينات",
   "lat": 35.893845,
   "lng": 3.033601
  },
  {
   "name": "Ouled Antar",
   "ar": "أولاد عنتر",
   "lat": 35.946516,
   "lng": 2.602586
  },
  {
   "name": "Bouaichoune",
   "ar": "بوعيشون",
   "lat": 36.148519,
   "lng": 2.662229
  },
  {
   "name": "Hannacha",
   "ar": "حناشة",
   "lat": 36.190545,
   "lng": 2.568636
  },
  {
   "name": "Sedraya",
   "ar": "سدراية",
   "lat": 36.245156,
   "lng": 3.528113
  },
  {
   "name": "Medjebar",
   "ar": "مجبر",
   "lat": 35.950801,
   "lng": 2.825085
  },
  {
   "name": "Khams Djouamaa",
   "ar": "خمس جوامع",
   "lat": 36.160198,
   "lng": 3.139661
  },
  {
   "name": "Saneg",
   "ar": "سانڨ",
   "lat": 35.850394,
   "lng": 2.888857
  }
 ],
 "27": [
  {
   "name": "Mostaganem",
   "ar": "مستغانم",
   "lat": 35.931145,
   "lng": 0.090941
  },
  {
   "name": "Sayada",
   "ar": "صيادة",
   "lat": 35.912199,
   "lng": 0.145451
  },
  {
   "name": "Fornaka",
   "ar": "فرناكة",
   "lat": 35.752911,
   "lng": -0.017235
  },
  {
   "name": "Stidia",
   "ar": "ستيدية",
   "lat": 35.82924,
   "lng": -0.004367
  },
  {
   "name": "Ain Nouissy",
   "ar": "عين نويسي",
   "lat": 35.804051,
   "lng": 0.045489
  },
  {
   "name": "Hassi Mameche",
   "ar": "حاسي مماش",
   "lat": 35.838899,
   "lng": 0.027987
  },
  {
   "name": "Ain Tedles",
   "ar": "عين تادلس",
   "lat": 35.994901,
   "lng": 0.299693
  },
  {
   "name": "Sour",
   "ar": "صور",
   "lat": 35.999837,
   "lng": 0.338942
  },
  {
   "name": "Oued El Kheir",
   "ar": "واد الخير",
   "lat": 35.950005,
   "lng": 0.381898
  },
  {
   "name": "Sidi Belaattar",
   "ar": "سيدي بلعاتر",
   "lat": 36.026535,
   "lng": 0.267707
  },
  {
   "name": "Kheir Eddine",
   "ar": "خير الدين",
   "lat": 35.981634,
   "lng": 0.168054
  },
  {
   "name": "Sidi Ali",
   "ar": "سيدي علي",
   "lat": 36.100853,
   "lng": 0.422004
  },
  {
   "name": "Benabdelmalek Ramdane",
   "ar": "عبد المالك رمضان",
   "lat": 36.103462,
   "lng": 0.275986
  },
  {
   "name": "Hadjadj",
   "ar": "حجاج",
   "lat": 36.09755,
   "lng": 0.322821
  },
  {
   "name": "Nekmaria",
   "ar": "نقمارية",
   "lat": 36.189906,
   "lng": 0.622347
  },
  {
   "name": "Sidi Lakhdar",
   "ar": "سيدي لخضر",
   "lat": 36.163019,
   "lng": 0.438419
  },
  {
   "name": "Achaacha",
   "ar": "عشعاشة",
   "lat": 36.286789,
   "lng": 0.646677
  },
  {
   "name": "Khadra",
   "ar": "خضراء",
   "lat": 36.253571,
   "lng": 0.575437
  },
  {
   "name": "Bouguirat",
   "ar": "بوقيراط",
   "lat": 35.747322,
   "lng": 0.269032
  },
  {
   "name": "Sirat",
   "ar": "سيرات",
   "lat": 35.779438,
   "lng": 0.189845
  },
  {
   "name": "Ain Sidi Cherif",
   "ar": "عين سيدي شريف",
   "lat": 35.833115,
   "lng": 0.125341
  },
  {
   "name": "Mesra",
   "ar": "ماسرة",
   "lat": 35.837991,
   "lng": 0.167475
  },
  {
   "name": "Mansourah",
   "ar": "منصورة",
   "lat": 35.84303,
   "lng": 0.233491
  },
  {
   "name": "Souaflia",
   "ar": "سوافلية",
   "lat": 35.861471,
   "lng": 0.33255
  },
  {
   "name": "Ouled Boughalem",
   "ar": "أوالد بوغالم",
   "lat": 36.31887,
   "lng": 0.669191
  },
  {
   "name": "Ouled Maalah",
   "ar": "أولاد مع اللّه",
   "lat": 36.006063,
   "lng": 0.592081
  },
  {
   "name": "Mazagran",
   "ar": "مزغران",
   "lat": 35.896943,
   "lng": 0.074006
  },
  {
   "name": "Ain Boudinar",
   "ar": "عين بودينار",
   "lat": 36.00954,
   "lng": 0.186316
  },
  {
   "name": "Tazgait",
   "ar": "تزقايت",
   "lat": 36.09533,
   "lng": 0.548541
  },
  {
   "name": "Safsaf",
   "ar": "صفصاف",
   "lat": 35.845843,
   "lng": 0.378853
  },
  {
   "name": "Touahria",
   "ar": "طواھيرية",
   "lat": 35.810406,
   "lng": 0.210302
  },
  {
   "name": "Hassiane",
   "ar": "الحسيان",
   "lat": 35.767895,
   "lng": 0.033743
  }
 ],
 "28": [
  {
   "name": "M'sila",
   "ar": "المسيلة",
   "lat": 35.718665,
   "lng": 4.523342
  },
  {
   "name": "Maadid",
   "ar": "المعاضيد",
   "lat": 35.771089,
   "lng": 4.750766
  },
  {
   "name": "Hammam Dalaa",
   "ar": "حمـام الضلعة",
   "lat": 35.921778,
   "lng": 4.376913
  },
  {
   "name": "Ouled Derradj",
   "ar": "أولاد دراج",
   "lat": 35.689269,
   "lng": 4.776416
  },
  {
   "name": "Tarmount",
   "ar": "تارمونت",
   "lat": 35.82102,
   "lng": 4.287989
  },
  {
   "name": "M'tarfa",
   "ar": "مطارفة",
   "lat": 35.699284,
   "lng": 4.618647
  },
  {
   "name": "Khoubana",
   "ar": "خبانة",
   "lat": 35.323799,
   "lng": 4.414998
  },
  {
   "name": "M'cif",
   "ar": "مسيف",
   "lat": 35.325702,
   "lng": 4.79081
  },
  {
   "name": "Chellal",
   "ar": "شلال",
   "lat": 35.517267,
   "lng": 4.38341
  },
  {
   "name": "Ouled Madhi",
   "ar": "أولاد مـاضي",
   "lat": 35.584185,
   "lng": 4.491882
  },
  {
   "name": "Magra",
   "ar": "مقرة",
   "lat": 35.614587,
   "lng": 5.097838
  },
  {
   "name": "Berhoum",
   "ar": "برهوم",
   "lat": 35.654883,
   "lng": 5.03472
  },
  {
   "name": "Ain Khadra",
   "ar": "عين الخضراء",
   "lat": 35.505046,
   "lng": 4.94404
  },
  {
   "name": "Ouled Addi Guebala",
   "ar": "اولاد عدي لقبالة",
   "lat": 35.670321,
   "lng": 4.881687
  },
  {
   "name": "Belaiba",
   "ar": "بلعايبة",
   "lat": 35.519448,
   "lng": 5.165192
  },
  {
   "name": "Sidi Aissa",
   "ar": "سيدي عيسى",
   "lat": 35.885157,
   "lng": 3.774373
  },
  {
   "name": "Ain El Hadjel",
   "ar": "عين الحجل",
   "lat": 35.672784,
   "lng": 3.883799
  },
  {
   "name": "Sidi Hadjeres",
   "ar": "سيدي ھجرس",
   "lat": 35.674618,
   "lng": 4.035677
  },
  {
   "name": "Ouanougha",
   "ar": "ونوغة",
   "lat": 35.96202,
   "lng": 4.154862
  },
  {
   "name": "Bou Saada",
   "ar": "بوسعادة",
   "lat": 35.216352,
   "lng": 4.181463
  },
  {
   "name": "Ouled Sidi Brahim",
   "ar": "أولاد سيدي ابراهيم",
   "lat": 35.2995,
   "lng": 4.171034
  },
  {
   "name": "Sidi Ameur",
   "ar": "سيدي عامر",
   "lat": 35.383565,
   "lng": 3.905375
  },
  {
   "name": "Tamsa",
   "ar": "تامسة",
   "lat": 35.17759,
   "lng": 3.93221
  },
  {
   "name": "Ben Srour",
   "ar": "بن سرور",
   "lat": 35.040695,
   "lng": 4.564236
  },
  {
   "name": "Ouled Slimane",
   "ar": "أولاد سليمان",
   "lat": 34.915731,
   "lng": 4.737317
  },
  {
   "name": "El Houamed",
   "ar": "الحوامد",
   "lat": 35.215576,
   "lng": 4.300265
  },
  {
   "name": "El Hamel",
   "ar": "الهامل",
   "lat": 35.124911,
   "lng": 4.089481
  },
  {
   "name": "Ouled Mansour",
   "ar": "أولاد منصور",
   "lat": 35.75127,
   "lng": 4.378268
  },
  {
   "name": "Maarif",
   "ar": "المعاريف",
   "lat": 35.41504,
   "lng": 4.341365
  },
  {
   "name": "Dehahna",
   "ar": "الدهاهنة",
   "lat": 35.733054,
   "lng": 5.008965
  },
  {
   "name": "Bouti Sayeh",
   "ar": "بوطي السايح",
   "lat": 35.642213,
   "lng": 3.695135
  },
  {
   "name": "Khettouti Sed El Jir",
   "ar": "خطوطي سد الجير",
   "lat": 35.630271,
   "lng": 4.176682
  },
  {
   "name": "Zarzour",
   "ar": "الزرزور",
   "lat": 35.085085,
   "lng": 4.834499
  },
  {
   "name": "Oued El Kheir",
   "ar": "واد الخير",
   "lat": 34.898577,
   "lng": 4.430203
  },
  {
   "name": "Benzouh",
   "ar": "بن الزوه",
   "lat": 35.484075,
   "lng": 4.106129
  },
  {
   "name": "Bir Foda",
   "ar": "بير الفضة",
   "lat": 34.825482,
   "lng": 3.756552
  },
  {
   "name": "Ain Fares",
   "ar": "عين فارس",
   "lat": 34.700424,
   "lng": 4.429492
  },
  {
   "name": "Sidi M'hamed",
   "ar": "سيدي محمد",
   "lat": 34.866197,
   "lng": 4.257065
  },
  {
   "name": "Souamaa",
   "ar": "الصوامع",
   "lat": 35.546266,
   "lng": 4.709776
  },
  {
   "name": "Ain El Melh",
   "ar": "عين الملح",
   "lat": 34.84672,
   "lng": 4.161804
  },
  {
   "name": "Medjedel",
   "ar": "مجدل",
   "lat": 35.033116,
   "lng": 3.635263
  },
  {
   "name": "Slim",
   "ar": "سليم",
   "lat": 34.897019,
   "lng": 3.734309
  },
  {
   "name": "Ain Rich",
   "ar": "عين الريش",
   "lat": 34.6802,
   "lng": 4.095707
  },
  {
   "name": "Beni Ilmane",
   "ar": "بنى يلمان",
   "lat": 35.945919,
   "lng": 4.119094
  },
  {
   "name": "Oulteme",
   "ar": "ولتام",
   "lat": 35.120598,
   "lng": 4.372564
  },
  {
   "name": "Djebel Messaad",
   "ar": "جبل مساعد",
   "lat": 34.990878,
   "lng": 4.092244
  }
 ],
 "29": [
  {
   "name": "Mascara",
   "ar": "مـعـسـكـر",
   "lat": 35.402099,
   "lng": 0.140026
  },
  {
   "name": "Bouhanifia",
   "ar": "بوحنيفية",
   "lat": 35.315685,
   "lng": -0.05038
  },
  {
   "name": "Tizi",
   "ar": "تيزي",
   "lat": 35.31466,
   "lng": 0.071847
  },
  {
   "name": "Hacine",
   "ar": "حسين",
   "lat": 35.459815,
   "lng": -0.004967
  },
  {
   "name": "Maoussa",
   "ar": "ماوسة",
   "lat": 35.378713,
   "lng": 0.245986
  },
  {
   "name": "Tighennif",
   "ar": "تيغنيف",
   "lat": 35.415257,
   "lng": 0.329094
  },
  {
   "name": "El Hachem",
   "ar": "الهاشم",
   "lat": 35.372039,
   "lng": 0.49071
  },
  {
   "name": "Sidi Kada",
   "ar": "سيدي قادة",
   "lat": 35.332267,
   "lng": 0.341016
  },
  {
   "name": "Zelamta",
   "ar": "زلماطة",
   "lat": 35.273339,
   "lng": 0.606966
  },
  {
   "name": "Oued El Abtal",
   "ar": "واد الأبطال",
   "lat": 35.457794,
   "lng": 0.687027
  },
  {
   "name": "Ain Ferah",
   "ar": "عين فراح",
   "lat": 35.38084,
   "lng": 0.783763
  },
  {
   "name": "Ghriss",
   "ar": "غريس",
   "lat": 35.246403,
   "lng": 0.158563
  },
  {
   "name": "Froha",
   "ar": "فروحة",
   "lat": 35.303072,
   "lng": 0.126972
  },
  {
   "name": "Matemore",
   "ar": "مطمور",
   "lat": 35.312795,
   "lng": 0.197303
  },
  {
   "name": "Makhda",
   "ar": "ماقضة",
   "lat": 35.173915,
   "lng": 0.297684
  },
  {
   "name": "Sidi Boussaid",
   "ar": "سيدي بوسعيد",
   "lat": 35.290588,
   "lng": 0.296481
  },
  {
   "name": "El Bordj",
   "ar": "البرج",
   "lat": 35.515206,
   "lng": 0.30047
  },
  {
   "name": "Ain Fekan",
   "ar": "عين فكان",
   "lat": 35.225476,
   "lng": -0.001088
  },
  {
   "name": "Benian",
   "ar": "بنيان",
   "lat": 35.100377,
   "lng": 0.229134
  },
  {
   "name": "Khalouia",
   "ar": "خلوية",
   "lat": 35.46279,
   "lng": 0.296488
  },
  {
   "name": "El Menaouer",
   "ar": "المناور",
   "lat": 35.541245,
   "lng": 0.375506
  },
  {
   "name": "Oued Taria",
   "ar": "واد التاغية",
   "lat": 35.1175,
   "lng": 0.087331
  },
  {
   "name": "Aouf",
   "ar": "عوف",
   "lat": 35.097633,
   "lng": 0.356682
  },
  {
   "name": "Ain Ferah",
   "ar": "عين فراح",
   "lat": 35.479304,
   "lng": 0.243927
  },
  {
   "name": "Ain Frass",
   "ar": "عين فراس",
   "lat": 35.207178,
   "lng": -0.154985
  },
  {
   "name": "Sig",
   "ar": "سيڨ",
   "lat": 35.531361,
   "lng": -0.189446
  },
  {
   "name": "Oggaz",
   "ar": "عقاز",
   "lat": 35.563729,
   "lng": -0.25642
  },
  {
   "name": "Alaimia",
   "ar": "العلايمية",
   "lat": 35.675127,
   "lng": -0.21933
  },
  {
   "name": "El Gaada",
   "ar": "القعدة",
   "lat": 35.42747,
   "lng": -0.313625
  },
  {
   "name": "Zahana",
   "ar": "زھانة",
   "lat": 35.536456,
   "lng": -0.378197
  },
  {
   "name": "Mohammadia",
   "ar": "المحمدية",
   "lat": 35.59191,
   "lng": 0.06542
  },
  {
   "name": "Sidi Abdelmoumene",
   "ar": "سيدي عبد المومن",
   "lat": 35.655703,
   "lng": 0.015926
  },
  {
   "name": "Ferraguig",
   "ar": "فرقيق",
   "lat": 35.533505,
   "lng": 0.155179
  },
  {
   "name": "El Ghomri",
   "ar": "الغمري",
   "lat": 35.68829,
   "lng": 0.206244
  },
  {
   "name": "Sedjerara",
   "ar": "سجرارة",
   "lat": 35.632081,
   "lng": 0.213809
  },
  {
   "name": "Mocta Douz",
   "ar": "مقطع الدوز",
   "lat": 35.402099,
   "lng": 0.140026
  },
  {
   "name": "Bou Henni",
   "ar": "بوهني",
   "lat": 35.560075,
   "lng": -0.085387
  },
  {
   "name": "El Gueitena",
   "ar": "القيطنة",
   "lat": 35.408411,
   "lng": -0.050791
  },
  {
   "name": "El Mamounia",
   "ar": "المامونية",
   "lat": 35.423592,
   "lng": 0.140513
  },
  {
   "name": "El Keurt",
   "ar": "الكرط",
   "lat": 35.380913,
   "lng": 0.091456
  },
  {
   "name": "Gharrous",
   "ar": "غروس",
   "lat": 35.126169,
   "lng": 0.446564
  },
  {
   "name": "Guerdjoum",
   "ar": "ڤرجوم",
   "lat": 35.390413,
   "lng": 0.149499
  },
  {
   "name": "Chorfa",
   "ar": "الشرفة",
   "lat": 35.431607,
   "lng": -0.245356
  },
  {
   "name": "Ras El Ain Amirouche",
   "ar": "رأس العين عميروش",
   "lat": 35.611076,
   "lng": -0.212939
  },
  {
   "name": "Nesmot",
   "ar": "نسموط",
   "lat": 35.254313,
   "lng": 0.379525
  },
  {
   "name": "Sidi Abdeldjebar",
   "ar": "سيدي عبد الجبار",
   "lat": 35.443319,
   "lng": 0.523745
  },
  {
   "name": "Sehailia",
   "ar": "سحايلية",
   "lat": 35.444651,
   "lng": 0.403094
  }
 ],
 "30": [
  {
   "name": "Ouargla",
   "ar": "ورڨلة",
   "lat": 31.952741,
   "lng": 5.333535
  },
  {
   "name": "Ain Beida",
   "ar": "عين البيضاء",
   "lat": 31.939925,
   "lng": 5.392479
  },
  {
   "name": "N'goussa",
   "ar": "نقوسة",
   "lat": 32.140761,
   "lng": 5.309172
  },
  {
   "name": "Hassi Messaoud",
   "ar": "حاسي مسعود",
   "lat": 30.985909,
   "lng": 5.749381
  },
  {
   "name": "Rouissat",
   "ar": "الرويسات",
   "lat": 31.717061,
   "lng": 4.893563
  },
  {
   "name": "Sidi Khouiled",
   "ar": "سيدي خويلد",
   "lat": 31.981198,
   "lng": 5.417918
  },
  {
   "name": "Hassi Ben Abdellah",
   "ar": "حاسي بن عبد ﷲ",
   "lat": 32.197226,
   "lng": 5.870643
  },
  {
   "name": "El Borma",
   "ar": "البرمة",
   "lat": 31.190996,
   "lng": 7.929926
  }
 ],
 "55": [
  {
   "name": "Blidet Amor",
   "ar": "بليدة عامر",
   "lat": 32.77732,
   "lng": 5.864855
  },
  {
   "name": "Tebesbest",
   "ar": "تبسبست",
   "lat": 33.118558,
   "lng": 6.083628
  },
  {
   "name": "Nezla",
   "ar": "نزلة",
   "lat": 33.066614,
   "lng": 6.030946
  },
  {
   "name": "Zaouia El Abidia",
   "ar": "الزاوية العابدية",
   "lat": 33.136366,
   "lng": 6.082245
  },
  {
   "name": "Touggourt",
   "ar": "توقرت",
   "lat": 33.104964,
   "lng": 6.066283
  },
  {
   "name": "El Hadjira",
   "ar": "الحجيرة",
   "lat": 32.617022,
   "lng": 5.513183
  },
  {
   "name": "Taibet",
   "ar": "الطيبات",
   "lat": 33.092183,
   "lng": 5.839954
  },
  {
   "name": "Temacine",
   "ar": "تماسين",
   "lat": 33.004469,
   "lng": 5.973151
  },
  {
   "name": "Benaceur",
   "ar": "بن ناصر",
   "lat": 32.602761,
   "lng": 6.262049
  },
  {
   "name": "Mnaguer",
   "ar": "المنقر",
   "lat": 33.104964,
   "lng": 6.066283
  },
  {
   "name": "Megarine",
   "ar": "المقارين",
   "lat": 33.211993,
   "lng": 5.89441
  },
  {
   "name": "El Alia",
   "ar": "العالية",
   "lat": 33.140374,
   "lng": 5.595066
  },
  {
   "name": "Sidi Slimane",
   "ar": "سيدي سليمان",
   "lat": 33.3252,
   "lng": 5.854231
  }
 ],
 "32": [
  {
   "name": "Sidi Slimane",
   "ar": "سيدي سليمان",
   "lat": 33.289642,
   "lng": 6.092739
  },
  {
   "name": "El Bayadh",
   "ar": "الـبـيـض",
   "lat": 33.685415,
   "lng": 1.030354
  },
  {
   "name": "Rogassa",
   "ar": "روقاصة",
   "lat": 34.018138,
   "lng": 0.922904
  },
  {
   "name": "Stitten",
   "ar": "ستيتين",
   "lat": 33.84478,
   "lng": 1.187371
  },
  {
   "name": "Brezina",
   "ar": "بريزينة",
   "lat": 33.098285,
   "lng": 1.260702
  },
  {
   "name": "Ghassoul",
   "ar": "غسول",
   "lat": 33.378812,
   "lng": 1.205693
  },
  {
   "name": "Boualem",
   "ar": "بوعلام",
   "lat": 33.653485,
   "lng": 1.482148
  },
  {
   "name": "El Biodh Sidi Cheikh",
   "ar": "الابيض سيدي الشيخ",
   "lat": 32.897065,
   "lng": 0.545761
  },
  {
   "name": "Ain El Orak",
   "ar": "عين العراك",
   "lat": 33.409277,
   "lng": 0.740915
  },
  {
   "name": "Arbaouat",
   "ar": "أربوات",
   "lat": 33.089457,
   "lng": 0.585061
  },
  {
   "name": "Bougtoub",
   "ar": "بوقطب",
   "lat": 34.045671,
   "lng": 0.085119
  },
  {
   "name": "El Kheither",
   "ar": "الخيثر",
   "lat": 34.150612,
   "lng": 0.0695
  },
  {
   "name": "Kef El Ahmar",
   "ar": "الكاف الاحمر",
   "lat": 33.853011,
   "lng": 0.632043
  },
  {
   "name": "Boussemghoun",
   "ar": "بوسمغون",
   "lat": 32.867848,
   "lng": 0.023228
  },
  {
   "name": "Chellala",
   "ar": "شلالة",
   "lat": 33.032543,
   "lng": 0.061522
  },
  {
   "name": "Krakda",
   "ar": "كراكدة",
   "lat": 33.319754,
   "lng": 0.958393
  },
  {
   "name": "El Bnoud",
   "ar": "البنود",
   "lat": 32.312453,
   "lng": 0.246263
  },
  {
   "name": "Cheguig",
   "ar": "الشقيق",
   "lat": 34.085145,
   "lng": 1.14754
  },
  {
   "name": "Sidi Ameur",
   "ar": "سيدي عامر",
   "lat": 33.767714,
   "lng": 1.434085
  },
  {
   "name": "El Mehara",
   "ar": "المھارة",
   "lat": 33.313007,
   "lng": 0.364244
  },
  {
   "name": "Tousmouline",
   "ar": "توسمولين",
   "lat": 33.650091,
   "lng": 0.316058
  },
  {
   "name": "Sidi Tifour",
   "ar": "سيدي طيفور",
   "lat": 33.719988,
   "lng": 1.680888
  }
 ],
 "31": [
  {
   "name": "Oran",
   "ar": "وهران",
   "lat": 35.698739,
   "lng": -0.634932
  },
  {
   "name": "Gdyel",
   "ar": "ڨديل",
   "lat": 35.782379,
   "lng": -0.42362
  },
  {
   "name": "Bir El Djir",
   "ar": "بئر الجير",
   "lat": 35.717671,
   "lng": -0.565365
  },
  {
   "name": "Hassi Bounif",
   "ar": "حاسيْ بُونِيف",
   "lat": 35.69432,
   "lng": -0.500446
  },
  {
   "name": "Es Senia",
   "ar": "السانية",
   "lat": 35.649202,
   "lng": -0.606228
  },
  {
   "name": "Arzew",
   "ar": "أرزيو",
   "lat": 35.857744,
   "lng": -0.309661
  },
  {
   "name": "Bethioua",
   "ar": "ﺑﻃﻴﻭة",
   "lat": 35.758976,
   "lng": -0.238219
  },
  {
   "name": "Marsat El Hadjadj",
   "ar": "مَرس ألحَجَاج",
   "lat": 35.794049,
   "lng": -0.168227
  },
  {
   "name": "Ain Turk",
   "ar": "عيْن التُرْكْ",
   "lat": 35.74274,
   "lng": -0.77315
  },
  {
   "name": "El Ancar",
   "ar": "العنصر",
   "lat": 35.686397,
   "lng": -0.868971
  },
  {
   "name": "Oued Tlelat",
   "ar": "وادى تليلات",
   "lat": 35.552235,
   "lng": -0.4488
  },
  {
   "name": "Tafraoui",
   "ar": "طفراوي",
   "lat": 35.521956,
   "lng": -0.535127
  },
  {
   "name": "Sidi Chami",
   "ar": "سيدي الشحمي",
   "lat": 35.657061,
   "lng": -0.52142
  },
  {
   "name": "Boufatis",
   "ar": "بوفاطيس",
   "lat": 35.679114,
   "lng": -0.41117
  },
  {
   "name": "Mers El Kebir",
   "ar": "المرسى الكبير",
   "lat": 35.728685,
   "lng": -0.706968
  },
  {
   "name": "Bousfer",
   "ar": "بوسفر",
   "lat": 35.70178,
   "lng": -0.81114
  },
  {
   "name": "El Kerma",
   "ar": "الكرمة",
   "lat": 35.601565,
   "lng": -0.574482
  },
  {
   "name": "El Braya",
   "ar": "ألبْرَيَ",
   "lat": 35.62986,
   "lng": -0.519112
  },
  {
   "name": "Hassi Ben Okba",
   "ar": "حاسي بن عقبة",
   "lat": 35.731771,
   "lng": -0.467747
  },
  {
   "name": "Ben Freha",
   "ar": "بن فريحة",
   "lat": 35.692684,
   "lng": -0.418535
  },
  {
   "name": "Hassi Mefsoukh",
   "ar": "حاسي مفسوخ",
   "lat": 35.801604,
   "lng": -0.373838
  },
  {
   "name": "Sidi Ben Yebka",
   "ar": "سيدي بن يبقى",
   "lat": 35.83059,
   "lng": -0.39336
  },
  {
   "name": "Messerghin",
   "ar": "مسرغين",
   "lat": 35.619414,
   "lng": -0.729788
  },
  {
   "name": "Boutlelis",
   "ar": "بوتليليس",
   "lat": 35.572595,
   "lng": -0.90015
  },
  {
   "name": "Ain Kerma",
   "ar": "عين الكرمة",
   "lat": 35.643791,
   "lng": -0.977305
  },
  {
   "name": "Ain Biya",
   "ar": "عين البية",
   "lat": 35.807795,
   "lng": -0.290178
  }
 ],
 "33": [
  {
   "name": "Illizi",
   "ar": "إلـيـزي",
   "lat": 26.477586,
   "lng": 8.477633
  },
  {
   "name": "Debdeb",
   "ar": "دبداب",
   "lat": 29.967215,
   "lng": 9.422346
  },
  {
   "name": "Bordj Omar Driss",
   "ar": "برج عمر ادريس",
   "lat": 28.144993,
   "lng": 6.823637
  },
  {
   "name": "In Amenas",
   "ar": "إن أميناس",
   "lat": 28.038352,
   "lng": 9.564626
  }
 ],
 "56": [
  {
   "name": "Djanet",
   "ar": "جانت",
   "lat": 24.554151,
   "lng": 9.485429
  },
  {
   "name": "Bordj El Haouasse",
   "ar": "برج الحواس",
   "lat": 24.882038,
   "lng": 8.435407
  }
 ],
 "34": [
  {
   "name": "Bordj Bou Arreridj",
   "ar": "برج بوعريريج",
   "lat": 36.073993,
   "lng": 4.763027
  },
  {
   "name": "Ras El Oued",
   "ar": "رأس الوادي",
   "lat": 35.940258,
   "lng": 5.028321
  },
  {
   "name": "Bordj Zemora",
   "ar": "برج زمورة",
   "lat": 36.269165,
   "lng": 4.846564
  },
  {
   "name": "Mansoura",
   "ar": "منصورة",
   "lat": 36.085796,
   "lng": 4.457368
  },
  {
   "name": "El M'hir",
   "ar": "المھير",
   "lat": 36.119832,
   "lng": 4.374762
  },
  {
   "name": "Ben Daoud",
   "ar": "بن داود",
   "lat": 36.051978,
   "lng": 4.177977
  },
  {
   "name": "El Achir",
   "ar": "العشير",
   "lat": 36.064207,
   "lng": 4.624841
  },
  {
   "name": "Ain Taghrout",
   "ar": "عين تاغروت",
   "lat": 36.129249,
   "lng": 5.077551
  },
  {
   "name": "Bordj Ghdir",
   "ar": "برج غدير",
   "lat": 35.898199,
   "lng": 4.891915
  },
  {
   "name": "Sidi Embarek",
   "ar": "سيدي مبارك",
   "lat": 36.103746,
   "lng": 4.908248
  },
  {
   "name": "El Hamadia",
   "ar": "الحمادية",
   "lat": 36.01057,
   "lng": 4.725189
  },
  {
   "name": "Belimour",
   "ar": "بليمور",
   "lat": 35.97825,
   "lng": 4.879706
  },
  {
   "name": "Medjana",
   "ar": "مجانة",
   "lat": 36.131948,
   "lng": 4.67375
  },
  {
   "name": "Teniet En Nasr",
   "ar": "ثنية النصر",
   "lat": 36.231682,
   "lng": 4.600767
  },
  {
   "name": "Djaafra",
   "ar": "جعافرة",
   "lat": 36.29273,
   "lng": 4.662618
  },
  {
   "name": "El Main",
   "ar": "إلماين",
   "lat": 36.369074,
   "lng": 4.732604
  },
  {
   "name": "Ouled Brahem",
   "ar": "أولاد ابراھم",
   "lat": 35.874454,
   "lng": 5.075303
  },
  {
   "name": "Ouled Dahmane",
   "ar": "أولاد دحمان",
   "lat": 36.222875,
   "lng": 4.769896
  },
  {
   "name": "Hasnaoua",
   "ar": "حسناوة",
   "lat": 36.152038,
   "lng": 4.79508
  },
  {
   "name": "Khelil",
   "ar": "خليل",
   "lat": 36.178203,
   "lng": 5.022932
  },
  {
   "name": "Taglait",
   "ar": "تاقلعيت",
   "lat": 35.772743,
   "lng": 4.999897
  },
  {
   "name": "Ksour",
   "ar": "القصور",
   "lat": 35.989175,
   "lng": 4.574356
  },
  {
   "name": "Ouled Sidi Brahim",
   "ar": "آث سيذى پراهم.",
   "lat": 36.228948,
   "lng": 4.335829
  },
  {
   "name": "Tafreg",
   "ar": "تفرڨ",
   "lat": 36.306257,
   "lng": 4.713148
  },
  {
   "name": "Colla",
   "ar": "القلة",
   "lat": 36.25907,
   "lng": 4.657723
  },
  {
   "name": "Tixter",
   "ar": "تقصطر",
   "lat": 36.049927,
   "lng": 5.079128
  },
  {
   "name": "El Ach",
   "ar": "العش",
   "lat": 35.931873,
   "lng": 4.673707
  },
  {
   "name": "El Anseur",
   "ar": "العناصر",
   "lat": 36.040113,
   "lng": 4.818335
  },
  {
   "name": "Tesmart",
   "ar": "تسمارت",
   "lat": 36.270328,
   "lng": 4.82118
  },
  {
   "name": "Ain Tesra",
   "ar": "عين تسرة",
   "lat": 36.034837,
   "lng": 4.999642
  },
  {
   "name": "Bir Kasdali",
   "ar": "بئر قصد علي",
   "lat": 36.146568,
   "lng": 5.029691
  },
  {
   "name": "Ghilassa",
   "ar": "غيلاسة",
   "lat": 35.871136,
   "lng": 4.905916
  },
  {
   "name": "Rabta",
   "ar": "الرابطة",
   "lat": 35.923631,
   "lng": 4.75385
  },
  {
   "name": "Haraza",
   "ar": "الحرازة",
   "lat": 36.155937,
   "lng": 4.223758
  }
 ],
 "37": [
  {
   "name": "Tindouf",
   "ar": "تندوف",
   "lat": 27.671916,
   "lng": -8.1398
  },
  {
   "name": "Oum El Assel",
   "ar": "أم العسل",
   "lat": 28.863172,
   "lng": -5.851478
  }
 ],
 "38": [
  {
   "name": "Tissemsilt",
   "ar": "تـيـسـمـسـيـلـت",
   "lat": 35.605378,
   "lng": 1.813098
  },
  {
   "name": "Bordj Bounaama",
   "ar": "برج بونعامة",
   "lat": 35.85039,
   "lng": 1.614914
  },
  {
   "name": "Theniet El Had",
   "ar": "ثنية الاحد",
   "lat": 35.870851,
   "lng": 2.024089
  },
  {
   "name": "Lazharia",
   "ar": "الازھرية",
   "lat": 35.937372,
   "lng": 1.561112
  },
  {
   "name": "Beni Chaib",
   "ar": "بنى شعيب",
   "lat": 35.81802,
   "lng": 1.805325
  },
  {
   "name": "Lardjem",
   "ar": "لارجم",
   "lat": 35.749154,
   "lng": 1.547458
  },
  {
   "name": "Melaab",
   "ar": "ملعب",
   "lat": 35.714321,
   "lng": 1.332573
  },
  {
   "name": "Sidi Lantri",
   "ar": "سيدي العنترى",
   "lat": 35.709995,
   "lng": 1.462804
  },
  {
   "name": "Bordj El Emir Abdelkader",
   "ar": "برج الامير عبد القادر",
   "lat": 35.864932,
   "lng": 2.269386
  },
  {
   "name": "Layoune",
   "ar": "العيون",
   "lat": 35.696428,
   "lng": 1.997632
  },
  {
   "name": "Khemisti",
   "ar": "خميستى",
   "lat": 35.667302,
   "lng": 1.963335
  },
  {
   "name": "Ouled Bessem",
   "ar": "أولاد بسام",
   "lat": 35.679677,
   "lng": 1.824454
  },
  {
   "name": "Ammari",
   "ar": "عمارى",
   "lat": 35.616477,
   "lng": 1.676656
  },
  {
   "name": "Youssoufia",
   "ar": "اليوسفية",
   "lat": 35.948697,
   "lng": 2.116306
  },
  {
   "name": "Sidi Boutouchent",
   "ar": "سيدي بوتوشنت",
   "lat": 35.825195,
   "lng": 1.950309
  },
  {
   "name": "Larbaa",
   "ar": "الاربعاء",
   "lat": 35.913263,
   "lng": 1.474836
  },
  {
   "name": "Maacem",
   "ar": "المعاصم",
   "lat": 35.659785,
   "lng": 1.553185
  },
  {
   "name": "Sidi Abed",
   "ar": "سيدي عابد",
   "lat": 35.744453,
   "lng": 1.705716
  },
  {
   "name": "Tamellalet",
   "ar": "تاملاحت",
   "lat": 35.81496,
   "lng": 1.62415
  },
  {
   "name": "Sidi Slimane",
   "ar": "سيدي سليمان",
   "lat": 35.858662,
   "lng": 1.730568
  },
  {
   "name": "Bou Caid",
   "ar": "بوقايد",
   "lat": 35.891336,
   "lng": 1.619365
  },
  {
   "name": "Beni Lahcene",
   "ar": "بنى لحسن",
   "lat": 35.813867,
   "lng": 1.68761
  }
 ],
 "39": [
  {
   "name": "El Oued",
   "ar": "الوادي",
   "lat": 33.367811,
   "lng": 6.851651
  },
  {
   "name": "Robbah",
   "ar": "رباح",
   "lat": 33.291266,
   "lng": 6.908482
  },
  {
   "name": "Oued El Alenda",
   "ar": "وادى العلندة",
   "lat": 33.232131,
   "lng": 6.763684
  },
  {
   "name": "Bayadha",
   "ar": "البياضة",
   "lat": 33.327458,
   "lng": 6.889129
  },
  {
   "name": "Nakhla",
   "ar": "النخلة",
   "lat": 33.277173,
   "lng": 6.951783
  },
  {
   "name": "Guemar",
   "ar": "ڨمار",
   "lat": 33.488299,
   "lng": 6.796674
  },
  {
   "name": "Kouinine",
   "ar": "كوينين",
   "lat": 33.403356,
   "lng": 6.825845
  },
  {
   "name": "Reguiba",
   "ar": "الرڨيبة",
   "lat": 33.562998,
   "lng": 6.712811
  },
  {
   "name": "Hamraia",
   "ar": "الحمراية",
   "lat": 34.111531,
   "lng": 6.228806
  },
  {
   "name": "Taghzout",
   "ar": "تغزوت",
   "lat": 33.472037,
   "lng": 6.80146
  },
  {
   "name": "Debila",
   "ar": "الدبيلة",
   "lat": 33.50582,
   "lng": 6.937898
  },
  {
   "name": "Hassani Abdelkrim",
   "ar": "بلدية حساني عبد الكريم",
   "lat": 33.476197,
   "lng": 6.896509
  },
  {
   "name": "Hassi Khalifa",
   "ar": "حاسى خليفة",
   "lat": 33.560126,
   "lng": 6.99072
  },
  {
   "name": "Taleb Larbi",
   "ar": "طالب العربي",
   "lat": 33.729943,
   "lng": 7.514338
  },
  {
   "name": "Douar El Maa",
   "ar": "دوار الماء",
   "lat": 33.37245,
   "lng": 7.688114
  },
  {
   "name": "Sidi Aoun",
   "ar": "سيدي عون",
   "lat": 33.542323,
   "lng": 6.904978
  },
  {
   "name": "Trifaoui",
   "ar": "تريفاوى",
   "lat": 33.420034,
   "lng": 6.935575
  },
  {
   "name": "Magrane",
   "ar": "المڨرن",
   "lat": 33.583452,
   "lng": 6.942168
  },
  {
   "name": "Ben Guecha",
   "ar": "بن ڨشة",
   "lat": 34.203793,
   "lng": 7.613231
  },
  {
   "name": "Ourmes",
   "ar": "أورماس",
   "lat": 33.406263,
   "lng": 6.778376
  },
  {
   "name": "El Ogla",
   "ar": "العقلة",
   "lat": 33.244794,
   "lng": 6.944102
  },
  {
   "name": "Mih Ouansa",
   "ar": "مية ونسة",
   "lat": 33.199987,
   "lng": 6.709566
  }
 ],
 "57": [
  {
   "name": "Still",
   "ar": "سطيل",
   "lat": 34.261607,
   "lng": 5.91005
  },
  {
   "name": "Mrara",
   "ar": "مرارة",
   "lat": 33.477761,
   "lng": 5.65951
  },
  {
   "name": "Sidi Khelil",
   "ar": "سيدي خليل",
   "lat": 33.851339,
   "lng": 5.928977
  },
  {
   "name": "Tenedla",
   "ar": "تندلة",
   "lat": 33.675377,
   "lng": 6.031248
  },
  {
   "name": "El M'ghair",
   "ar": "المغير",
   "lat": 33.950285,
   "lng": 5.924424
  },
  {
   "name": "Djamaa",
   "ar": "جامعة",
   "lat": 33.573595,
   "lng": 5.746771
  },
  {
   "name": "Oum Touyour",
   "ar": "أم الطيور",
   "lat": 34.152084,
   "lng": 5.835408
  },
  {
   "name": "Sidi Amrane",
   "ar": "سيدي عمران",
   "lat": 33.497727,
   "lng": 6.006367
  }
 ],
 "40": [
  {
   "name": "Khenchela",
   "ar": "خنشلة",
   "lat": 35.42694,
   "lng": 7.146016
  },
  {
   "name": "M'toussa",
   "ar": "متوسة",
   "lat": 35.597218,
   "lng": 7.247418
  },
  {
   "name": "Kais",
   "ar": "قايس",
   "lat": 35.494885,
   "lng": 6.924413
  },
  {
   "name": "Baghai",
   "ar": "بغاي",
   "lat": 35.528439,
   "lng": 7.122182
  },
  {
   "name": "El Hamma",
   "ar": "الحامة",
   "lat": 35.46586,
   "lng": 7.058264
  },
  {
   "name": "Ain Touila",
   "ar": "عين الطويلة",
   "lat": 35.444176,
   "lng": 7.467486
  },
  {
   "name": "Taouzianat",
   "ar": "تاوزيانت",
   "lat": 35.510977,
   "lng": 6.809216
  },
  {
   "name": "Bouhmama",
   "ar": "بوحمامة",
   "lat": 35.319464,
   "lng": 6.744719
  },
  {
   "name": "El Oueldja",
   "ar": "الولجة",
   "lat": 34.681962,
   "lng": -1.900155
  },
  {
   "name": "Remila",
   "ar": "الرميلة",
   "lat": 35.571431,
   "lng": 6.898194
  },
  {
   "name": "Cherchar",
   "ar": "ششار",
   "lat": 34.878613,
   "lng": 7.049844
  },
  {
   "name": "Djellal",
   "ar": "جلال",
   "lat": 34.887155,
   "lng": 6.843387
  },
  {
   "name": "Babar",
   "ar": "بابار",
   "lat": 35.165978,
   "lng": 7.106013
  },
  {
   "name": "Tamza",
   "ar": "تامزة",
   "lat": 35.322397,
   "lng": 6.977769
  },
  {
   "name": "Ensigha",
   "ar": "انسيغة",
   "lat": 35.382057,
   "lng": 7.146017
  },
  {
   "name": "Ouled Rechache",
   "ar": "أولاد رشاش",
   "lat": 35.296355,
   "lng": 7.35321
  },
  {
   "name": "El Mahmal",
   "ar": "المحمل",
   "lat": 35.339247,
   "lng": 7.259697
  },
  {
   "name": "M'sara",
   "ar": "أمصارة",
   "lat": 35.238289,
   "lng": 6.57243
  },
  {
   "name": "Yabous",
   "ar": "يابوس",
   "lat": 35.408794,
   "lng": 6.64272
  },
  {
   "name": "Khirane",
   "ar": "خيران",
   "lat": 34.997486,
   "lng": 6.761025
  },
  {
   "name": "Chelia",
   "ar": "شلية",
   "lat": 35.364212,
   "lng": 6.779031
  }
 ],
 "41": [
  {
   "name": "Souk Ahras",
   "ar": "سوق أهراس",
   "lat": 36.280106,
   "lng": 7.938403
  },
  {
   "name": "Sedrata",
   "ar": "سدراتة",
   "lat": 36.134525,
   "lng": 7.529748
  },
  {
   "name": "Hanencha",
   "ar": "الحنانشة",
   "lat": 36.261923,
   "lng": 7.793116
  },
  {
   "name": "Machroha",
   "ar": "المشروحة",
   "lat": 36.357991,
   "lng": 7.837917
  },
  {
   "name": "Ouled Driss",
   "ar": "أولاد ادريس",
   "lat": 36.357671,
   "lng": 8.027104
  },
  {
   "name": "Tiffech",
   "ar": "تيفاش",
   "lat": 36.190448,
   "lng": 7.783673
  },
  {
   "name": "Zaarouria",
   "ar": "الزعرورية",
   "lat": 36.191138,
   "lng": 7.968718
  },
  {
   "name": "Taoura",
   "ar": "تاورة",
   "lat": 36.16667,
   "lng": 8.035737
  },
  {
   "name": "Drea",
   "ar": "الدريعة",
   "lat": 36.114705,
   "lng": 7.879176
  },
  {
   "name": "Haddada",
   "ar": "الحدادة",
   "lat": 36.23258,
   "lng": 8.334272
  },
  {
   "name": "Khedara",
   "ar": "لخضارة",
   "lat": 36.284268,
   "lng": 8.319247
  },
  {
   "name": "Merahna",
   "ar": "المراهنة",
   "lat": 36.197379,
   "lng": 8.155184
  },
  {
   "name": "Ouled Moumen",
   "ar": "أولاد مؤمن",
   "lat": 36.341544,
   "lng": 8.316383
  },
  {
   "name": "Bir Bouhouche",
   "ar": "بئر بوحوش",
   "lat": 36.012953,
   "lng": 7.426596
  },
  {
   "name": "M'daourouche",
   "ar": "مداوروش",
   "lat": 36.073367,
   "lng": 7.8176
  },
  {
   "name": "Oum El Adhaim",
   "ar": "أم العظائم",
   "lat": 36.030207,
   "lng": 7.603289
  },
  {
   "name": "Ain Zana",
   "ar": "عين الزانة",
   "lat": 36.401704,
   "lng": 8.191541
  },
  {
   "name": "Quillen",
   "ar": "ويلان",
   "lat": 36.298694,
   "lng": 7.925921
  },
  {
   "name": "Sidi Fredj",
   "ar": "سيدي فرج",
   "lat": 36.153172,
   "lng": 8.195827
  },
  {
   "name": "Safel El Ouiden",
   "ar": "سافل الويدان",
   "lat": 35.938602,
   "lng": 7.492788
  },
  {
   "name": "Ragouba",
   "ar": "الرقوبة",
   "lat": 36.126575,
   "lng": 7.672261
  },
  {
   "name": "Khemissa",
   "ar": "خميسة",
   "lat": 36.160596,
   "lng": 7.622944
  },
  {
   "name": "Oued Kebrit",
   "ar": "وادى الكبريت",
   "lat": 35.923684,
   "lng": 7.919366
  },
  {
   "name": "Terraguelt",
   "ar": "ترقالت",
   "lat": 35.883122,
   "lng": 7.597389
  },
  {
   "name": "Zouabi",
   "ar": "الزوابى",
   "lat": 36.118609,
   "lng": 7.420059
  }
 ],
 "43": [
  {
   "name": "Mila",
   "ar": "ميلة",
   "lat": 36.451905,
   "lng": 6.258434
  },
  {
   "name": "Ferdjioua",
   "ar": "فرجيوة",
   "lat": 36.405114,
   "lng": 5.94196
  },
  {
   "name": "Chelghoum Laid",
   "ar": "شلغوم العيد",
   "lat": 36.16356,
   "lng": 6.183756
  },
  {
   "name": "Oued Athmenia",
   "ar": "وادي العثمانية",
   "lat": 36.247001,
   "lng": 6.286432
  },
  {
   "name": "Ain Mellouk",
   "ar": "عين ملوك",
   "lat": 36.276244,
   "lng": 6.174599
  },
  {
   "name": "Teleghma",
   "ar": "تلاغمة",
   "lat": 36.116627,
   "lng": 6.355588
  },
  {
   "name": "Oued Seguen",
   "ar": "وادى سقان",
   "lat": 36.178719,
   "lng": 6.388919
  },
  {
   "name": "Tadjenanet",
   "ar": "تاجنانت",
   "lat": 36.121833,
   "lng": 5.985242
  },
  {
   "name": "Benyahia Abderrahmane",
   "ar": "بن يحيى عبد الرحمان",
   "lat": 36.205818,
   "lng": 6.035422
  },
  {
   "name": "Oued Endja",
   "ar": "وادى النجاء",
   "lat": 36.500021,
   "lng": 6.071327
  },
  {
   "name": "Ahmed Rachedi",
   "ar": "أحمد راشدي",
   "lat": 36.389674,
   "lng": 6.131033
  },
  {
   "name": "Ouled Khalouf",
   "ar": "أولاد خلوف",
   "lat": 36.0558,
   "lng": 6.124574
  },
  {
   "name": "Tiberguent",
   "ar": "تيبرقنت",
   "lat": 36.410794,
   "lng": 6.040508
  },
  {
   "name": "Bouhatem",
   "ar": "بوحاتم",
   "lat": 36.305502,
   "lng": 6.034781
  },
  {
   "name": "Rouached",
   "ar": "رواشد",
   "lat": 36.458677,
   "lng": 6.035554
  },
  {
   "name": "Tessala",
   "ar": "تسالة",
   "lat": 38.91815,
   "lng": -77.048728
  },
  {
   "name": "Grarem Gouga",
   "ar": "القرارم قوقة",
   "lat": 36.520164,
   "lng": 6.325266
  },
  {
   "name": "Sidi Merouane",
   "ar": "سيدي مروان",
   "lat": 36.517607,
   "lng": 6.258664
  },
  {
   "name": "Tassadane Haddada",
   "ar": "تسدان حدادة",
   "lat": 36.500972,
   "lng": 5.877199
  },
  {
   "name": "Derrahi Bousselah",
   "ar": "دراحي بوصلاح",
   "lat": 36.313642,
   "lng": 5.925182
  },
  {
   "name": "Minar Zarza",
   "ar": "مينار زرزة",
   "lat": 36.525492,
   "lng": 5.872963
  },
  {
   "name": "Amira Arres",
   "ar": "عميرة أراس",
   "lat": 36.536821,
   "lng": 6.066636
  },
  {
   "name": "Terrai Bainem",
   "ar": "ترعى بينان",
   "lat": 36.531526,
   "lng": 6.121794
  },
  {
   "name": "Hamala",
   "ar": "حمالة",
   "lat": 36.572971,
   "lng": 6.341294
  },
  {
   "name": "Ain Tine",
   "ar": "عين التين",
   "lat": 36.396305,
   "lng": 6.324714
  },
  {
   "name": "El Mechira",
   "ar": "المشيرة",
   "lat": 36.010117,
   "lng": 6.229125
  },
  {
   "name": "Sidi Khelifa",
   "ar": "سيدي خليفة",
   "lat": 36.34979,
   "lng": 6.300287
  },
  {
   "name": "Zeghaia",
   "ar": "زغاية",
   "lat": 36.469272,
   "lng": 6.175521
  },
  {
   "name": "Elayadi Barbes",
   "ar": "العياضى برباس",
   "lat": 36.436726,
   "lng": 5.82089
  },
  {
   "name": "Ain Beida Harriche",
   "ar": "عين البيضاء حريش",
   "lat": 36.395074,
   "lng": 5.886808
  },
  {
   "name": "Yahia Beniguecha",
   "ar": "يحيى بنى قشة",
   "lat": 36.391686,
   "lng": 5.992687
  },
  {
   "name": "Chigara",
   "ar": "الشيقارة",
   "lat": 36.559814,
   "lng": 6.221516
  }
 ],
 "44": [
  {
   "name": "Ain Defla",
   "ar": "عين دفلة - عين الدفلى",
   "lat": 36.250943,
   "lng": 1.939382
  },
  {
   "name": "Miliana",
   "ar": "مليانة",
   "lat": 36.308027,
   "lng": 2.228407
  },
  {
   "name": "Boumedfaa",
   "ar": "بومدفع",
   "lat": 36.369588,
   "lng": 2.472794
  },
  {
   "name": "Khemis Miliana",
   "ar": "خميس مليانة",
   "lat": 36.260983,
   "lng": 2.234358
  },
  {
   "name": "Hammam Righa",
   "ar": "حمام ريغة",
   "lat": 36.381533,
   "lng": 2.400042
  },
  {
   "name": "Arib",
   "ar": "عريب",
   "lat": 36.346366,
   "lng": 2.072101
  },
  {
   "name": "Djelida",
   "ar": "جليدة",
   "lat": 36.203842,
   "lng": 2.080058
  },
  {
   "name": "El Amra",
   "ar": "العامرة",
   "lat": 36.308144,
   "lng": 1.848184
  },
  {
   "name": "Bourached",
   "ar": "بوراشد",
   "lat": 36.169763,
   "lng": 1.930953
  },
  {
   "name": "El Attaf",
   "ar": "العطاف",
   "lat": 36.225829,
   "lng": 1.673711
  },
  {
   "name": "El Abadia",
   "ar": "العبادية",
   "lat": 36.272039,
   "lng": 1.685391
  },
  {
   "name": "Djendel",
   "ar": "جندل",
   "lat": 36.220534,
   "lng": 2.414938
  },
  {
   "name": "Oued Chorfa",
   "ar": "وادى الشرفاء",
   "lat": 36.166495,
   "lng": 2.554864
  },
  {
   "name": "Ain Lechiakh",
   "ar": "عين االشياخ",
   "lat": 36.159963,
   "lng": 2.405252
  },
  {
   "name": "Oued Djemaa",
   "ar": "وادى جمعة",
   "lat": 36.114349,
   "lng": 2.303218
  },
  {
   "name": "Rouina",
   "ar": "روينة",
   "lat": 36.243697,
   "lng": 1.807648
  },
  {
   "name": "Zeddine",
   "ar": "زدين",
   "lat": 36.156736,
   "lng": 1.820989
  },
  {
   "name": "Hassania",
   "ar": "الحسنية",
   "lat": 35.977482,
   "lng": 1.934195
  },
  {
   "name": "Bir Ould Khelifa",
   "ar": "بئر ولد خليفة",
   "lat": 36.183058,
   "lng": 2.224724
  },
  {
   "name": "Ain Soltane",
   "ar": "عين السلطان",
   "lat": 36.23139,
   "lng": 2.325158
  },
  {
   "name": "Tarik Ibn Ziad",
   "ar": "طارق بن زياد",
   "lat": 35.988008,
   "lng": 2.140175
  },
  {
   "name": "Bordj Emir Khaled",
   "ar": "برج الأمير خالد",
   "lat": 36.122341,
   "lng": 2.204891
  },
  {
   "name": "Ain Tork",
   "ar": "عين التركى",
   "lat": 36.335323,
   "lng": 2.301749
  },
  {
   "name": "Sidi Lakhdar",
   "ar": "سيدي لخضر",
   "lat": 36.265371,
   "lng": 2.161567
  },
  {
   "name": "Ben Allal",
   "ar": "بن علال",
   "lat": 36.312258,
   "lng": 2.165177
  },
  {
   "name": "Ain Benian",
   "ar": "عين البنيان",
   "lat": 36.351624,
   "lng": 2.386168
  },
  {
   "name": "Hoceinia",
   "ar": "حسينية",
   "lat": 36.310941,
   "lng": 2.396904
  },
  {
   "name": "Barbouche",
   "ar": "بربوش",
   "lat": 36.107187,
   "lng": 2.481585
  },
  {
   "name": "Djemaa Ouled Cheikh",
   "ar": "جمعة أولاد الشيخ",
   "lat": 36.07836,
   "lng": 2.00557
  },
  {
   "name": "Mekhatria",
   "ar": "المخاطرية",
   "lat": 36.345476,
   "lng": 1.955168
  },
  {
   "name": "Bathia",
   "ar": "بطحية",
   "lat": 35.915973,
   "lng": 1.839404
  },
  {
   "name": "Tacheta Zegagha",
   "ar": "تاشتة زقاغة",
   "lat": 36.351658,
   "lng": 1.64329
  },
  {
   "name": "Ain Bouyahia",
   "ar": "عين بويحى",
   "lat": 36.287612,
   "lng": 1.766796
  },
  {
   "name": "El Maine",
   "ar": "الماين",
   "lat": 36.050931,
   "lng": 1.758544
  },
  {
   "name": "Tiberkanine",
   "ar": "تبركانين",
   "lat": 36.174958,
   "lng": 1.627
  },
  {
   "name": "Belaas",
   "ar": "بالعاص",
   "lat": 35.982609,
   "lng": 1.850413
  }
 ],
 "45": [
  {
   "name": "Naama",
   "ar": "النــعـامـة",
   "lat": 33.266732,
   "lng": -0.312866
  },
  {
   "name": "Mecheria",
   "ar": "مشرية",
   "lat": 33.542838,
   "lng": -0.275112
  },
  {
   "name": "Ain Safra",
   "ar": "عين الصفراء",
   "lat": 32.759117,
   "lng": -0.578262
  },
  {
   "name": "Tiout",
   "ar": "تيوت",
   "lat": 32.772077,
   "lng": -0.417367
  },
  {
   "name": "Sfissifa",
   "ar": "صفيصيفة",
   "lat": 32.72628,
   "lng": -0.862731
  },
  {
   "name": "Moghrar",
   "ar": "مغرار",
   "lat": 32.539643,
   "lng": -0.495774
  },
  {
   "name": "Assela",
   "ar": "عسلة",
   "lat": 33.003247,
   "lng": -0.077434
  },
  {
   "name": "Djeniane Bourzeg",
   "ar": "جنين بورزق",
   "lat": 32.290057,
   "lng": -0.907559
  },
  {
   "name": "Ain Ben Khelil",
   "ar": "عين بن خليل",
   "lat": 33.291779,
   "lng": -0.761322
  },
  {
   "name": "Makman Ben Amer",
   "ar": "مكمن بن عمر",
   "lat": 33.700306,
   "lng": -0.76326
  },
  {
   "name": "Kasdir",
   "ar": "قصدير",
   "lat": 33.704236,
   "lng": -1.380501
  },
  {
   "name": "El Biod",
   "ar": "البيوض",
   "lat": 33.765467,
   "lng": -0.127531
  }
 ],
 "47": [
  {
   "name": "Ghardaia",
   "ar": "غرداية",
   "lat": 32.494374,
   "lng": 3.64446
  },
  {
   "name": "Dhayet Bendhahoua",
   "ar": "ضاية بن ضحوة",
   "lat": 32.549932,
   "lng": 3.604395
  },
  {
   "name": "Berriane",
   "ar": "بريان",
   "lat": 32.825651,
   "lng": 3.763906
  },
  {
   "name": "Metlili",
   "ar": "متليلي الشعانبة",
   "lat": 32.291202,
   "lng": 3.603168
  },
  {
   "name": "El Guerrara",
   "ar": "الڨرارة",
   "lat": 32.788573,
   "lng": 4.488276
  },
  {
   "name": "El Atteuf",
   "ar": "العطف",
   "lat": 32.47663,
   "lng": 3.747243
  },
  {
   "name": "Zelfana",
   "ar": "زلفانة",
   "lat": 32.395813,
   "lng": 4.223377
  },
  {
   "name": "Sebseb",
   "ar": "سبسب",
   "lat": 32.174464,
   "lng": 3.581684
  },
  {
   "name": "Bounoura",
   "ar": "بونورة",
   "lat": 32.483029,
   "lng": 3.699477
  },
  {
   "name": "Mansoura",
   "ar": "منصورة",
   "lat": 31.971682,
   "lng": 3.411786
  }
 ],
 "58": [
  {
   "name": "El Meniaa",
   "ar": "المنيعة",
   "lat": 30.583316,
   "lng": 2.88367
  },
  {
   "name": "Hassi Fehal",
   "ar": "حاسي الفحل",
   "lat": 31.60319,
   "lng": 3.677204
  },
  {
   "name": "Hassi Gara",
   "ar": "حاسي قارة",
   "lat": 30.544473,
   "lng": 2.909792
  }
 ],
 "48": [
  {
   "name": "Relizane",
   "ar": "غيليزان",
   "lat": 35.745026,
   "lng": 0.557884
  },
  {
   "name": "Oued Rhiou",
   "ar": "وادي رهيو",
   "lat": 35.977005,
   "lng": 0.92475
  },
  {
   "name": "Belaassel Bouzagza",
   "ar": "بلعسل بوزقزة",
   "lat": 35.852837,
   "lng": 0.505702
  },
  {
   "name": "Sidi Saada",
   "ar": "سيدي سعادة",
   "lat": 35.676031,
   "lng": 0.340717
  },
  {
   "name": "Ouled Aiche",
   "ar": "أولاد يعيش",
   "lat": 35.825564,
   "lng": 0.963686
  },
  {
   "name": "Sidi Lazreg",
   "ar": "سيدي لزرق",
   "lat": 35.646682,
   "lng": 0.778242
  },
  {
   "name": "El H'madna",
   "ar": "الحمادنة",
   "lat": 35.904256,
   "lng": 0.776859
  },
  {
   "name": "Sidi M'hamed Benali",
   "ar": "سيدي امحمد بن علي",
   "lat": 36.14534,
   "lng": 0.841525
  },
  {
   "name": "Mediouna",
   "ar": "مديونة",
   "lat": 36.123897,
   "lng": 0.748983
  },
  {
   "name": "Sidi Khettab",
   "ar": "سيدي خطاب",
   "lat": 35.91179,
   "lng": 0.512062
  },
  {
   "name": "Ammi Moussa",
   "ar": "عمي موسى",
   "lat": 35.872127,
   "lng": 1.107932
  },
  {
   "name": "Zemmoura",
   "ar": "زمورة",
   "lat": 35.720702,
   "lng": 0.758517
  },
  {
   "name": "Beni Dergoun",
   "ar": "بني درقن",
   "lat": 35.798717,
   "lng": 0.801384
  },
  {
   "name": "Djidiouia",
   "ar": "جيديوة",
   "lat": 35.929649,
   "lng": 0.83022
  },
  {
   "name": "El Guettar",
   "ar": "القطارة",
   "lat": 36.087423,
   "lng": 0.815202
  },
  {
   "name": "Hamri",
   "ar": "الحمري",
   "lat": 36.01934,
   "lng": 0.69015
  },
  {
   "name": "El Matmar",
   "ar": "المطمار",
   "lat": 35.731162,
   "lng": 0.459553
  },
  {
   "name": "Sidi M'hamed Benaouda",
   "ar": "سيدي بن عودة",
   "lat": 35.602983,
   "lng": 0.588806
  },
  {
   "name": "Ain Tarek",
   "ar": "عين طارق",
   "lat": 35.781522,
   "lng": 1.131166
  },
  {
   "name": "Oued Essalem",
   "ar": "وادي السلام",
   "lat": 35.579738,
   "lng": 0.923695
  },
  {
   "name": "Ouarizane",
   "ar": "ﻭﺍﺭﻳﺯﺍﻥ",
   "lat": 36.035857,
   "lng": 0.88311
  },
  {
   "name": "Mazouna",
   "ar": "مازونة",
   "lat": 36.12647,
   "lng": 0.89061
  },
  {
   "name": "Kalaa",
   "ar": "قلعة",
   "lat": 35.598113,
   "lng": 0.346597
  },
  {
   "name": "Ain Rahma",
   "ar": "عين الرحمة",
   "lat": 35.624131,
   "lng": 0.392785
  },
  {
   "name": "Yellel",
   "ar": "يلل",
   "lat": 35.723223,
   "lng": 0.35629
  },
  {
   "name": "Oued El Djemaa",
   "ar": "وادى الجمعة",
   "lat": 35.797187,
   "lng": 0.681052
  },
  {
   "name": "Ramka",
   "ar": "رمكة",
   "lat": 35.866614,
   "lng": 1.279663
  },
  {
   "name": "Mendes",
   "ar": "مندس",
   "lat": 35.650652,
   "lng": 0.863057
  },
  {
   "name": "Lahlef",
   "ar": "لحلاف",
   "lat": 35.89463,
   "lng": 0.979477
  },
  {
   "name": "Beni Zentis",
   "ar": "بني زنتيس",
   "lat": 36.11189,
   "lng": 0.664032
  },
  {
   "name": "Souk El Had",
   "ar": "سوق الحد",
   "lat": 35.935629,
   "lng": 1.227085
  },
  {
   "name": "Dar Ben Abdelah",
   "ar": "دار بن عبد الله",
   "lat": 35.692618,
   "lng": 0.695856
  },
  {
   "name": "El Hassi",
   "ar": "الحاسى",
   "lat": 35.73424,
   "lng": 1.019058
  },
  {
   "name": "Had Echkalla",
   "ar": "حد الشقالة",
   "lat": 35.676969,
   "lng": 1.147446
  },
  {
   "name": "Bendaoud",
   "ar": "بن داود",
   "lat": 35.719084,
   "lng": 0.522238
  },
  {
   "name": "El Ouldja",
   "ar": "العلجة",
   "lat": 35.91038,
   "lng": 1.120142
  },
  {
   "name": "Merdja Sidi Abed",
   "ar": "مرجة سيدي عابد",
   "lat": 36.010449,
   "lng": 1.021698
  },
  {
   "name": "Ouled Sidi Mihoub",
   "ar": "أولاد سيدي ميهوب",
   "lat": 35.974231,
   "lng": 0.684
  }
 ]
};

export const ALL_COMMUNES: { wilayaCode: string; commune: Commune }[] = Object.entries(COMMUNES_BY_WILAYA).flatMap(([wilayaCode, list]) => list.map(commune => ({ wilayaCode, commune })));

export function communesForWilaya(code: string): Commune[] { return COMMUNES_BY_WILAYA[code] || []; }
