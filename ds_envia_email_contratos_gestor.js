function defineStructure() {
	addColumn("Situacao");

	
}
function onSync(lastSyncDate) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("Situacao");
	
var matricula ='admin';

try {
	//monta o mapa com os parametros do template
	var parametros = new java.util.HashMap();
	var contratosList = new java.util.ArrayList();
	
	var gestor =  "ola";
	var nomeGestor= "ola";
	
	var constraintDs_RmContratos1 = DatasetFactory.createConstraint('TIPOFIMCONTRATO', '1', '1', ConstraintType.MUST);
	var constraintDs_RmContratos2 = DatasetFactory.createConstraint('NATUREZACONTRATO', 'R', 'R', ConstraintType.MUST_NOT);
	var constraintDs_RmContratos3 = DatasetFactory.createConstraint('SITUACAO', 'Ativo', 'Ativo', ConstraintType.MUST);
	var datasetDs_RmContratos = DatasetFactory.getDataset('ds_RmContratos', null, new Array(constraintDs_RmContratos1, constraintDs_RmContratos2, constraintDs_RmContratos3), new Array("GERENTE"));

	for (var j = 0; j < datasetDs_RmContratos.rowsCount; j++) {
	
	if(gestor!=datasetDs_RmContratos.getValue(j, "GERENTE")){
			//monta o mapa com os parametros do template
    if(parametros.isEmpty()){
        log.warn("emailcontrato: parametros vazio ");
        	var assunto = "GESTÃO DE CONTRATOS - Contratos à vencer em menos de 30 dias ";
				parametros.put("contratos", contratosList);
				
				// assunto do email
				parametros.put("subject", assunto);
				parametros.put("gestor", gestor);
				//Conforme consta em nosso Sistema de Gestão de Contratos, segue a Lista de contratos sob a sua gestão que ${corpo!''}
				parametros.put("corpo", "e que encerram em menos de 30 dias para o encerramento");
				//destinatarios
				var destinatarios = new java.util.ArrayList();
				destinatarios.add(datasetDs_RmContratos.getValue(j, "CODUSUARIO")+"@email.com.br");
				notifier.notify(matricula, "email_contratos", parametros, destinatarios, "text/html");
       parametros.clear();
        contratosList = new java.util.ArrayList();
        

    }
			gestor = datasetDs_RmContratos.getValue(j, "GERENTE");
		}
	
	 var obs="";
        var saldoPercentual = 0;
        var valorPago = datasetDs_RmContratos.getValue(j, "VALORPAGO");
        if(valorPago>0){
            saldoPercentual= (valorPago/datasetDs_RmContratos.getValue(j, "VALORCONTRATO"))*100;
           // if(saldoPercentual>=50)
            obs=" Foi pago "+saldoPercentual.toFixed(2).replace(".00","") +"% do valor contratado;";
        }
        obs+= " faltam "+datasetDs_RmContratos.getValue(j, "DIASFIMCONTRATO") +" dias para o fim deste contrato.";
		var contrato = new java.util.HashMap();
	    var tempoContrato = datasetDs_RmContratos.getValue(j, "TEMPOCONTRATO");
		contrato.put("contrato",datasetDs_RmContratos.getValue(j, "CODIGOCONTRATO"));
		contrato.put("fornecedor",datasetDs_RmContratos.getValue(j, "FORNECEDOR"));
		contrato.put("periodo",datasetDs_RmContratos.getValue(j, "DATAINICIO")+' à '+datasetDs_RmContratos.getValue(j, "DATAFIM"));
		contrato.put("tempoContrato", tempoContrato==1 ? tempoContrato+ " mês ": tempoContrato+" meses "  );
		contrato.put("diasFimContrato",datasetDs_RmContratos.getValue(j, "DIASFIMCONTRATO"));
		contrato.put("objeto",datasetDs_RmContratos.getValue(j, "OBJETO"));
		contrato.put("valorcontrato",formatReal(datasetDs_RmContratos.getValue(j, "VALORCONTRATO")));
		contrato.put("valorpago",formatReal(datasetDs_RmContratos.getValue(j, "VALORPAGO")));
		contrato.put("saldo",formatReal(datasetDs_RmContratos.getValue(j, "SALDOCONTRATO")));
        contrato.put("obs",obs);
        contrato.put("tipoTempoContrato",datasetDs_RmContratos.getValue(j, "TIPOTEMPOCONTRATO")); 
		contratosList.add(contrato);

	}
	
//	log.warn("emailcontrato: listadecontratos " + contratosList);
				
	var row = [];
	row.push('Sucesso');
	dataset.addRow(row);
	
} catch(e) {
	throw e;
}
return dataset;
}

function formatReal( valor )
{
    //569871750
    var tmp = valor.replace('.','')+'';
    
    tmp= tmp.replace(/([0-9]{2})$/g, ",$1");
    // 5.69 8.717,50
    if( tmp.length > 6 ) tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    if( tmp.length = 9 ) tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, "$1.$2,$3");
    if( tmp.length > 10 ) tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, ".$1.$2,$3");
    
return tmp; 

}
