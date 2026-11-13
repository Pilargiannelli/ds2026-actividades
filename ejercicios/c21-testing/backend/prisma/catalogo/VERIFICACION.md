# Verificación del catálogo

Generado a partir de `verificacion.json` (contraste con Open Library; último lote verificado: 2026-11-13).
Para repetirlo: `npx tsx prisma/catalogo/verificar.ts --openlibrary [--lotes=literatura,gastronomia]`.

## Resumen

| Estado | Registros |
|---|---:|
| Confirmados en Open Library (título + autor, año consistente) | 722 |
| Verificados con búsqueda web puntual | 3 |
| **Pendientes de verificación** | **258** |
| Total | 983 |

Criterio: año y editorial son los de la **primera edición**. Un registro queda pendiente cuando
Open Library no encontró la obra (revistas, títulos en idioma original, catálogos de museo) o la
encontró con otro año. Revisados uno por uno, casi todos esos desacuerdos son de Open Library
(reediciones posteriores, años imposibles anteriores al autor, coincidencias con otra obra): se
mantiene el año de primera edición, pero sin confirmación externa todavía.

Datos vaciados por no poder confirmarlos: *Beware Wet Paint*, *White*, *Ex-formation*, *The Camera*, *The Industrial Design Reader*, *Manuale tipografico*.
Los libros nuevos no tienen descripción: no se inventa. La nacionalidad del autor solo figura
donde está verificada (todos los autores de Literatura la tienen).

## Pendientes, por lote

### Base (fondo original + 1.ª ampliación) (12)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| El principito | Antoine de Saint-Exupéry | 1943 | Open Library: 1980 («El Principito») |
| S,M,L,XL | Rem Koolhaas | 1995 | No encontrado en Open Library |
| Made You Look | Stefan Sagmeister | 2001 | Open Library: 2012 («Sagmeister : Made You Look») |
| Punkt und Linie zu Fläche | Wassily Kandinsky | 1926 | Open Library: 1928 («Punkt und Linie zu Fläche») |
| The Shock of the New | Robert Hughes | 1980 | Open Library: 1821 («The Shock of the new») |
| Sumo | Helmut Newton | 1999 | Open Library: 1994 («Helmut Newton. SUMO, 20th Anniversary Edition») |
| Rei Kawakubo/Comme des Garçons: Art of the In-Between | Andrew Bolton | 2017 | No encontrado en Open Library |
| Arte come mestiere | Bruno Munari | 1966 | Open Library: 1972 («Arte come mestiere») |
| The Design of Everyday Things | Don Norman | 1988 | No encontrado en Open Library |
| Helvetica: Homage to a Typeface | Lars Müller | 2002 | Open Library: 1936 («Helvetica») |
| Whole Earth Catalog | Stewart Brand | 1968 | Open Library: 1971 («Next Whole Earth Catalog») |
| The Visual Display of Quantitative Information | Edward Tufte | 1983 | Open Library: 1731 («The Visual Display of Quantitative Information») |

