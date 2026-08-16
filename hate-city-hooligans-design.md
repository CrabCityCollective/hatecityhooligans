# Hate City Hooligans — Design Document

*Werktitel, eerder "Crab City Hooligans". Management/simulatiegame waarin je een hooligan-gang runt.*

---

## Concept

Je managet een gang van voetbalhooligans. Elk weekend is er een gevecht met de rivaliserende club, waar je "beruchtheid" opbouwt (of verliest). Doordeweeks recruteer je nieuwe leden, koop je uitrusting in, en beheer je de balans tussen geweld en politie-aandacht.

De hooligans zelf zijn de kern van het spel: elk heeft een unieke set persoonlijkheids-traits die bepalen hoe ze zich gedragen tijdens het gevecht, bij recruitment, en bij arrestatie.

---

## 1. Het Gevecht

**Type:** Chaotisch vrij-voor-allen, top-down zicht, passief (speler bereidt voor, kijkt daarna toe).

**Opstelling:**
- Twee groepen van 5-8 hooligans spawnen tegenover elkaar op een plein/straat
- Elk poppetje toont: naam, haat-niveau richting tegenstander (visuele indicator)
- Simpele top-down sprites met ren-, stomp- en vechtanimaties

**Targeting:**
- Elke hooligan scant het veld en scoort tegenstanders op haat (rivaliserende club sowieso + bonus als tegenstander een gehate eigenschap heeft: tattoo, snor, jong, etc.)
- Rent naar hoogst scorende target
- Is target al in gevecht? Dan sluit hij aan bij dat gevecht (kluitjesvorming)

**Snelheid:**
- Cocaïne: 2x snelheid, eerder bij het gevecht
- Dronken: trager, maar blijft langer op het veld staan

**Duels (sustained):**
- Bij contact "vergrendelen" twee (of meer) hooligans in een vechtanimatie
- Health/stamina-balkje boven elk poppetje tikt weg per tick
- Schade-modifiers: vechtsport-trait (bonus), wapens (grote bonus), dronken (mist vaker), haat-niveau tegen die specifieke tegenstander (bonus damage)
- **2-tegen-1 (of meer):** zwaar in het nadeel van de underdog — geen adrenaline/underdog-bonus, gewoon rauwe optelsom van schade
- Winnaar: zoekt nieuw target. Verliezer: vlucht (afhankelijk van trait) of gaat neer (KO)

**Neergeslagen hooligans:**
- Blijven liggen op het veld (uit het gevecht)
- Kunnen later opgepakt worden door de politie als de meter hoog genoeg is

**Einde van het gevecht:**
- Een volledig gevecht (full clear, iedereen bij tegenstander KO) is zeldzaam — meestal wordt het afgebroken door de politie
- **Afgebroken gevecht (de norm):** score op basis van aantal KO's op het moment van afbreken
- **Full clear (uitzondering):** je krijgt de volledige beruchtheid die er te verdienen viel, plus een bonus gebaseerd op de beruchtheid van de tegenstander (zwakke tegenstander clearen = makkelijk maar weinig winst; beruchte rivaal full clearen = zeldzaam en zeer lucratief)

---

## 2. Politie-meter

**Opbouw:**
- Stijgt puur op basis van de beruchtheid van je eigen gang (niet op basis van acties/geweld tijdens het gevecht zelf)
- Hoe beruchter je gang, hoe sneller de meter oploopt bij elk volgend gevecht — een self-balancing catch-22

**Bivakmutsen:**
- Verhogen niet de duur tot de meter vol is, maar geven hooligans een hogere *tolerantie* voor de meter (ze blijven langer staan voordat ze vluchten)

**Als de meter vol is:**
- "Verstandige" hooligans (iedereen behalve dronken/KO, met trait-modifiers) vluchten het veld af
- Dronken hooligans blijven staan (zien het gevaar niet / kunnen niet meer vluchten)
- KO'de hooligans liggen er nog steeds, kunnen niet vluchten
- Politie pakt de achterblijvers (dronken + KO) op

