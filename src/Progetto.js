/**
 * @author Cisternino Matteo, Vigilante Antonio, Bocale Cristian, Tancredi Simone
 * @version 2.1.5
 * @description Il programma deve gestire una lista della spesa in cui ogni elemento 
 * ha i seguenti attributi: nome del prodotto, quantità da acquistare e categoria del prodotto.
 * Il programma deve permettere all'utente di:
 * - Aggiungere un elemento alla lista della spesa specificando il prodotto, la quantità e la categoria.
 * - Visualizzare l'intera lista della spesa con i relativi prodotti e quantità per categoria.
 * - Ricerca un elemento nella lista della spesa specificando il nome del prodotto o della categoria.
 * - Rimuovere un elemento dalla lista della spesa specificando il prodotto o la categoria da eliminare.
 * - Modificare un elemento nella lista della spesa specificando il prodotto da modificare e i nuovi valori.
 * Il programma deve essere implementato utilizzando le seguenti classi:
 * - GestioneFile: Questa classe gestisce la lettura e la scrittura di un file.
 * - ListaDellaSpesa: Questa classe gestisce la lista della spesa e fornisce metodi per aggiungere, visualizzare, cercare, eliminare e modificare un elemento.
 */

const prompt = require('prompt-sync')();

/**
 * @class GestioneFile
 * @description Questa classe gestisce la lettura e la scrittura di un file.
 * Il file viene utilizzato per memorizzare la lista della spesa in formato JSON.
 * La classe fornisce metodi per leggere i dati dal file e creare una mappa dalla stringa JSON letta.
*/
class GestioneFile {
    /**
     * @constructor
     * @description Questo costruttore inizializza la classe GestioneFile con il percorso del 
     * file JSON da leggere e scrivere.
     * Inoltre inizializza il modulo fs per la lettura e la scrittura di file.
     * @param {String} percorso - Il percorso del file JSON da leggere e scrivere.
     */
    constructor(percorso) {
        this.fs = require('fs');
        this.percorsoFile = percorso;
    }

    /**
     * @description Questo metodo converte un oggetto in una mappa ricorsivamente.
     * Se l'oggetto è vuoto, restituisce una mappa vuota altrimenti crea una mappa con le chiavi 
     * e i valori dell'oggetto e la restituisce.
     * @param {Object} oggetto - L'oggetto da convertire in mappa.
     * @returns {Map} La mappa creata dall'oggetto.
     */
    ObjectToMap(oggetto) {
        const mappa = new Map();
        for (const [chiave, valore] of Object.entries(oggetto)) {
            if (valore!==null && typeof valore === 'object' && !(valore instanceof Array)) {
                mappa.set(chiave, this.ObjectToMap(valore)); // Ricorsione per oggetti annidati
            } else {
                mappa.set(chiave, valore);
            }
        }
        return mappa;
    }

    /**
     * @description Questo metodo converte una mappa in un oggetto ricorsivamente.
     * Se la mappa è vuota, restituisce un oggetto vuoto altrimenti crea un oggetto con le chiavi
     * e i valori della mappa e lo restituisce.
     * @param {Map} mappa - La mappa da convertire in oggetto.
     * @returns {Object} L'oggetto creato dalla mappa.
     */
    MapToObject(mappa){
        const oggetto = {};
        for (const [chiave, valore] of mappa) {
            if (valore instanceof Map) {
                oggetto[chiave] = this.MapToObject(valore); // Ricorsione per sotto-mappe
            } else {
                oggetto[chiave] = valore;
            }
        }
        return oggetto;
    }

    /**
     * @description Questo metodo legge un file JSON e crea e restituisce una mappa dai dati letti.
     * Se il file non esiste o è vuoto, restituisce una mappa vuota.
     * @returns {Map} La mappa creata dal file JSON letto.
     */
    LeggiFileECreaMap() {
        try {
            const datiLettiDalFile=this.fs.readFileSync(this.percorsoFile , 'utf8');//lettura del file
            //creazione della mappa dalla stringa JSON letta e trasformata in oggetto con JSON.parse
            return this.ObjectToMap(JSON.parse(datiLettiDalFile));
        } catch (error) {
            return new Map();
        }
    }

    /**
     * @description Questo metodo scrive una mappa su un file JSON.
     * @param {Map} mappa - La mappa da scrivere su file. 
     */
    ScriviMapSuFile(listaDaScrivere) {
        // Trasformazione della mappa in oggetto e scrittura su file sotto forma di stringa JSON
        const ListaTraformata = this.MapToObject(listaDaScrivere);
        this.fs.writeFileSync(this.percorsoFile, JSON.stringify(ListaTraformata, null, 2));
    }
}



