import {
  Command,
  CommandMessage,
  CommandNotFound,
  Discord,
} from "@typeit/discord";

export const REQUEST_START = '?';
export const HELP_COMMAND = 'merchantBanker';
export const HELP_MESSAGE = `use ?${HELP_COMMAND} for available commands`;
export type CALC_COMMANDS = 'miles2km' | 'km2miles' | 'fahr2cel' | 'cel2fahr';

export const MILES_IN_KM = 1.609344;
export const FAHRENHEIT_CONSTANT = 32;
export const FAHRENHEIT_FACTOR = 1.8;

export type CalculationDictionaryPreset = { [key in CALC_COMMANDS]: (value: number) => number };
export type CalculationTextDictionaryPreset = { [key in CALC_COMMANDS]: string };

export const exampleValueDictionary: CalculationTextDictionaryPreset = {
  miles2km: '26.2',
  km2miles: '10',
  fahr2cel: '86',
  cel2fahr: '24',
};
export const outputValueUnitDictionary: CalculationTextDictionaryPreset = {
  miles2km: ' km',
  km2miles: ' miles',
  fahr2cel: '°C',
  cel2fahr: '°F',
};
export const calculationDictionary: CalculationDictionaryPreset = {
  miles2km: value => value * MILES_IN_KM,
  km2miles: value => value / MILES_IN_KM,
  fahr2cel: value => (value - FAHRENHEIT_CONSTANT) / FAHRENHEIT_FACTOR,
  cel2fahr: value => value * FAHRENHEIT_FACTOR + FAHRENHEIT_CONSTANT,
}
export const commandDescriptionsDictionary: CalculationTextDictionaryPreset = {
  miles2km: 'Convert miles into kilometers',
  km2miles: 'Convert kilometers into miles',
  fahr2cel: 'Convert fahrenheit into degrees celsius',
  cel2fahr: 'Convert celsius into degrees fahrenheit',
}

@Discord(REQUEST_START) // Decorate the class
// @ts-ignore
abstract class MerchantBanker {
  // @ts-ignore
  private static processCalcRequest(message: CommandMessage) {
    let requestParts = message.commandContent
        .split(' ')
        .map(value => value.trim());
    const requestType = requestParts[0] as CALC_COMMANDS;
    const inputValue = Number(requestParts[1]);

    if (isNaN(inputValue)) {
      MerchantBanker.sendCalcError(requestType, message, exampleValueDictionary[requestType]);
      return;
    }

    const outputValue = calculationDictionary[requestType](inputValue).toFixed(2);

    message.reply(`That would be about ${outputValue}${outputValueUnitDictionary[requestType]}.`);
  }

  private static sendCalcError(requestType: CALC_COMMANDS, message: CommandMessage, exampleValue: string) {
    message.reply(`That's not a number, chap! Try again. (example: ?${requestType} ${exampleValue})`); // 26.2
  }

  @Command(HELP_COMMAND) help(message: CommandMessage) {
    const commandDescriptions = Object
        .entries(commandDescriptionsDictionary)
        .map(([command, description]) => `?${command} - ${description}`)
        .join('\n');

    return message.channel.send(`Available commands:\n${commandDescriptions}`, {
      reply: undefined
    });
  };

  @Command('miles2km' as CALC_COMMANDS) miles2km(message: CommandMessage) {
    return MerchantBanker.processCalcRequest(message);
  }

  @Command('km2miles' as CALC_COMMANDS) km2miles(message: CommandMessage) {
    return MerchantBanker.processCalcRequest(message);
  }

  @Command('fahr2cel' as CALC_COMMANDS) fahr2cel(message: CommandMessage) {
    return MerchantBanker.processCalcRequest(message);
  }

  @Command('cel2fahr' as CALC_COMMANDS) cel2fahr(message: CommandMessage) {
    return MerchantBanker.processCalcRequest(message);
  }

  @CommandNotFound() commandNotFound(message: CommandMessage) {
    return message.reply(`You quite sure you got this right? (${HELP_MESSAGE})`);
  };
}