### Arquitectura (19)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| A Pattern Language | Christopher Alexander, Sara Ishikawa y Murray Silverstein | 1977 | Open Library: 1968 («A pattern language») |
| Studies in Tectonic Culture | Kenneth Frampton | 1995 | Open Library: 1985 («Studies in Tectonic Culture») |
| An Outline of European Architecture | Nikolaus Pevsner | 1943 | Open Library: 1945 («An outline of European architecture») |
| Megastructure: Urban Futures of the Recent Past | Reyner Banham | 1976 | Open Library: 1920 («Megastructure») |
| Espèces d'espaces | Georges Perec | 1974 | No encontrado en Open Library |
| Junkspace with Running Room | Rem Koolhaas y Hal Foster | 2013 | No encontrado en Open Library |
| Hot to Cold: An Odyssey of Architectural Adaptation | Bjarke Ingels Group | 2015 | No encontrado en Open Library |
| Œuvre complète 1910–1929 | Le Corbusier y Pierre Jeanneret | 1929 | Open Library: 1937 («Oeuvre complète, 1910-1929») |
| Mies van der Rohe: A Critical Biography | Franz Schulze | 1985 | Open Library: 1982 («Mies Van Der Rohe») |
| Alvar Aalto: The Early Years | Göran Schildt | 1984 | Open Library: 1964 («Alvar Aalto») |
| Peter Zumthor: Buildings and Projects 1985–2013 | Thomas Durisch | 2014 | Open Library: 1900 («Peter Zumthor, 1985-2013») |
| Made in Tokyo | Atelier Bow-Wow | 2001 | No encontrado en Open Library |
| Carlo Scarpa: The Complete Works | Francesco Dal Co y Giuseppe Mazzariol | 1984 | Open Library: 1979 («Carlo Scarpa») |
| Supercritical | Peter Eisenman y Rem Koolhaas | 2010 | No encontrado en Open Library |
| Hadid: Complete Works 1979–Today | Philip Jodidio | 2012 | Open Library: 2009 («Zaha Hadid») |
| Herzog & de Meuron: Natural History | Philip Ursprung | 2002 | Open Library: 1899 («Herzog & de Meuron») |
| Glenn Murcutt: Thinking Drawing / Working Drawing | Glenn Murcutt | 2008 | Open Library: 1999 («Glenn Murcutt») |
| I quattro libri dell'architettura | Andrea Palladio | 1570 | Open Library: 1581 («I quattro libri dell'architettura») |
| Five Architects | Peter Eisenman, Michael Graves, Charles Gwathmey, John Hejduk y Richard Meier | 1972 | Open Library: 1975 («Five architects») |

### Diseño gráfico (21)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| Pentagram: The Compendium | Pentagram | 1993 | Open Library: 1973 («Pentagram») |
| Geschichte der visuellen Kommunikation | Josef Müller-Brockmann | 1971 | No encontrado en Open Library |
| Methodik der Form- und Bildgestaltung | Armin Hofmann | 1965 | Open Library: 1973 («Graphic Design Manual: Principles and Practice/Methodik Der ») |
| Beware Wet Paint | Alan Fletcher | — | Año vaciado (dudoso) |
| Ken Garland: Structure and Substance | Adrian Shaughnessy | 2012 | No encontrado en Open Library |
| FHK Henrion: The Complete Designer | Adrian Shaughnessy | 2013 | No encontrado en Open Library |
| Graphic Design: A User's Manual | Adrian Shaughnessy | 2009 | Open Library: 2005 («How to be a graphic designer, without losing your soul») |
| Bradbury Thompson: The Art of Graphic Design | Bradbury Thompson | 1988 | No encontrado en Open Library |
| El Lissitzky: Life, Letters, Texts | Sophie Lissitzky-Küppers | 1967 | Open Library: 1992 («El Lissitzky») |
| Marks of Excellence | Per Mollerup | 1997 | Open Library: 1995 («Marks of Excellence») |
| Envisioning Information | Edward Tufte | 1990 | Open Library: 1987 («Envisioning Information») |
| Sémiologie graphique | Jacques Bertin | 1967 | Open Library: 1900 («Sémiologie graphique») |
| M to M of M/M (Paris) | Emily King | 2012 | Open Library: 1641 («M to M of M/M») |
| Printed Matter / Drukwerk | Karel Martens | 1996 | Open Library: 2010 («Printed Matter / Drukwerk») |
| Tibor Kalman: Perverse Optimist | Peter Hall y Michael Bierut | 1998 | Open Library: 2000 («Tibor Kalman») |
| Paula Scher: Works | Paula Scher | 2017 | Open Library: 2008 («Paula Scher») |
| Letters on America | Ed Fella | 2000 | No encontrado en Open Library |
| White | Kenya Hara | — | Año vaciado (dudoso) |
| Ex-formation | Kenya Hara | — | Año vaciado (dudoso) |
| Women in Graphic Design 1890–2012 | Gerda Breuer y Julia Meer | 2012 | No encontrado en Open Library |
| Abram Games: His Life and Work | Naomi Games, Catherine Moriarty y June Rose | 2003 | Open Library: 1990 («Abram Games») |

