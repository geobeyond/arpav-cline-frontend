import { Grid, Typography, useMediaQuery } from '@mui/material';
import PageContainer from '../../components/Modals/PageContainer';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import HeaderBar from 'app/components/HeaderBar';

const regioneImg = '../../../assets/img/logo_regione_veneto.png';
const arpafvg = '../../../assets/img/arpafvg-logo.svg';
const arpavImg = '../../../assets/img/logo_arpav.png';
const snpaImg = '../../../assets/img/logo_SNPA.png';

const InfoPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const style = {
        maxHeight: isMobile ? '10vh' : '5vh',
        minHeight: '30px',
        marginBottom: '30px',
    };
    const styleSquared = {
        maxHeight: isMobile ? '16vh' : '7vh',
        minHeight: '30px',
        marginBottom: '30px',
    };

    return (
        <PageContainer>
            <>
                <br />

                <div
                    dangerouslySetInnerHTML={{
                        __html: `


<style>
p {
font-family: 'Titillium Web', sans-serif;
}
table {
  font-family: 'Titillium Web', arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>




<!--<p>-->
<!--    <strong>Loghi</strong>: nell'ordine, Arpav, ArpaFVG, SNPA (allineati a sinistra); Regione (allineato a destra).-->
<!--</p>-->


<h1>Il cambiamento climatico</h1>
<p>
Le attività umane influiscono sul clima: l'aumento della concentrazione di gas serra e i conseguenti
cambiamenti osservati dei valori climatici medi sul lungo periodo e degli estremi climatici in ogni parte
del mondo ne sono evidenti segnali. Nell'area del Mediterraneo, in particolare, le condizioni che alterano
l'equilibrio climatico più severe, come l'aumento delle temperature e la diminuzione delle precipitazioni
estive, e la sua vulnerabilità accentuata rispetto ad altre regioni, portano a rischi climatici più gravi.</p>
<p>
Una valutazione del cambiamento climatico e della sua variabilità a scala regionale diviene quindi
cruciale per stimarne i potenziali impatti in futuro, per lo sviluppo di strategie di adattamento (processo di
adeguamento al clima attuale o atteso e ai suoi effetti, al fine di limitare i danni o sfruttare le opportunità
favorevoli) e per valutare azioni di mitigazione (qualsiasi intervento umano che riduca le emissioni o
rafforzi le fonti di assorbimento dei gas serra).</p>

<h1>La piattaforma</h1>
<p>
    La Piattaforma <strong>Cli</strong>ma <strong>N</strong>ord-<strong>E</strong>st (CliNE) propone <strong>proiezioni climatiche</strong> per il territorio del <strong>Nord-Est Italia</strong> attraverso <strong>tredici indicatori</strong> calcolati per possibili <strong>scenari climatici futuri</strong> e adattati ai dati raccolti dalle stazioni meteorologiche regionali.&nbsp;
</p>
<p>
    Tali proiezioni vengono fornite in termini di mappe e di serie temporali, per diversi orizzonti temporali e tre scenari emissivi, 
    con la possibilità di estrazione e download dei dati per specifici punti di interesse. Inoltre, viene data
la possibilità di visualizzare e confrontare la serie annuale puntuale fornita dalla proiezione con la serie
storica puntuale misurata dalle stazioni di misura della rete meteo-idro-nivo regionale presenti nelle
immediate vicinanze (entro 1 km).
</p>
<p>
Le informazioni presentate nella Piattaforma sono di utilità per decisori politici, portatori di interesse e
cittadini, al fine di supportare la pianificazione del territorio, le misure di adattamento ai cambiamenti
climatici e, più in generale, aumentare la conoscenza e la consapevolezza sui cambiamenti climatici in
corso.</p>
<p>Per informazioni sull'utilizzo  di CliNE è possibile consultare il <a href="https://github.com/venetoarpa/Arpav-PPCV-backend/wiki/Manuale-utente" target="_blank">Manuale d'uso.</a></p>

<h1>
 Gli elementi della piattaforma
</h1>

<h3>1. Barometro del clima</h3>
<p>Il <a href="https://clima.arpa.veneto.it" target="_blank">barometro del clima</a>, analogamente al barometro che misura la pressione atmosferica usato per descrivere 
e prevedere l'evoluzione meteorologica, vuole essere uno strumento semplice e diretto per descrivere e prevedere 
il clima che cambia.</p>
<p>In questo contesto, la temperatura media annua misurata dalle stazioni meteorologiche regionali racconta 
l'evoluzione del clima in Veneto fino ad oggi. Le proiezioni climatiche rappresentano possibili futuri climatici, 
ognuno dei quali parte dalla situazione attuale tenendo conto di sviluppi socio-economici, demografici e tecnologici 
che determinano panorami emissivi diversi di gas serra, causa principale del riscaldamento globale.</p>
<p>Il confronto tra temperatura media annua rilevata e proiezioni climatiche offre una misura del clima che sta 
cambiando e della possibile evoluzione nel futuro.</p>

<h3>2. Tredici indicatori</h3>
    <table>
        <colgroup><col style="width:40%;"><col style="width:60%;"></colgroup>
        <tbody>
            <tr>
                <td>
                    <p>
                        <strong>Indicatore</strong>
                    </p>
                </td>
                <td>
                    <p>
                        <strong>Descrizione</strong>
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Temperatura media (<strong>TAS</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Temperatura media giornaliera dell'aria vicino al suolo
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Temperatura minima (<strong>TASMIN</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Temperatura minima giornaliera dell'aria vicino al suolo
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Temperatura massima (<strong>TASMAX</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Temperatura massima giornaliera dell'aria vicino al suolo
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Notti tropicali (<strong>TR</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Numero di notti con temperatura minima maggiore di 20 °C
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Giorni caldi (<strong>SU30</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Numero di giorni con temperatura massima maggiore di 30 °C
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Giorni di gelo (<strong>FD</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Numero di giorni con temperatura minima minore di 0 °C
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Durata delle ondate di calore (<strong>HWDI</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Numero di giorni con temperatura massima maggiore di 5 °C rispetto alla media per almeno 5 giorni consecutivi
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Gradi giorno di riscaldamento (<strong>HDDs</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Somma delle differenze tra la temperatura dell'ambiente (20°C) e la
temperatura media giornaliera esterna nell'anno solare (1 gennaio - 31
dicembre); vengono conteggiate solo le differenze superiori allo zero
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Gradi giorno di raffrescamento (<strong>CDDs</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Somma delle differenze tra la temperatura media giornaliera esterna e
la temperatura di comfort climatico (21°C) nell'anno solare (1 gennaio
- 31 dicembre); la differenza viene conteggiata solo se la temperatura
media esterna supera i 24°C
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Precipitazione (<strong>PR</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Precipitazione giornaliera
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Precipitazione estrema (<strong>R95pTOT</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Precipitazione totale cumulata al di sopra del 95 <sup>o</sup> percentile del periodo di riferimento
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Giorni secchi (<strong>CDD</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Numero massimo di giorni consecutivi asciutti (precipitazione giornaliera inferiore a 1 mm)
                    </p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>
                        Giorni con neve nuova (<strong>SNWDAYS</strong>)
                    </p>
                </td>
                <td>
                    <p>
                        Numero di giorni con temperatura media minore di 2 °C e precipitazione giornaliera maggiore di 1 mm
                    </p>
                </td>
            </tr>
        </tbody>
    </table>

<p>
    &nbsp;


<h3>3. Medie annuali e trentennali</h3>
<p>
    Per ogni indicatore sono disponibili <strong>medie a livello annuale e trentennale</strong> in 
    <strong>valore assoluto</strong> o in termini di variazione del valore atteso nel futuro 
    rispetto al periodo di riferimento (<strong>anomalia</strong>).&nbsp;
</p>
<p>
    Per le <strong>medie trentennali</strong> il <strong>periodo storico di riferimento</strong> è l'intervallo 1976-2005,
    che rappresenta la climatologia passata, su cui sono state calcolate le medie per i periodi 
    2021-2050 (futuro vicino) e 2071-2100 (futuro lontano).
</p>

<h3>4. Dati stagionali e annuali</h3>
<p>
    Gli indicatori sono calcolati su <strong>base stagionale</strong> e alcuni su <strong>base 
    annuale</strong>, anche a seconda della tipologia dell'indicatore. Si considera la definizione 
    climatica di stagione: inverno (dicembre-gennaio-febbraio), primavera (marzo-aprile-maggio), 
    estate (giugno-luglio-agosto), autunno (settembre-ottobre-novembre).
</p>

<h3>5. Scenari e modelli climatici</h3>
<p>
    La piattaforma CliNE utilizza <strong>tre scenari</strong>:
</p>
<p>
    RCP2.6: scenario con <strong>forte mitigazione</strong> delle emissioni di gas serra, 
    ovvero una concentrazione in atmosfera di CO2 entro il 2100 pari a quella attuale (circa 420ppm) 
    e che mira a mantenere il riscaldamento globale entro i 2°C rispetto ai valori preindustriali, 
    come previsto dall'Accordo di Parigi (del 2015);&nbsp;
</p>
<p>
    RCP4.5: scenario intermedio di <strong>stabilizzazione</strong>, ovvero la concentrazione di 
    CO2 si stabilizza entro fine secolo a 538 ppm;
</p>
<p>
    RCP8.5: scenario <strong>senza mitigazione</strong> e con emissioni via via crescente, 
    cosiddetto <i>business-as-usual</i> e una concentrazione di CO2 entro fine secolo che supera i 900 ppm.
</p>
<p>
    Per questi scenari la Piattaforma elabora - con un metodo di <i>bias-correction</i> 
    che tiene conto dei dati della rete delle stazioni meteorologiche regionali - proiezioni che 
    meglio rappresentano la realtà locale: sono utilizzati <strong>cinque diversi modelli</strong> 
    climatici e una <strong>media di ensemble</strong> come migliore proiezione per il futuro. 
    I cinque modelli sono <strong>modelli 
    climatici a scala regionale</strong> del progetto EURO-CORDEX 
    (<a target="_blank" rel="noopener noreferrer" href="http://www.euro-cordex.net/"><u>http://www.euro-cordex.net/</u></a>), 
    che rappresenta lo stato dell'arte dei modelli climatici regionali su scala europea in termini di risoluzione spaziale; 
    questi ultimi garantiscono una rappresentazione più dettagliata delle caratteristiche geografiche e dei processi fisici 
    che influenzano il clima a scala regionale rispetto ai modelli climatici a scala globale da cui derivano.
</p>

<h3>6. Risoluzione geografica</h3>
<p>
    Per gli indicatori corretti con bias-correction il passo di griglia è 500 m e 5 km, rispettivamente, 
    per quelli calcolati sulla base di temperatura e di precipitazione. Per gli indicatori non corretti 
    con la bias-correction il passo di griglia è quello originale del modello, ovvero 11 km.&nbsp;
</p>
<p>
    Tutte le griglie sono fornite con il sistema di riferimento WGS 84 (EPSG:4326).
</p>


<h1>Avvertenze</h1>
<p>
    Nell'utilizzo della Piattaforma è importante tenere presente le seguenti avvertenze:
</p>
<p>
    Sono presenti 5 diverse simulazioni modellistiche e la loro media di ensemble come
    migliore proiezione per il futuro (Giorgi, 2005). Tutte le simulazioni modellistiche 
    sono caratterizzate da un certo grado di <strong>incertezza</strong>, che è dovuta 
    allo scenario di emissione, alla rappresentazione dei processi fisici (fisica delle 
    nubi, bilancio energetico alla superficie, …) e alla variabilità naturale del sistema 
    climatico (Cubash et al, 2001). L'incertezza dei modelli considerati è fornita dalla 
    deviazione standard dell'insieme di modelli considerati (Giorgi, 2005). Nell'utilizzo 
    delle proiezioni, la media di ensemble può essere considerata come la proiezione futura 
    più probabile, ma l'incertezza fornita dai diversi output delle varie simulazioni modellistiche 
    va sempre tenuta in considerazione. Attualmente in CliNE si tiene conto dell'incertezza 
    nei modi seguenti: per le mappe di anomalia trentennale, le aree dove i modelli non hanno 
    un buon accordo (Stocker at el., 2013) e quindi la proiezione è incerta sono ombreggiate 
    (media di ensemble < deviazione standard dei 5 modelli); per le serie annuali puntuali, 
    oltre alla media di ensemble vengono forniti gli estremi di incertezza superiore e inferiore 
    (media ensemble +/- deviazione standard dei 5 modelli).
</p>
<p>
    Si tratta di <strong>proiezioni</strong> climatiche e non di previsioni a lungo termine. 
    Pertanto, il valore annuale non ha validità come previsione (ad es. non ha alcun significato 
    vedere quale sarà la temperatura media nell'estate del 2047), ma ha validità esclusivamente 
    in un contesto di trend trentennale.
</p>
<p>
    La <strong>risoluzione</strong> effettiva delle simulazioni modellistiche è circa 2-3 
    volte minore rispetto al passo di griglia e quindi non è possibile descrivere fenomeni 
    al di sotto di questa dimensione. Ad esempio, se il modello ha passo di griglia 11 km la 
    risoluzione effettiva è circa 30 km; nell'utilizzo  dell'indicatore sul singolo punto è 
    sempre necessario tener conto di questo aspetto.&nbsp;
</p>
<p>
    <strong>Area geografica</strong> di riferimento. Per gli indicatori che si basano sulla 
    precipitazione il bias-correction è stato operato su tutta l'area di Veneto/Friuli-Venezia 
    Giulia/Trentino-Alto Adige utilizzando il dataset ArCIS che copre il centro-Nord Italia e 
    pertanto è presente tutta l'area interessata. La medesima area è presente per gli indicatori 
    forniti in anomalia su cui non è stata operato il bias-correction. Per gli indicatori di 
    temperatura il bias-correction è stato eseguito utilizzando esclusivamente le stazioni di 
    Veneto e Friuli-Venezia Giulia, pertanto il dato è fornito solo su quest'area. In una versione 
    futura della Piattaforma si cercherà di integrare le proiezioni con la bias-correction eseguita 
    con i dati da stazione del Trentino-Alto Adige.
</p>
<p>
    Sebbene gli output dei dati di origine EURO-CORDEX siano stati sottoposti a procedure di 
    controllo qualità, è possibile rimangano errori non identificati.
</p>

<h3>Link utili</h3>
    <p>PDF di approfondimento <a href="/cline_approfondimento.pdf" target="_blank">CliNE: sezione Proiezioni Climatiche</a></p>
    <p><a href="https://github.com/venetoarpa/Arpav-PPCV-backend/wiki/Manuale-utente" target="_blank">Manuale d'uso della Piattaforma</a></p>
    <p>Codice sorgente disponibile su <a href="https://github.com/venetoarpa/Arpav-PPCV" target="_blank">Github</a></p>
    <p>Indirizzo per informazioni e segnalazioni: <a href="mailto:cmt.rete@arpa.veneto.it" target="_blank"><u>cmt.rete@arpa.veneto.it</u></a></p>

            `,
                    }}
                />
            </>
        </PageContainer>
    );
};

export default InfoPage;
