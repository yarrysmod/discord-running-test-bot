import {
  Client,
} from "@typeit/discord";
import {apiCredentials} from "./config/api";
import {HELP_MESSAGE} from "./bots/MerchantBanker";

export class Main {
  private static client: Client;

  static async start() {
    this.client = new Client();

    await this.client.login(
        apiCredentials.API_KEY,
        `${__dirname}/bots/*.js`
    );

    await this.client.user?.setActivity(HELP_MESSAGE, { type: 'WATCHING' });

    console.log(Client.getCommands());
  }
}

Main.start();
