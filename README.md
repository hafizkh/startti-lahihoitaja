# Startti l&auml;hihoitaja &ndash; tenttimateriaali

Yksinkertaistettu opiskelu- ja tenttimateriaali Taitotalon Startti l&auml;hihoitaja -koulutuksen tenttej&auml; varten.

## Rakenne

```
index.html              Etusivu, listaa kaikki aiheet
docs/<aihe>.html        Yhden aiheen opiskelusivu (helpotettu teksti + tenttiharjoitus + vastausavain)
docs/<aihe>.pdf         Sama sis&auml;lt&ouml; PDF-muodossa
assets/style.css        Yhteinen ulkoasu kaikille sivuille
```

## K&auml;ytt&ouml; (GitHub Pages)

1. Luo GitHub-tili ja uusi julkinen repo, esim. `startti-lahihoitaja-materiaali`.
2. Ty&ouml;nn&auml; t&auml;m&auml;n kansion sis&auml;lt&ouml; siihen:
   ```
   git remote add origin https://github.com/<kayttajanimi>/startti-lahihoitaja-materiaali.git
   git push -u origin main
   ```
3. Mene reposi asetuksiin &rarr; **Settings &rarr; Pages** &rarr; valitse `main`-haara ja `/ (root)` -kansio &rarr; Save.
4. Muutaman minuutin kuluttua sivusto on osoitteessa:
   `https://<kayttajanimi>.github.io/startti-lahihoitaja-materiaali/`

## Uuden aiheen lis&auml;&auml;minen

1. Lis&auml;&auml; uusi `docs/<aihe>.html` -tiedosto samalla pohjalla kuin `docs/ammattietiikka.html`.
2. Lis&auml;&auml; vastaava PDF `docs/<aihe>.pdf`.
3. Lis&auml;&auml; linkki `index.html`-tiedostoon (malli valmiina kommenttina tiedoston lopussa).
4. `git add`, `git commit`, `git push`.
