const prompt=require("prompt-sync")();

let listaSpesa = [];

function aggiungiAlimento()
{
    let alimento=prompt("Inserire un nuovo alimento:");
    listaSpesa.push(alimento);
}

aggiungiAlimento();