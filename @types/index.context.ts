import express from 'express';

export class Context {
  constructor(public someContextVariable: any) {
  }

  log(message: string) {
    console.log(this.someContextVariable, { message });
  }
}

declare global {
  namespace Express {
    interface Request {
      context: Context
    }
  }
}

const app = express();

app.use((req, res, next) => {
  req.context = new Context(req.url);
  next();
});

app.use((req, res, next) => {
  req.context.log('about to return')
  res.send('hello world world');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))