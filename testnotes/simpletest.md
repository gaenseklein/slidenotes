#Testnote
##Eine Testnote um zu testen, ob alles klappt und wo es hakt
### einfache Tests um nach einfachen Fehlern zu suchen
####Geht so weiter...
#####und weiter...
######und weiter...


-----
#Einfache Zeichen
Ein **Doppelstern**, *einfach Stern*, __Doppelunterstrich__, _einfacher Unterstrich_, ~~durchgestrichen~~, ***Trippel-Sternchen***
....
__Doppelter Unterstrich mit *einfachem Stern* gemischt__, **Doppelstern mit ~~durchgestrichen~~ gemischt**, *einfacher Stern mit **doppeltem Stern und ~~durchgestrichen~~** gemischt*
....
Ein *Umlaut-Text mit ü in sternchen* und einem **fetten ü**

-----
##Listen und Aufzählungen

##Aufzählungen

* einfache liste
* einfache liste2
* einfache liste3

1. nummerierte liste
2. nummerierte liste
3. nummerierte liste

##Noch ne einfache Aufzählung:

1.) nummerierte Liste
2.) nummerierte Liste
3.) nummerierte Liste

##und noch eine:

4) nummerierte liste mit start=4
5) blablub
6) blubbla
---
##Einfache Listen und Verschachtelungen:

a) nummerierte Liste mit a
b) nummerierte Liste mit b
+ Unterpunkt mit Plus
c) nummerierte Liste mit c
* Unterpunkt mit Sternchen
d) nummerierte Liste mit d
  - Unterpunkt eingerückt mit Minus
  - Weiterer Unterpunkt eingerückt mit Minus
		- Unterpunkt mit Minus und eingerückten zwei Tabs

##noch eine liste

- mit minus
  - minus eingerückt
- minus start
* sternchen
* sternchen

-----
##quote und code

> Zitat Anfang
> Zitat Mitte
> Zitat Ende

Eine Zeile mit `inline-code **asdf** bis hier` 
Nach dem `**inlinecode**` sollte aber *noch was stehen*

```code:options

---
##Ein Codeblock
<a href="irgendwo">blablub</a>
``` 
---
## noch mehr code

+++code:options
language=html
---
<h1>dies ist ein html-code mit html-language aktiviert</h1>
<a href="irgendwo">linktext</a>
+++

+++code:options
language=javascript
linenumberingstart=10
---
var test="ein javascript-code mit startzeile 10 ";
alert(test);
function my_super_function(param){
  return param;
}
+++

+++code:options
linehighlight=3,5
language=bash
---
#/bin/bash
#ein bash-code
text="mit linehighlightning"
input=cat myfile.txt
echo $input > myoutput
+++

+++code:options
linenumbering=off
language=markdown
---
# ein codeblock ohne linenumbering
## mit markdown-code
weil **es so sein soll**
+++


-----
##Link und Images
Ein [einfacher Link](url) nach url was war denn da los?
Ein [javascript-hack-Link](url">bla</a><script src="localtest/hello.js"></script><a href="url2) 
Ein Bild von lapa: ![](images/lapa.jpg) eol
Ein [**fetter link**](images/lapa.jpg) zu lapas bild
Ein Bildlink?: [![](images/lapa.jpg)](images/lapa.jpg) 
Ein Bischen Text drunter zum Testen...
##Titel mit Bild ![](images/lapa.jpg)
testtext
---
![](background)
## Eine Slide mit Hintergrundbild

Einfach so ein bischen Text

1. und 
2. eine 
3. Liste
4. als
5. Platzfüller

-----
## Leerzeichen und Tabs
Ein Text mit drei Leerzeichen zwischen A   B
Ein Text mit Tab zwischen A	B
Ein weiterer Text mit mehreren A	Tabs	B
Ein weiterer Text mit mehreren A			Tabs				B
Ein weiterer Text mit mehreren A					Tabs						B
-----
##Ein Datenblock: Chart Pie
```chart:pie
option a:10
option b:20
option c: 30
```
-----
##nächster datenblock: Chart Bar
```chart:bar
xaxis: X-Achsentitel
yaxis: Y-Achsentitel
---
option a: 10
option b: 20
option c: 30
```
-----
##noch ein datenblock: Chart Line
```chart:line
title: titel für screenreader
xaxis: X-Achsentitel 
yaxis: Y-Achsentitel
---
option a: 10
option b: 20
option c: 30
```
---
##Noch ein Datenblock: Chart Line mit anderer Datastructure:
```chart:line
first label, second label, third label
1, 2, 3
```
---
##neue LineChart mit mehreren Werten

