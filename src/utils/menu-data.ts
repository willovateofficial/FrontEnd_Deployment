import masalaPapad from "../assets/Masala Papad.jpeg";
import roastedPapad from "../assets/Roasted Papad.jpeg";
import paneerChilli from "../assets/Paneer Chilli.jpeg";
import paneerPakoda from "../assets/Paneer Pakoda.jpeg";
import vegManchurian from "../assets/Veg Manchurian.jpeg";
import mashroomChilli from "../assets/Mushroom Chilli.jpeg";

import chickenLolipop from "../assets/Chicken Lolipop.jpeg";
import chickenChilli from "../assets/Chicken Chilli.jpeg";
import chickenFry from "../assets/Chicken Fry.jpeg";
import fishFry from "../assets/Fish Fry.jpeg";
import muttonFry from "../assets/Mutton Fry.jpeg";
import bangdaFry from "../assets/Bangda Fry.jpeg";

import fishThali from "../assets/Fish Thali.jpeg";
import specialNagpuriThali from "../assets/Special Nagpuri Thali.jpeg";
import chickenThali from "../assets/Chicken Thali.jpeg";
import eggThali from "../assets/Egg Thali.jpeg";
import muttonThali from "../assets/Mutton Thali.jpeg";
import vegThali from "../assets/Veg Thali.jpeg";

import dalTadka from "../assets/Dal Tadka.jpeg";
import dalFry from "../assets/Dal Fry.jpeg";
import shevBhaji from "../assets/Shev Bhaji.jpeg";
import baiganBharta from "../assets/Baingan Bharta.jpeg";
import vegKolhapuri from "../assets/Veg kolhapuri.jpeg";
import vegKadhai from "../assets/Kadhai-Veg.jpeg";
import mashroomMasala from "../assets/Mushroom Masala.jpeg";
import mashroomKadhai from "../assets/kadhai Mushroom.jpeg";
import kajuMasala from "../assets/Kaju Masala.jpeg";
import kajuPaneerMasala from "../assets/Kaju Paneer Masala.jpeg";
import kajuCurry from "../assets/kaju Curry.jpeg";
import baiganMasala from "../assets/Baingan Masala.jpeg";
import bhindiMasala from "../assets/Bhindi Masala.jpeg";
import chanaMasala from "../assets/Chana Masala.jpeg";
import paneerMasala from "../assets/Paneer Masala.jpeg";
import paneerKadhai from "../assets/Paneer Kadhai.jpeg";
import paneerButterMasala from "../assets/Paneer Butter Masala.jpeg";
import paneerKolhapuri from "../assets/Paneer Kolhapuri.jpeg";
import paneerBhurji from "../assets/Paneer Bhurji.jpeg";
import mutterPaneer from "../assets/Muttor Paneer.jpeg";
import aluMutter from "../assets/Aalu Mutter.jpeg";
import greenPeasMasala from "../assets/Green Peas Masala.jpeg";
import palakPaneer from "../assets/Palak Paneer.jpeg";
import vegMaratha from "../assets/Veg Maratha.jpeg";
import vegBhuna from "../assets/Veg Bhuna.jpeg";

import chickenCurry from "../assets/Chicken Curry.jpeg";
import chickenMasala from "../assets/Chicken Masala.jpeg";
import chickenKolhapuri from "../assets/Chicken Kolhapuri.jpeg";
import chickenKadhai from "../assets/Chicken kadhai.jpeg";
import chickenHandi from "../assets/Chicken Handi.jpeg";

import muttonCurry from "../assets/Mutton Curry.jpeg";
import muttonMasala from "../assets/Mutton Masala.jpeg";
import muttonKolhapuri from "../assets/Mutton Kolhapuri.jpeg";
import muttonKadhai from "../assets/Mutton Kadhai.jpeg";
import muttonHandi from "../assets/Mutton Handi.jpeg";

