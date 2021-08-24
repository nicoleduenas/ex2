const http = require('http');
const axios = require('axios');
const fs = require('fs');
const path = require('path');    
const providersDataUrl = 'https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json';
const clientsDataUrl = 'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json';

async function getDataFromUrl(url){
    try{
        let dataFetched = await  axios.get(url);
        console.log(dataFetched.data);
        return dataFetched.data;
    }
    catch(err) {
        console.log(`Error getting data: ${err}`);
    }
}
function createHTMLFile(dataFetched, providerFile){
    let fileToRetrieve = providerFile? "html/providers.html": "html/clients.html";
    fileToRetrieve = path.join(__dirname, fileToRetrieve);
    try{
        var fileStr = fs.readFileSync(fileToRetrieve, 'utf8');
        let rows = "";
            for(let i =0; i<dataFetched.length; i++){
                let el = dataFetched[i];
                rows += `<tr> \n<th scope="row">${providerFile? el.idproveedor: el.idCliente}</th> \n <td>${providerFile?el.nombrecompania: el.NombreCompania }</td> \n<td>${providerFile?el.nombrecontacto: el.NombreContacto}</td> \n</tr>\n`;
            }
            return fileStr.replace("{{tbody}}", rows)
    }
    catch(err){
        console.log(`Error reading file: ${err}`);
    }
}

http.createServer(async function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html' });
    const url = req.url;
    let urlDataToFetch = ""
    let providerFile = false
    if(url.endsWith("api/proveedores")){
        urlDataToFetch = providersDataUrl;
        providerFile = true;
    }
    else if(url.endsWith("api/clientes")){
        urlDataToFetch = clientsDataUrl;
    }
    try{
        const dataFetched = await getDataFromUrl(urlDataToFetch);
        res.end(createHTMLFile(dataFetched, providerFile));
    }
    catch(err){
        console.log(`Error sending the response: ${err}`);
    }

}).listen(8081);