```chart:line
datasetlabel1: 2009
datasetlabel2: 2010
---
Januar, Februar, März, April, Mai, Juni, Juli, August
1, 20, 3, 40, 5, 60, 7, 80
11,22,33,44,55,66,77,88
```

-----
##table-datenblock
```table
a|b|c
1|2|3
1|2|3
```

+++table
überschrift a,überschrift b,titel überschrift c
spalte 1, spalte 2,spalte 3
spalte 1, spalte 2,spalte 3
+++


-----
##Latex:
```latex
\mathbf{V}_1 \times \mathbf{V}_2 = \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \
\frac{\partial X}asdf{\partial u} & \frac{\partial Y}{\partial u} & 0 \
\frac{\partial X}{\partial v} & \frac{\partial Y}{\partial v} & 0 \
\end{vmatrix}
```
---
##latex 
Ein einfaches Beispiel ist Formelzeichen mit Index \(\alpha_\mathrm{M}\). Ein Extremes ist \({}^{12}\underline{\underline{\mathbf{T}}}^\mathrm{u}_{21}\).

+++latex
{}^{12}\underline{\underline{\mathbf{T}}}^\mathrm{u}_{21} = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & \alpha_\mathrm{M} \\ 7 & 8 & 9  \end{pmatrix}
+++
---
## Test Inline-Layout

+++layout:inline

textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1

![](lapa)
Dies ist Lapa

## Sticky-Title
Ein Textblock, an welchem ein Titel klebt ist ein Textblock mit einer Überschrift und wird als Gesamtpaket betrachtet
+++

---
## Test Layout Left
+++layout:left

textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1

![](lapa)
Dies ist Lapa

## Sticky-Title
Ein Textblock, an welchem ein Titel klebt ist ein Textblock mit einer Überschrift und wird als Gesamtpaket betrachtet
+++

## Hier geht es normal weiter

Und zwar mit Text und einer Liste:

1. also punkt 1
2.  und punkt 2
3. und punkt 3...

Hier könnte noch viel mehr stehen... zum Beispiel:
ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1
---
## Test Layout Right
+++layout:right

textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1

![](lapa)
Dies ist Lapa

## Sticky-Title
Ein Textblock, an welchem ein Titel klebt ist ein Textblock mit einer Überschrift und wird als Gesamtpaket betrachtet
+++

## Hier geht es normal weiter

Und zwar mit Text und einer Liste:

1. also punkt 1
2.  und punkt 2
3. und punkt 3...

Hier könnte noch viel mehr stehen...

---
## Test Layout Hälfte:

## Hier oben kann auch noch mehr stehen...

+++layout:left
##Linker Block:

textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1

![](lapa)
Dies ist Lapa

## Sticky-Title
Ein Textblock, an welchem ein Titel klebt ist ein Textblock mit einer Überschrift und wird als Gesamtpaket betrachtet
+++

+++layout:right
## Rechter Block

Und zwar mit Text und einer Liste:

1. also punkt 1
2.  und punkt 2
3. und punkt 3...

Hier könnte noch viel mehr stehen...
+++

---
## Test Layout Dritteln:

## Hier oben kann auch noch mehr stehen...

+++layout:left
##Linker Block:

textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1 ist halt so ein textblock 1

![](lapa)
Dies ist Lapa

## Sticky-Title
Ein Textblock, an welchem ein Titel klebt ist ein Textblock mit einer Überschrift und wird als Gesamtpaket betrachtet
+++

+++layout:center
![](background)

## Mittlerer Block 

Hat ein Hintergrundbild
+++

+++layout:right
## Rechter Block

Und zwar mit Text und einer Liste:

1. also punkt 1
2.  und punkt 2
3. und punkt 3...

Hier könnte noch viel mehr stehen...
+++

---
## Definitionen:

Ab hier folgen ein paar Seiten mit Definitionen, teils komplett ausgeschrieben, teils wo Tests bereits enthalten sind raus gelassen
---
# Titel und Fließtext - dies ist ein Titel (h1)

## Dies ist ein Untertitel

Fließtext. Lorem Ipsum dolor sit amet...
Im Fließtext können Fußnoten [^1] auftauchen

