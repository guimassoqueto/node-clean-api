## executa a aplicação containerizada, banco de dados e api
up:
	make down && docker compose up -d

## inicia o container do banco de dados principal (mongodb)
## o husky depende desse commando no pre-commit, se mudá-lo, modifique-o tambem em .husk/pre-commit
db:
	docker compose up mongodb -d

## derruba os containeres em execução, banco de dados e api
down:
	docker compose down

## gerar .env a partir do .env.example
env:
	cp .env.example .env

## instala todos os pacotes requeridos no package.json
## (install)
i:
	npx husky install && npm install

## executa todos os testes da aplicação, verborragicamente, sequencialmente, um a um
## (tests)
t:
	docker compose up mongodb -d && npm run test

## executa os testes de modo simplificado
## (tests-simplified)
ts:
	docker compose up mongodb -d && npm run test:simplified

## transpila para javascript
## (build)
b:
	rm -rf dist && npm run build

## builda a imagem em docker
## (build image)
bi:
	docker build -t guimassoqueto/node-api .

## executa testes unitários da aplicação, localizados em tests/unit
##(unit tests)
ut:
	npm run test:unit

## executa testes de integração da aplicação, localizados em tests/integration
## (integration tests)
it:
	docker compose up mongodb -d && npm run test:integration

## abre o navegador na página principal do repositório no GitHub 
## (open repository)
or:
	open "https://github.com/guimassoqueto/node-clean-api"

## abre com a GUI o diretorio local do repositório
## (open directory)
od:
	xdg-open .

## faz a transpilação de tsc para javascript em tempo real, execute em um terminal separado
## (typescript watch)
tsw:
	npm run tsc:watch

## executa a applicação em javascript com as mudanças feitas em tempo real, depende do tsc-watch estar em execução
## deve ser executado em terminal separado, diferente do terminal no qual tsc-watch está sendo executado
## (node watch)
nw:
	npm run node:watch

# builda e inicia a aplicação em javascript puro
## (start javascript)
sjs:
	docker compose up mongodb -d && rm -rf dist && npm run build && npm run start:server

# inicia a aplicação localmente sem transpilar
## (start typescript)
sts:
	docker compose up mongodb -d && npm run start:ts

## executa teste de um arquivo especifico
## (test file)
tf:
	npm run test -- tests/main/routes/survey-result-routes.test.ts