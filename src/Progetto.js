/**
 * @author Cisternino Matteo, Vigilante Antonio, Bocale Cristian, Tancredi Simone
 * @version 1.1.0
 * @description Il programma deve gestire una lista della spesa in cui ogni elemento ha i seguenti attributi: Categoria,prodotto e quantità.
 * La lista permette l'aggiunta, l'eliminazione e la stampa degli attributi.
 */

const prompt=require("prompt-sync")();
let pausa;

/**
 * @class ListaDellaSpesa
 * @description Classe ListaDellaSpesa che contiene un elemento Lista di tipo MAP e i vari metodi della gestione Lista.
 */
class ListaDellaSpesa{
    Lista=new Map();
    
    /**
     * @param {String} prodotto - Il nome del prodotto da aggiungere.
     * @param {String} quantita - La quantità del prodotto da acquistare.
     * @param {String} categoria - La categoria del prodotto (es. cibo, bevande, ecc.).
     * @description Questo metodo aggiunge un nuovo elemento alla lista della spesa o aggiorna la quantità se l'elemento esiste già.
       Se la categoria specificata non esiste già nella lista, crea una nuova categoria e aggiunge il prodotto con la quantità specificata.
       Se la categoria esiste già, aggiunge semplicemente il prodotto con la quantità specificata a quella categoria.
       In caso di valori non validi per prodotto, quantità o categoria, il metodo non esegue alcuna operazione.
       dopo l'aggiunta della categoria e del prodotto, la lista viene ordinata in ordine alfabetico sia per categoria che per prodotto.
     */
    Aggiungi(prodotto,quantita,categoria){   
        categoria=categoria.toUpperCase();     
        prodotto=prodotto.toLowerCase()
        if(!this.Lista.has(categoria)){
            this.Lista.set(categoria,new Map());
        }
        this.Lista.get(categoria).set(prodotto,quantita);

        this.Lista=new Map([...this.Lista].sort());//Ordiniamo gli elementi della lista tramite sort
        this.Lista.forEach((prodotti)=>{//iteriamo ogni categoria
            prodotti=new Map([...prodotti].sort());//ordiniamo tutti gli elementi delle singole categorie
        })

        console.log("\nProdotto aggiunto alla lista della spesa");
    }

    /**
     * @function InterfacciaAggiungi
     * @description Questo metodo permette all'utente di inserire un nuovo prodotto nella lista della spesa.
     * In particolare questa classe gestisce tutta la parte grafica dell'aggiunta di un prodotto alla lista della spesa.
     * L'aggiunta di un prodotto avviene tramite l'inserimento del nome del prodotto, la quantità e la categoria che
     * vengono poi passati come parametri al metodo Aggiungi della classe ListaDellaSpesa che fa l'effettiva aggiunta.
     */
    InterfacciaAggiungi(){
        console.log("Aggiunta prodotto alla lista della spesa\n");
        let prodotto=prompt("Inserisci nome prodotto: ");
        let quantita=prompt("Inserisci quantità da acquistare: ");
        let categoria=prompt("Inserisci categoria prodotto (Es cibo,bevande,ecc): ");
        this.Aggiungi(prodotto,quantita,categoria);
        prompt("\nPremi Invio per continuare");
    }
  
   /**
    * @function Stampa
    * @description  Stampa tutti gli elementi presenti nella lista della spesa, ordinati per categoria.
    * Ogni categoria viene stampata seguita dai rispettivi prodotti con le relative quantità.
    * Utilizza la funzione forEach() per iterare su ogni categoria e i relativi prodotti.
    */
    Stampa(){
        if(this.Lista.size==0){
            console.log("La lista della spesa è vuota")
            return; 
        }
        this.Lista.forEach((prodotti,categoria)=>{console.log(categoria);//attraverso il forEach iteriamo per ogni categoria
            prodotti.forEach((quantita,prodotto)=>{//iteriamo ogni prodotto di quella categoria
                console.log("- prodotto: "+prodotto+" | quantità: "+quantita)
            })
        })
    }

      /**
     * @function Elimina
     * @param {String} elemento - Il nome dell'elemento (categoria o prodotto) da eliminare.
     * @description Questo metodo rimuove una categoria o un prodotto dalla lista della spesa.
     * Ricerca per primo una categoria che ha lo stesso nome di "elemento".
     * Se trova una categoria col nome indicato la elimina.
     * Se non c'è nessuna categoria il cui nome corrisponde a "elemento", passa alla ricerca dei prodotti scorrendo tutte le categorie presenti.
     * Se in una categoria trova un prodotto il cui nome corrisponde a "elemento", lo elimina.
     * Se la funzione non riesce ad eliminare nessun prodotto/categoria stampa un messaggio di avviso all'utente.
     */
    Elimina(elemento){
        if(this.Lista.size==0){
            console.log("\nLa lista della spesa è vuota")
            return; 
        }
        let eliminato=0;
        elemento=elemento.toUpperCase();
        if(this.Lista.has(elemento)){
            this.Lista.delete(elemento)
            console.log("\nEliminata la categoria: " + elemento)
            eliminato = 1
        }
        else{
            elemento=elemento.toLowerCase();
            this.Lista.forEach((prodotti,categoria)=>{
                if(prodotti.has(elemento))
                {
                    prodotti.delete(elemento)
                    console.log("\nEliminato il prodotto "+elemento+" dalla categoria "+categoria)
                    eliminato = 1
                }
                if(prodotti.size==0){//se la categoria rimane vuota allora l'elemento all'interno viene eliminato
                    this.Lista.delete(categoria);
                }
            })
        }

        if(eliminato == 0){
            console.log("\nImpossibile trovare una categoria o un prodotto con il nome specificato")
        }       
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
        console.log("4-Esci");
        scelta=parseInt(prompt(">> "));  
        console.clear(); 
        switch(scelta){            
            case 1:{                
                Lista.InterfacciaAggiungi(); 
                break;
            }
            case 2:{
                console.log("Gli elementi presenti nella lista della spesa sono: \n");
                Lista.Stampa();
                prompt("\nPremi Invio per continuare");
                break;
            }
            case 3:{
                console.log("Elinazione prodotto o categoria dalla lista della spesa\n");
                let prodotto=prompt("Inserisci prodotto o categoria da eliminare dalla lista: ");
                Lista.Elimina(prodotto);
                prompt("\nPremi Invio per continuare");
                break;
            }
            case 4:{
                break;
            }
            default:{
                console.log("Opzione non valida");
                prompt("\nPremi Invio per continuare");
                break;
            }
        }
    }while(scelta!==4);

}
//Richiamo del main
main();