### Arte (24)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| Art and Illusion | E. H. Gombrich | 1960 | Open Library: 1956 («Art and illusion») |
| Le vite de' più eccellenti pittori, scultori e architettori | Giorgio Vasari | 1550 | Open Library: 1568 («Le vite de' piu eccellenti pittori scultori e architettori») |
| Pädagogisches Skizzenbuch | Paul Klee | 1925 | Open Library: 2018 («Pädagogisches Skizzenbuch») |
| Vincent van Gogh: The Letters | Vincent van Gogh | 2009 | Open Library: 1914 («Vincent van Gogh») |
| Matisse on Art | Jack Flam | 1973 | Open Library: 1978 («Matisse on Art») |
| Gerhard Richter: Panorama | Mark Godfrey y Nicholas Serota | 2011 | Open Library: 2016 («Gerhard Richter : Panorama : A Retrospective») |
| Hockney's Pictures | David Hockney | 2004 | Open Library: 1992 («Hockney's pictures») |
| David Hockney by David Hockney | David Hockney | 1976 | Open Library: 1971 («David Hockney by David Hockney») |
| Writings | Agnes Martin | 1992 | Open Library: 1894 («The inventions, researches and writings of Nikola Tesla») |
| Robert Smithson: The Collected Writings | Jack Flam | 1996 | No encontrado en Open Library |
| Art Since 1900 | Hal Foster, Rosalind Krauss, Yve-Alain Bois y Benjamin H. D. Buchloh | 2004 | Open Library: 2001 («Art since 1900») |
| Postproduction | Nicolas Bourriaud | 2002 | Open Library: 2000 («Postproduction») |
| Art | Clive Bell | 1914 | Open Library: 1844 («Art on My Mind») |
| Against Interpretation | Susan Sontag | 1966 | Open Library: 1961 («Against Interpretation») |
| Interviews, Volume 1 | Hans Ulrich Obrist | 2003 | No encontrado en Open Library |
| Joseph Beuys | Caroline Tisdall | 1979 | Open Library: 1974 («Joseph Beuys») |
| Edward Hopper: An Intimate Biography | Gail Levin | 1995 | Open Library: 1979 («Edward Hopper») |
| Georgia O'Keeffe | Georgia O'Keeffe | 1976 | Open Library: 1960 («Georgia O'Keeffe») |
| Olafur Eliasson: Experience | Olafur Eliasson | 2018 | Open Library: 2001 («Olafur Eliasson») |
| Lucian Freud | William Feaver | 2007 | Open Library: 2002 («Lives of Lucian Freud») |
| Dada: Kunst und Antikunst | Hans Richter | 1964 | Open Library: 1961 («Dada») |
| Manifeste du surréalisme | André Breton | 1924 | Open Library: 1900 («Manifestes du surréalisme») |
| Futurist Manifestos | Umbro Apollonio | 1973 | Open Library: 1970 («Futurist manifestos») |
| Le Musée imaginaire | André Malraux | 1947 | Open Library: 1952 («Le musée imaginaire de la sculpture mondiale») |

### Fotografía (27)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| American Surfaces | Stephen Shore | 1999 | Open Library: 2005 («American surfaces») |
| William Eggleston's Democratic Camera | Elisabeth Sussman y Thomas Weski | 2008 | No encontrado en Open Library |
| New Topographics | William Jenkins | 1975 | No encontrado en Open Library |
| Typologies of Industrial Buildings | Bernd Becher y Hilla Becher | 2004 | No encontrado en Open Library |
| Museum Photographs | Thomas Struth | 1993 | Open Library: 2005 («Museum Photographs») |
| Libraries | Candida Höfer | 2005 | Open Library: 1933 («Libraries») |
| Shashin yo sayōnara (Farewell Photography) | Daido Moriyama | 1972 | Open Library: 2006 («Shashin yo sayōnara») |
| Nippon gekijō shashinchō (Japan, A Photo Theater) | Daido Moriyama | 1968 | Open Library: 2011 («Nippon gekijō shashinchō») |
| Sentimental Journey | Nobuyoshi Araki | 1971 | Open Library: 1991 («Diary Sentimental Journey») |
| Ba-ra-kei (Killed by Roses) | Eikoh Hosoe | 1963 | Open Library: 1985 («Ba-ra-kei, ordeal by roses») |
| 11:02 Nagasaki | Shōmei Tōmatsu | 1966 | Open Library: 1995 («Nagasaki <11:02> 1945-nen 8-gatsu 9-nichi») |
| Antlitz der Zeit | August Sander | 1929 | Open Library: 1976 («Antlitz der Zeit») |
| Malerei, Fotografie, Film | László Moholy-Nagy | 1925 | Open Library: 1927 («Malerei, Fotografie, Film») |
| Atget, photographe de Paris | Eugène Atget | 1930 | No encontrado en Open Library |
| The Camera | Ansel Adams | — | Año vaciado (dudoso) |
| Ansel Adams: An Autobiography | Ansel Adams | 1985 | Open Library: 1972 («Ansel Adams») |
| Early Color | Saul Leiter | 2006 | Open Library: 2013 («Early Color (New Edition)») |
| Fred Herzog: Photographs | Fred Herzog | 2011 | Open Library: 2007 («Fred Herzog») |
| The Last Resort | Martin Parr | 1986 | Open Library: 1952 («The Court of Last Resort») |
| The Photobook: A History, Volume II | Martin Parr y Gerry Badger | 2006 | Open Library: 2004 («The photobook») |
| A Shimmer of Possibility | Paul Graham | 2007 | No encontrado en Open Library |
| Broken Manual | Alec Soth | 2010 | Open Library: 2014 («Broken Manual») |
| The Complete Untitled Film Stills | Cindy Sherman | 2003 | No encontrado en Open Library |
| Jeff Wall: Catalogue Raisonné 1978–2004 | Jeff Wall | 2005 | Open Library: 1979 («Jeff Wall») |
| War Primer 2 | Adam Broomberg y Oliver Chanarin | 2011 | Open Library: 2018 («War Primer 2») |
| The Afronauts | Cristina de Middel | 2012 | No encontrado en Open Library |
| Un art moyen | Pierre Bourdieu | 1965 | No encontrado en Open Library |

### Moda (15)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| Fashion: A History from the 18th to the 20th Century | The Kyoto Costume Institute | 2002 | Open Library: 1976 («Fashion: A Fashion History of the 20th Century») |
| Fashion: A Very Short Introduction | Rebecca Arnold | 2009 | Open Library: 1964 («Patterns of fashion») |
| Balenciaga: Shaping Fashion | Lesley Ellis Miller | 2017 | Open Library: 1993 («Balenciaga») |
| Yves Saint Laurent | Diana Vreeland | 1983 | Open Library: 2013 («Yves Saint Laurent») |
| Chanel Catwalk | Patrick Mauriès | 2016 | Open Library: 2001 («Chanel Catwalk») |
| Raf Simons Redux | Raf Simons | 2005 | No encontrado en Open Library |
| Talking to Myself | Yohji Yamamoto | 2002 | No encontrado en Open Library |
| Vivienne Westwood | Vivienne Westwood e Ian Kelly | 2014 | Open Library: 2000 («Vivienne Westwood») |
| Gods and Kings | Dana Thomas | 2015 | Open Library: 1623 («Gods and Kings») |
| In Vogue: The Illustrated History of the World's Most Famous Fashion Magazine | Alberto Oliva y Norberto Angeletti | 2006 | Open Library: 2012 («In Vogue: An Illustrated History of the World's Most Famous ») |
| Harper's Bazaar: 150 Years | Glenda Bailey | 2017 | Open Library: 2011 («Harper's Bazaar») |
| Pictures | Tim Walker | 2008 | Open Library: 1860 («Pictures of a gone city») |
| On Fashion Photography | Peter Lindbergh | 2016 | Open Library: 2020 («Peter Lindbergh. on Fashion Photography. 40th Ed») |
| China: Through the Looking Glass | Andrew Bolton | 2015 | Open Library: 1984 («China») |
| Camp: Notes on Fashion | Andrew Bolton | 2019 | Open Library: 2013 («The camp») |

