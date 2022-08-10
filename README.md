# FLUIG Exemplo de envio de e-mail personalizado
Enviando e-mail de Gestão de Contratos RM no FLUIG via Dataset

Este projeto propôe mostrar o uso da função notifier para enviar e-mail de controle via Dataset, optou-se em usar desta forma, para podermos criar mecanismo de envio automatico de uma forma agendada, neste exemplo para enviar avisos aos gestores de contrato do RM, informando-os que os contratos sob a sua gestão, estão encerrando(o prazo definido aqui foi 30 dias antes do fim de contrato), foi agendado esta tarefa uma vez ao dia.

O FLUIG utiliza para os templates o FreeMarker para prover o HTML dinâmico: https://freemarker.apache.org/

Link TOTVS sobre o Assunto: https://tdn.totvs.com/display/public/fluig/Templates+de+e-mail+personalizado

Material resumo do funcionamento foi extraido deste link: https://willian.eti.br/enviando-e-mail-pelo-fluig/


## :hammer: Resumo do funcionamento:
1 - personalizar o Dataset para buscar os dados e mandar os resultados organizados para a estrutura da função notifier, que por sua vez chama o template postado no FLUIG;<br>
2 - personalizar o Template para receber as variaveis enviadas pelo DataSet, existem alguns limites associados as versões utilizadas de CSS, HTML, JAVASCRIPT e demais utilizadas dentro do ambiente FLUIG, exemplo disso: não consegui usar o codigo CSS de tabela zebrada, tive que usar o metodo antigo, para alternar as cores por linha;<br>

<p> ## :hammer: Postar Template de e-mail no FLUIG:</p>
1 - Vá em painel de controle do FLUIG;<br>
2 - Digite na pesquisa "Templates de email"; <br>
3 - escolha o template ou edite se for o caso;<br>
4 - Caso seja novo digite um codigo identificador e uma descrição amigavél do template;<br>
5 - o codigo digitado é que deve ser usado no parâmetro  do notifier: notifier.notify(matricula, <codigo do Template de e-mail entre aspas duplas>, <HashMap dos parametros>, ArrayList dos destinatarios, "text/html");<br>
  
