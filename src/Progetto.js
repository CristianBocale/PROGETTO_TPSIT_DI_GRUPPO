const prompt=require("prompt-sync")();
//Classe Lista che contiene un elemento Lista di tipo MAP e vari metodi tra cui Aggiungi.
class ListaDellaSpesa{
    Lista=new Map();
    /*
    Con il metodo aggiungi è possibile sia aggiungere nuovi elementi appartenenti a categorie
    non ancora presenti, sia aggiungere elementi a categorie già create. 
    */
    Aggiungi(prodotto,quantita,categoria){        
        if(!this.Lista.has(categoria)){
            this.Lista.set(categoria,new Map());
        }
        this.Lista.get(categoria).set(prodotto,quantita);
    }
    /*
    Stampa di tutte le categorie con i rispettivi prodotti
    */
    Stampa(){
        this.Lista.forEach((prodotti,categoria)=>{console.log(categoria);//attraverso il forEach iteriamo per ogni categoria
            prodotti.forEach((quantita,prodotto)=>{//iteriamo ogni prodotto di quella categoria
                console.log("- prodotto: "+prodotto+" | quantità: "+quantita)
            })
        })
    }
}

/*
Il main presenta un menu dove è possibile scegliere le azioni da eseguire. sono inizializzati tutti i case
seppure manchino ancora alcune delle funzioni.
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

main();