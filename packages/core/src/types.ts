import A from 'automerge'
import { AnyAction, Middleware, Reducer, Store } from 'redux'
import { DocSetSync } from './DocSetSync'

export type ProxyReducer = (action: AnyAction) => ChangeMap | null
export type ReducerConverter = (proxyReducer: ProxyReducer, docSet: DocSet<any>) => Reducer

export interface ChangeMap {
  [docId: string]: A.ChangeFn<any> | symbol
}

export interface StoreManagerOptions<T> {
  // Redux store
  proxyReducer: ProxyReducer
  middlewares?: Middleware[] // TODO: accept an `enhancer` object instead
  initialState: T

  // hypercore feed options
  databaseName: string
  urls?: string[]
}

export interface CreateStoreResult {
  feed: any //Feed<string>
  store: Store
}

// TODO: sort out the type for feed after building, can't get it to pick up the Feed type from the ambient hypercore types
export type MiddlewareFactory = <T>(
  feed: any,
  docSet: A.DocSet<any>,
  proxyReducer: ProxyReducer,
  discoveryKey?: string
) => Middleware // feed: Feed<string>

// A keychain maps a discovery key (the id we share to the signal server) with a public/private
// keypair (which we use for storage etc). The discovery key can be any string that we think is
// going to be unique on our signal hub servers.
export interface Keychain {
  [discoveryKey: string]: KeyPair
}

export interface KeyPair {
  key: string
  secretKey: string
}

export interface Message {
  docId: string
  clock: A.Clock
  changes?: A.Change[]
}

export interface ReceiveMessagePayload {
  message: Message
  connection: DocSetSync
}

export interface State<T = any> {
  [key: string]: A.Doc<T>
}

export interface ChangeSet {
  docId: string
  changes: A.Change[]
  isDelete?: boolean
}
