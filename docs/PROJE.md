# Mırnav — Proje Dokümanı

> Uygulama adı: **Mırnav**. İçerideki "koloni" kelimesi artık marka adı değil, uygulama içindeki kedi galerisi sekmesinin adı olarak kullanılıyor (bkz. Bölüm 6).

## 1. Tek Cümlelik Özet

Kullanıcının odaklanma/dijital detoks seanslarını tamamlayarak sanal bir sokak kedisi kolonisi büyüttüğü, reklamsız, tek seferlik satın alma + kozmetik ürünlerle gelir üreten bir mobil uygulama.

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
- [ ] Mağaza ekranı (Pro paket + tekil kostüm satın alma)
- [ ] Bildirimler (günlük hatırlatma, isteğe bağlı)
- [ ] Türkçe + İngilizce dil desteği (öncelik: Türkçe)

**v1'de OLMAYACAKLAR:** kullanıcı hesabı/girişi, sosyal özellikler (arkadaş ekleme, liderlik tablosu), gerçek bağış entegrasyonu, çoklu cihaz senkronizasyonu. Bunlar v2 adayı.

## 6. Ekranlar

Tasarım referansları bu sohbette dört mockup olarak üretildi:

1. **Ana ekran** — dairesel geri sayım sayacı, aktif kedi, streak rozeti, haftalık özet
2. **Koloni galerisi** — 4 sütunlu grid, açık/kilitli kedi kartları, kilit açma süresi
3. **Seans sonu ödül ekranı** — modal, kutlama, streak/ilerleme güncellemesi, paylaş butonu
4. **Mağaza** — öne çıkan "Pro" paketi (2px vurgulu kart) + kozmetik ürün grid'i

## 7. Gelir Modeli

**Reklam YOK.** İki katmanlı model:

| Katman                    | İçerik                                                             | Fiyat           |
| ------------------------- | ------------------------------------------------------------------ | --------------- |
| Ücretsiz                  | Sınırsız odaklanma seansı, ilk birkaç kedi, temel istatistikler    | —               |
| Mırnav Pro (tek seferlik) | Sınırsız mahalle teması, tüm temel kediler, gelişmiş istatistikler | ~₺49,90         |
| Kozmetik IAP (tekil)      | Kedi kıyafetleri, mevsimlik setler                                 | ₺14,90 - ₺19,90 |

Kural: **hiçbir kozmetik ürün odaklanma deneyimini iyileştirmemeli** (pay-to-focus yok) — sadece görsel/koleksiyon değeri olmalı. Bu, App Store/Play Store politikalarıyla da uyumlu ve kullanıcı güvenini korur.

## 8. Teknoloji Yığını (özet — detaylar FRONTEND.md ve BACKEND.md'de)

- **Frontend:** React Native + Expo (yönetilen iş akışı)
- **Yerel depolama:** MMKV veya AsyncStorage (v1'de sunucu şart değil)
- **Backend:** v1'de opsiyonel/minimal, v2'de senkron ve bağış özellikleri için Fastify + Supabase
- **IAP:** RevenueCat (App Store + Play Store makbuz doğrulamasını soyutlar, kendi backend'imizi büyütmeden başlamamızı sağlar)

## 9. Farklılaşma / Neden Bu İş Modeli

- Sıfır veri API maliyeti (spor verisi projesinin aksine) — içerik tamamen bizim ürettiğimiz illüstrasyon/mekanik
- Tek kullanıcılı ürün — iki taraflı pazar yeri likidite sorunu yok
- Reklamsız model, tek seferlik + kozmetik satışlarla sürdürülebilir; kullanıcı sayısı küçük kalsa bile gelir orantılı büyür

## 10. Açık Sorular / Kararlaştırılacaklar

- Gerçek bir hayvan barınağıyla bağış ortaklığı yapılacak mı (v2 fikri, pazarlama değeri yüksek ama operasyonel yük getirir)
- İlk sürümde kaç kedi olacak (öneri: 8-10, sonrasında güncellemelerle genişlet)
- Bildirim sıklığı ve tonu (rahatsız etmeden hatırlatma nasıl kurgulanır)
- Kedi kilit açma saat eşikleri (ilk taslak `src/constants/cats.ts` içinde, balancing testi yapılmadı)
- Geliştirme döneminde MMKV yerine AsyncStorage kullanılıyor (bkz. FRONTEND.md Teknik Notlar) — development build'e geçince MMKV'ye dönülecek

## 11. İlgili Dokümanlar

- `FRONTEND.md` — frontend görev listesi ve teknik detaylar
- `BACKEND.md` — backend görev listesi ve teknik detaylar (v1 sonrası)
- `PROJE_KURALLARI.md` — proje kodlama ve tasarım kuralları
