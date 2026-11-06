# LONGWAVE — podgląd strony

Publiczna próbka projektu strony. GitHub Pages, pliki statyczne.

Oferty: publiczny katalog aplikacji, kopia z 6 listopada 2026; rezerwacje i aktualna dostępność w aplikacji.

Materiały marki LONGWAVE udostępnione na potrzeby podglądu. Brak licencji na dalsze wykorzystanie materiałów marki. Biblioteka Three.js: THREE-LICENSE.txt.

## Optymalizacja 6.11.2026
- Poprawki od tej daty publikujemy również w tym podglądzie, zgodnie z dyspozycją właściciela.
- Wycięte przedmioty: PNG 9 493 622 B → WebP 741 390 B (92% mniej). Oryginały zachowane w projekcie roboczym.
- Ładowanie brzegu równolegle z przejściem i morzem; zachowana gotowość wszystkich trzech przed startem sceny, aby pierwszy scroll nie trafiał na pusty film.
- Usunięto pełnoekranową pustą teksturę GPU (zastąpiona 1×1), powtarzane przebudowy przy identycznym rozmiarze, zdublowane wywołania scroll podczas snap oraz próbkowanie koloru menu, gdy jego kolor jest wymuszony na biały.
- Rozdzielczości i kompresji wideo nie zmieniano; zachowano buforowanie MSE pętli morza.
- Kontrola Chrome headless: 1440×900 i 390×844, wszystkie cztery sceny osiągają docelową pozycję, brak błędów JS; po przejściu do końca strony wszystkie filmy zatrzymane. Pojedyncze zgubione klatki przy starcie (do 3), więc nie jest to gwarancja płynności każdego telefonu.
- Pomiar localhost nie uzasadnia obietnicy przyspieszenia czasu startu: 410 ms przed / 664 ms po (pojedyncze próby, wpływ dekodowania i środowiska). Pewny zysk to 8,75 MB mniej transferu grafik. Pierwsza scena nadal buforuje około 15 MB filmów; adaptacyjne warianty wideo pozostają kolejnym możliwym etapem po testach na urządzeniach.
- Recenzja Claude niedostępna: CLI niezalogowane.

## Mobilne przewijanie — 6.11.2026
Na urządzeniach dotykowych do 920 px: natywne przewijanie, bez WebGL i blokowania gestów zegarem filmu. Hero i pozostałe sekcje widoczne bez autoplay. Opcjonalne pętle deski i muszelki ładowane przy widoczności; obraz pozostaje przy odmowie odtwarzania. Desktop: odmowa play uruchamia fallback, zatrzymany film przejścia zwalnia blokadę po 3,5 s. Test Chrome emulacja iPhone 13, także wymuszone NotAllowedError: dostępne wszystkie sekcje i stopka, brak overflow poziomego, brak błędów JS. WebKit i fizyczny iPhone niedostępne w środowisku; Claude CLI niezalogowane.
