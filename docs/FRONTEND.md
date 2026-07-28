# Frontend — Görev Listesi ve Teknik Notlar

Bkz. `PROJE.md` genel bağlam için, `PROJE_KURALLARI.md` kod standartları için.

## 1. Teknoloji Seçimleri

| Alan           | Seçim                                           | Not                                                        |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| Framework      | React Native + Expo (managed)                   | Hızlı store onayı, OTA güncelleme kolaylığı                |
| Dil            | TypeScript                                      | Zorunlu, `any` kullanımı PROJE_KURALLARI.md'de yasak       |
| State yönetimi | Zustand                                         | Redux'a göre daha az boilerplate, küçük proje için yeterli |
| Yerel depolama | `react-native-mmkv`                             | AsyncStorage'dan çok daha hızlı, senkron okuma/yazma       |
| Navigasyon     | Expo Router                                     | Dosya tabanlı routing, öğrenme eğrisi düşük                |
| Animasyon      | Reanimated 3 + Lottie (kedi animasyonları için) | Sayaç halkası ve kedi hareketleri için                     |
| Bildirimler    | `expo-notifications`                            | Günlük hatırlatma, seans bitiş bildirimi                   |
| IAP            | RevenueCat SDK (`react-native-purchases`)       | Makbuz doğrulamasını soyutlar, kendi backend'i gerektirmez |
| i18n           | `i18next` + `react-i18next`                     | Türkçe varsayılan, İngilizce ikincil                       |
| Test           | Jest + React Native Testing Library             | Kritik mantık (sayaç, unlock sistemi) için                 |

## 2. Klasör Yapısı (öneri)

```
/app                  → Expo Router sayfaları (home, colony, store, settings)
/components           → Paylaşılan UI bileşenleri (Timer, CatCard, ProgressRing)
/features
  /focus-session       → Seans mantığı, AppState dinleyicisi, sayaç
  /colony               → Kedi galerisi, unlock mantığı
  /store                → IAP akışı, ürün listesi
/lib
  /storage             → MMKV wrapper, tip güvenli get/set
  /iap                 → RevenueCat init ve satın alma yardımcıları
  /notifications       → Bildirim planlama mantığı
/assets
  /cats                → Kedi illüstrasyonları/Lottie dosyaları
/locales
  /tr.json, /en.json
```

## 3. Faz 1 — Çekirdek Deneyim (MVP iskeleti)

- [x] Expo projesini kur, TypeScript + ESLint + Prettier yapılandır
- [x] Expo Router ile temel navigasyon (Home / Colony / Store / Settings sekmeleri)
- [x] Zustand store: `sessionStore`, `colonyStore`, `settingsStore` (dil tercihi: sistem/tr/en, settings ekranındaki dil seçiciyle)
- [x] Sayaç bileşeni: geri sayım mantığı, süre seçimi (15/25/50 dk + 5-180 dk arası özel)
- [x] `AppState` dinleyicisi: uygulama arka plana geçerse seansı iptal et, ön plana dönerse durumu değerlendir (5 sn tolerans)
- [x] Seans tamamlanma mantığı: toplam süre, streak, son seans tarihini kalıcı depoya yaz
- [x] Ana ekran UI'ı (mockup'taki dairesel sayaç + aktif kedi görseli)

## 4. Faz 2 — Koloni Sistemi

