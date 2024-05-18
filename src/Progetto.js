/**
 * @author Cisternino Matteo, Vigilante Antonio, Bocale Cristian, Tancredi Simone
 * @version 1.0.0
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
     */
    Aggiungi(prodotto,quantita,categoria){   
        categoria=categoria.toUpperCase();     
        prodotto=prodotto.toLowerCase()
        if(!this.Lista.has(categoria)){
            this.Lista.set(categoria,new Map());
        }
        this.Lista.get(categoria).set(prodotto,quantita);
        console.log("\nProdotto aggiunto alla lista della spesa");
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
    * @param {String} elemento - Il nome del prodotto o della categoria da eliminare.
    * @description  Questa Funzione elimina un elemento specificato dalla lista della spesa. Permette sia l'eliminazione di un'intera
    * categorai che di un singolo prodotto. Se l'elemento specificato è una categoria, elimina tutti i prodotti associati a quella categoria.
    * Se l'elemento specificato è un prodotto, elimina solo quel prodotto dalla categoria a cui appartiene. Qualora rimuovendo un prodotto
    * la categoria rimanesse vuota, elimina anche la categoria. 
    * Se l'elemento specificato non esiste nella lista della spesa, viene visualizzato un messaggio di errore.
    * Se l'elemento specificato è presente nella lista della spesa, viene visualizzato un messaggio di conferma dell'eliminazione.
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
                if(prodotti.size==0){
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
                console.log("Aggiunta prodotto alla lista della spesa\n");
                let prodotto=prompt("Inserisci nome prodotto: ");
                let quantita=prompt("Inserisci quantità da acquistare: ");
                let categoria=prompt("Inserisci categoria prodotto (Es cibo,bevande,ecc): ");
                Lista.Aggiungi(prodotto,quantita,categoria);
                prompt("\nPremi Invio per continuare"); 
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