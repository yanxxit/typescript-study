declare namespace Express {
  export interface Request {
    myField?: string
  }
  export interface Response {
    pretty(body: any): void;
    success(body: any): void;
    rtJSON(code: number, error: string, data: any): void;
    fail(body: any): void;
    fail(code: number, error: string, data: any): void;
    fail(error: string, data: any): void;
    fail(array: any[]): void;
    csv(sheets: any[], fileName: string): void;
  }
}