/**
 * @class ListaDellaSpesa
 * @description Classe per gestire la lista della spesa.
 * La classe fornisce metodi per aggiungere, visualizzare, cercare, eliminare e modificare un elemento.
 * Oltre a questo, la classe fornisce metodi per gestire l'interfaccia utente di ogni metodo
 */
class ListaDellaSpesa{    
    gestioneFile = new GestioneFile('../ListaDellaSpesa.json');
    lista = this.gestioneFile.LeggiFileECreaMap();

    /**
     * @description Aggiunge o aggiorna un prodotto nella lista della spesa.
     * Se la categoria non esiste, la crea. Se il prodotto esiste già, aggiorna la quantità.
     * Controlla che i parametri siano validi e che la quantità sia un numero maggiore di zero.
     * @param {String} prodotto - Nome del prodotto.
     * @param {String} quantita - Quantità da acquistare.
     * @param {String} categoria - Categoria del prodotto.
     * @returns {Boolean} True se l'aggiunta è avvenuta con successo, False altrimenti.
     */
    Aggiungi(categoria, prodotto, quantita) {
        quantita = parseFloat(quantita);

        // Validazione input
        if (
            !prodotto || 
            prodotto.trim() === "" || 
            quantita <= 0 || 
            isNaN(quantita)  ||
            !categoria ||
            categoria.trim() === "" ||
            prodotto.trim() === categoria.trim()
        ) {
            return false;
        }

        categoria = categoria.toUpperCase();
        prodotto = prodotto.toLowerCase();

        // Aggiunta/aggiornamento prodotto
        if (!this.lista.has(categoria)) {
            this.lista.set(categoria, new Map());
        }
        this.lista.get(categoria).set(prodotto, quantita);

        // Ordinamento lista
        this.lista = new Map([...this.lista].sort());
        this.lista.forEach((prodotti) => {
            prodotti = new Map([...prodotti].sort());
        });
        return true;
    }
    /**
     * @description Questo metodo permette all'utente di inserire un nuovo prodotto nella lista della spesa.
     * In particolare questa classe gestisce tutta la parte grafica dell'aggiunta di un prodotto alla lista della spesa.
     * L'aggiunta di un prodotto avviene tramite l'inserimento del nome del prodotto, la quantità e la categoria che
     * vengono poi passati come parametri al metodo Aggiungi della classe ListaDellaSpesa che fa l'effettiva aggiunta.
     * qualora durante l'input l'utente inserisca 0, la funzione termina.
    */      
    InterfacciaAggiungi() {
        console.log("------------------------------------");
        console.log("              Aggiunta              ");
        console.log("------------------------------------\n");
        let categoria = prompt("Inserisci categoria prodotto (Es cibo,bevande,ecc) oppure immetti 0 per annullare >>");
        if(categoria === "0"){//se l'utente inserisce 0 allora la funzione termina
            return;
        }
        let prodotto = prompt("Inserisci nome prodotto oppure immetti 0 per annullare >> ");
        if(prodotto === "0"){//se l'utente inserisce 0 allora la funzione termina
            return;
        }
        let quantita = prompt("Inserisci quantità da acquistare oppure immetti 0 per annullare >>");
        if(quantita === "0"){//se l'utente inserisce 0 allora la funzione termina
            return;
        }        
        //aggiunta del prodotto alla lista della spesa e controllo con output a video per confermare l'aggiunta
        if (this.Aggiungi(categoria, prodotto, quantita)) {
          console.log("\nProdotto aggiunto alla lista della spesa");
          this.gestioneFile.ScriviMapSuFile(this.lista);
        } else {
          console.log("\nErrore nell'aggiunta del prodotto alla lista della spesa:\
          \nnome prodotto e categoria devono essere validi e diversi tra loro, la quantità deve essere maggiore di 0");
        }
        prompt("\nPremi Invio per continuare");
    }
  

