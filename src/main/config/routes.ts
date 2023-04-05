import { type Express, Router } from 'express'
import fg from 'fast-glob'

export default function setUpRoutes (app: Express): void {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/main/routes/**route.ts').map(async (file, index) => {
    // imports que não estejam no cabeçalhos devem ser feitos como import()
    // a importação deve ser assíncrona
    // cada arquivo importado contem um export default function, por isso o parenteses e o .default
    const route = (await import(`../../../${file}`)).default

    // cada função tem como parâmetro um argumento do tipo Router, por isso o route(router)
    route(router)

    // (await import(`../../../${file}`)).default(router) // funciona do mesmo modo que as 2 linhas acima
  })
}
