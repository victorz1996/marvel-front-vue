import { ListSerieById } from './../application/listSerieById/ListSerieById'
import 'reflect-metadata'
import { Container } from 'inversify'
import getDecorators from 'inversify-inject-decorators'
import { AxiosRepository } from './AxiosRepository'
import { SYMBOLS_SERIES } from './Types'
import type { Repository } from '../domain/Repository'
import { ListSeries } from '../application/listSeries/ListSeries'
import { ListResources } from '../application/listResources/ListResources'

export const container = new Container({ skipBaseClassChecks: true })

container.bind<Repository>(SYMBOLS_SERIES.SERIE_REPOSITORY).to(AxiosRepository).inSingletonScope()

container.bind<ListSeries>(SYMBOLS_SERIES.LIST_SERIES).to(ListSeries).inSingletonScope()

container.bind<ListSerieById>(SYMBOLS_SERIES.LIST_SERIE_BY_ID).to(ListSerieById).inSingletonScope()

container
  .bind<ListResources>(SYMBOLS_SERIES.LIST_RESOURCES_BY_SERIE_ID_AND_RESOURCE_NAME)
  .to(ListResources)
  .inSingletonScope()

export const { lazyInject } = getDecorators(container)