   /**
    * @description  Stampa tutti gli elementi presenti nella lista della spesa, ordinati per categoria.
    * Ogni categoria viene stampata seguita dai rispettivi prodotti con le relative quantità.
    * Qualora la lista della spesa sia vuota, viene stampato un messaggio di avviso.
    */
    VisualizzaLista(){
        if(this.lista.size==0){
            console.log("!! La lista è vuota !!");
            return; 
        }
        this.lista.forEach((prodotti,categoria)=>{console.log(categoria);//attraverso il forEach iteriamo per ogni categoria
            prodotti.forEach((quantita,prodotto)=>{//iteriamo ogni prodotto di quella categoria
                console.log("- prodotto: "+prodotto+" | quantità: "+quantita)
            })
        })
    }
    /**
     * @description Questo metodo gestisce l'interfaccia per visualizzare la lista della spesa.
     * viene poi richiamata la funzione VisualizzaLista che stampa tutti gli elementi presenti nella lista della spesa.
     */
    InterfacciaVisualizzaLista(){
        console.log("------------------------------------");
        console.log("        Elementi della lista        ");
        console.log("------------------------------------\n");
        this.VisualizzaLista();
        prompt("\nPremi Invio per continuare");
    }


    /**     * 
     * @description Questo metodo stampa un elemento specifico della lista della spesa.
     * questo elemento può essere una categoria o un prodotto.
     * Nel caso di una categoria, stampa tutti i prodotti e le relative quantità di quella categoria.
     * Nel caso di un prodotto, stampa la categoria, il prodotto e la quantità.
     * @param {Array} elementoDaStampare prodotto o categoria da stampare
     */
    Stampa(elementoDaStampare){
        if(elementoDaStampare.length==1){
            console.log("\n"+elementoDaStampare[0]);
            this.lista.get(elementoDaStampare[0]).forEach((quantita,prodotto)=>{
                console.log("- prodotto: "+prodotto+" | quantità: "+quantita)
            }) 
        }else if(elementoDaStampare.length==3){
            console.log("\n" + elementoDaStampare[0] + "\n- prodotto: " + elementoDaStampare[1] + " | quantità: " + elementoDaStampare[2]);
        }else{
            console.log("\n!! Nessuna corrispondenza trovata !!");
        }
    }    
    /**
     * @description - Cerca un elemento specifico all'interno di una mappa (map) che rappresenta una struttura di dati. 
     *  L'elemento può essere cercato sia come categoria che come prodotto all'interno di tale struttura.
     *  Se non è una categoria, cerca l'elemento tra i prodotti di tutte le categorie;
     * @param {String} elementoDaCercare nome del prodotto o della categoria da cercare
     * @returns {Array} vetore contenente la categoria, il prodotto e la quantità cercati se trova un prodotto, altrimenti un array vuoto.
     * Se l'elemento cercato è una categoria, restituisce un array con la categoria cercata.
     * Se l'elemento cercato non è presente nella lista della spesa, restituisce un array vuoto.
    */
    Cerca(elementoDaCercare){
        let vettore;
        elementoDaCercare=elementoDaCercare.toUpperCase();//tutte le categorie sono in maiuscolo
        if(this.lista.has(elementoDaCercare)){
            vettore=new Array(elementoDaCercare);            
            return vettore;                    
        }else{
            elementoDaCercare=elementoDaCercare.toLowerCase();//tutti i prodotti sono in minuscolo
            vettore=new Array();
            this.lista.forEach((prodotti,categoria)=>{
                if(prodotti.has(elementoDaCercare)){                    
                    vettore=new Array(categoria,elementoDaCercare,prodotti.get(elementoDaCercare));
                    return vettore;
            }});
            return vettore;
        }
    }
    /**
     * @description la funzione permette all'utente di cercare un prodotto o una categoria all'interno della lista della spesa.
     * Se la lista è vuota mostra un messaggio di avviso.
     * Altrimenti si chiede di inserire il prodotto o la categoria da cercare.
     * Attraverso le funzini Cerca e Stampa viene poi stampato l'elemento cercato. 
     */
    InterfacciaCerca()
    {
        console.log("------------------------------------");
        console.log("    Ricerca prodotto o categoria    ");
        console.log("------------------------------------\n");
        if(this.lista.size==0){
            console.log("!! la lista è vuota !!");
            prompt("\nPremi Invio per continuare");
            return; 
        }        
        let prodotto=prompt("Inserisci prodotto o categoria da cercare nella lista oppure immetti 0 per annullare >> ");
        if(prodotto === "0"){
            return;
        }
        let elementoTrovato=this.Cerca(prodotto);//ottengo l'elemento da stampare che può essere una categoria o un prodotto
        this.Stampa(elementoTrovato);//facendo la stampa dell'elemento trovato attraverso la funzione Stampa
        prompt("\nPremi Invio per continuare");
    }
    

