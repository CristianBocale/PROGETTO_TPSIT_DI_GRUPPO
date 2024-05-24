/**
/**
 * @author Cisternino Matteo, Vigilante Antonio, Bocale Cristian, Tancredi Simone
 * @version 2.0.0
 * @description Il programma deve gestire una lista della spesa in cui ogni elemento ha i seguenti attributi: Categoria, prodotto e quantità.
 * La lista permette l'aggiunta, l'eliminazione e la stampa degli attributi.
 */

const prompt = require("prompt-sync")();
const jsonfile = require('jsonfile');

/**
 * @class GestioneFile
 * @description Questa classe gestisce la lettura e la scrittura di un file.
 * Il file viene utilizzato per memorizzare la lista della spesa in formato JSON.
 * La classe fornisce metodi per leggere i dati dal file e creare una mappa dalla stringa JSON letta.
*/
class GestioneFile {
    constructor(percorso) {
        this.fs = require('fs');
        this.percorsoFile = percorso;
    }

    objectToMap(oggetto) {
        const mappa = new Map();
        for (const [chiave, valore] of Object.entries(oggetto)) {
            if (valore!==null && typeof valore === 'object' && !(valore instanceof Array)) {
                mappa.set(chiave, this.objectToMap(valore)); // Ricorsione per oggetti annidati
            } else {
                mappa.set(chiave, valore);
            }
        }
        return mappa;
    }

    mapToObject(mappa){
        const oggetto = {};
        for (const [chiave, valore] of mappa) {
            if (valore instanceof Map) {
                oggetto[chiave] = this.mapToObject(valore); // Ricorsione per sotto-mappe
            } else {
                oggetto[chiave] = valore;
            }
        }
        return oggetto;
    }

    LeggiFileECreaMap() {
        try {
            const oggetto=this.fs.readFileSync(this.percorsoFile , 'utf8');
            return this.objectToMap(JSON.parse(oggetto));
        } catch (error) {
            return new Map();
        }
    }

    ScriviMapSuFile(mappa) {
        const oggetto = this.mapToObject(mappa);
        this.fs.writeFileSync(this.percorsoFile, JSON.stringify(oggetto, null, 2));
    }
}



/**
 * @class ListaDellaSpesa
 * @description Classe per gestire la lista della spesa.
 */
class ListaDellaSpesa{    
    GestioneFile = new GestioneFile('../ListaDellaSpesa.json');
    Lista = this.GestioneFile.LeggiFileECreaMap();

    /**
     * @description Aggiunge o aggiorna un prodotto nella lista della spesa.
     * Se la categoria non esiste, la crea. Se il prodotto esiste già, aggiorna la quantità.
     * Controlla che i parametri siano validi e che la quantità sia un numero maggiore di zero.
     * @param {String} prodotto - Nome del prodotto.
     * @param {String} quantita - Quantità da acquistare.
     * @param {String} categoria - Categoria del prodotto.
     * @returns {Boolean} True se l'aggiunta è avvenuta con successo, False altrimenti.
     */
    Aggiungi(prodotto, quantita, categoria) {
        quantita = parseFloat(quantita);

        // Validazione input
        if (
            !prodotto || 
            prodotto.trim() === "" || 
            quantita <= 0 || 
            isNaN(quantita)  ||
            !categoria ||
            categoria.trim() === ""
        ) {
            return false;
        }

        categoria = categoria.toUpperCase();
        prodotto = prodotto.toLowerCase();

        // Aggiunta/aggiornamento prodotto
        if (!this.Lista.has(categoria)) {
            this.Lista.set(categoria, new Map());
        }
        this.Lista.get(categoria).set(prodotto, quantita);

        // Ordinamento lista
        this.Lista = new Map([...this.Lista].sort());
        this.Lista.forEach((prodotti) => {
            prodotti = new Map([...prodotti].sort());
        });
        return true;
    }
      
    
    /**
     * @description Questo metodo permette all'utente di inserire un nuovo prodotto nella lista della spesa.
     * In particolare questa classe gestisce tutta la parte grafica dell'aggiunta di un prodotto alla lista della spesa.
     * L'aggiunta di un prodotto avviene tramite l'inserimento del nome del prodotto, la quantità e la categoria che
     * vengono poi passati come parametri al metodo Aggiungi della classe ListaDellaSpesa che fa l'effettiva aggiunta.
    */      
    InterfacciaAggiungi() {
        console.log("Aggiunta prodotto alla lista della spesa\n");
        let prodotto = prompt("Inserisci nome prodotto: ");
        let quantita = prompt("Inserisci quantità da acquistare: ");
        let categoria = prompt("Inserisci categoria prodotto (Es cibo,bevande,ecc): ");
        if (this.Aggiungi(prodotto, quantita, categoria)) {
          console.log("\nProdotto aggiunto alla lista della spesa");
          this.GestioneFile.ScriviMapSuFile(this.Lista);
        } else {
          console.log("\nErrore nell'aggiunta del prodotto alla lista della spesa:\
          \nnome prodotto, quantità e categoria sono obbligatori e la quantità deve essere un numero maggiore di zero");
        }
        prompt("\nPremi Invio per continuare");
    }
  
