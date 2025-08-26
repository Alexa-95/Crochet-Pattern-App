# Konfiguracja Appwrite (krok po kroku)

**Założenia**: używamy Appwrite Cloud lub własnej instalacji. Poniżej nazwy/ID możesz
wymyślić samodzielnie; ważne, by je później wkleić do `.env.local`.

## 1) Utwórz projekt
- Zaloguj się do Appwrite Console.
- Kliknij **Create Project** → nadaj nazwę, np. `pixel-art-app`.
- W projekcie przejdź do **Platforms** i dodaj **Web App**.
  - Wpisz adresy: na potrzeby dev możesz użyć `http://localhost:5173`.
  - Zapisz.

## 2) Włącz Email/Password auth
- W **Authentication → Providers** włącz **Email/Password**.
- (Opcjonalnie) Możesz włączyć OAuth (Google, GitHub itd.), ale w tej wersji aplikacji
  używamy e-mail + hasło.

## 3) Utwórz bazę danych i kolekcję
- Przejdź do **Databases** → **Create database** → nazwij np. `pixelart`.
- W środku utwórz **Collection** np. `patterns`.
- Atrybuty kolekcji (wszystkie *required*):
  - `name` (string, 1–128 znaków)
  - `width` (integer)
  - `height` (integer)
  - `pixels` (string) – przechowujemy JSON (spłaszczona tablica kolorów)
- **Permissions**: ustaw **Document-level permissions** w trybie "Only with permissions".
  - Domyślne: wyłącz publiczny odczyt/zapis.
  - W aplikacji dodajemy per dokument: odczyt/aktualizacja/usunięcie tylko dla zalogowanego
    właściciela.

## 4) Skopiuj identyfikatory
- Z poziomu konsoli Appwrite zanotuj:
  - `PROJECT_ID`
  - `DATABASE_ID`
  - `COLLECTION_ID`

## 5) Plik `.env.local`
W katalogu projektu utwórz plik `.env.local` i uzupełnij:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1   # lub Twój self-hosted endpoint
VITE_APPWRITE_PROJECT_ID=...
VITE_APPWRITE_DATABASE_ID=...
VITE_APPWRITE_COLLECTION_ID=...
```

## 6) Reguły CORS
- W **Settings → CORS** dodaj `http://localhost:5173` i (opcjonalnie) `http://127.0.0.1:5173`.

To wszystko. Po uruchomieniu `npm run dev` rejestrujesz konto, logujesz się i możesz zapisywać wzory.