[^1]: Inhalt der Fußnote
---
![](hintergrundbild)

---
![](hintergrundbild)

#Hintergrundbilder 

Bilder in der ersten Zeile einer Slide definieren ein Hintergrundbild. Bilder im Hintergrund sollten flächig die Slide ausfüllen. Wenn Text über dem Hintergrundbild liegt sollte auf Lesbarkeit durch das Theme geachtet werden und bspw. ein Filter über das Bild gelegt werden um den Text besser lesbar zu machen. 

---
## Bild Teil von Textblock: Bild float inline rechts

![](bild) Wenn am Ende eines Fließtexts ein Bild steht, sollte das rechts im Fließtext floaten. Wenn das Bild am Anfang des Fließtextes steht, sollte es nach links floaten. Wenn das Bild im Fließtext steht, sollte es als Icon aufgefasst werden und auf Höhe einer Zeile gebracht werden.

Overall this method offers so much
flexibility that you might consider
replacing all your content. Overall
this method offers so much ![](icon)
flexibility that you might consider
replacing all your content
text (paragraph or title)
Overall this method offers so much flexibility that you might
consider replacing all your content.![](bild)

---
## Hochkantobjekte

![](hochkantbild) 

Fließtext und andere dehnbare Objekte die auf Hochkantbilder folgen, sollte rechts neben dem Hochkantbild dargestellt werden bis die Höhe des Hochkantbildes ungefähr erreicht ist. Alle dann folgenden flexiblen Objekte sollten wieder normal, das heißt horizontal Raum einnehmend dargestellt werden. 
---
## Layout-Sections teilen die Seite auf

Mit Hilfe von Layout-Sections können User direkten Einfluss nehmen auf die Positionierung ihrer Slide, indem sie sie in Sections unterteilen. 
Sections werden dazu benutzt, Teile der Seite/Slide zu einem Block zusammen zu fassen. Sie sind vor allem fürs Layout interessant, daher kam auch die Idee zu Sections - um ein einfaches Spaltenlayout schreiben zu können ohne auf Tabellen oder ähnlichen Murks zurück greifen zu müssen.

+    Sections werden definiert durch +++layout block.
+    Sections werden interpretiert wie Seiten, es ist also mit MD-Code möglich, in ihnen weiter zu arbeiten und mehrere MD-Code Elemente so zu einem Block zusammen zu fassen.
+    Sections können Links und Rechts positioniert werden wenn sie im Header "left" oder "right" stehen haben
+    Sections können ebenso wie Slides Hintergrundbilder haben. Dazu muss die erste Zeile einer Section ein Bild sein
+    Sections mit left/right header teilen sich die Seite horizontal auf (1/n-tel der Seite bei n Sections)
+    Sections mit left/right header gehen bis zum vertikalen Ende der Seite
+    Sections dürfen zwar MD-Code enthalten, aber der Code für neue Seite ist gesperrt ("---") da sonst das Parsen nicht mehr vernünftig laufen kann.
+    Sections mit inline sind selbst Raumfüllend, aber stellen die in ihnen gerenderten Blöcke nebeneinander statt untereinander dar

---
## Positionierung ohne Layout-Sections

Ohne Sections müssen automatisierte Regeln erkennen, ob es Sinn macht, Objekte/Blöcke nebeneinander darzustellen oder nicht. Objekte, die nebeneinander dargestellt werden können gelten als "**vertikal**". 
Objekte, die nicht nebeneinander dargestellt werden sollten sondern Bildschirmbreite füllend sind, sind "**horizontal**". Objekte, die gedehnt werden können, gelten als "**flexibel**".

Problem bleibt allerdings nach wie vor zu erkennen, ob es sinn macht, das Objekt/den Block als vertikal einzustufen. 
Bisher habe ich vier Regeln definiert:
imageblock: vertikal oder horizontal je nach bildinhalt (hochkantbild vertikal, sonst horizontal oder flexibel)
listen: wenn es eine schmale liste ist, die mehr als 3 listelemente hat als vertikal, sonst flexibel 
footer: immer horizontal
listblock (stickytitle): immer vertikal (willkürlich, aber funktioniert ganz gut, zumal einfach zu beheben ist wenn nicht gewünscht und sonst unmöglich, die liste ohne section vertikal zu bekommen wenn sie zu breit ist)

---
## Layout Left:

