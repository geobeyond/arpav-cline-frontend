const InfoHistoricEn = () => {
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
                <h2>Historical Climatology</h2>

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
                                <p>Daily mean air temperature near the ground</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Minimum temperature (<strong>TASMIN</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Daily minimum air temperature near the ground</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Maximum temperature (<strong>TASMAX</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Daily maximum air temperature near the ground</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Tropical nights (<strong>TR</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Number of nights with a minimum temperature above 20°C</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Hot days (<strong>SU30</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Number of days with a maximum temperature above 30°C</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Frost days (<strong>FD</strong>)
                                </p>
                            </td>
                            <td>
                                <p>Number of days with a minimum temperature below 0°C</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Heating Degree Days (<strong>HDDs</strong>)
                                </p>
                            </td>
                            <td>
                                <p>
                                    Sum of the differences between indoor temperature (20°C) and
                                    the external daily mean temperature during the calendar year
                                    (January 1st – December 31st); only positive differences are
                                    counted
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    Cooling Degree Days (<strong>CDDs</strong>)
                                </p>
                            </td>
                            <td>
                                <p>
                                    Sum of the differences between the external daily mean
                                    temperature and the comfort temperature (21°C) during the
                                    calendar year (January 1st – December 31st); only counted if
                                    the external mean temperature exceeds 24°C
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
                                <p>Daily precipitation</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3>Temporal Aggregation</h3>
                <p>
                    For each indicator,{' '}
                    <strong>annual, decadal, and thirty-year averages</strong> are
                    available, provided as <strong>absolute values</strong> or as
                    differences from the reference period (<strong>anomalies</strong>).
                </p>
                <p>
                    The reference period used is the <strong>climatic normal</strong>{' '}
                    1991–2020, representing recent climatology. Based on this period,
                    annual and decadal anomalies were calculated.
                </p>
                <p>
                    Indicators are calculated on a monthly, seasonal, and annual basis,
                    depending on the indicator type. Seasons follow the climatic
                    definition: winter (December–January–February), spring
                    (March–April–May), summer (June–July–August), autumn
                    (September–October–November).
                </p>

                <h3>Observed Data</h3>
                <p>
                    The CliNE platform for the Veneto region uses observations from the{' '}
                    <strong>automatic weather-hydro-snow station network</strong>
                    of <strong>ARPA Veneto</strong>, considering around 130 stations with
                    consistent data series (at least 27 years) from 1992 to the present.
                    Regional estimates were obtained through spatial interpolation of
                    point data using
                    <i>Universal Kriging</i>, with elevation as a covariate and, for some
                    indicators, distance from the coastline.
                </p>
                <p>
                    For Friuli Venezia Giulia, around 85 automatic weather stations from
                    the <strong>ARPA FVG</strong> regional network are used, with
                    consistent series starting from 1991.
                </p>
                <p>
                    Trend estimation is based on the <i>Theil-Sen</i> estimator, a more
                    robust method than linear regression; trend statistical significance
                    is assessed using the non-parametric <i>Mann-Kendall</i> test.
                </p>

                <h3>Geographic Resolution</h3>
                <p>
                    For spatialized indicators in the Veneto region, the grid resolution
                    is approximately 1 km.
                </p>
                <p>
                    All grids are provided in WGS 84 (EPSG:4326) coordinate reference
                    system.
                </p>

                <h1>Warnings</h1>
                <p>Please keep in mind the following when using the platform:</p>
                <ul>
                    <li>
                        <strong>Geographic area</strong> of reference: For indicators
                        calculated over Veneto, a<strong>geo-spatial interpolation</strong>{' '}
                        has been applied, generating a regular grid over the entire region.
                        Values outside the station locations are{' '}
                        <strong>interpolated estimates</strong>, not direct measurements.
                        For Friuli Venezia Giulia, only station-level measured values are
                        provided.
                    </li>
                    <li>
                        In the analysis of historical series,{' '}
                        <strong>statistical significance</strong> of trend lines is key. In
                        CliNE, for annual station-level series, if the trend is
                        statistically significant (95% confidence), the trend line is solid
                        and the rate of change is provided; otherwise, the line is dashed
                        and no rate is shown.
                    </li>
                    <li>
                        For annual station-level series, data from a station is shown if the
                        selected point is within
                        <strong>2.5 km</strong> of the station; otherwise, interpolated data
                        is used (if available).
                    </li>
                    <li>
                        Although the original station data has undergone quality control
                        procedures, undetected errors may still be present.
                    </li>
                </ul>
            </div>
        </>
    );
};

export default InfoHistoricEn;
