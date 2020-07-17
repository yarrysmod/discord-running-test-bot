import {
  Command,
  CommandMessage,
  Discord,
} from "@typeit/discord";

export const REQUEST_START = '.';
export const HELP_COMMAND = 'merchantBanker';
export const HELP_MESSAGE = `use ${REQUEST_START}${HELP_COMMAND} for available commands`;
export type CALC_COMMANDS = 'miles2km' | 'km2miles' | 'fahr2cel' | 'cel2fahr';

export const MILES_IN_KM = 1.609344;
export const FAHRENHEIT_CONSTANT = 32;
export const FAHRENHEIT_FACTOR = 1.8;

export type CalculationDictionaryPreset = { [key in CALC_COMMANDS]: (value: number) => number };
export type CalculationTextDictionaryPreset = { [key in CALC_COMMANDS]: string };
export type CalculationOverrideDictionaryPreset = { [key in CALC_COMMANDS]?: {[key: number]: number} };

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
};
export const overrideValueDictionary: CalculationOverrideDictionaryPreset = {
  miles2km: {
    13.1: 21.0975,
    26.2: 42.195
  },
  km2miles: {
    21.1: 13.1,
    42.2: 26.2,
  },
};

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

    const overrideValues = overrideValueDictionary[requestType];
    const overriddenValue = overrideValues && overrideValues[Number(inputValue.toFixed(1))];
    let outputValue = calculationDictionary[requestType](inputValue).toFixed(2);

    message.reply(
        overriddenValue
            ? `That would be about ~~${outputValue}~~ ${overriddenValue}${outputValueUnitDictionary[requestType]}. It's the law after all.`
            : `That would be about ${outputValue}${outputValueUnitDictionary[requestType]}.`
    );
  }

  private static sendCalcError(requestType: CALC_COMMANDS, message: CommandMessage, exampleValue: string) {
    message.reply(`That's not a number, chap! Try again. (example: ${REQUEST_START}${requestType} ${exampleValue})`); // 26.2
  }

  @Command(HELP_COMMAND) help(message: CommandMessage) {
    const commandDescriptions = Object
        .entries(commandDescriptionsDictionary)
        .map(([command, description]) => `${REQUEST_START}${command} - ${description}`)
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
}
