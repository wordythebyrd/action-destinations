import type { BrowserActionDefinition } from '@segment/browser-destination-runtime/types'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import type { PendoSDK, PendoOptions } from '../types'
import { removeObjectByKey } from '../utils'

const action: BrowserActionDefinition<Settings, PendoSDK, Payload> = {
  title: 'Send Group Event',
  description: 'Send Segment group() events to Pendo',
  defaultSubscription: 'type="group"',
  platform: 'web',
  fields: {
    visitorId: {
      label: 'Visitor ID',
      description: 'Pendo Visitor ID. Maps to Segment userId',
      type: 'string',
      required: true,
      default: {
        '@path': '$.userId'
      },
      readOnly: true
    },
    accountId: {
      label: 'Account ID',
      description: 'Pendo Account ID',
      type: 'string',
      required: true,
      default: { '@path': '$.groupId' },
      readOnly: true
    },
    accountData: {
      label: 'Account Metadata',
      description: 'Additional Account data to send',
      type: 'object',
      required: false,
      default: { '@path': '$.traits' },
      readOnly: true
    },
    parentAccountData: {
      label: 'Parent Account Metadata',
      description:
        'Additional Parent Account data to send. Note: Contact Pendo to request enablement of Parent Account feature.',
      type: 'object',
      properties: {
        id: {
          label: 'Parent Account ID',
          type: 'string',
          required: true
        }
      },
      additionalProperties: true,
      default: { '@path': '$.traits.parentAccount' },
      required: false
    }
  },
  perform: (pendo, { payload }) => {
    removeObjectByKey(payload.accountData, payload.parentAccountData)

    const pendoPayload: PendoOptions = {
      visitor: {
        id: payload.visitorId
      },
      account: {
        ...payload.accountData,
        id: payload.accountId
      }
    }

    if (payload.parentAccountData) {
      pendoPayload.parentAccount = payload.parentAccountData
    }

    console.log(pendoPayload)

    pendo.identify(pendoPayload)
  }
}

export default action