   /**
    * @description  Stampa tutti gli elementi presenti nella lista della spesa, ordinati per categoria.
    * Ogni categoria viene stampata seguita dai rispettivi prodotti con le relative quantità.
    * Utilizza la funzione forEach() per iterare su ogni categoria e i relativi prodotti.
    */
    VisualizzaLista(){
        if(this.Lista.size==0){
            console.log("La lista della spesa è vuota");
            return; 
        }
        this.Lista.forEach((prodotti,categoria)=>{console.log(categoria);//attraverso il forEach iteriamo per ogni categoria
            prodotti.forEach((quantita,prodotto)=>{//iteriamo ogni prodotto di quella categoria
                console.log("- prodotto: "+prodotto+" | quantità: "+quantita)
            })
        })
    }

    /**
     * @description Questo metodo mostra l'interfaccia per visualizzare la lista della spesa.
     * La funzione stampa tutti gli elementi presenti nella lista della spesa, ordinati per categoria.
     */
    InterfacciaVisualizzaLista(){
        console.log("Gli elementi presenti nella lista della spesa sono: \n");
        this.VisualizzaLista();
        prompt("\nPremi Invio per continuare");
    }

    /**
     * @param {Array} ElementoDaStampare prodotto o categoria da stampare
     * @description Questo metodo stampa un elemento specifico della lista della spesa.
     * questo elemento può essere una categoria o un prodotto.
     * Nel caso di una categoria, stampa tutti i prodotti e le relative quantità di quella categoria.
     * Nel caso di un prodotto, stampa la categoria, il prodotto e la quantità.
     */
    Stampa(ElementoDaStampare){
        if(ElementoDaStampare.length==1){
            console.log("\n"+ElementoDaStampare[0]);
            this.Lista.get(ElementoDaStampare[0]).forEach((quantita,prodotto)=>{
                console.log("- prodotto: "+prodotto+" | quantità: "+quantita)
            }) 
        }else if(ElementoDaStampare.length==3){
            console.log("\n" + ElementoDaStampare[0] + "\n- prodotto: " + ElementoDaStampare[1] + " | quantità: " + ElementoDaStampare[2]);
        }else{
            console.log("\nNon è stato trovato nessun elemento");
        }
    }    