**Preventieve arrestatie (los systeem, zie §4):**
- Losstaand van de meter tijdens het gevecht — gebeurt al bij aankoop van riskante uitrusting

---

## 3. Arrestatie-uitkomsten (trait-gebaseerd)

Als een hooligan wordt opgepakt (tijdens het gevecht of preventief), bepalen zijn traits de uitkomst — een spectrum tussen drie gevolgen:

| Trait | Effect |
|---|---|
| Heeft een gezin / kantoorbaan | Praat sneller (verraadt teamleden → hogere politie-meter volgende week), maar zelf kortere straf |
| Opgegroeid in de stad | Kent zijn rechten, houdt mond dicht, korte straf |
| Woont in een dorp | Onbekend bij de lokale politie, mindere kans op herkenning bij volgend gevecht |
| Alcoholprobleem | Hogere kans op recidive-dossier → langere straf, kans op permadeath |
| Houdt van raven / drugsgebruik | Extra aanklacht (bezit) → langere straf |
| Kickboksen / karate | Wordt gezien als "getraind" → zwaarder aangerekend, langere straf |
| Geen bijzondere traits | Baseline: kort tijdelijk verlies |

**Mogelijke uitkomsten:**
1. Tijdelijk verlies (X weken niet inzetbaar)
2. Permanent verlies (permadeath — moet vervangen worden)
3. Verraad (politie-meter volgende week extra hoog) — kan gecombineerd worden met uitkomst 1 of 2

---

## 4. Economie & Uitrusting

**Inkomsten:**
- Bijbaantje-trait: laag inkomen, geen invloed op gedrag tijdens gevecht
- Kantoorbaan-trait: hoog inkomen, maar deze hooligan is de eerste die vlucht zodra de politie-meter oploopt
- Dit zijn de enige inkomstenbronnen — de gevechten zelf leveren geen geld op

**Aankopen — Bouwmarkt (goedkoop, laag risico):**
| Item | Effect | Verbruik |
|---|---|---|
| Plank met spijkers | Matige schade-bonus | Meestal kapot na 1 gevecht |
| Hamer | Matige schade-bonus | Meestal kapot na 1 gevecht |

**Aankopen — Dark web (duurder, effectiever, risico op preventieve arrestatie):**
| Item | Effect | Verbruik | Preventie-arrestatierisico |
|---|---|---|---|
| Bivakmuts | Hogere politie-tolerantie tijdens gevecht (EU-verboden, dus verplicht dark web) | Permanent | Laag |
| Pepperspray | Stun/schade | Verbruikt na gebruik | Laag-midden |
| Taser | Stun-effect | Permanent (oplaadbaar) | Midden |
| Wapenstok | Hoge schade-bonus | Permanent | Midden-hoog |
| Vuurwapen | Zeer hoge winstkans-boost in het gevecht | Permanent | Extreem hoog — en zorgt dat de politie-meter volgende week vrijwel meteen vol zit → waarschijnlijk je hele gang opgepakt (game over/zware reset). De "nucleaire optie". |

**Preventieve arrestatie-mechanisme:**
- Je wijst bij elke dark web-bestelling een hooligan aan als "ontvanger" van de levering
- Risico wordt direct bij bestelling bepaald (niet pas bij gebruik in het gevecht)
- Bij onderschepping: die hooligan is opgepakt (uitkomst via trait-tabel, §3) én de hele bestelling is kwijt

---

## 5. Voetbal-gok-systeem

- Je kunt alleen wedden op de wedstrijd van je **eigen club** (win/verlies/gelijkspel, odds gebaseerd op vorm)
- Voetbaluitslag is bekend vóór het hooligan-gevecht (wedstrijd → knokpartij erna, logische tijdlijn)
- **Verlies van je club** → alle hooligans krijgen een tijdelijke haat/agressie-boost voor het gevecht die dag
- **Winst of gelijkspel** → neutraal, geen modifier
- Innerlijk conflict voor de speler: winst hopen voor het geld, maar eigenlijk verlies willen voor een sterker team

