# `matrix-gcp-bot`

A bot for displaying the current color of the Global Consciousness Project dot

## Running / Building

This assumes you have at least **NodeJS 10 or higher**.

Run `npm install` to get the dependencies.

To build it: `npm run build`.

To run it: `npm run start:dev`

To check the lint: `npm run lint`

### Configuration

This template uses a package called `config` to manage configuration. The default configuration is offered
as `config/default.yaml`. Copy/paste this to `config/development.yaml` and `config/production.yaml` and edit
them accordingly for your environment.

## Usage

The following commands will invoke a response from the bot:

```
!gcp dot  - Dispaly the current dot
!gcp help - Display a help menu listing available commands
```
