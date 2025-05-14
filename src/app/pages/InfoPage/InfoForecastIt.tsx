const InfoForecastIt = () => {
    return (
        <>
            <style>
                {`
            tr:nth-child(2n) {
                background: #cccccc;
        }
        `}
            </style>
            <div>
                <h2>Proiezioni Climatiche</h2>

                <h3>Indicatori climatici</h3>
                <table>
                    <colgroup>
                        <col style={{ width: '40%' }}></col>
                        <col style={{ width: '60%' }}></col>
                    </colgroup>
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
                                <p>Temperatura media dell'aria vicino al suolo</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Temperatura minima (<strong>TASMIN</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Temperatura minima giornaliera dell'aria vicino al suolo</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Temperatura massima (<strong>TASMAX</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Temperatura massima giornaliera dell'aria vicino al suolo</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Notti tropicali (<strong>TR</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Numero di notti con temperatura minima maggiore di 20 °C</p>
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
                                <p>Numero di giorni con temperatura minima minore di 0 °C</p>
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
                                    Numero di giorni con temperatura massima maggiore di 5 °C
                                    rispetto alla media per almeno 5 giorni consecutivi
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
                                    Somma delle differenze tra la temperatura dell'ambiente (20°C)
                                    e la temperatura media giornaliera esterna nell'anno solare (1
                                    gennaio - 31 dicembre); vengono conteggiate solo le differenze
                                    superiori allo zero
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
                                    Somma delle differenze tra la temperatura media giornaliera
                                    esterna e la temperatura di comfort climatico (21°C) nell'anno
                                    solare (1 gennaio - 31 dicembre); la differenza viene
                                    conteggiata solo se la temperatura media esterna supera i 24°C
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
                                <p>Precipitazione cumulata al suolo</p>
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
                                    Precipitazione totale cumulata al di sopra del 95 <sup>o</sup>
                                    percentile del periodo di riferimento
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
                                    Numero massimo di giorni consecutivi asciutti (precipitazione
                                    giornaliera inferiore a 1 mm)
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
                                    Numero di giorni con temperatura media minore di 2 °C e
                                    precipitazione giornaliera maggiore di 1 mm
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3>Aggregazione temporale</h3>
                <p>
                    Per ogni indicatore sono disponibili
                    <strong>medie a livello annuale e trentennale</strong> in
                    <strong>valore assoluto</strong> o in termini di variazione del valore
                    atteso nel futuro rispetto al periodo di riferimento (
                    <strong>anomalia</strong>).&nbsp;
                </p>
                <p>
                    Per le medie trentennali il
                    <strong>periodo storico di riferimento</strong> è l'intervallo
                    1976-2005, che rappresenta la climatologia passata, su cui sono state
                    calcolate le medie per i periodi <strong>2021-2050</strong> (futuro
                    vicino) e <strong>2071-2100</strong>&nbsp;
                    (futuro lontano).
                </p>
                <p>
                    Gli indicatori sono calcolati su base stagionale e alcuni su base
                    annuale, anche a seconda della tipologia dell'indicatore. Si considera
                    la definizione climatica di stagione: inverno
                    (dicembre-gennaio-febbraio), primavera (marzo-aprile-maggio), estate
                    (giugno-luglio-agosto), autunno (settembre-ottobre-novembre).
                </p>
                <h3>Scenari e modelli climatici</h3>
                <p>
                    La piattaforma CliNE utilizza <strong>tre scenari climatici</strong>:
                </p>
                <ul>
                    <li>
                        RCP2.6: scenario con <strong>forte mitigazione</strong> delle
                        emissioni di gas serra, ovvero una concentrazione in atmosfera di
                        CO2 entro il 2100 pari a quella attuale (circa 420ppm) e che mira a
                        mantenere il riscaldamento globale entro i 2°C rispetto ai valori
                        preindustriali, come previsto dall'Accordo di Parigi (del
                        2015);&nbsp;
                    </li>
                    <li>
                        RCP4.5: scenario intermedio di <strong>stabilizzazione</strong>,
                        ovvero la concentrazione di CO2 si stabilizza entro fine secolo a
                        538 ppm;
                    </li>
                    <li>
                        RCP8.5: scenario <strong>senza mitigazione</strong> e con emissioni
                        via via crescente, cosiddetto <i>business-as-usual</i> e una
                        concentrazione di CO2 entro fine secolo che supera i 900 ppm, come
                        da tendenza attuale.
                    </li>
                </ul>
                <p>
                    Per questi scenari la Piattaforma elabora - con un metodo di
                    <i>bias-correction</i>
                    che tiene conto dei dati della rete delle stazioni meteorologiche
                    regionali - proiezioni che meglio rappresentano la realtà locale: sono
                    utilizzati <strong>cinque diversi modelli</strong>
                    climatici e una <strong>media di ensemble</strong> come migliore
                    proiezione per il futuro. I cinque modelli sono
                    <strong>modelli climatici a scala regionale</strong> del progetto
                    EURO-CORDEX (
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="http://www.euro-cordex.net/"
                    >
                        <u>http://www.euro-cordex.net/</u>
                    </a>
                    ), che rappresenta lo stato dell'arte dei modelli climatici regionali
                    su scala europea in termini di risoluzione spaziale; questi ultimi
                    garantiscono una rappresentazione più dettagliata delle
                    caratteristiche geografiche e dei processi fisici che influenzano il
                    clima a scala regionale rispetto ai modelli climatici a scala globale
                    da cui derivano.
                </p>

                <h3>Risoluzione geografica</h3>
                <p>
                    Per gli indicatori corretti con bias-correction il passo di griglia è
                    500 m e 5 km, rispettivamente, per quelli calcolati sulla base di
                    temperatura e di precipitazione. Per gli indicatori non corretti con
                    la bias-correction il passo di griglia è quello originale del modello,
                    ovvero 11 km.&nbsp;
                </p>
                <p>
                    Tutte le griglie sono fornite con il sistema di riferimento WGS 84
                    (EPSG:4326).
                </p>

                <h1>Avvertenze</h1>
                <p>
                    Nell'utilizzo della Piattaforma è importante tenere presente le
                    seguenti avvertenze:
                </p>
                <ul>
                    <li>
                        Sono presenti 5 diverse simulazioni modellistiche e la loro media di
                        ensemble come migliore proiezione per il futuro (Giorgi, 2005).
                        Tutte le simulazioni modellistiche sono caratterizzate da un certo
                        grado di
                        <strong>incertezza</strong>, che è dovuta allo scenario di
                        emissione, alla rappresentazione dei processi fisici (fisica delle
                        nubi, bilancio energetico alla superficie, …) e alla variabilità
                        naturale del sistema climatico (Cubash et al, 2001). L'incertezza
                        dei modelli considerati è fornita dalla deviazione standard
                        dell'insieme di modelli considerati (Giorgi, 2005). Nell'utilizzo
                        delle proiezioni, la media di ensemble può essere considerata come
                        la proiezione futura più probabile, ma l'incertezza fornita dai
                        diversi output delle varie simulazioni modellistiche va sempre
                        tenuta in considerazione. Attualmente in CliNE si tiene conto
                        dell'incertezza nei modi seguenti: per le mappe di anomalia
                        trentennale, le aree dove i modelli non hanno un buon accordo
                        (Stocker at el., 2013) e quindi la proiezione è incerta sono
                        ombreggiate (media di ensemble &lt; deviazione standard dei 5
                        modelli); per le serie annuali puntuali, oltre alla media di
                        ensemble vengono forniti gli estremi di incertezza superiore e
                        inferiore (media ensemble +/- deviazione standard dei 5 modelli).
                    </li>
                    <li>
                        Si tratta di <strong>proiezioni</strong> climatiche e non di
                        previsioni a lungo termine. Pertanto, il valore annuale non ha
                        validità come previsione (ad es. non ha alcun significato vedere
                        quale sarà la temperatura media nell'estate del 2047), ma ha
                        validità esclusivamente in un contesto di trend trentennale.
                    </li>
                    <li>
                        La <strong>risoluzione</strong> effettiva delle simulazioni
                        modellistiche è circa 2-3 volte minore rispetto al passo di griglia
                        e quindi non è possibile descrivere fenomeni al di sotto di questa
                        dimensione. Ad esempio, se il modello ha passo di griglia 11 km la
                        risoluzione effettiva è circa 30 km; nell'utilizzo dell'indicatore
                        sul singolo punto è sempre necessario tener conto di questo
                        aspetto.&nbsp;
                    </li>
                    <li>
                        <strong>Area geografica</strong> di riferimento. Per gli indicatori
                        che si basano sulla precipitazione il bias-correction è stato
                        operato su tutta l'area di Veneto/Friuli-Venezia
                        Giulia/Trentino-Alto Adige utilizzando il dataset ArCIS che copre il
                        centro-Nord Italia e pertanto è presente tutta l'area interessata.
                        La medesima area è presente per gli indicatori forniti in anomalia
                        su cui non è stata operato il bias-correction. Per gli indicatori di
                        temperatura il bias-correction è stato eseguito utilizzando
                        esclusivamente le stazioni di Veneto e Friuli-Venezia Giulia,
                        pertanto il dato è fornito solo su quest'area. In una versione
                        futura della Piattaforma si cercherà di integrare le proiezioni con
                        la bias-correction eseguita con i dati da stazione del Trentino-Alto
                        Adige.
                    </li>
                    <li>
                        La serie annuale puntuale fornita dalla proiezione viene messa a
                        confronto con la serie storica puntuale misurata dalla stazione di
                        misura della rete meteo regionale presente nelle immediate
                        vicinanze, se quest'ultima si trova ad una distanza di 1 km dal
                        punto di griglia del modello.
                    </li>
                    <li>
                        Sebbene gli output dei dati di origine EURO-CORDEX siano stati
                        sottoposti a procedure di controllo qualità, è possibile rimangano
                        errori non identificati.
                    </li>
                </ul>
            </div>
        </>
    );
};

export default InfoForecastIt;
