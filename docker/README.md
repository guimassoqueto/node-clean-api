## Descrição do README

compose.yml utilizado para buildar os containeres no Github Actions, para que os testes de integração também possam ser executados na pipeline de testes.

Este compose.yml tem exatamente as mesmas configurações do compose.yml na raíz do projeto. A única diferança é que este compose não possui variáveis dependentes do .env, estão todas escritas no próprio arquivo, e quando as variáveis são necessárias estão declaradas em /.github/workflows/tests.yml no step de buildar a/as imagem/ns. 
