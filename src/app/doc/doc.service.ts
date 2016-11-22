import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

import { NetworkService } from '../core/network/network.service'

import * as MuteStructs  from 'mute-structs'

@Injectable()
export class DocService {

  private doc: any
  private network: NetworkService
  private remoteTextOperationsStream: Observable<any[]>
  private docSubject: BehaviorSubject<MuteStructs.LogootSRopes>

  constructor(network: NetworkService) {
    this.network = network
    this.network.onJoin.subscribe( (id: number) => {
      this.doc = new MuteStructs.LogootSRopes(id)
      // Emit initial value
      this.docSubject = new BehaviorSubject<MuteStructs.LogootSRopes>(this.doc)
      this.network.setDocStream(this.docSubject.asObservable())
    })

    this.network.onJoinDoc
	// Check to filter null values
    .filter( (doc: MuteStructs.LogootSRopes) => doc instanceof MuteStructs.LogootSRopes )
    .subscribe( (doc: MuteStructs.LogootSRopes) => {
      this.doc = doc
    })
    this.remoteTextOperationsStream = this.network.onRemoteOperations.map( (logootSOperation: any) => {
      return this.handleRemoteOperation(logootSOperation)
    })
  }

  setLocalTextOperationsStream(textOperationsStream: Observable<any[]>) {
    textOperationsStream.subscribe( (array: any[][]) => {
      this.handleTextOperations(array)
    })
  }

  getRemoteTextOperationsStream(): Observable<any[]> {
    return this.remoteTextOperationsStream
  }

  handleTextOperations(array: any[][]) {
    array.forEach( (textOperations: any[]) => {
      textOperations.forEach( (textOperation: any) => {
        const logootSOperation: any = textOperation.applyTo(this.doc)
        if (logootSOperation instanceof MuteStructs.LogootSAdd) {
          this.network.sendLogootSAdd(logootSOperation)
        } else {
          this.network.sendLogootSDel(logootSOperation)
        }
      })
    })
    log.info('operation:doc', 'updated doc: ', this.doc)
    this.docSubject.next(this.doc)
  }

  handleRemoteOperation(logootSOperation: any) {
    const textOperations: any[] = logootSOperation.execute(this.doc)
    log.info('operation:doc', 'updated doc: ', this.doc)
    this.docSubject.next(this.doc)
    return textOperations
  }

}
