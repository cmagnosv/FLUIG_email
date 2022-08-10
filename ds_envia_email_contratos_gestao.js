// DATASET FEITO PARA ENVIAR AO GESTOR DE CONTRATOS DO RM, A LSITA DE CONTRATOS QUE ESTÃO EM SITUAÇÃO DE: COM PELOS MENOS 30 DIAS DE FIM DE CONTRATO, PAGOS MAIS DE 50% DO VALOR
function defineStructure() {
	addColumn("Situacao");

	
}
function onSync(lastSyncDate) {
	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("Situacao"); 
	var matricula ='admin'; //Maricula do usuario que será responsavel pela chamada de funcção notifier

try {
	//monta o mapa com os parametros do template
	var parametros = new java.util.HashMap();
	var contratosList = new java.util.ArrayList();
	
	var gestor =  "ola"; //
	var nomeGestor= "ola";
	var codcontrato = "";
	
	var constraintDs_RmContratos1 = DatasetFactory.createConstraint('TIPOFIMCONTRATO', '1', '1', ConstraintType.MUST);
	var constraintDs_RmContratos2 = DatasetFactory.createConstraint('NATUREZACONTRATO', 'R', 'R', ConstraintType.MUST_NOT);
	var constraintDs_RmContratos3 = DatasetFactory.createConstraint('SITUACAO', 'Ativo', 'Ativo', ConstraintType.MUST);
	// dataset com dados vindos do RM area de contratos momntado através de SQL do RM
	var datasetDs_RmContratos = DatasetFactory.getDataset('ds_RmContratos', null, new Array(constraintDs_RmContratos1, constraintDs_RmContratos2, constraintDs_RmContratos3), new Array("GERENTE"));

	//inicio do loop percorrendo dataset de contratos e alimentando contratolist 
	for (var j = 0; j < datasetDs_RmContratos.rowsCount; j++) {
		// verifica se o campo codcontrato não esta vazio e calcula o percentual de execução do contrato, além de continuar varrendo o dataset, foi necessário pois apareceu sujeira no retorno dos contratos no RM
		if(codcontrato != datasetDs_RmContratos.getValue(j, "CODIGOCONTRATO")){
		var obs="";
        var saldoPercentual = 0;
        var valorPago = datasetDs_RmContratos.getValue(j, "VALORPAGO");
        if(valorPago>0){
            saldoPercentual= (valorPago/datasetDs_RmContratos.getValue(j, "VALORCONTRATO"))*100;
           // if(saldoPercentual>=50)
            obs=" Foi pago "+saldoPercentual.toFixed(2).replace(".00","") +"% do valor contratado;";
        }
        
        // campo calculado do SQL RM para informar prazo para fim de contrato, então é agregado ao campo OBS 
        obs+= " faltam "+datasetDs_RmContratos.getValue(j, "DIASFIMCONTRATO") +" dias para o fim deste contrato.";
		var contrato = new java.util.HashMap();
	    var tempoContrato = datasetDs_RmContratos.getValue(j, "TEMPOCONTRATO");
		contrato.put("contrato",datasetDs_RmContratos.getValue(j, "CODIGOCONTRATO"));
		contrato.put("fornecedor",datasetDs_RmContratos.getValue(j, "FORNECEDOR"));
		contrato.put("dataInicio",datasetDs_RmContratos.getValue(j, "DATAINICIO"));
		contrato.put("dataFim",datasetDs_RmContratos.getValue(j, "DATAFIM"));
		contrato.put("gestor",datasetDs_RmContratos.getValue(j, "GERENTE"));
		contrato.put("tempoContrato", tempoContrato==1 ? tempoContrato+ " mês ": tempoContrato+" meses "  );
		contrato.put("diasFimContrato",datasetDs_RmContratos.getValue(j, "DIASFIMCONTRATO"));
        contrato.put("tipoTempoContrato",datasetDs_RmContratos.getValue(j, "TIPOTEMPOCONTRATO")); 
        contrato.put("obs",obs);
        
		contratosList.add(contrato);
		
        }
		codcontrato = datasetDs_RmContratos.getValue(j, "CODIGOCONTRATO");
	}
	
//	log.warn("emailcontrato: listadecontratos " + contratosList);

	var assunto = "GESTÃO DE CONTRATOS - Contratos à vencer em menos de 30 dias ";
				parametros.put("contratos", contratosList);
				
				// assunto do email
				parametros.put("subject", assunto);
				parametros.put("gestao", "NOME DO GESTOR"); // optou-se em colocar manualmente o nome do gestor de contratos, poderia se pensar em criar um papel, ou atributo para saber quem seria o gestor do contrato
				//texto do HTML: "Conforme consta em nosso Sistema de Gestão de Contratos, segue a Lista de contratos sob a sua gestão que ${corpo!''}" complemento abaixo, caso queira personalizar
				parametros.put("corpo", " e que encerram em menos de 30 dias");
				//destinatarios
				var destinatarios = new java.util.ArrayList();
				destinatarios.add("email completo"); // optou-se em colocar manualmente o nome do gestor de contratos, poderia se pensar em criar um papel, ou atributo para saber quem seria o gestor do contrato
				notifier.notify(matricula, "email_contratos_gestao", parametros, destinatarios, "text/html"); // notifier.notify(<matricula do responsavel pela chamada>, <modelo de e-mail postado paindel de controle/Templates de emails>, <todos os elementos para compor o e-mail>, <destinatarios>, <tipo de mensagem>); 
				// Caso o e-mail não chegue, imprima alguns trechos do codigo com console.log e observe o LOG do FLUIG
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
