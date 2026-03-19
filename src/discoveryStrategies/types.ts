export type DiscoveredFeed = {
  url: string
  title?: string
  format?: string
}

export type DiscoveryStrategy = (document: Document) => DiscoveredFeed[] | undefined
