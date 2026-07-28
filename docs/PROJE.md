# Mırnav — Proje Dokümanı

> Uygulama adı: **Mırnav**. İçerideki "koloni" kelimesi artık marka adı değil, uygulama içindeki kedi galerisi sekmesinin adı olarak kullanılıyor (bkz. Bölüm 6).

## 1. Tek Cümlelik Özet

Kullanıcının odaklanma/dijital detoks seanslarını tamamlayarak sanal bir sokak kedisi kolonisi büyüttüğü, reklamsız, Mırnav Pro aboneliği + kozmetik satışlarıyla gelir üreten bir mobil uygulama.

## 2. Problem ve Fikir

"Forest" tarzı odaklanma uygulamaları (telefonu bırak, sanal bir şey büyüt) dünya genelinde kanıtlanmış bir kategori ama Türkiye'de güçlü, yerel kimliği olan bir rakip yok. Sokak kedisi teması hem duygusal olarak güçlü bir bağ kuruyor (insanlar karakterlere bağlanır) hem de tamamen yerel bir kimlik veriyor — kopyalanması kolay olmayan bir fark yaratıyor.

## 3. Hedef Kitle

- Türkiye'de yaşayan, telefon/sosyal medya kullanımını azaltmak isteyen, 18-35 yaş arası kullanıcılar
- Öğrenciler (ders çalışma seansları) ve uzaktan/hibrit çalışanlar (derin çalışma blokları)
- Kedi/hayvan sevgisi olan, "duygusal bağ kurulan bir karakter" konseptine ilgi duyan kitle

## 4. Temel Döngü (Core Loop)

1. Kullanıcı bir odaklanma seansı başlatır (süre seçer: 15 / 25 / 50 dk veya özel).
2. Seans boyunca uygulamadan çıkılmaz / telefon kilitlenmez varsayımıyla ilerler.
3. Seans tamamlanınca: aktif kedi "beslenir", XP/saat birikir, streak (üst üste gün) güncellenir.
4. Belirli saat eşiklerine ulaşınca yeni bir kedi kilidi açılır (koloniye katılır).
5. Kullanıcı koloni galerisinde biriktirdiği kedileri görür, isim/durumlarını inceler.
6. Zaman zaman kozmetik ürün (kedi kıyafeti, mahalle teması) satın alarak koloniyi özelleştirir.

Seans yarıda kesilirse (uygulamadan çıkma/arka plana alma): seans başarısız sayılır, kedi "üzülür" ama ceza ağır olmamalı — kullanıcıyı suçluluk duygusuyla değil, nazik bir geri bildirimle motive et.

## 5. v1 (MVP) Kapsamı

- [x] Konsept ve ekran tasarımları (mockuplar tamamlandı)
- [x] Odaklanma seansı (sayaç + arka plana geçiş algılama)
- [x] Koloni galerisi (kilitli/açık kedi listesi)
- [x] Seans sonu ödül ekranı
- [x] Streak (günlük seri) takibi
- [ ] Mağaza ekranı (Pro abonelik paywall + kozmetik grid)
- [ ] Bildirimler (günlük hatırlatma, isteğe bağlı)
- [ ] Türkçe + İngilizce dil desteği (öncelik: Türkçe)

**v1'de OLMAYACAKLAR:** kullanıcı hesabı/girişi, sosyal özellikler (arkadaş ekleme, liderlik tablosu), gerçek bağış entegrasyonu, çoklu cihaz senkronizasyonu. Bunlar v2 adayı.

## 6. Ekranlar

Tasarım referansları bu sohbette dört mockup olarak üretildi:

1. **Ana ekran** — dairesel geri sayım sayacı, aktif kedi, streak rozeti, haftalık özet
2. **Koloni galerisi** — 4 sütunlu grid, açık/kilitli kedi kartları, kilit açma süresi
3. **Seans sonu ödül ekranı** — modal, kutlama, streak/ilerleme güncellemesi, paylaş butonu
4. **Mağaza** — Pro abonelik paywall'ı (Free/Pro karşılaştırması, tek CTA) + kozmetik ürün grid'i

