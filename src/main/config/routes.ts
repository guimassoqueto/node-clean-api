import { type Express, Router } from 'express'
import fg from 'fast-glob'

export default function (app: Express): void {
  // verifica a extensão do arquivo corrente e define o caminho para as routes
  // isso deve ser feito para evitar erro de exucução do arquivo transpilado para.js
  const routesPath = __filename.endsWith('.js') ? '**/dist/main/routes/**-routes.js' : '**/src/main/routes/**-routes.ts'

  const router = Router()
  app.use('/api', router)
  fg.sync(routesPath).map(async (file, _) => {
    // imports que não estejam no cabeçalhos devem ser feitos como import()
    // a importação deve ser assíncrona
    // cada arquivo importado contem um export default function, por isso o parenteses e o .default
    const route = (await import(`../../../${file}`)).default

    // cada função tem como parâmetro um argumento do tipo Router, por isso o route(router)
    route(router)

    // (await import(`../../../${file}`)).default(router) // funciona do mesmo modo que as 2 linhas acima
  })
}