    /**
     * @description Questo metodo rimuove una categoria o un prodotto dalla lista della spesa.
     * Ricerca per primo una categoria che ha lo stesso nome di "elemento".
     * Se trova una categoria col nome indicato la elimina.
     * Se non c'è nessuna categoria il cui nome corrisponde a "elemento", passa alla ricerca dei prodotti scorrendo tutte le categorie presenti.
     * Se in una categoria trova un prodotto il cui nome corrisponde a "elemento", lo elimina.
     * @param {String} elemento - Il nome dell'elemento (categoria o prodotto) da eliminare.
     * @returns {Boolean} True se ha eliminato un elemento, False se non ha eliminato nulla     * 
    */
    Elimina(elemento){
        let eliminato=0;
        elemento=elemento.toUpperCase();//tutte le categorie sono in maiuscolo
        if(this.lista.has(elemento)){
            this.lista.delete(elemento)
            eliminato = 1
        }
        else{
            elemento=elemento.toLowerCase();//tutti i prodotti sono in minuscolo
            this.lista.forEach((prodotti,categoria)=>{
                if(prodotti.has(elemento))
                {
                    prodotti.delete(elemento)
                    eliminato = 1
                }
                if(prodotti.size==0){//se la categoria rimane vuota allora l'elemento all'interno viene eliminato
                    this.lista.delete(categoria);
                    eliminato = 1
                }
            })
        }

        if(eliminato == 1){
            return true;
        }else{
            return false;
        }       
    }
    /**
     * @description Questo metodo mostra l' interfaccia di Eliminazione.
     * La funzione verifica se la lista non e' vuota, in tal caso 
     * richiede all' utente di inserire il nome del prodotto o della categoria da eliminare.
     * qualora durante l'input l'utente inserisca 0, la funzione termina.
     * Vengono visualizzati vari messaggi a seconda del return ottenuto dalla funzione Elimina.
     */  
    InterfacciaElimina(){        
        console.log("------------------------------------");
        console.log("            Eliminazione            ");
        console.log("------------------------------------\n");
        if(this.lista.size==0){
            console.log("!! la lista è vuota !!");
            prompt("\nPremi Invio per continuare");
            return; 
        }
        else{
            let prodotto=prompt("Inserisci prodotto o categoria da eliminare dalla lista oppure immetti 0 per annullare >> ");
            if(prodotto === "0"){
                return;
            }
            if(this.Elimina(prodotto)){
                console.log("\nElemento eliminato con successo");
                this.gestioneFile.ScriviMapSuFile(this.lista);
            }
            else{
                console.log("\n!! Impossibile trovare una categoria o un prodotto con il nome specificato !!");
            }
            prompt("\nPremi Invio per continuare");
        }
      
    }