    /**
     * @param {String} ElementoDaCercare nome del prodotto o della categoria da cercare
     * @description - * Cerca un elemento specifico all'interno di una mappa (map) che rappresenta una struttura di dati. 
     *  L'elemento può essere cercato sia come categoria che come prodotto all'interno di tale struttura.
     *  Se non è una categoria, cerca l'elemento tra i prodotti di tutte le categorie;
     *  Se trova qualcosa allora restituisce un array con ciò che ha trovato:
     *  Se trova una categoria restituisce un array contenente la categoria trovata.
     *  Se trova un prodotto allora restituisce un array di 3 elementi con rispettivamente 
     *  categoria, nome e quantità del prodotto trovato.
     *  Se non trova niente invece restituisce un array vuoto.
     */
    Cerca(ElementoDaCercare){
        let vettore;
        ElementoDaCercare=ElementoDaCercare.toUpperCase();
        if(this.Lista.has(ElementoDaCercare)){
            vettore=new Array(ElementoDaCercare);            
            return vettore;                    
        }else{
            ElementoDaCercare=ElementoDaCercare.toLowerCase();
            vettore=new Array();
            this.Lista.forEach((prodotti,categoria)=>{
                if(prodotti.has(ElementoDaCercare)){                    
                    vettore=new Array(categoria,ElementoDaCercare,prodotti.get(ElementoDaCercare));
                    return vettore;
            }});
            return vettore;
        }
    }
    /**
     * @description la funzione permette all'utente di cercare un prodotto o una categoria all'interno della lista della spesa.
     * Se trova l'elemento lo stampa a video e restituiesce true, altrimenti stampa un messaggio di errore e restituisce false.
     */
    InterfacciaCerca()
    {
        console.log("Ricerca prodotto o categoria dalla lista della spesa\n");
        let prodotto=prompt("Inserisci prodotto o categoria di prodotti da cercare nella lista: ");
        let ElementoTrovato=this.Cerca(prodotto);
        this.Stampa(ElementoTrovato);
        prompt("\nPremi Invio per continuare");
    }
    
