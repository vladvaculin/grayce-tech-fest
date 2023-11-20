# Seek-O-Tron Salvager
![SOTS](https://github.com/vladvaculin/grayce-tech-fest/blob/main/SOTS.gif)

This is the winning project for the Grayce Tech Fest 2023. In just a week, we (the Green team) managed to come up with a personified AI with a role in helping the world to become greener.
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
The backend is a simple Flask server that loads an image classifier built from scratch. Please check [Giorgio's repo](https://github.com/pheygiod/garbage-model/tree/main) for more details about the model.

## Getting Started

First, run the development server:

```bash
yarn dev
```

From another terminal, start the Flask server.
```bash
cd server
flask --app server.py run
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