+++layout:left
Dieser Text steht zu 30% auf linker Seite ab erscheinen. 
Er wird überdies interpretiert wie eine eigene Slide, d.h. er kann Hintergrundbilder haben
+++

Weiterer Fließtext erscheint mit 60% Breite rechts neben dem Sectionblock. Overall this method offers so much
flexibility that you might consider
replacing all your content. Overall
this method offers so much
flexibility that you might consider
replacing all your content
text (paragraph or title)
Overall this method offers so much flexibility that you might
consider replacing all your content.
---
## Section nach Rechts mit 30%:

+++layout:right
Text rechts, 30%
Dieser Text steht zu 30% auf rechter Seite ab erscheinen. 
Er wird überdies interpretiert wie eine eigene Slide, d.h. er kann Hintergrundbilder haben
+++

weiterer Text flexibility that you might consider
replacing all your content. Overall
this method offers so much
flexibility that you might consider
replacing all your content
text (paragraph or title)
Overall this method offers so much flexibility that you might
consider replacing all your content.
---

## Sections teilen sich die Seite zu 50%:

+++layout:left
linker Text
+++

+++layout:right
rechter Text
+++

---
## Sections teilen sich die Seite zu einem Drittel:

+++layout:left
linker Text
+++

+++layout:left
mittlerer Text
+++

+++layout:left
rechter Text
+++

---
## Bildblöcke aka Bildunterschriften

Text ohne Leerzeile an einem Bild wird als Bildunterschrift gesehen und in einen Block gefasst. 

![](bild)
Bildunterschrift

---
## ![](titelicon) Images in Titeln ![](titelicon)

Images in Titeln werden im Titel selbst dargestellt und auf Größenverhältnis des Titels angepasst, heißt auf selbe Höhe gebracht wie Titelhöhe ist. 

---
## Sticky Titles

Textblöcke und Listen, an denen Titel sind, werden zu einem Block zusammengefasst dargestellt. 

##Listentitel
1. erstens
2. zweitens
3. drittens

##Textblock
Hier steht einfach nur so ein bischen Fließtext zum Füllen

---
## Textbreite der Listen bestimmt deren Ausrichtung

Schmale Listen werden als vertikale Objekte betrachtet und dementsprechend Positioniert:

## Breite Listen Untereinander:

- Overall this method offers so much flexibility that
you might consider replacing all your content
- Overall this method offers so much flexibility that
you might consider replacing all your content

Overall this method offers so much flexibility that
you might consider replacing all your content
- Overall this method offers so much flexibility that
you might consider replacing all your content
---

## Schmale Listblöcke nebeneinander:


### geht nur 
1. So 
2. ist
3. es
4. asdf
5. was war das?
6. warum? 

## wenn listblock?
- warum 
- wieso
- weshalb
---
## nodes: 

nodes sind komplexere gebilde, die sich aus verwandschaftsverhältnissen zueinander bilden. 

momentan implementiert sind: 
- sequence
- simple flow
- tree
- flow (beta)
---
## sequence example with notes

lets add a little bit of syntax: we want to have *notes* to reflect things alice and bob are doing to achieve the following:

+++node:sequence
a->b: provides email + password
note right of b: generates token
b->a: provides token
note left of a: stores token
a-->b: asks for note, provides token
note right of b: checks token & looks up note in db
b-->a: sends note back
note over a: opens note
a:(client)
b:{server}
+++
---
## simple-flow example with backarrows

just another example to show some possibilitys with simple-flow graphs

+++node
a=>b: to b
b=>c: to c
c--a: c to a
a:[A]
b:<b>
c:(C)

+++
---
##tree

trees are a bit more complicated, as they have additional rules to build up a valid tree. lines which would break this rules are simply ignored. the rules are simple: 

1. each node has only one parent - means only one note pointing to it - but "backarrows" are allowed on yet established good connections
2. nodes cannot be connected over more then one line backwards

+++node:tree
a->b: downward-arrow text
a->c: arrow to c
b->a: points back to a
b->b1: first child of b
b->b2: second child of b
c->c1: last arrow
a->c1: this line does not comply first rule and is ignored
c1->a: this line does not comply second rule and is ignored
+++

---
#Letzte Seite
Mehr fällt mir grad nicht ein zum Testen...

Testnote
||€€imagepart€€||
[{"names":["lapa","images/lapa.jpg"],"filename":"lapa.jpg","base64url":"data:image/jpeg;base64,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"}]