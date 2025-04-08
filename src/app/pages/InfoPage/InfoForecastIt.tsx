const InfoForecastIt = () => {
    return (
        <>
            <div>
                <h1>Il cambiamento climatico</h1>
                <p>
                    Le attività umane influiscono sul clima: l'aumento della
                    concentrazione di gas serra e i conseguenti cambiamenti osservati dei
                    valori climatici medi sul lungo periodo e degli estremi climatici in
                    ogni parte del mondo ne sono evidenti segnali. Nell'area del
                    Mediterraneo, in particolare, le condizioni che alterano l'equilibrio
                    climatico più severe, come l'aumento delle temperature e la
                    diminuzione delle precipitazioni estive, e la sua vulnerabilità
                    accentuata rispetto ad altre regioni, portano a rischi climatici più
                    gravi.
                </p>
                <p>
                    Una valutazione del cambiamento climatico e della sua variabilità a
                    scala regionale diviene quindi cruciale per stimarne i potenziali
                    impatti in futuro, per lo sviluppo di strategie di adattamento
                    (processo di adeguamento al clima attuale o atteso e ai suoi effetti,
                    al fine di limitare i danni o sfruttare le opportunità favorevoli) e
                    per valutare azioni di mitigazione (qualsiasi intervento umano che
                    riduca le emissioni o rafforzi le fonti di assorbimento dei gas
                    serra).
                </p>

                <h1>La piattaforma</h1>
                <p>
                    La Piattaforma <strong>Cli</strong>ma <strong>N</strong>ord-
                    <strong>E</strong>st (CliNE) propone
                    <strong>proiezioni climatiche</strong> per il territorio del
                    <strong>Nord-Est Italia</strong> attraverso
                    <strong>tredici indicatori</strong> calcolati per possibili
                    <strong>scenari climatici futuri</strong> e adattati ai dati raccolti
                    dalle stazioni meteorologiche regionali.&nbsp;
                </p>
                <p>
                    Tali proiezioni vengono fornite in termini di mappe e di serie
                    temporali, per diversi orizzonti temporali e tre scenari emissivi, con
                    la possibilità di estrazione e download dei dati per specifici punti
                    di interesse. Inoltre, viene data la possibilità di visualizzare e
                    confrontare la serie annuale puntuale fornita dalla proiezione con la
                    serie storica puntuale misurata dalle stazioni di misura della rete
                    meteo-idro-nivo regionale presenti nelle immediate vicinanze (entro 1
                    km).
                </p>
                <p>
                    Le informazioni presentate nella Piattaforma sono di utilità per
                    decisori politici, portatori di interesse e cittadini, al fine di
                    supportare la pianificazione del territorio, le misure di adattamento
                    ai cambiamenti climatici e, più in generale, aumentare la conoscenza e
                    la consapevolezza sui cambiamenti climatici in corso.
                </p>
                <p>
                    Per informazioni sull'utilizzo di CliNE è possibile consultare il
                    <a
                        href="https://github.com/venetoarpa/arpav-cline-frontend/wiki/Manuale-utente"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Manuale d'uso.
                    </a>
                </p>

                <h1>Gli elementi della piattaforma</h1>

                <h3>1. Barometro del clima</h3>
                <p>
                    Il{' '}
                    <a
                        href="https://clima.arpa.veneto.it"
                        target="_blank"
                        rel="noreferrer"
                    >
                        barometro del clima
                    </a>
                    , analogamente al barometro che misura la pressione atmosferica usato
                    per descrivere e prevedere l'evoluzione meteorologica, vuole essere
                    uno strumento semplice e diretto per descrivere e prevedere il clima
                    che cambia.
                </p>
                <p>
                    In questo contesto, la temperatura media annua misurata dalle stazioni
                    meteorologiche regionali racconta l'evoluzione del clima in Veneto
                    fino ad oggi. Le proiezioni climatiche rappresentano possibili futuri
                    climatici, ognuno dei quali parte dalla situazione attuale tenendo
                    conto di sviluppi socio-economici, demografici e tecnologici che
                    determinano panorami emissivi diversi di gas serra, causa principale
                    del riscaldamento globale.
                </p>
                <p>
                    Il confronto tra temperatura media annua rilevata e proiezioni
                    climatiche offre una misura del clima che sta cambiando e della
                    possibile evoluzione nel futuro.
                </p>

                <h3>2. Tredici indicatori</h3>
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
                                <p>Temperatura media giornaliera dell'aria vicino al suolo</p>
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
                                <p>Precipitazione giornaliera</p>
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
                                    Precipitazione totale cumulata al di sopra del 95 <sup>o</sup>{' '}
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
            </div>
        </>
    );
};

export default InfoForecastIt;