### Diseño industrial (17)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| Horizons | Norman Bel Geddes | 1932 | Open Library: 1930 («Horizons») |
| The Industrial Design Reader | Carma Gorman | — | Año vaciado (dudoso) |
| Ettore Sottsass | Philippe Thomé | 2014 | Open Library: 1996 («Ettore Sottsass») |
| Memphis: Research, Experiences, Results, Failures and Successes of New Design | Barbara Radice | 1984 | Open Library: 1981 («Memphis») |
| As Little Design as Possible | Sophie Lovell | 2011 | No encontrado en Open Library |
| Charles and Ray Eames: Designers of the Twentieth Century | Pat Kirkham | 1995 | Open Library: 1989 («Charles and Ray Eames») |
| Problems of Design | George Nelson | 1957 | Open Library: 1954 («Problems of design») |
| Gio Ponti | Ugo La Pietra | 1995 | Open Library: 2009 («Gio Ponti») |
| Autoprogettazione? | Enzo Mari | 1974 | Open Library: 2002 («Autoprogettazione?») |
| Ronan & Erwan Bouroullec: Works | Ronan Bouroullec y Erwan Bouroullec | 2012 | Open Library: 2003 («Ronan and Erwan Bouroullec») |
| Marc Newson: Works | Marc Newson | 2012 | Open Library: 2002 («Marc Newson») |
| The Good Life: Perceptions of the Ordinary | Jasper Morrison | 2014 | Open Library: 1932 («The place of the ecstatic trance in the ideal of the good li») |
| A Book of Things | Jasper Morrison | 2015 | Open Library: 1985 («Powers of ten : a book about the relative size of things in ») |
| Embodiment | Naoto Fukasawa | 2018 | No encontrado en Open Library |
| Designed by Apple in California | Apple | 2016 | No encontrado en Open Library |
| Industrial Design A–Z | Charlotte Fiell y Peter Fiell | 2000 | No encontrado en Open Library |
| Change by Design | Tim Brown | 2009 | Open Library: 1853 («Change by design») |