    /** 
     * @description Questo metodo modifica un prodotto presente nella lista della spesa. 
    * Esso elimina il prodotto presente e poi aggiunge un nuovo prodotto con le informazioni specificate.
    * @param {String} vecchioProdotto - Il nome del prodotto esistente da sostituire.
    * @param {String} nuovoProdotto - Il nome del nuovo prodotto da aggiungere.
    * @param {Number} nuovaQuantita - La nuova quantità del prodotto.
    * @param {String} nuovaCategoria - La nuova categoria del prodotto.
    * @returns {Boolean} True se il prodotto è stato modificato con successo, False altrimenti.    * 
    */  
    Modifica(vecchioProdotto, nuovaCategoria, nuovoProdotto, nuovaQuantita) {
        if (this.Elimina(vecchioProdotto)) {
            return this.Aggiungi(nuovaCategoria, nuovoProdotto, nuovaQuantita);
        } else {
            return false;
        }
    }
    /**
    * @description Interfaccia per modificare un prodotto nella lista della spesa.
    * Questo metodo chiede all'utente di inserire il nome del prodotto da modificare e 
    * poi gli chiede di selezionare cosa modificare (nome, quantità, categoria o uscire).

    * Se l'utente sceglie di modificare il nome, la quantità o la categoria del prodotto,
    * il metodo chiede all'utente di inserire i nuovi valori e poi li utilizza per modificare il prodotto nella lista della spesa.
    
    * Se l'utente sceglie di uscire, il metodo termina l'operazione di modifica.
    * Se la modifica è avvenuta con successo, il metodo stampa un messaggio di conferma.
    * Altrimenti, stampa un messaggio di avviso se non ci sono state modifiche o stampa 
    * un messaggio di errore qualora la modifica non è riuscita.
    * qualora durante l'input l'utente inserisca 0, la funzione termina.
    */
    InterfacciaModifica() {
        console.log("------------------------------------");
        console.log("              Modifica              ");
        console.log("------------------------------------\n");
        if(this.lista.size==0){
            console.log("!! la lista è vuota !!");
            prompt("\nPremi Invio per continuare");
            return; 
        }
        let vecchioProdotto = prompt("Inserisci il prodotto da modificare oppure immetti 0 per annullare >> ");
        if(vecchioProdotto === "0"){
            return;
        }
        let scelta;
        let elementoDaModificare = this.Cerca(vecchioProdotto);
        if (elementoDaModificare.length === 3) {//lunghezza 3 significa che è stato trovato un prodotto
            //salviamo i valori del prodotto prima di essere modificato
            let nuovaCategoria = elementoDaModificare[0];
            let nuovoProdotto = elementoDaModificare[1];
            let nuovaQuantita = elementoDaModificare[2];
            let modificato = false;           
            do {
                console.clear();
                console.log("------------------------------------");
                console.log("              Modifica              ");
                console.log("------------------------------------\n");
                console.log("Cosa vuoi modificare del prodotto?\n");
                console.log("1 - Categoria");
                console.log("2 - Nome Prodotto");
                console.log("3 - Quantita");                
                console.log("0 - Esci");
                scelta = parseInt(prompt(("Fai una scelta >> ")));
                switch (scelta) {
                    case 1: {
                        nuovaCategoria = prompt("Inserire la nuova categoria del prodotto >>");
                        modificato = true;
                        break;
                    }
                    case 2: {
                        nuovoProdotto = prompt("Inserire il nuovo nome del prodotto >>");
                        modificato = true;
                        break;
                    }
                    case 3: {
                        nuovaQuantita = prompt("Inserire la nuova Quantita' del prodotto >>");
                        modificato = true;
                        break;
                    }                    
                    case 0: {
                        break;
                    }
                    default: {
                        console.log("\nOpzione non valida");
                        prompt("\nPremi Invio per continuare");
                        break;
                    }
                }
            } while (scelta != 0);
          
            //Controlli per controllare la validità dei dati inseriti e l'effettiva modifica del prodotto
            if (modificato && this.Modifica(vecchioProdotto, nuovaCategoria, nuovoProdotto, nuovaQuantita)) {
                console.log("\nModifica Avvenuta con Successo.");
                this.gestioneFile.ScriviMapSuFile(this.lista);
            } else if (!modificato) {
                console.log("\nNessuna modifica effettuata.");
            } else {
                console.log("\nModifica Fallita.");
            }
        } else {
            console.log("\nL'elemento che si vuole modificare non esiste nella lista della spesa.");
        }
        prompt("\nPremi Invio per continuare");
    }
}


/**
 * @function main
 * @description Questa funzione avvia il programma per la gestione della lista della spesa. 
   Visualizza un menu interattivo che consente all'utente di:
   - Visualizzare la lista della spesa
    - Ricerca un elemento nella lista della spesa
    - Aggiungere un elemento alla lista della spesa
    - Rimuovere un elemento dalla lista della spesa
    - Modificare un elemento nella lista della spesa
    - Uscire dal programma
    Qualora l'utente inserisca un'opzione non valida, viene visualizzato un messaggio di errore.
 */
function main(){
    const lista=new ListaDellaSpesa();
    let scelta;
    do{
        console.clear();
        console.log("------------------------------------");
        console.log("     Gestione Lista della Spesa     ");
        console.log("------------------------------------\n");
        console.log("Scegliere cosa fare");        
        console.log("1 - Visualizzare la lista della spesa");
        console.log("2 - Ricerca un elemento nella lista della spesa");
        console.log("3 - Aggiungere elemento alla lista della spesa");        
        console.log("4 - Rimuovere un elemento dalla lista della spesa");        
        console.log("5 - Modifica un elemento nella lista della spesa");     
        console.log("0 - Esci");   
        scelta=parseInt(prompt(">> "));          
        console.clear(); 
        switch(scelta){                     
            case 1:{  
                lista.InterfacciaVisualizzaLista();              
                break;
            }
            case 2:{
                lista.InterfacciaCerca();
                break;
            }
            case 3:{
                lista.InterfacciaAggiungi(); 
                break;
            }
            case 4:{
                lista.InterfacciaElimina();
                break;
            }            
            case 5:{
                lista.InterfacciaModifica();
                break;
            }  
            case 0:{
                break;
            }             
            default:{
                console.log("!! Opzione non valida !!");
                prompt("\nPremi Invio per continuare");
                break;
            }
        }
    }while(scelta!==0);

}
//Richiamo del main
main()