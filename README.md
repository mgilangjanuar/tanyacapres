# TanyaCapres

This is a web-based application that can be used to chat with the PDF file of the presidential candidate. This application is built using ExpressJS, React, and TypeScript with OpenAI integration to generate embeddings and answer questions.


### Getting Started

0. Install [NodeJS](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/getting-started/install) on your machine.

1. Clone this repository.

2. Install dependencies.

  ```bash
  cd api && yarn install && cd ../web && yarn install && cd ..
  ```

3. Define environment variables.

  ```bash
  cp api/.env.example api/.env
  ```

  | Variable | Description |
  | --- | --- |
  | OPENAI_API_KEY | OpenAI API key |
  | SECRET | Secret for decrypting prompt |
  | DECRYPT_KEY | Key for authentication |


  ```bash
  cp web/.env.example web/.env.local
  ```

  | Variable | Description |
  | --- | --- |
  | VITE_API_URL | API URL |
  | DECRYPT_KEY | Key for authentication |
  | OPENAI_API_KEY | OpenAI API key |

3. Run in development mode.

  ```bash
  yarn dev
  ```