### Tipografía (10)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| An Essay on Typography | Eric Gill | 1931 | Open Library: 1941 («An essay on typography») |
| First Principles of Typography | Stanley Morison | 1936 | Open Library: 1930 («First principles of typography») |
| Manuale tipografico | Giambattista Bodoni | — | Año vaciado (dudoso) |
| Mechanick Exercises on the Whole Art of Printing | Joseph Moxon | 1683 | Open Library: 1958 («Mechanick exercises on the whole art of printing (1683-4)») |
| Modern Typography: An Essay in Critical History | Robin Kinross | 1992 | Open Library: 1984 («Modern Typography») |
| Type and Typography | Phil Baines y Andrew Haslam | 2002 | No encontrado en Open Library |
| Manuale Typographicum | Hermann Zapf | 1954 | Open Library: 1952 («Manuale typographicum») |
| Type: A Visual History of Typefaces and Graphic Styles | Cees W. de Jong, Alston W. Purvis y Jan Tholenaar | 2009 | Open Library: 1977 («CREATIVE TYPE: A SOURCEBOOK OF CLASSIC AND CONTEMPORARY LETT») |
| Cómo crear tipografías | Cristóbal Henestrosa, Laura Meseguer y José Scaglione | 2012 | No encontrado en Open Library |
| Hermann Zapf and His Design Philosophy | Hermann Zapf | 1987 | Open Library: 1990 («Hermann Zapf and His Design Philosophy») |