Pro ile birlikte gelecek yeni ekranlar (mockup'ı sonra üretilecek): istatistik ekranı (temel/detaylı), zaman tüneli. Bkz. FRONTEND.md Faz 4.

## 7. Gelir Modeli

**Reklam YOK.** Üç katmanlı model (2026-07-28'de tek seferlik Pro'dan abonelik Pro'ya çevrildi, bkz. Bölüm 10):

| Katman                 | İçerik                                                                               | Fiyat                                              |
| ---------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------- |
| Ücretsiz               | Sınırsız odak seansı, 8 temel kedi, streak + koruma, temel istatistik, başarılar, etiketler | —                                                  |
| Mırnav Pro (abonelik)  | Detaylı istatistikler, zaman tüneli, mevsimlik özel kediler, tüm kozmetikler dahil   | 7 gün deneme, ~₺39,90/ay veya ~₺399/yıl (taslak)   |
| Kozmetik IAP (tekil)   | Kedi kıyafetleri, mevsimlik setler                                                   | ₺14,90 - ₺19,90                                    |

Kurallar:

- **Pay-to-focus yok:** hiçbir satın alma odaklanma deneyimini iyileştirmez.
- **Pay-to-progress yok:** hiçbir satın alma ilerlemeyi (kedi kilidi, streak) hızlandırmaz — Forest'ın "3x ödül" çarpanı bilinçli olarak alınmadı.
- **Çekirdek döngü Free'de kısıtlanmaz:** sınırsız seans, koloni ve streak her zaman ücretsiz.

Bu sınırlar App Store/Play Store politikalarıyla da uyumlu ve kullanıcı güvenini korur.

### 7.1 Mırnav Pro Özellik Seti

Forest Plus'tan uyarlanan, kedi temasına çevrilmiş özellikler:

- **Detaylı istatistikler** (Forest "Genel Görünüm" karşılığı): gün/hafta/ay/yıl görünümleri, odak dağılım grafiği, günün koloni görünümü
- **Zaman Tüneli**: seans geçmişi — tamamlanan/başarısız seanslar, açılan kediler, etiketleriyle birlikte
- **Mevsimlik özel kediler** (Forest "mevsimsel kristal ağaçlar" karşılığı): sadece Pro'da açılan dönemlik kediler
- **Tüm kozmetikler dahil**: tekil satılan kıyafet/temaların hepsi abonelikte açık
- **v2 Pro adayları:** "Mahalle Koruması" (uygulama engelleme / ekran süresi — native API, development build gerektirir), gerçek bağış ortaklığı (Forest "Gerçek Orman" karşılığı — sokak hayvanları barınağı)

## 8. Teknoloji Yığını (özet — detaylar FRONTEND.md ve BACKEND.md'de)

- **Frontend:** React Native + Expo (yönetilen iş akışı)
- **Yerel depolama:** MMKV veya AsyncStorage (v1'de sunucu şart değil)
- **Backend:** v1'de opsiyonel/minimal, v2'de senkron ve bağış özellikleri için Fastify + Supabase
- **IAP:** RevenueCat (App Store + Play Store makbuz doğrulamasını soyutlar, kendi backend'imizi büyütmeden başlamamızı sağlar)

## 9. Farklılaşma / Neden Bu İş Modeli

- Sıfır veri API maliyeti (spor verisi projesinin aksine) — içerik tamamen bizim ürettiğimiz illüstrasyon/mekanik
- Tek kullanıcılı ürün — iki taraflı pazar yeri likidite sorunu yok
- Reklamsız model, abonelik + kozmetik satışlarla sürdürülebilir; abonelik tekrarlayan gelir sağlar, kullanıcı sayısı küçük kalsa bile gelir orantılı büyür

## 10. Açık Sorular / Kararlaştırılacaklar

- **Karar kaydı (2026-07-28):** gelir modeli "tek seferlik Pro (~₺49,90) + tekil kozmetik" yerine "Pro aboneliği (7 gün deneme + aylık/yıllık) + tekil kozmetik" olarak değiştirildi. Ödül çarpanı (Forest 3x) bilinçli olarak alınmadı — pay-to-progress yasağı korundu. Katman ayrımı Bölüm 7'de.
- Pro kesin fiyat noktaları (taslak ~₺39,90/ay, ~₺399/yıl) ve yıllık indirim oranı
- Mevsimlik özel kedilerin üretim ritmi (sezon başına kaç kedi, hangi dönemler)
- Gerçek bir hayvan barınağıyla bağış ortaklığı yapılacak mı (v2 fikri, pazarlama değeri yüksek ama operasyonel yük getirir)
- İlk sürümde kaç kedi olacak (öneri: 8-10, sonrasında güncellemelerle genişlet)
- Bildirim sıklığı ve tonu (rahatsız etmeden hatırlatma nasıl kurgulanır)
- Kedi kilit açma saat eşikleri (ilk taslak `src/constants/cats.ts` içinde, balancing testi yapılmadı)
- Geliştirme döneminde MMKV yerine AsyncStorage kullanılıyor (bkz. FRONTEND.md Teknik Notlar) — development build'e geçince MMKV'ye dönülecek

## 11. İlgili Dokümanlar

- `FRONTEND.md` — frontend görev listesi ve teknik detaylar
- `BACKEND.md` — backend görev listesi ve teknik detaylar (v1 sonrası)
- `PROJE_KURALLARI.md` — proje kodlama ve tasarım kuralları
