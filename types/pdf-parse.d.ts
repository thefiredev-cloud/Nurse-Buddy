declare module "pdf-parse" {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: {
      Title?: string;
      Subject?: string;
      Author?: string;
      Creator?: string;
      Producer?: string;
      CreationDate?: string;
      ModDate?: string;
    };
    metadata: any;
    text: string;
    version: string;
  }

  function pdfParse(dataBuffer: Buffer, options?: any): Promise<PDFData>;
  
  export = pdfParse;
}