import fishCurry from "../assets/Fish Curry.jpeg";
import fishMasala from "../assets/Fish Masala.jpeg";

import jeeraRiceImg from "../assets/Jeera Rice.jpeg";
import steamRiceImg from "../assets/Steam Rice.jpeg";
import garlicRiceImg from "../assets/Garlic Rice.jpeg";
import dalKhichdiImg from "../assets/Dal Khichdi.jpeg";
import vegBiryaniImg from "../assets/Veg Biryani.jpeg";
import paneerBiryaniImg from "../assets/Paneer Biryani.jpeg";
import chickenBiryaniImg from "../assets/Chicken Biryani.jpeg";
import muttonBiryaniImg from "../assets/Mutton Biryani.jpeg";
import eggBiryaniImg from "../assets/Egg Biryani.jpeg";
import eggFriedRiceImg from "../assets/Egg Fried Rice.jpeg";
import chickenFriedRiceImg from "../assets/Chicken Fried Rice.jpeg";
import vegPulavImg from "../assets/Veg Pulao.jpeg";

import baiganMasalaImg from "../assets/Baingan Masala.jpeg";
import baiganBhartaImg from "../assets/Baingan Bharta.jpeg";
import patodiSaojiImg from "../assets/Patodi Saoji.jpeg";

import butterChapatiImg from "../assets/Butter Chapati.jpeg";
import tandooriRotiImg from "../assets/Tandoori Roti.jpeg";
import bhakriImg from "../assets/Bhakari.jpeg";
import butterNanImg from "../assets/Butter Naan.jpeg";
import garlicNanImg from "../assets/Garlic Naan.jpeg";
import cheeseNanImg from "../assets/Cheese Naan.jpeg";

export interface MenuItem {
  name: string;
  nameMr?: string;
  details?: string;
  detailsMr?: string;
  price: string | { half: string; full: string };
  img?: string;
}

export interface MenuCategory {
  title: string;
  titleMr?: string;
  items: MenuItem[];
}