    /**
     * @param {String} elemento - Il nome dell'elemento (categoria o prodotto) da eliminare.
     * @returns {Boolean} True se ha eliminato un elemento, False se non ha eliminato nulla
     * @description Questo metodo rimuove una categoria o un prodotto dalla lista della spesa.
     * Ricerca per primo una categoria che ha lo stesso nome di "elemento".
     * Se trova una categoria col nome indicato la elimina.
     * Se non c'è nessuna categoria il cui nome corrisponde a "elemento", passa alla ricerca dei prodotti scorrendo tutte le categorie presenti.
     * Se in una categoria trova un prodotto il cui nome corrisponde a "elemento", lo elimina.
     * Se la funzione non riesce ad eliminare nessun prodotto/categoria stampa un messaggio di avviso all'utente.
    */
    Elimina(elemento){
        let eliminato=0;
        elemento=elemento.toUpperCase();
        if(this.Lista.has(elemento)){
            this.Lista.delete(elemento)
            eliminato = 1
        }
        else{
            elemento=elemento.toLowerCase();
            this.Lista.forEach((prodotti,categoria)=>{
                if(prodotti.has(elemento))
                {
                    prodotti.delete(elemento)
                    eliminato = 1
                }
                if(prodotti.size==0){//se la categoria rimane vuota allora l'elemento all'interno viene eliminato
                    this.Lista.delete(categoria);
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
     */  
    InterfacciaElimina(){
        if(this.Lista.size==0){
            console.log("\nLa lista della spesa è vuota");
            prompt("\nPremi Invio per continuare");
            return; 
        }
        else{
            console.log("Eliminazione prodotto o categoria dalla lista della spesa\n");
            let prodotto=prompt("Inserisci prodotto o categoria da eliminare dalla lista: ");
        
            if(this.Elimina(prodotto)){
                console.log("\nElemento eliminato con successo");
                this.GestioneFile.ScriviMapSuFile(this.Lista);
            }
            else{
                console.log("\nImpossibile trovare una categoria o un prodotto con il nome specificato");
            }
            prompt("\nPremi Invio per continuare");
        }
      
    }

    /** 
    * @param {String} vecchioProdotto - Il nome del prodotto esistente da sostituire.
    * @param {String} nuovoProdotto - Il nome del nuovo prodotto da aggiungere.
    * @param {Number} nuovaQuantita - La nuova quantità del prodotto.
    * @param {String} nuovaCategoria - La nuova categoria del prodotto.
    * @returns {Boolean} True se il prodotto è stato modificato con successo, False altrimenti.
    * @description Questo metodo modifica un prodotto presente nella lista della spesa. 
    * Esso elimina il prodotto presente e poi aggiunge un nuovo prodotto con le informazioni specificate.
    */  
    Modifica(vecchioProdotto, nuovoProdotto, nuovaQuantita, nuovaCategoria) {
        if (this.Aggiungi(nuovoProdotto, nuovaQuantita, nuovaCategoria)) {
            return this.Elimina(vecchioProdotto);
        } else {
            return false;
        }
    }
      
    /**
    *  @description Interfaccia per modificare un prodotto nella lista della spesa.
    * Questo metodo chiede all'utente di inserire il nome del prodotto da modificare e 
    * poi gli chiede di selezionare cosa modificare (nome, quantità, categoria o uscire).

    * Se l'utente sceglie di modificare il nome, la quantità o la categoria del prodotto,
    * il metodo chiede all'utente di inserire i nuovi valori e poi li utilizza per modificare il prodotto nella lista della spesa.

    * Se l'utente sceglie di uscire, il metodo termina l'operazione di modifica.
    *  Se la modifica è avvenuta con successo, il metodo stampa un messaggio di conferma. Altrimenti, stampa un messaggio di errore.
    */
    InterfacciaModifica() {
        console.log("Modifica prodotto nella lista della spesa\n");
        let vecchioProdotto = prompt("Quale prodotto vuoi modificare? >> ");
        let scelta;
        let ElementoDaModificare = this.Cerca(vecchioProdotto);
        if (ElementoDaModificare.length === 3) {
            let nuovaCategoria = ElementoDaModificare[0];
            let nuovoProdotto = ElementoDaModificare[1];
            let nuovaQuantita = ElementoDaModificare[2];
            let modificato = false;           
            do {
                console.clear();
                console.log("Modifica prodotto nella lista della spesa\n");
                console.log("Cosa vuoi modificare del prodotto?\n");
                console.log("1- Nome Prodotto");
                console.log("2- Quantita");
                console.log("3- Categoria");
                console.log("4- Esci");
                scelta = parseInt(prompt(("Fai una scelta >> ")));
                switch (scelta) {
                    case 1: {
                        nuovoProdotto = prompt("Inserire il nuovo nome del prodotto >>");
                        modificato = true;
                        break;
                    }
                    case 2: {
                        nuovaQuantita = prompt("Inserire la nuova Quantita' del prodotto >>");
                        modificato = true;
                        break;
                    }
                    case 3: {
                        nuovaCategoria = prompt("Inserire la nuova categoria del prodotto >>");
                        modificato = true;
                        break;
                    }
                    case 4: {
                        break;
                    }
                    default: {
                        console.log("\nOpzione non valida");
                        prompt("\nPremi Invio per continuare");
                        break;
                    }
                }
            } while (scelta != 4);
          
            if (modificato && this.Modifica(vecchioProdotto, nuovoProdotto, nuovaQuantita, nuovaCategoria)) {
                console.log("\nModifica Avvenuta con Successo.");
                this.GestioneFile.ScriviMapSuFile(this.Lista);
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
   - Aggiungere un elemento alla lista della spesa specificando il prodotto, la quantità e la categoria.
   - Visualizzare l'intera lista della spesa con i relativi prodotti e quantità per categoria.
   - Rimuovere un elemento dalla lista della spesa specificando il prodotto o la categoria da eliminare.
   - Uscire dal programma.
   L'utente può scegliere un'opzione digitando un numero da 1 a 4. 
   In caso di scelta non valida, viene visualizzato un messaggio di errore.
 */
function main(){
    const Lista=new ListaDellaSpesa();
    let scelta;
    do{
        console.clear();
        console.log("Scegliere cosa fare (1-5)");
        console.log("1-Aggiungere elemento alla lista della spesa");
        console.log("2-Visualizzare la lista della spesa");
        console.log("3-Rimuovere un elemento dalla lista della spesa");
        console.log("4-Ricerca un elemento nella lista della spesa");
        console.log("5-Modifica un elemento nella lista della spesa");
        console.log("6-Esci");
        scelta=parseInt(prompt(">> "));  
        console.clear(); 
        switch(scelta){            
            case 1:{                
                Lista.InterfacciaAggiungi(); 
                break;
            }
            case 2:{
                Lista.InterfacciaVisualizzaLista();
                break;
            }
            case 3:{
                Lista.InterfacciaElimina();
                break;
            }
            case 4:{
                Lista.InterfacciaCerca();
                break;
            }
            case 5:{
                Lista.InterfacciaModifica();
                break;
            }
            case 6:{
                break;
            }
            default:{
                console.log("Opzione non valida");
                prompt("\nPremi Invio per continuare");
                break;
            }
        }
    }while(scelta!==6);

}
//Richiamo del main
main();