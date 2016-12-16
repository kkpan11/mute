import { Injectable } from '@angular/core'

import { CollaboratorsService, Collaborator } from 'core/collaborators'

@Injectable()
export class ProfileService {

  private storagePrefix = 'mute'
  private pseudonymDefault = 'Anonymous'

  constructor (
    private collaborators: CollaboratorsService
  ) {
    this.collaborators.onJoin.subscribe((collab: Collaborator) => {
      this.collaborators.updatePseudo(this.pseudonym, collab.id)
    })
  }

  get pseudonym () {
    let pseudonym = this.getItem('pseudonym')
    if (pseudonym === null) {
      return this.pseudonymDefault
    }
    return pseudonym
  }

  set pseudonym (value) {
    if (value !== '') {
      this.setItem('pseudonym', value)
    } else {
      this.removeItem('pseudonym')
    }
    this.collaborators.updatePseudo(this.pseudonym)
  }

  private setItem (key, value) {
    localStorage.setItem(this.storagePrefix + key, value)
  }

  private getItem (key) {
    return localStorage.getItem(this.storagePrefix + key)
  }

  private removeItem (key) {
    localStorage.removeItem(this.storagePrefix + key)
  }

}
