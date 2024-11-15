import PageContainer from '../../components/Modals/PageContainer';
import React from 'react';
import { useTheme } from '@mui/material/styles';

const DataPolicyPage = () => {
  const theme = useTheme();

  return (
    <PageContainer>
      <div>
        <h1>Data policy</h1>
        <p>
          La piattaforma web denominata "Piattaforma Clima Nord-Est", di seguito
          denominata "Piattaforma", accessibile dal link pubblico{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://clima.arpa.veneto.it/"
          >
            <u>https://clima.arpa.veneto.it</u>
          </a>{' '}
          è installata su infrastruttura di ARPAV, ubicata nella sede di Teolo
          (PD).&nbsp;
        </p>

        <p>
          È accessibile direttamente dai cittadini, gratuitamente e senza
          credenziali, fornisce proiezioni sullo stato futuro del clima nel
          territorio del Nord-Est Italia. Offre, in particolare, la
          visualizzazione di mappe e serie temporali delle proiezioni climatiche
          di punti specifici, con riferimento a vari indicatori climatici, con
          la possibilità di confrontare queste ultime con le serie storiche
          misurate dalle stazioni della rete meteo-idro-nivo regionale.
        </p>

        <p>
          ARPAV ha commissionato lo sviluppo e la realizzazione della
          Piattaforma e del relativo software alla ditta{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://inkode.it/"
          >
            <u>INKODE Soc. Coop.</u>
          </a>{' '}
          e successivamente ha commissionato una manutenzione evolutiva a{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.geobeyond.it/"
          >
            <u>Geobeyond Srl</u>
          </a>. acquisendone, al termine dell'esecuzione della
          fornitura, la sua titolarità comprensiva di tutti i diritti di
          proprietà intellettuale e industriale.
        </p>
        <p>
          Ai sensi di quanto previsto dall'art. 69 del Codice
          dell'Amministrazione Digitale, ARPAV mette in riuso a titolo gratuito
          ad altre PA il software sviluppato, rendendone disponibile il codice
          sorgente, completo della documentazione, in un repository pubblico (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/venetoarpa/Arpav-PPCV-backend"
          >
            <u>https://github.com/venetoarpa/Arpav-PPCV-backend</u>
          </a>
          ;{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/venetoarpa/Arpav-PPCV"
          >
            <u>https://github.com/venetoarpa/Arpav-PPCV</u>
          </a>
          ), in licenza aperta, e registrandone il rilascio nel catalogo di
          Developers Italia, secondo quanto previsto da AGID nelle "
          <i>
            Linee guida su acquisizione e riuso di software per le Pubbliche
            Amministrazioni
          </i>
          "
        </p>
        <p>
          I contenuti della piattaforma, se non diversamente specificato, sono
          rilasciati sotto licenza Creative Commons Attribuzione - Condividi
          allo stesso modo 4.0 Italia (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.it"
          >
            <u>CC BY-SA 4.0 IT</u>
          </a>
          ), rinvenibile al seguente link{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.it"
          >
            <u>https://creativecommons.org/licenses/by-sa/4.0/deed.it</u>
          </a>
          , e<strong> </strong>possono essere riprodotti, distribuiti,
          comunicati, esposti, rappresentati, modificati e usati anche per fini
          commerciali, rispettando le seguenti <strong>condizioni</strong>:
        </p>
        <p>
          <strong>Paternità</strong> - Si deve dare evidenza che la paternità
          dei contenuti della Piattaforma è di ARPAV-Arpa FVG, su dati
          ambientali forniti da Istituto Meteorologico Reale dei Paesi Bassi,
          Istituto Meteorologico e Idrologico Svedese, Istituto per la
          Meteorologia Max-Planck, CLM-Community, ARPAV, Arpa FVG, Arpae
          Emilia-Romagna, Provincia Autonoma zdi Trento, Provincia Autonoma di
          Bolzano, Aeronautica Militare; deve essere riportato altresì l'URL{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://clima.arpa.veneto.it/"
          >
            <u>https://clima.arpa.veneto.it/</u>
          </a>
          <u>;</u>&nbsp;
        </p>
        <p>
          <strong>Stessa Licenza</strong> - Se il materiale viene trasformato o
          se ci si basa su di esso, è necessario distribuire i contributi con la
          medesima licenza del materiale originario;
        </p>
        <p>
          <strong>Rinuncia</strong> - E' possibile rinunciare a qualunque delle
          condizioni sopra descritte se si ottiene l'autorizzazione dal
          detentore dei diritti;
        </p>
        <p>
          <strong>Pubblico Dominio</strong> - Nel caso in cui l'opera o
          qualunque delle sue componenti siano nel pubblico dominio secondo la
          legge vigente, tale condizione non è in alcun modo modificata dalla
          licenza;
        </p>
        <p>
          <strong>Altri Diritti</strong> - La licenza non ha effetto in nessun
          modo sui seguenti diritti:
          <ul>
            <li>
              le eccezioni, libere utilizzazioni e le altre utilizzazioni
              consentite dalla legge sul diritto d'autore;
            </li>
            <li>i diritti morali dell'autore;</li>
            <li>
              i diritti che altre persone possono avere sull'opera stessa e/o
              sull'utilizzo dell'opera stessa, come il diritto all'immagine o
              alla tutela dei dati personali.
            </li>
          </ul>
        </p>
        <p>
          A riguardo si precisa che nella home page della Piattaforma è pubblicata
          la foto della Marmolada-Punta Penia del 1937, scattata da
          Giuseppe Ghedina Basilio (1898 - 1986). Nel caso di specie la pubblicazione
          è consentita, in deroga al diritto d'autore, sussistendo le condizioni
          consentite ex art.70 1-bis L. 633/1941 (Legge sul diritto d'autore):
          l'immagine è pubblicata infatti esclusivamente per finalità d'interesse
          pubblico, ad uso scientifico, senza alcun scopo di lucro, per fare conoscere
          alla cittadinanza l'impatto dei cambiamenti climatici in atto nell'ambito
          dell'area del Nord-est del territorio nazionale.
        </p>
        <p>
          Al di fuori di tale eccezione, ogni qualvolta vengano usati o distribuiti
          i contenuti del sito{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://clima.arpa.veneto.it/"
          >
            <u>https://clima.arpa.veneto.it/</u>
          </a>
          , è necessario farlo secondo i termini di questa licenza, che va
          comunicata in termini chiari ed inequivoci.
        </p>

        <h3>Utilizzo del sito</h3>

        <p>
          ARPAV informa che, a propria discrezione potrà sostituire, aggiungere,
          modificare e/o integrare il materiale contenuto nel portale{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://clima.arpa.veneto.it/"
          >
            <u>https://clima.arpa.veneto.it/</u>
          </a>
          , senza che ciò possa comportare alcuna responsabilità in merito a
          eventuali problemi di qualsiasi natura causati direttamente o
          indirettamente dall'accesso al sito, dall'incapacità o impossibilità
          di accedervi, dall'affidamento alle informazioni in esso contenute o
          dal loro impiego.
        </p>
        <p>
          I contenuti di &nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://clima.arpa.veneto.it/"
          >
            <u>https://clima.arpa.veneto.it/</u>
          </a>
          &nbsp; sono sottoposti al controllo da parte di ARPAV, che tuttavia
          declina ogni responsabilità diretta o indiretta per eventuali ritardi,
          imprecisioni, errori, omissioni, danni derivanti dall'uso dei
          contenuti del sito da parte di terzi.
        </p>

        <h3>Download</h3>
        <p>
          Ogni oggetto scaricabile presente su{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://clima.arpa.veneto.it/"
          >
            <u>https://clima.arpa.veneto.it/</u>
          </a>{' '}
          quali documentazione tecnica, normativa, modulistica e software, salvo
          diversa indicazione, è liberamente e gratuitamente disponibile,
          citando la fonte, in licenza Creative Commons Attribuzione - Condividi
          allo stesso modo 4.0 Italia (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.it"
          >
            <u>CC BY-SA 4.0 IT</u>
          </a>
          ).
        </p>
      </div>
    </PageContainer>
  );
};

export default DataPolicyPage;
