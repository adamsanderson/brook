import { FeedFormatType } from "@/constants"

export type DiscoveredFeed = {
  url: string
  title?: string
  format?: FeedFormatType
}

export type DiscoveryStrategy = (document: Document) => DiscoveredFeed[] | undefined
