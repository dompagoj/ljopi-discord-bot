import { TextMessage } from 'ts3-nodejs-library/lib/types/Events'
import * as DB from '../db/connection'
import { TeamspeakClient } from '../teamspeak'
import { BOT_COMMANDS } from './commands'

export async function handleTeamspeakMessage({ msg, invoker }: TextMessage) {
  if (!msg.startsWith('b!')) return
  const [_, trigger] = msg.split('b!')
  const [command, ...params] = trigger.trim().split(' ')

  const foundCommand = BOT_COMMANDS[command]

  if (foundCommand) {
    console.log('Found command handler!')

    return foundCommand.handler(params.join(' '))
  }

  const message = await DB.getMessageByTrigger(trigger.trim())
  const { instance: teamspeak } = TeamspeakClient
  if (!message) return teamspeak.sendMessageToChannel(`Nekuzim kaj je "${trigger}" pogledaj kaj sve postoji idiote`)

  return teamspeak.sendMessageToChannel(message.content)
}