### Editorial y publicaciones independientes (32)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| Neue Grafik | Richard Paul Lohse, Josef Müller-Brockmann, Hans Neuburg y Carlo Vivarelli | 1958 | No encontrado en Open Library |
| Provoke | Takuma Nakahira, Yutaka Takanashi, Kōji Taki y Daido Moriyama | 1968 | No encontrado en Open Library |
| Camera Work | Alfred Stieglitz | 1903 | Open Library: 1975 («Camera work») |
| Aspen | Phyllis Johnson | 1965 | Open Library: 1995 («Cankers on western quaking aspen») |
| Wet: The Magazine of Gourmet Bathing | Leonard Koren | 1976 | Open Library: 2012 («Making WET») |
| Colors | Tibor Kalman | 1991 | Open Library: 1993 («What Color Is It? (Looking at Nature)») |
| Apartamento | Marco Velardi, Omar Sosa y Nacho Alegre | 2008 | Open Library: 2018 («The World of Apartamento») |
| Fantastic Man | Gert Jonkers y Jop van Bennekom | 2005 | No encontrado en Open Library |
| Butt | Gert Jonkers y Jop van Bennekom | 2001 | Open Library: 2015 («Forever Butt») |
| Re-Magazine | Jop van Bennekom | 1994 | No encontrado en Open Library |
| The Gentlewoman | Penny Martin | 2010 | Open Library: 1799 («A Remarkable and surprising account of the abandoned life, h») |
| Purple | Olivier Zahm y Elein Fleiss | 1992 | Open Library: 2008 («Purple anthology, 1992-2006») |
| 032c | Jörg Koch | 2000 | No encontrado en Open Library |
| Cabinet | Sina Najafi | 2000 | Open Library: 2004 («Cabinet») |
| Dot Dot Dot | Stuart Bailey y Peter Bilak | 2000 | Open Library: 2005 («Dot Dot Dot Issue 10 (Dot Dot Dot)») |
| Bulletins of The Serving Library | Dexter Sinister | 2011 | No encontrado en Open Library |
| Eye | Rick Poynor | 1990 | No encontrado en Open Library |
| Octavo | 8vo | 1986 | No encontrado en Open Library |
| Visionaire | Stephen Gan, James Kaliardos y Cecilia Dean | 1991 | Open Library: 1997 («Visionaire's fashion 2000») |
| i-D | Terry Jones | 1980 | Open Library: 1998 («Smile i-D») |
| The Face | Nick Logan | 1980 | Open Library: 1971 («The Face of Evil») |
| El Croquis | Fernando Márquez Cecilia y Richard Levene | 1982 | No encontrado en Open Library |
| Oppositions | Peter Eisenman, Kenneth Frampton y Mario Gandelsonas | 1973 | No encontrado en Open Library |
| Merz | Kurt Schwitters | 1923 | Open Library: 1972 («Merz») |
| De Stijl | Theo van Doesburg | 1917 | Open Library: 1986 («"De Stijl overal absolute leiding"») |
| Interview | Andy Warhol y John Wilcock | 1969 | Open Library: 1973 («Andy Warhol's Interview») |
| Wallpaper* | Tyler Brûlé | 1996 | No encontrado en Open Library |
| Monocle | Tyler Brûlé | 2007 | Open Library: 2015 («The Monocle guide to cosy homes») |
| Irma Boom: The Architecture of the Book | Irma Boom | 2010 | Open Library: 2013 («Irma Boom») |
| Royal Road Test | Ed Ruscha, Mason Williams y Patrick Blackwell | 1967 | No encontrado en Open Library |
| Publishing as Artistic Practice | Annette Gilbert | 2016 | Open Library: 2020 («Publishing As Artistic Practice») |
| Behind the Zines: Self-Publishing Culture | Gestalten | 2011 | No encontrado en Open Library |

### Literatura (63)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| Don Quijote de la Mancha | Miguel de Cervantes | 1605 | Open Library: 1600 («Don Quijote de la Mancha») |
| Guerra y paz | León Tolstói | 1869 | Open Library: 1896 («Guerra y paz») |
| Anna Karénina | León Tolstói | 1878 | Open Library: 1978 («Anna Karenina») |
| Crimen y castigo | Fiódor Dostoievski | 1866 | Open Library: 2002 («Crimen y castigo») |
| Los hermanos Karamázov | Fiódor Dostoievski | 1880 | Open Library: 2003 («Los Hermanos Karamazov») |
| Essais | Michel de Montaigne | 1580 | Open Library: 1595 («Essais») |
| La vida es sueño | Pedro Calderón de la Barca | 1636 | Open Library: 1690 («La vida es sueño») |
| Fuenteovejuna | Lope de Vega | 1619 | Open Library: 1965 («Fuenteovejuna») |
| Les Fleurs du mal | Charles Baudelaire | 1857 | Open Library: 1855 («Les fleurs du mal») |
| Une saison en enfer | Arthur Rimbaud | 1873 | Open Library: 1914 («Une saison en enfer») |
| La gaviota | Antón Chéjov | 1896 | Open Library: 1998 («GAVIOTA, LA TRES HERMANAS TIO VANIA») |
| The War of the Worlds | H. G. Wells | 1898 | Open Library: 0 («The War of the Worlds») |
| Ulysses | James Joyce | 1922 | Open Library: 1914 («Ulysses») |
| Finnegans Wake | James Joyce | 1939 | Open Library: 1928 («Finnegans Wake») |
| Du côté de chez Swann | Marcel Proust | 1913 | Open Library: 1908 («Du côté de chez Swann») |
| Die Verwandlung | Franz Kafka | 1915 | Open Library: 1962 («Die Verwandlung») |
| Der Process | Franz Kafka | 1925 | Open Library: 1825 («Der Proceß») |
| The Great Gatsby | F. Scott Fitzgerald | 1925 | Open Library: 1920 («The Great Gatsby») |
| Sei personaggi in cerca d'autore | Luigi Pirandello | 1921 | Open Library: 1900 («Sei personaggi in cerca d'autore») |
| Livro do Desassossego | Fernando Pessoa | 1982 | Open Library: 1961 («Livro do Desassossego») |
| La Peste | Albert Camus | 1947 | Open Library: 1942 («La Peste») |
| Exercices de style | Raymond Queneau | 1947 | Open Library: 1996 («Exercices de Style») |
| Confesiones de una máscara | Yukio Mishima | 1949 | Open Library: 1990 («Confesiones de una máscara») |
| The Catcher in the Rye | J. D. Salinger | 1951 | Open Library: 1945 («The Catcher in the Rye») |
| Death of a Salesman | Arthur Miller | 1949 | Open Library: 1940 («Death of a Salesman») |
| Lolita | Vladimir Nabokov | 1955 | Open Library: 1777 («Lolita») |
| Pale Fire | Vladimir Nabokov | 1962 | Open Library: 1945 («Pale Fire») |
| Mythologies | Roland Barthes | 1957 | Open Library: 1953 («Mythologies») |
| Apocalittici e integrati | Umberto Eco | 1964 | Open Library: 1973 («Apocalittici E Integrati Pack») |
| La Vie mode d'emploi | Georges Perec | 1978 | No encontrado en Open Library |
| The Unfortunates | B. S. Johnson | 1969 | Open Library: 1808 («The Unfortunates») |
| Foundation | Isaac Asimov | 1951 | Open Library: 1945 («Foundation») |
| Solaris | Stanisław Lem | 1961 | Open Library: 1901 («Solaris») |
| Slaughterhouse-Five | Kurt Vonnegut | 1969 | Open Library: 1956 («Slaughterhouse-Five») |
| Crash | J. G. Ballard | 1973 | Open Library: 1901 («Crash») |
| Kindred | Octavia E. Butler | 1979 | Open Library: 1939 («Kindred») |
| Jonathan Strange & Mr Norrell | Susanna Clarke | 2004 | Open Library: 2001 («Jonathan Strange and Mr. Norrell») |
| El problema de los tres cuerpos | Liu Cixin | 2008 | Open Library: 2024 («Estuche Trilogía de Los Tres Cuerpos : el Problema de Los Tr») |
| L'insoutenable légèreté de l'être | Milan Kundera | 1984 | Open Library: 2007 («L'insoutenable légèreté de l'être») |
| Tokio blues (Norwegian Wood) | Haruki Murakami | 1987 | Open Library: 2005 («Tokio blues») |
| House of Leaves | Mark Z. Danielewski | 2000 | Open Library: 1998 («House of Leaves») |
| Kafka en la orilla | Haruki Murakami | 2002 | No encontrado en Open Library |
| The Road | Cormac McCarthy | 2006 | Open Library: 2002 («The Road») |
| Les Années | Annie Ernaux | 2008 | Open Library: 2001 («Les années») |
| Min kamp 1 | Karl Ove Knausgård | 2009 | No encontrado en Open Library |
| Facundo | Domingo F. Sarmiento | 1845 | Open Library: 1868 («Facundo, or, civilization and barbarism») |
| El gaucho Martín Fierro | José Hernández | 1872 | Open Library: 1894 («El gaucho Martin Fierro») |
| Las fuerzas extrañas | Leopoldo Lugones | 1906 | Open Library: 1926 («Las fuerzas extrañas») |
| Veinte poemas para ser leídos en el tranvía | Oliverio Girondo | 1922 | Open Library: 1966 («Veinte poemas para ser leídos en el tranvía. Calcomanías.») |
| Don Segundo Sombra | Ricardo Güiraldes | 1926 | Open Library: 1900 («Don Segundo Sombra») |
| Los siete locos | Roberto Arlt | 1929 | Open Library: 1958 («Los Siete Locos») |
| Las armas secretas | Julio Cortázar | 1959 | Open Library: 1963 («Las armas secretas») |
| Operación Masacre | Rodolfo Walsh | 1957 | Open Library: 1969 («Operación masacre») |
| Kentukis | Samanta Schweblin | 2018 | Open Library: 2014 («Kentukis») |
| Azul... | Rubén Darío | 1888 | Open Library: 1966 («Azul») |
| Cuentos de amor de locura y de muerte | Horacio Quiroga | 1917 | Open Library: 1900 («Cuentos de amor, de locura y de muerte») |
| Cuentos de la selva | Horacio Quiroga | 1918 | Open Library: 1940 («Cuentos de la selva») |
| Desolación | Gabriela Mistral | 1922 | Open Library: 1900 («Desolación») |
| Canto general | Pablo Neruda | 1950 | Open Library: 1943 («Canto general») |
| El reino de este mundo | Alejo Carpentier | 1949 | Open Library: 1957 («El reino de este mundo») |
| Los adioses | Juan Carlos Onetti | 1954 | Open Library: 1966 («Los adioses») |
| Los ingrávidos | Valeria Luiselli | 2011 | Open Library: 2013 («Los ingrávidos - 3. ed») |
| Romancero gitano | Federico García Lorca | 1928 | Open Library: 1900 («Romancero gitano (1924-1927)») |

### Gastronomía (18)

| Título | Autor | Año cargado | Motivo |
|---|---|---:|---|
| Le Guide culinaire | Auguste Escoffier | 1903 | Open Library: 1968 («Escoffier : Le guide culinaire ; Aide-memoire de cuisine pra») |
| Fäviken | Magnus Nilsson | 2012 | Open Library: 2020 («Fäviken») |
| Central | Virgilio Martínez | 2016 | Open Library: 1900 («Central») |
| Baking: From My Home to Yours | Dorie Greenspan | 2006 | Open Library: 1996 («Baking») |
| Roast Chicken and Other Stories | Simon Hopkinson y Lindsey Bareham | 1994 | Open Library: 1980 («"How to Roast a Chicken" and Other Stories») |
| Momofuku | David Chang y Peter Meehan | 2009 | Open Library: 2018 («Momofuku») |
| The Joy of Cooking | Irma S. Rombauer | 1931 | Open Library: 1974 («The  joy of cooking Christmas cookies») |
| Il cucchiaio d'argento | Editoriale Domus | 1950 | No encontrado en Open Library |
| El libro de Doña Petrona | Petrona C. de Gandulfo | 1934 | Open Library: 1949 («El libro de doña Petrona») |
| Spain: The Cookbook | Simone Ortega e Inés Ortega | 2007 | Open Library: 1937 («Invertebrate Spain,») |
| Peru: The Cookbook | Gastón Acurio | 2015 | Open Library: 2004 («Peru. Gastronomia») |
| Japanese Cooking: A Simple Art | Shizuo Tsuji | 1980 | Open Library: 1972 («Japanese cooking») |
| Land of Plenty | Fuchsia Dunlop | 2001 | Open Library: 2003 («Land of plenty») |
| Moro: The Cookbook | Sam Clark y Samantha Clark | 2001 | Open Library: 2003 («Casa Moro») |
| The Omnivore's Dilemma | Michael Pollan | 2006 | No encontrado en Open Library |
| Blood, Bones & Butter | Gabrielle Hamilton | 2011 | Open Library: 2008 («Blood, Bones & Butter») |
| The Gourmand | David Lane y Marina Tweed | 2012 | No encontrado en Open Library |
| Cherry Bombe | Kerry Diamond y Claudia Wu | 2013 | Error de red al consultar |