export const restaurantMenu: MenuCategory[] = [
  {
    title: "Starters",
    titleMr: "स्टार्टर्स",
    items: [
      {
        name: "Masala Papad",
        nameMr: "मसाला पापड",
        price: "40",
        img: masalaPapad,
      },
      {
        name: "Roasted Papad",
        nameMr: "रोस्टेड पापड",
        price: "30",
        img: roastedPapad,
      },
      {
        name: "Paneer Chilly",
        nameMr: "पनीर चिल्ली",
        price: "170",
        img: paneerChilli,
      },
      {
        name: "Paneer Pakoda",
        nameMr: "पनीर पकोडा",
        price: "150",
        img: paneerPakoda,
      },
      {
        name: "Veg Manchurian",
        nameMr: "व्हेज मंचूरियन",
        price: "120",
        img: vegManchurian,
      },
      {
        name: "Mashroom Chilly",
        nameMr: "मशरूम चिल्ली",
        price: "120",
        img: mashroomChilli,
      },
    ],
  },
  {
    title: "Non-Veg Starters",
    titleMr: "नॉनव्हेज स्टार्टर्स",
    items: [
      {
        name: "Chicken Lolipop",
        nameMr: "चिकन लॉलीपॉप",
        price: {
          half: "90",
          full: "160",
        },
        img: chickenLolipop,
      },
      {
        name: "Chicken Chilly",
        nameMr: "चिकन चिली",
        price: "190",
        img: chickenChilli,
      },
      {
        name: "Chicken Fry",
        nameMr: "चिकन फ्राय",
        price: "150",
        img: chickenFry,
      },
      { name: "Fish Fry", nameMr: "फिश फ्राय", price: "150", img: fishFry },
      { name: "Mutton Fry", nameMr: "मटण फ्राय", price: "230", img: muttonFry },
      {
        name: "Bangda Fry",
        nameMr: "बंगडा फ्राय",
        price: "100",
        img: bangdaFry,
      },
    ],
  },

  {
    title: "Thali Section",
    titleMr: "थाळी विभाग",
    items: [
      {
        name: "Fish Thali",
        nameMr: "फिश थाळी",
        details: "Fish curry, Fish Fry, 3 chapati/Roti/2 Bhakari, Rice, salad",
        detailsMr: "फिश करी, फिश फ्राय, ३ चपाती/२ भाकरी, भात, कोशिंबीर",
        price: "170",
        img: fishThali,
      },
      {
        name: "Spacial Nagpuri Thali",
        nameMr: "स्पेशल नागपुरी थाळी",
        details:
          "3 Patodi, Patodi Rassa, Wanga Bharit, Roti/Bhakri, Sweet, Papad, Salad",
        detailsMr:
          "३ पाटोदी, पाटोदी रस्सा, वांगे भरीत, भाकरी, गोड, पापड, कोशिंबीर",
        price: "150",
        img: specialNagpuriThali,
      },
      {
        name: "Chicken Thali",
        nameMr: "चिकन थाळी",
        details: "3 piece Chicken, Roti, Rice, 1 Boiled Egg, Salad",
        detailsMr: "३ चिकन पीस, भाकरी, भात, १ उकडलेले अंडे, कोशिंबीर",
        price: "170",
        img: chickenThali,
      },
      {
        name: "Egg Thali",
        nameMr: "अंडा थाळी",
        details: "2 Egg Gravy, Roti/Bhakari, Rice, Salad",
        detailsMr: "२ अंडा रस्सा, भाकरी, भात, कोशिंबीर",
        price: "120",
        img: eggThali,
      },
      {
        name: "Mutton Thali",
        nameMr: "मटण थाळी",
        details:
          "3 piece Mutton Masala, Roti/Bhakari, Rice, 1 Boiled Egg, Salad",
        detailsMr: "३ मटण पीस, भाकरी, भात, १ उकडलेले अंडे, कोशिंबीर",
        price: "270",
        img: muttonThali,
      },
      {
        name: "Veg Thali",
        nameMr: "व्हेज थाळी",
        details:
          "Dal, Paneer Masala, Mix Veg, Roti/Bhakri, Rice, Papad, Sweet, Salad",
        detailsMr:
          "डाळ, पनीर मसाला, मिक्स व्हेज, भाकरी, भात, पापड, गोड, कोशिंबीर",
        price: "130",
        img: vegThali,
      },
    ],
  },
  {
    title: "Veg Main Course",
    titleMr: "व्हेज मुख्य जेवण",
    items: [
      { name: "Dal Tadka", nameMr: "दाल तड़का", price: "90", img: dalTadka },
      { name: "Dal Fry", nameMr: "दाल फ्राय", price: "80", img: dalFry },
      { name: "Shev Bhaji", nameMr: "शेव भाजी", price: "80", img: shevBhaji },
      {
        name: "Baigan Bharta",
        nameMr: "बैंगन भर्ता",
        price: "120",
        img: baiganBharta,
      },
      {
        name: "Veg Kolhapuri",
        nameMr: "व्हेज कोल्हापुरी",
        price: "150",
        img: vegKolhapuri,
      },
      {
        name: "Veg Kadhai",
        nameMr: "व्हेज कढाई",
        price: "150",
        img: vegKadhai,
      },
      {
        name: "Mashroom Masala",
        nameMr: "मशरूम मसाला",
        price: "150",
        img: mashroomMasala,
      },
      {
        name: "Mashroom Kadhai",
        nameMr: "मशरूम कढाई",
        price: "180",
        img: mashroomKadhai,
      },
      {
        name: "Kaju Masala",
        nameMr: "काजू मसाला",
        price: "170",
        img: kajuMasala,
      },
      {
        name: "Kaju Paneer Masala",
        nameMr: "काजू पनीर मसाला",
        price: "180",
        img: kajuPaneerMasala,
      },
      { name: "Kaju Curry", nameMr: "काजू करी", price: "160", img: kajuCurry },
      {
        name: "Baigan Masala",
        nameMr: "बैंगन मसाला",
        price: "100",
        img: baiganMasala,
      },
      {
        name: "Bhindi Masala",
        nameMr: "भेंडी मसाला",
        price: "100",
        img: bhindiMasala,
      },
      {
        name: "Chana Masala",
        nameMr: "चना मसाला",
        price: "120",
        img: chanaMasala,
      },
      {
        name: "Paneer Masala",
        nameMr: "पनीर मसाला",
        price: "170",
        img: paneerMasala,
      },
      {
        name: "Paneer Kadhai",
        nameMr: "पनीर कढई",
        price: "190",
        img: paneerKadhai,
      },
      {
        name: "Paneer Butter Masala",
        nameMr: "पनीर बटर मसाला",
        price: "180",
        img: paneerButterMasala,
      },
      {
        name: "Paneer Kolhapuri",
        nameMr: "पनीर कोल्हापुरी",
        price: "170",
        img: paneerKolhapuri,
      },
      {
        name: "Paneer Bhurji",
        nameMr: "पनीर भुंजी",
        price: "180",
        img: paneerBhurji,
      },
      {
        name: "Mutter Paneer",
        nameMr: "मटर पनीर",
        price: "160",
        img: mutterPaneer,
      },
      { name: "Alu Mutter", nameMr: "आलू मटर", price: "130", img: aluMutter },
      {
        name: "Green Peas Masala",
        nameMr: "ग्रीन पीज मसाला",
        price: "100",
        img: greenPeasMasala,
      },
      {
        name: "Palak Paneer",
        nameMr: "पालक पनीर",
        price: "150",
        img: palakPaneer,
      },
      {
        name: "Veg Maratha",
        nameMr: "व्हेज मराठा",
        price: "160",
        img: vegMaratha,
      },
      { name: "Veg Bhuna", nameMr: "व्हेज भुना", price: "150", img: vegBhuna },
    ],
  },
  {
    title: "Chicken Main Course",
    titleMr: "चिकन मुख्य जेवण",
    items: [
      {
        name: "Chicken Curry",
        nameMr: "चिकन करी",
        price: "150",
        img: chickenCurry,
      },
      {
        name: "Chicken Masala",
        nameMr: "चिकन मसाला",
        price: "160",
        img: chickenMasala,
      },
      {
        name: "Chicken Kolhapuri",
        nameMr: "चिकन कोल्हापुरी",
        price: "170",
        img: chickenKolhapuri,
      },
      {
        name: "Chicken Kadhai",
        nameMr: "चिकन कढाई",
        price: "180",
        img: chickenKadhai,
      },
      {
        name: "Chicken Handi",
        nameMr: "चिकन हंडी",
        price: "Half: 300 / Full: 500",
        img: chickenHandi,
      },
    ],
  },
  {
    title: "Mutton Main Course",
    titleMr: "मटण मुख्य जेवण",
    items: [
      {
        name: "Mutton Curry",
        nameMr: "मटण करी",
        price: "250",
        img: muttonCurry,
      },
      {
        name: "Mutton Masala",
        nameMr: "मटण मसाला",
        price: "270",
        img: muttonMasala,
      },
      {
        name: "Mutton Kolhapuri",
        nameMr: "मटण कोल्हापुरी",
        price: "270",
        img: muttonKolhapuri,
      },
      {
        name: "Mutton Kadhai",
        nameMr: "मटण कढाई",
        price: "290",
        img: muttonKadhai,
      },
      {
        name: "Mutton Handi",
        nameMr: "मटण हंडी",
        price: "Half: 500/ Full: 900",
        img: muttonHandi,
      },
    ],
  },
  {
    title: "Fish Main Course",
    titleMr: "फिश मुख्य जेवण",
    items: [
      { name: "Fish Curry", nameMr: "फिश करी", price: "150", img: fishCurry },
      {
        name: "Fish Masala",
        nameMr: "फिश मसाला",
        price: "160",
        img: fishMasala,
      },
    ],
  },
  {
    title: "Rice & Biryani",
    titleMr: "भात व बिर्याणी",
    items: [
      {
        name: "Jeera Rice",
        nameMr: "जीरा राईस",
        price: "Half: 80/ Full: 60",
        img: jeeraRiceImg,
      },
      {
        name: "Steam Rice",
        nameMr: "स्टीम राईस",
        price: "Half: 80/ Full: 60",
        img: steamRiceImg,
      },
      {
        name: "Garlic Rice",
        nameMr: "गार्लिक राईस",
        price: "100/80",
        img: garlicRiceImg,
      },
      {
        name: "Dal Khichdi",
        nameMr: "दाल खिचड़ी",
        price: "130",
        img: dalKhichdiImg,
      },
      {
        name: "Veg Biryani",
        nameMr: "व्हेज बिर्याणी",
        price: "130/90",
        img: vegBiryaniImg,
      },
      {
        name: "Paneer Biryani",
        nameMr: "पनीर बिर्याणी",
        price: "140/90",
        img: paneerBiryaniImg,
      },
      {
        name: "Chicken Biryani",
        nameMr: "चिकन बिर्याणी",
        price: "150/100",
        img: chickenBiryaniImg,
      },
      {
        name: "Mutton Biryani",
        nameMr: "मटण बिर्याणी",
        price: "250/180",
        img: muttonBiryaniImg,
      },
      {
        name: "Egg Biryani",
        nameMr: "अंडा बिर्याणी",
        price: "100/80",
        img: eggBiryaniImg,
      },
      {
        name: "Egg Fried Rice",
        nameMr: "अंडा फ्रायड राईस",
        price: "100/80",
        img: eggFriedRiceImg,
      },
      {
        name: "Chicken Fried Rice",
        nameMr: "चिकन फ्रायड राईस",
        price: "120/100",
        img: chickenFriedRiceImg,
      },
      {
        name: "Veg Pulav",
        nameMr: "व्हेज पुलाव",
        price: "150",
        img: vegPulavImg,
      },
    ],
  },
  {
    title: "Saoji Special",
    titleMr: "सावजी स्पेशल",
    items: [
      {
        name: "Baigan Masala",
        nameMr: "बैंगन मसाला",
        price: "140",
        img: baiganMasalaImg,
      },
      {
        name: "Baigan Bharta",
        nameMr: "बैंगन भर्ता",
        price: "120",
        img: baiganBhartaImg,
      },
      {
        name: "Patodi Saoji",
        nameMr: "पाटवडी सावजी",
        price: "160",
        img: patodiSaojiImg,
      },
    ],
  },
  {
    title: "Roti Bread",
    titleMr: "भाकरी / पोळी",
    items: [
      {
        name: "Chapati / Butter Chapati",
        nameMr: "चपाती / बटर चपाती",
        price: "10/15",
        img: butterChapatiImg,
      },
      {
        name: "Tandoori Roti / Butter Roti",
        nameMr: "तंदुरी रोटी / बटर रोटी",
        price: "15/20",
        img: tandooriRotiImg,
      },
      {
        name: "Bhakri (Jawari / Bajri)",
        nameMr: "भाकरी (ज्वारी / बाजरी)",
        price: "25",
        img: bhakriImg,
      },
      {
        name: "Nan / Butter Nan",
        nameMr: "नान / बटर नान",
        price: "30/40",
        img: butterNanImg,
      },
      {
        name: "Garlic Nan / Cheese",
        nameMr: "गार्लिक नान / चीज",
        price: "50/60",
        img: garlicNanImg,
      },
      { name: "Cheese Nan", nameMr: "चीज नान", price: "50", img: cheeseNanImg },
    ],
  },
];
