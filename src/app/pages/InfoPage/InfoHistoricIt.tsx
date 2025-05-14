const InfoHistoricIt = () => {
    return (
        <>
            <div>
                <h2>Climatologia Storica</h2>

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
                    </tbody>
                </table>

                <h3>Aggregazione temporale</h3>
                <p>
                    Per ogni indicatore sono disponibili{' '}
                    <strong>medie a livello annuale, decennale e trentennale</strong> in{' '}
                    <strong>valore assoluto</strong> o in termini di variazione del valore
                    atteso nel futuro rispetto al periodo di riferimento ({' '}
                    <strong>anomalia</strong>).&nbsp;
                </p>
                <p>
                    Come periodo di riferimento è stato preso il trentennio{' '}
                    <strong>normale climatico</strong> 1991-2020, che rappresenta la
                    climatologia recente. Utilizzando questo normale climatico sono state
                    calcolate le anomalie annuali e decennali.
                </p>
                <p>
                    Gli indicatori sono calcolati su base mensile, stagionale e annuale a
                    seconda della tipologia dell'indicatore. Si considera la definizione
                    climatica di stagione: inverno (dicembre-gennaio-febbraio), primavera
                    (marzo-aprile-maggio), estate (giugno-luglio-agosto), autunno
                    (settembre-ottobre-novembre).
                </p>

                <h3>Dati osservati</h3>
                <p>
                    La piattaforma CliNE sul territorio del Veneto utilizza le
                    osservazioni della <strong>rete di stazioni automatiche</strong>
                    meteo-idro-nivo di <strong>ARPA Veneto</strong>, considerando circa
                    130 stazioni che dispongono di una serie consistente (almeno 27 anni)
                    dal 1992 ad oggi. Le stime dei valori regionalizzati sono state
                    calcolate mediante la spazializzazione dei dati puntuali attraverso
                    l'applicazione del <i>Universal Kriging</i>, utilizzando come
                    covariabile la quota e considerando anche la distanza dalla costa per
                    alcuni indicatori.{' '}
                </p>
                <p>
                    Per il territorio del Friuli Venezia Giulia vengono utilizzate circa
                    85 stazioni automatiche della rete meteorologica regionale di{' '}
                    <b>ARPA FVG</b> che dispongono di una serie consistente a partire dal
                    1991.
                </p>
                <p>
                    Per il calcolo del trend si è adottato lo stimatore di{' '}
                    <i>Theil-Sen</i>, metodo più robusto rispetto alla regressione
                    lineare; la significatività statistica del trend viene poi valutata
                    con il test non parametrico di <i>Mann-Kendall</i>.
                </p>

                <h3>Risoluzione geografica</h3>
                <p>
                    Per gli indicatori spazializzati sul Veneto il passo di griglia è
                    circa 1 km.
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
                        <strong>Area geografica</strong> di riferimento. Per gli indicatori
                        calcolati sul Veneto è stata operata un'
                        <strong>interpolazione geo-spaziale</strong> che permette di
                        ottenere un grigliato regolare su tutta la regione. I valori nei
                        punti al di fuori delle stazioni meteorologiche, essendo frutto di
                        <strong>interpolazione spaziale</strong>, vanno trattati come dati
                        stimati e non come dati misurati. Per il Friuli Venezia Giulia
                        vengono forniti solo i valori misurati a livello puntuale di
                        stazione.
                    </li>
                    <li>
                        Nell'analisi delle serie storiche un aspetto cruciale è la
                        <strong>significatività statistica</strong> delle linee di tendenza.
                        Attualmente in CliNE si tiene conto della significatività del trend
                        nel modo seguente: per le serie annuali puntuali, se il trend è
                        statisticamente significativo (con 95% di confidenza) la linea di
                        trend è continua e viene fornito il coefficiente di
                        aumento/diminuzione; in caso contrario, la linea dell'andamento è
                        tratteggiata e non viene fornito alcun coefficiente.
                    </li>
                    <li>
                        Nelle serie annuali puntuali viene fornito il dato da stazione se il
                        punto selezionato è ad una distanza massima di{' '}
                        <strong>2.5 km</strong> dalla stazione stessa; al di fuori di questo
                        raggio, viene fornito il dato frutto dell'interpolazione spaziale
                        (ove esistente).
                    </li>
                    <li>
                        Sebbene gli output dei dati di origine delle stazioni siano stati
                        sottoposti a procedure di controllo qualità, è possibile rimangano
                        errori non identificati.
                    </li>
                </ul>
            </div>
        </>
    );
};

export default InfoHistoricIt;
