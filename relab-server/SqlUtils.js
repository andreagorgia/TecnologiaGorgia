const sql = require('mssql');
const CC = require('./CoordConverter');

const coordConverter =  new CC();
 
const config = {
    user: 'PCTO',  //Vostro user name
    password: 'xxx123#', //Vostra password
    server: "213.140.22.237",  //Stringa di connessione
    database: 'Katmai', //(Nome del DB)
}

module.exports = class SqlUtils {
/*il metodo connect riceve la funzione callback per avvisarci della riuscita della connessione visto che in javascript non possiamo usare un return
oltre la funzione riceve anche i parametri req e res,vengono ricevuti perchè la funzione di callback richiede due paramentri e di conzeguenza anche il metodo
principale connect deve ricevere due parametri anche se req non verrà mai utilizzato*/
    static connect(req,res, connectedCallback)
    {
        sql.connect(config, (err) => {
            if (err) console.log(err);  // ... error check
            else connectedCallback(req,res);     //callback da eseguire in caso di connessione avvenuta 
        });
    }

    static makeSqlRequest(req,res) {
        let sqlRequest = new sql.Request();  //sqlRequest: oggetto che serve a eseguire le query
        let q = 'SELECT DISTINCT TOP (100) [GEOM].STAsText() FROM [Katmai].[dbo].[interventiMilano]';
        //eseguo la query e aspetto il risultato nella callback
        sqlRequest.query(q, (err, result) => {SqlUtils.sendQueryResults(err,result,res)}); 
    }
    
    static sendQueryResults(err,result, res)
    {
        if (err) console.log(err); // ... error checks
        res.send(coordConverter.generateGeoJson(result.recordset));  //Invio il risultato al Browser
    }
    
/*Il metodo ciVettRequest ottiene le richieste dei fogli da cui otteniamo i dati e stampa il numero del foglio conservato nella variabile req 
dopo aver ottenuto i dati visualizza il foglio*/
 static ciVettRequest(req,res) {
        let sqlRequest = new sql.Request();  //sqlRequest: oggetto che serve a eseguire le query
        let foglio = req.params.foglio; //ottengo il foglio passato come parametro dall'url
        let q = `SELECT INDIRIZZO, WGS84_X, WGS84_Y, CLASSE_ENE, EP_H_ND, CI_VETTORE, FOGLIO, SEZ
        FROM [Katmai].[dbo].[interventiMilano]
        WHERE FOGLIO = ${foglio}`//otteniamo i dati dall url passandoli alla condizione WHERE contenuta su questa riga di codice
        //eseguo la query e aspetto il risultato nella callback
        sqlRequest.query(q, (err, result) => {SqlUtils.sendCiVettResult(err,result,res)}); 
    }


  static sendCiVettResult(err,result, res)
  {
        if (err) console.log(err); // ... error checks
        res.send(result.recordset);  //Invio il risultato al Browser
  }

  static ciVettGeoRequest(req,res) {
        let sqlRequest = new sql.Request();  //sqlRequest: oggetto che serve a eseguire le query
        let x = Number(req.params.lng);
        let y = Number(req.params.lat);
        let r = Number(req.params.r);
        let q = `SELECT INDIRIZZO, WGS84_X, WGS84_Y, CLASSE_ENE, EP_H_ND, CI_VETTORE, FOGLIO, SEZ
        FROM [Katmai].[dbo].[interventiMilano]
        WHERE WGS84_X > ${x} - ${r} AND 
        WGS84_X < ${x} + ${r} AND
        WGS84_Y > ${y} - ${r} AND 
        WGS84_Y < ${y} + ${r}`
        
        console.log(q);
        //eseguo la query e aspetto il risultato nella callback
        sqlRequest.query(q, (err, result) => {SqlUtils.sendCiVettReult(err,result,res)}); 
    }

}
