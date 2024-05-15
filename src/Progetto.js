/**
 * @author Cisternino Matteo, Vigilante Antonio, Bocale Cristian, Tancredi Simone
 * @version 0.8.0
 * @description Il programma deve gestire una lista della spesa in cui ogni elemento ha i seguenti attributi: Categoria,prodotto e quantità.
 * La lista permette l'aggiunta, l'eliminazione e la stampa degli attributi.
 */

const prompt=require("prompt-sync")();

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
     */
    Aggiungi(prodotto,quantita,categoria){        
        if(!this.Lista.has(categoria)){
            this.Lista.set(categoria,new Map());
        }
        this.Lista.get(categoria).set(prodotto,quantita);
    }
  
   /**
    * @function Stampa
    * @description  Stampa tutti gli elementi presenti nella lista della spesa, ordinati per categoria.
    * Ogni categoria viene stampata seguita dai rispettivi prodotti con le relative quantità.
    * Utilizza la funzione forEach() per iterare su ogni categoria e i relativi prodotti.
    */
    Stampa(){
        this.Lista.forEach((prodotti,categoria)=>{console.log(categoria);//attraverso il forEach iteriamo per ogni categoria
            prodotti.forEach((quantita,prodotto)=>{//iteriamo ogni prodotto di quella categoria
                console.log("- prodotto: "+prodotto+" | quantità: "+quantita)
            })
        })
    }
}

/**
 * @function main
 * @description Questa funzione avvia il programma per la gestione della lista della spesa. 
   Visualizza un menu interattivo che consente all'utente di:
   - Aggiungere un elemento alla lista della spesa specificando il prodotto, la quantità e la categoria.
   - Visualizzare l'intera lista della spesa con i relativi prodotti e quantità per categoria.
   - Rimuovere un elemento dalla lista della spesa specificando il prodotto o la categoria da eliminare.
   - Cercare un prodotto specifico nella lista della spesa specificando il nome del prodotto o la categoria.
   - Uscire dal programma.
   L'utente può scegliere un'opzione digitando un numero da 1 a 5. 
   In caso di scelta non valida, viene visualizzato un messaggio di errore.
 */
function main(){
    const Lista=new ListaDellaSpesa();
    let scelta;
    do{
        console.log("Scegliere cosa fare (1-5)");
        console.log("1-Aggiungere elemento alla lista della spesa");
        console.log("2-Visualizzare la lista della spesa");
        console.log("3-Rimuovere un elemento dalla lista della spesa");
        console.log("4-Ricerca nella lista della spesa");
        console.log("5-Esci");
        scelta=parseInt(prompt(">> "));
        switch(scelta){
            case 1:{
                let prodotto=prompt("Inserisci prodotto: ").toLowerCase();
                let quantita=prompt("Inserisci quantità da acquistare: ");
                let categoria=prompt("Inserisci categoria prodotto (Es cibo,bevande,ecc): ").toUpperCase();
                Lista.Aggiungi(prodotto,quantita,categoria);
                break;
            }
            case 2:{
                Lista.Stampa();
                break;
            }
            case 3:{
                let prodotto=prompt("Inserisci prodotto o categoria da eliminare dalla lista: ");
                Lista.Elimina(prodotto);
                break;
            }
            case 4:{
                let prodotto=prompt("Inserisci prodotto o categoria di prodotti da cercare nella lista: ");
                Lista.Cerca(prodotto);
                break;
            }
            case 5:{
                break;
            }
            default:{
                console.log("Opzione non valida");
                break;
            }
        }
    }while(scelta!==5);

}
//Richiamo del main
main();