---

## 6. Recruitment

**Locaties (met eigen trait-bias):**
- Sportschool → hoge kans op kickboksen/karate
- Rave → hoge kans op xtc/houdt van raven
- Schoolplein → alleen relevant als je zelf hooligans met "heeft een gezin"-trait hebt; hoge kans op gezin-trait
- (Uit te breiden: kroeg, dark web forum, stadion, etc.)

**Beruchtheid-effect:**
- Hoe beruchter je gang, hoe beter de kwaliteit van de kandidatenpool
- Maar ook: hoe beruchter, hoe groter de kans op een undercover agent tussen de kandidaten

**Interview-systeem:**
- 5 generieke vragen + 1 locatie-specifieke vraag beschikbaar
- Je kiest **3 van de 6** om te stellen
- Elke vraag geeft een signaal over een trait (niet 100% zeker — behalve de locatie-specifieke vraag, die iets betrouwbaarder is)
- Generieke vragen:
  1. "Wat vind je van [rivaliserende club]?" → haat-niveau + specifieke club
  2. "Waar ben je opgegroeid?" → stad/dorp
  3. "Biertje?" → alcohol-trait
  4. "Heb je een vaste baan of gezin?" → gezin/baan-trait
  5. "Wat doe je het liefst in het weekend?" → drugsvoorkeur (algemeen)
- Locatie-specifieke vragen:
  - Sportschool: "Doe je aan vechtsport?" → kickboksen/karate (betrouwbaar)
  - Rave: "Wat is je drug van keuze vanavond?" → specifieke drugsvoorkeur (betrouwbaar)
  - Schoolplein: "Heb je zelf kinderen?" → bevestigt gezin-trait + sub-vraag over agressie t.b.v. bescherming kind
- Na 3 vragen: beslissing (aannemen/afwijzen)
- **Na de beslissing worden alle traits volledig onthuld** — direct leermoment of je goed gokte
- Gratis (geen geld/tijdskosten) — puur informatie/skill-based keuze

---

## 7. Hooligan Traits (overzicht)

**Achtergrond:**
- Zit op kickboksen / karate
- Houdt van raven
- Heeft een gezin
- Heeft een kantoorbaan / bijbaantje
- Woont in een dorp / opgegroeid in de stad

**Middelen:**
- Lievelingsdrugs: wiet, cocaïne, alcohol, xtc
- Cocaïne → 2x rensnelheid, eerder bij het gevecht
- Alcohol (op) → blijft langer, maar mist vaker
- Alcoholprobleem → soms afwezig bij het gevecht (te brak)

**Haat-triggers:**
- Rivaliserende club (altijd, vaak één club in het bijzonder)
- Jongeren
- Mensen met een snor
- Mensen met tattoos
- Mensen met een andere huidskleur
- Mensen met huisdieren
- Hoe meer haat, hoe agressiever + meer schade tegen dat specifieke doelwit

---

## 8. Progressie & Divisiestructuur

**Structuur:** Divisie-klimmen (optie C) — begin in de laagste divisie, klim via beruchtheid + overwinningen naar hogere, gevaarlijkere divisies. Degradatie mogelijk bij falen; game over bij totale gang-ineenstorting.

**Divisie 3 (Tweede Divisie) — 16 clubs (excl. beloften):**
Rijnsburgse Boys, De Treffers, GVVV, Koninklijke HFC, Barendrecht, HHC Hardenberg, RKAV Volendam, Spakenburg, IJsselmeervogels, Quick Boys, VV Katwijk, HSV Hoek, Kloetinge, Kozakken Boys, AFC, Rohda Raalte

