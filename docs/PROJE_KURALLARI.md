# Proje Kuralları

Bu doküman kod yazarken, tasarım kararı alırken ve ürün kararı verirken referans alınacak kuralları içerir. Amaç: tek kişilik bir projede tutarlılığı korumak ve gelecekte (ekip büyürse) hızlı onboarding sağlamak.

## 1. Ürün Felsefesi

- **Reklam asla yok.** Bu, kullanıcıya verilen bir söz — hiçbir büyüme baskısı bu kuralı değiştirmemeli.
- **Kozmetik satış = etik sınır.** Hiçbir satın alma odaklanma deneyimini "kolaylaştırmamalı" (ör. parayla sahte seans tamamlama gibi bir şey asla eklenmeyecek). Sadece görsel/koleksiyon değeri satılır.
- **Suçluluk duygusu üzerinden büyüme yok.** Streak kırıldığında, seans yarım kaldığında kullanıcıyı utandıran dil/tasarım kullanılmaz. Nazik, teşvik edici ton esas.
- **Basit kalsın.** Her yeni özellik eklenmeden önce "bu, temel deneyimi karmaşıklaştırıyor mu?" sorusu sorulur. Cevap evetse özellik ya sadeleştirilir ya da ertelenir.

## 2. Kod Standartları

- **TypeScript zorunlu.** `any` kullanımı yasak; kaçınılmazsa `// TODO: explain why any` yorumuyla açıklanmalı (bkz. dil kuralı aşağıda — bu yorum da İngilizce yazılır).
- **Fonksiyonel bileşenler + hooks.** Class component yok.
- **Dosya adlandırma:** bileşenler `PascalCase.tsx`, yardımcı fonksiyonlar `camelCase.ts`, klasörler `kebab-case`.
- **Lint/format:** ESLint + Prettier her commit öncesi otomatik çalışır (husky pre-commit hook önerilir).
- **Sabit değerler** (renkler, süreler, eşik değerleri) dosya içine gömülmez, `constants/` altında tek yerden yönetilir.

### 2.1 Dil Kuralı — Kod Tamamen İngilizce

- **Kod içinde Türkçe yasak.** Değişken, fonksiyon, sınıf, tip, dosya ve klasör adları, i18n çeviri dosyalarındaki `key`'ler — hepsi İngilizce yazılır.
- **Tek istisna: kedi karakter isimleri** (Boncuk, Duman, Pamuk, Zeytin gibi). Bunlar marka kimliğinin parçası, kod içinde sabit/string olarak Türkçe haliyle kalır, çevrilmez.
- **Netlik için:** bu kural kaynak kodu (identifier, yorum, commit mesajı) kapsar — `locales/tr.json` içindeki _değerler_ (kullanıcıya gösterilecek gerçek Türkçe arayüz metni) bu kuralın dışındadır, çünkü onlar kod değil, çeviri içeriğidir. `locales/tr.json`'daki `key`'ler yine İngilizce olur (ör. `"session_complete_title": "Boncuk'un karnı doydu"`).

### 2.2 Yorum Satırı Kuralı

- **Yapay zeka (Claude Code, Copilot vb.) tarafından üretilen kodda yorum satırı asla eklenmeyecek.** AI çıktısı temiz, yorumsuz teslim edilir.
- İnsan tarafından elle yazılan kodda, gerçekten gerekliyse (karmaşık iş mantığı, "neden böyle" açıklaması) kısa ve İngilizce yorum eklenebilir — ama varsayılan davranış yorum eklememektir. Kod zaten "ne"yi anlatıyor olmalı.

## 3. Commit ve Branch Kuralları

- **Commit mesajları her zaman İngilizce yazılır.** Türkçe commit mesajı kabul edilmez, istisna yok.
- **Conventional Commits** formatı: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
- Örnek: `feat: add colony gallery grid view`
- **Branch adlandırma:** İngilizce, örn. `feature/colony-gallery`, `fix/timer-background-bug`
- Küçük, sık commit'ler tercih edilir — tek dev projede bile geçmişi okunabilir tutmak ileride işe yarar (özellik geri alma, hata ayıklama).

## 4. Tasarım Kuralları

- **Karanlık mod zorunlu** — her ekran hem açık hem koyu modda test edilir.
- **Renk paleti:** kedi/mahalle temaları için sıcak tonlar (amber, coral) ana karakter rengi; UI kromu için nötr gri. Bkz. mockup ekranlarındaki renk kullanımı referans alınabilir.
- **Tipografi:** sistem fontu kullanılır (React Native varsayılanı), özel font yüklemesi performans/paket boyutu nedeniyle v1'de yapılmaz.
- **Erişilebilirlik:** tüm ikon-only butonlarda `accessibilityLabel` zorunlu; kontrast oranı WCAG AA seviyesinin altına düşmemeli.
- **Animasyon süresi:** hiçbir geçiş/animasyon 400ms'yi geçmez — akıcı hissettirmeli, kullanıcıyı bekletmemeli.

## 5. Yerelleştirme (i18n) Kuralları

- Tüm kullanıcıya görünen metin `locales/{dilKodu}.json` yapısı üzerinden yönetilir — kod içine gömülü (hardcoded) string yasak, dil fark etmeksizin.
- Çeviri dosyalarındaki `key`'ler İngilizce (bkz. madde 2.1); her dosyanın içindeki değerler o dilde yazılır — `tr.json` Türkçe, `en.json` İngilizce.
- **Birincil dil Türkçe (`tr`), ikincil dil İngilizce (`en`).** Yeni metin önce Türkçe yazılır, sonra İngilizce çevirisi eklenir.
- Yapı en baştan çoklu dile açık tasarlanır — v1'de sadece `tr` + `en` olsa da, ileride yeni bir dil eklemek sadece yeni bir `locales/{dilKodu}.json` dosyası eklemek ve dil seçiciye satır eklemekten ibaret olmalı; kodun herhangi bir yerinde dil sayısına göre hardcoded mantık (`if tr ... else en`) kurulmaz.
- Karakter isimleri (Boncuk, Duman, Pamuk, Zeytin gibi) hiçbir dilde çevrilmez, marka kimliğinin parçasıdır — bu, madde 2.1'deki tek istisnayla birebir örtüşür.

## 6. Mağaza / Gelir Kuralları

- Paywall'da **tek net CTA** olur, kullanıcıyı çoklu seçenekle boğmayız.
- Fiyatlar yerel para biriminde (₺) gösterilir, store'un otomatik kur çevrimine güvenilir.
- Hiçbir satın alma "geri sayımlı sahte indirim" gibi baskı taktikleriyle sunulmaz (App Store/Play Store politikalarına da aykırı, kullanıcı güvenini de zedeler).
- "Satın alımları geri yükle" seçeneği her zaman ayarlar ekranında görünür olmalı.

## 7. Test ve Kalite

- Kritik iş mantığı (sayaç, unlock hesaplama, streak hesaplama) için birim test zorunlu — bu fonksiyonlar sessiz hata verirse kullanıcı güveni doğrudan zedelenir.
- UI bileşenleri için görsel regresyon testi v1'de opsiyonel (tek kişilik proje için maliyeti şu an yüksek).
- Her store gönderiminden önce gerçek cihazda (simülatör değil) en az bir tam kullanıcı akışı test edilir.

## 8. Karar Değişikliği Süreci

Bu kurallardan biri değiştirilmek istenirse: değişiklik `PROJE.md`'nin "Açık Sorular" bölümüne not düşülür, karar verildikten sonra ilgili kural burada güncellenir. Kurallar sabit değil ama sessizce değiştirilmez — değişiklik iz bırakır.
