const InfoForecastEn = () => {
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
                <h2>Climate Projections</h2>

                <h3>Climate Indicators</h3>
                <table>
                    <colgroup>
                        <col style={{ width: '40%' }}></col>
                        <col style={{ width: '60%' }}></col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                <p>
                                    <strong>Indicator</strong>
                                </p>
                            </td>
                            <td>
                                <p>
                                    <strong>Description</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Mean temperature (<strong>TAS</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Average near-surface air temperature</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Minimum temperature (<strong>TASMIN</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Daily minimum near-surface air temperature</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Maximum temperature (<strong>TASMAX</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Daily maximum near-surface air temperature</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Tropical nights (<strong>TR</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Number of nights with minimum temperature above 20 °C</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Hot days (<strong>SU30</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Number of days with maximum temperature above 30 °C</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Frost days (<strong>FD</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Number of days with minimum temperature below 0 °C</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Heatwave duration (<strong>HWDI</strong>)
                                </p>
                            </td>
                            <td>
                                <p>
                                    Number of days with maximum temperature exceeding the average
                                    by more than 5 °C for at least 5 consecutive days
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Heating degree days (<strong>HDDs</strong>)
                                </p>
                            </td>
                            <td>
                                <p>
                                    Sum of the differences between indoor temperature (20°C) and
                                    daily outdoor mean temperature over the calendar year (January
                                    1 – December 31); only positive differences are counted
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Cooling degree days (<strong>CDDs</strong>)
                                </p>
                            </td>
                            <td>
                                <p>
                                    Sum of the differences between daily outdoor mean temperature
                                    and climate comfort temperature (21°C) over the calendar year;
                                    only counted when mean outdoor temperature exceeds 24°C
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Precipitation (<strong>PR</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Total accumulated precipitation</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Extreme precipitation (<strong>R95pTOT</strong>)
                                </p>
                            </td>
                            <td>
                                <p>
                                    Total precipitation accumulated above the 95<sup>th</sup>
                                    percentile of the reference period
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Dry days (<strong>CDD</strong>)
                                </p>
                            </td>
                            <td>
                                <p>
                                    Maximum number of consecutive dry days (daily precipitation
                                    less than 1 mm)
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Days with new snowfall (<strong>SNWDAYS</strong>)
                                </p>
                            </td>
                            <td>
                                <p>
                                    Number of days with average temperature below 2 °C and daily
                                    precipitation above 1 mm
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3>Temporal Aggregation</h3>
                <p>
                    For each indicator, <strong>annual and 30-year averages</strong> are
                    available in <strong>absolute value</strong> or as a variation from
                    the reference period (<strong>anomaly</strong>).
                </p>
                <p>
                    For 30-year averages, the <strong>historical reference period</strong>{' '}
                    is 1976–2005, which represents the past climate used to calculate
                    averages for the
                    <strong>2021–2050</strong> (near future) and{' '}
                    <strong>2071–2100</strong> (far future) periods.
                </p>
                <p>
                    Indicators are calculated seasonally, and in some cases annually,
                    depending on the indicator. The definition of climate seasons used is:
                    winter (December–January–February), spring (March–April–May), summer
                    (June–July–August), and autumn (September–October–November).
                </p>

                <h3>Climate Scenarios and Models</h3>
                <p>
                    The CliNE platform uses <strong>three climate scenarios</strong>:
                </p>
                <ul>
                    <li>
                        RCP2.6: scenario with <strong>strong mitigation</strong> of
                        greenhouse gas emissions, aiming to stabilize CO₂ concentration by
                        2100 at current levels (~420 ppm) and limit global warming to 2°C
                        above pre-industrial levels, as outlined in the Paris Agreement
                        (2015);
                    </li>
                    <li>
                        RCP4.5: <strong>stabilization</strong> scenario, in which CO₂
                        concentration stabilizes around 538 ppm by the end of the century;
                    </li>
                    <li>
                        RCP8.5: <strong>no-mitigation</strong> or “<i>business-as-usual</i>”
                        scenario, with CO₂ concentrations exceeding 900 ppm by the end of
                        the century.
                    </li>
                </ul>
                <p>
                    For these scenarios, the platform uses a <i>bias-correction</i> method
                    that incorporates data from the regional meteorological station
                    network to generate projections that better reflect local conditions.
                    It uses
                    <strong>five regional climate models</strong> and their
                    <strong>ensemble average</strong> as the best projection for the
                    future. The five models are{' '}
                    <strong>regional-scale climate models</strong> from the EURO-CORDEX
                    project (
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="http://www.euro-cordex.net/"
                    >
                        <u>http://www.euro-cordex.net/</u>
                    </a>
                    ), representing the state-of-the-art for high-resolution regional
                    climate modeling in Europe. They provide more detailed representations
                    of geographic features and physical processes compared to global
                    models.
                </p>

                <h3>Geographic Resolution</h3>
                <p>
                    For indicators corrected with bias-correction, grid spacing is 500 m
                    for temperature-based indicators and 5 km for precipitation-based
                    indicators. For uncorrected indicators, the original model resolution
                    (11 km) is used.
                </p>
                <p>
                    All grids are provided using the WGS 84 reference system (EPSG:4326).
                </p>

                <h1>Warnings</h1>
                <p>When using the Platform, please consider the following warnings:</p>
                <ul>
                    <li>
                        There are 5 different model simulations and their ensemble mean,
                        which is considered the most reliable projection for the future
                        (Giorgi, 2005). All simulations involve a certain degree of
                        <strong>uncertainty</strong>, due to emission scenario assumptions,
                        representation of physical processes (cloud physics, surface energy
                        balance, etc.), and the natural variability of the climate system
                        (Cubash et al., 2001). Model uncertainty is expressed as the
                        standard deviation across the considered model set (Giorgi, 2005).
                        The ensemble mean can be seen as the most likely future projection,
                        but the spread of outcomes should always be taken into account.
                    </li>
                </ul>
            </div>
        </>
    );
};

export default InfoForecastEn;