**Divisie 2 (Keuken Kampioen Divisie) — 16 clubs (excl. beloften):**
FC Volendam, NAC Breda, Heracles Almelo, De Graafschap, Roda JC Kerkrade, FC Dordrecht, Almere City, RKC Waalwijk, FC Den Bosch, VVV-Venlo, FC Eindhoven, Helmond Sport, MVV Maastricht, FC Emmen, TOP Oss, Vitesse

**Divisie 1 (Eredivisie) — 18 clubs:**
Ajax, PSV, Feyenoord, AZ, FC Twente, FC Utrecht, Go Ahead Eagles, Sparta Rotterdam, NEC Nijmegen, Fortuna Sittard, PEC Zwolle, SC Heerenveen, Excelsior, FC Groningen, Telstar, Willem II, ADO Den Haag, SC Cambuur

*(Totaal: 50 echte clubs over drie niveaus)*

---

## 9. Rivaliteiten (voor haat-toewijzing tussen clubs)

| Club | Aartsrivaal / rivalen | Aard |
|---|---|---|
| Ajax | Feyenoord (De Klassieker) | Grootste, historisch, stedenrivaliteit Amsterdam-Rotterdam |
| Ajax | PSV (De Topper) | Historische topdrie-rivaliteit |
| Feyenoord | Sparta Rotterdam | Streekderby, twee oudste clubs van Rotterdam |
| Feyenoord | Excelsior | "Klein broertje"/ex-satellietclub, maar ook openlijke vijandigheid (bv. 2017 titelverlies) |
| PSV | FC Eindhoven | Lichtstadderby, sinds 1915, gevestigde club vs volksclub |
| AZ | Ajax | Asymmetrisch — voor AZ de meest beladen wedstrijd, niet wederzijds |
| AZ | FC Twente | Recentere rivaliteit (laatste jaren) |
| AZ | Telstar / Haarlem | Oudere regionale rivaliteit (Eerste Divisie-periode) |
| FC Twente | Heracles Almelo | Twentse derby, sinds jaren '60 |
| NAC Breda | Willem II | Brabantse derby, sinds begin 20e eeuw |
| Vitesse | NEC | Gelderse derby |
| Fortuna Sittard | Roda JC Kerkrade | Limburgse derby (west vs oost) |
| PEC Zwolle | Go Ahead Eagles | IJsselderby, sinds 1983 |
| TOP Oss | FC Den Bosch | Brabantse regioderby, ~20 km afstand |
| SC Cambuur | SC Heerenveen | Friese kwestie (Cambuur profileert zich als "Hollands") |
| FC Groningen | SC Heerenveen | Groningen vs Friesland |
| FC Utrecht | Ajax | Asymmetrisch, niet wederzijds |
| Excelsior | Sparta Rotterdam | Eigenlijke Rotterdamse stadsderby, socio-economische wortels |
| Quick Boys | Katwijk | Felle amateur-regio-rivaliteit |

*Nog geen specifieke aartsrivaal gevonden voor: Willem II (behalve als tegenpartij van NAC), ADO Den Haag, De Graafschap, Almere City, RKC Waalwijk, VVV-Venlo, MVV Maastricht, FC Emmen, Helmond Sport, FC Dordrecht, en de meeste Tweede Divisie-clubs behalve Quick Boys/Katwijk. Voor deze clubs kan desgewenst nog verder onderzoek gedaan worden, of ze kunnen fictieve/generieke rivaliteiten toegewezen krijgen.*

---

## Openstaande ontwerpvragen (nog te verfijnen)

- Trait-interacties (bijv. alcoholprobleem + kickbokser — hoe werken tegenstrijdige traits samen?)
- Moeilijkheidscurve (hoe voorkom je dat hogere beruchtheid te makkelijk snowballt?)
- Verdere divisiestructuur-mechanica (promotie/degradatie-regels, hoeveel gevechten per seizoen, etc.)
- Sensitieve haat-traits (huidskleur, etc.) — toon/framing zodat het spel deze niet verheerlijkt maar als lelijke eigenschap van de personages neerzet