- [x] Kedi veri modeli (`id`, `isim`, `unlockSaati`, `illüstrasyon` — şimdilik emoji, `açıklama` — locales'ta)
- [x] Unlock mantığı: toplam biriken saate göre otomatik kilit açma
- [x] Koloni galerisi ekranı (grid, kilitli/açık durum, ilerleme yüzdesi)
- [x] Seans sonu ödül modalı (yeni kedi açıldıysa özel kutlama varyantı)
- [x] Streak mantığı: gün atlanırsa sıfırlama kuralı + "streak koruma" hakkı (tek günlük boşluğu 7 günde 1 otomatik affeder; cooldown `constants/session.ts` `StreakProtectionCooldownDays`)

## 5. Faz 3 — Mağaza ve Gelir

Durum (2026-07-28): mağaza UI iskeleti hazır — Pro kartı (özellik listesi + CTA + fiyat/deneme notu), kozmetik grid, `entitlementStore` (local). Satın alma pasif; RevenueCat ve Free/Pro karşılaştırma tablosu bekliyor.

- [ ] RevenueCat abonelik entegrasyonu: aylık/yıllık Pro + 7 gün deneme (App Store Connect + Play Console'da eşleşen ürün ID'leri)
- [ ] Paywall UI: Free/Pro karşılaştırma tablosu, tek net CTA, deneme/yenileme koşulları açıkça yazılır
- [ ] Kozmetik grid + tekil kozmetik IAP (Pro abonelerinde tümü açık gösterilir)
- [x] `entitlementStore`: Pro abonelik ve kozmetik sahipliği durumu (local persist; RevenueCat senkronu entegrasyonla gelecek)
- [ ] Satın alma sonrası unlock mantığı (kozmetik kedi kıyafeti/temanın anında yansıması)
- [ ] "Satın alımları geri yükle" akışı (Apple/Google zorunlu kılıyor) + ayarlarda abonelik yönetimi bağlantısı

## 6. Faz 4 — İstatistik, Etiketler ve Başarılar

Katman ayrımı PROJE.md Bölüm 7'de. Free maddeler Pro'dan önce yapılır ki paywall'da gösterilecek Pro farkı gerçek olsun.

- [x] Etiket seçimi (free): seans başlatırken 7 varsayılan etiketten seçim (renkli çip + modal, `constants/tags.ts`)
- [x] Etiket yönetimi (free): etiket seçicide arama + "oluştur" satırıyla özel etiket ekleme (`tagsStore`, renk paletten sırayla atanır); silme/düzenleme ertelendi
- [x] Seans kaydı altyapısı: her seans tarih/süre/etiket/sonuç ile local geçmişe yazılır (`sessionLogStore`, 2000 kayıt tavanı — istatistik ve tünelin veri kaynağı)
- [x] Temel istatistik ekranı (free): 5. sekme "İstatistik" — bugünkü odak/seans, seri, toplam saat/seans kartları (`features/stats/summary.ts`)
- [x] Başarılar (free): 11 rozet — toplam saat (4/24/72/168/360), üst üste gün (3/7/30, kalıcı `bestStreak` üzerinden), seans sayısı (10/50/200); İstatistik sekmesinden ulaşılır (`app/achievements.tsx`, `constants/achievements.ts`)
- [x] Detaylı istatistikler (Pro): gün/hafta/ay/yıl bar grafikleri + dönem toplamı + çubuğa dokununca değer (`app/detailed-stats.tsx`, `features/stats/bar-chart.tsx`; grafik rengi iki modda da doğrulanmış `#EA580C`, `Colors.chart`)
- [ ] Günün koloni görünümü (Pro, detaylı istatistik içinde): Forest'ın izometrik orman karşılığı — illüstrasyon gerektirir, ertelendi
- [x] Zaman Tüneli (Pro): güne göre gruplu seans geçmişi (tamamlanan/yarıda kalan, etiket + süre + saat), Pro değilse kilit ekranı + mağaza yönlendirmesi; İstatistik sekmesinden ulaşılır (gizli route `app/timeline.tsx`)
- [ ] Mevsimlik özel kediler (Pro): katalog yapısı + koloni galerisinde gösterim

## 7. Faz 5 — Cila ve Yayına Hazırlık

- [ ] Bildirim planlama (günlük hatırlatma, kullanıcı ayarlardan kapatabilmeli)
- [ ] Onboarding akışı (3 ekranlık kısa tanıtım, atlanabilir)
- [ ] Başlangıç Görevleri: ilk açılışta 2-3 görevlik liste (ör. "1 seans tamamla", "koloniyi ziyaret et"), ödül ilk kedinin tanıtımı — satın alma içermez, Forest "Başlangıç Mücadelesi" uyarlaması
- [ ] Karanlık mod desteği
- [ ] Türkçe/İngilizce dil geçişi test
- [ ] Performans: Lottie animasyonlarının düşük uçlu cihazlarda akıcılığı
- [ ] App Store / Play Store metadata (açıklama, ekran görüntüleri, gizlilik politikası sayfası)
- [ ] Analitik (ör. PostHog veya Firebase Analytics — hangi ekranlarda terk edildiği görülebilsin)

## 8. Faz 6 — Hesap ve Senkron (2026-07-28'de v1'e alındı)

Detaylı görev listesi ve şema BACKEND.md Bölüm 2'de. Frontend tarafı:

- [ ] `supabase-js` + env konfigürasyonu, oturum persist (AsyncStorage adapter)
- [ ] Auth gate: oturum yoksa kayıt/giriş ekranı (uygulama girişsiz kullanılamaz)
- [ ] Kayıt/giriş ekranları (e-posta+şifre; hata durumları nazik dille, i18n)
- [ ] Google/Apple giriş butonları (development build sonrası)
- [ ] Store senkron katmanı: girişte pull/merge, seans bitiminde push
- [ ] Ayarlar: çıkış yap + hesap silme

## 9. Teknik Notlar

**Arka plan algılama mantığı (özet):**
`AppState.addEventListener('change', ...)` ile `active` → `background` geçişini yakala. Geçiş anında seans state'ini `interrupted` olarak işaretle. Kullanıcı 3-5 saniye içinde geri dönerse (ör. bildirim çekmesi gibi kazara durumlar) toleranslı davran — anında ceza yerine kısa bir tolerans penceresi bırak, bu kullanıcı deneyimini sertleştirmez.

**Neden MMKV, neden sunucu değil (v1):**
Kullanıcı verisi (seans geçmişi, unlock durumu, streak) tamamen cihazda tutulabilir; bu v1'i basitleştirir, sunucu maliyetini sıfırlar ve gizlilik açısından da avantajlıdır. Çoklu cihaz senkronizasyonu gerçek bir kullanıcı talebi olarak öne çıkarsa `BACKEND.md`'deki v2 planına geçilir.

**Depolama kararı (geliştirme dönemi):**
MMKV native modül olduğu için Expo Go'da çalışmıyor. Geliştirme Expo Go üzerinden sürdüğü için kalıcı depo şimdilik AsyncStorage (zustand persist). Tüm erişim `src/lib/storage.ts` üzerinden geçiyor; development build'e geçildiğinde sadece bu dosya değiştirilerek MMKV'ye dönülecek.
