import { EncryptionType } from '../app/core/crypto/EncryptionType'

export interface IEnvironment {
  production: boolean
  debug: {
    visible: boolean
    log: {
      netflux: boolean
      crypto: boolean
      doc: boolean
    }
  }
  p2p: {
    rtcConfiguration?: RTCConfiguration
    signalingServer: string
  }
  cryptography: {
    type: EncryptionType
    coniksClient?: {
      url: string
      binaries: {
        linux: string
        windows: string
        macOS: string
      }
    }
  }
  botStorage?: {
    httpURL: string
    wsURL: string
    isAnonymousAllowed: boolean
  }
  authentication?: {
    baseUrl: string
    providers: {
      github: {
        clientId: string
        scope: [string]
      }
      google: {
        clientId: string
        scope: [string, string]
      }
    }
  }
}
