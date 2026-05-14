/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import * as vision from '@google-cloud/vision';
import { AiExtractionService } from './ai-extraction.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CacService {
  private readonly logger = new Logger(CacService.name);
  private readonly client = new vision.ImageAnnotatorClient();
  private readonly aiExtractionService: AiExtractionService;

  // ─── Main entry point ─────────────────────────────────────────
  // async extractAndValidateCac(
  //   fileBuffer: Buffer,
  //   mimeType: string,
  // ): Promise<{
  //   extractedFields: {
  //     businessName: string | null;
  //     rcNumber: string | null;
  //     registrationDate: string | null;
  //     address: string | null;
  //     rawText: string;
  //   };
  //   documentChecks: {
  //     hasRcNumber: boolean;
  //     rcNumberFormatValid: boolean;
  //     hasCacHeader: boolean;
  //     hasRegistrationDate: boolean;
  //     hasStamp: boolean;
  //     hasBusinessName: boolean;
  //   };
  //   documentScore: number; // 0-100
  // }> {
  //   // 1. Run OCR
  //   const rawText = await this.runOcr(fileBuffer, mimeType);
  //   this.logger.log(`OCR extracted ${rawText.length} characters`);

  //   // 2. Extract structured fields
  //   const extractedFields = this.extractFields(rawText);

  //   // 3. Run document authenticity checks
  //   const documentChecks = this.runDocumentChecks(rawText, extractedFields);

  //   // 4. Score the document
  //   const documentScore = this.scoreDocument(documentChecks);

  //   return { extractedFields, documentChecks, documentScore };
  // }

  async extractAndValidateCac(
    fileBuffer: Buffer,
    mimeType: string,
    submittedBusinessName: string,
  ) {
    const benchmarkPath = path.join(
      __dirname,
      '../../assets/cac-benchmark.jpg',
    );
    const benchmarkBuffer = fs.readFileSync(benchmarkPath);
    const benchmarkMimeType = 'image/jpeg';

    let aiResult: any;

    if (mimeType === 'application/pdf') {
      // PDF: extract text first then send to Gemini
      // (keep the regex pipeline for PDFs for now)
      const rawText = await this.runOcr(fileBuffer, mimeType);
      aiResult = await this.aiExtractionService.extractCacFields(
        rawText,
        submittedBusinessName,
      );
    } else {
      // Images: send directly to Gemini — no OCR needed
      aiResult = await this.aiExtractionService.extractCacFieldsWithBenchmark(
        fileBuffer,
        mimeType,
        benchmarkBuffer,
        benchmarkMimeType,
        submittedBusinessName,
      );
    }

    return aiResult;
  }

  // ─── OCR via Google Vision ─────────────────────────────────────
  private async runOcr(fileBuffer: Buffer, mimeType: string): Promise<string> {
    const request = {
      image: { content: fileBuffer.toString('base64') },
      features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
    };

    const [result] = await this.client.annotateImage(request);
    return result.fullTextAnnotation?.text || '';
  }

  // ─── Extract structured fields from raw OCR text ──────────────
  private extractFields(text: string) {
    const normalized = text.toUpperCase();

    return {
      rawText: text,

      // RC number: format RC123456 or RC 123456
      rcNumber: this.extractRcNumber(normalized),

      // Business name usually appears after "NAME:" or near the top
      businessName: this.extractBusinessName(text),

      // Registration date
      registrationDate: this.extractDate(normalized),

      // Address
      address: this.extractAddress(text),
    };
  }

  private extractRcNumber(text: string): string | null {
    // CAC RC numbers: RC followed by 5-7 digits
    const match = text.match(/RC\s*(\d{5,7})/);
    return match ? `RC${match[1]}` : null;
  }

  private extractBusinessName(text: string): string | null {
    // Business name usually on first few lines or after "COMPANY NAME:"
    const patterns = [
      /COMPANY\s+NAME[:\s]+([A-Z][^\n]+)/i,
      /NAME\s+OF\s+COMPANY[:\s]+([A-Z][^\n]+)/i,
      /BUSINESS\s+NAME[:\s]+([A-Z][^\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    // Fallback: second non-empty line (often the business name on CAC docs)
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    return lines[1] || null;
  }

  private extractDate(text: string): string | null {
    // Match dates like 12TH JANUARY 2020 or 12/01/2020 or 2020-01-12
    const patterns = [
      /(\d{1,2}(?:ST|ND|RD|TH)?\s+(?:JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s+\d{4})/,
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      /(\d{4}-\d{2}-\d{2})/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  private extractAddress(text: string): string | null {
    const match = text.match(
      /(?:ADDRESS|REGISTERED\s+OFFICE)[:\s]+([^\n]+(?:\n[^\n]+)?)/i,
    );
    return match ? match[1].trim() : null;
  }

  // ─── Document authenticity checks ─────────────────────────────
  private runDocumentChecks(
    text: string,
    fields: ReturnType<typeof this.extractFields>,
  ) {
    const normalized = text.toUpperCase();

    return {
      // Does it have an RC number at all?
      hasRcNumber: !!fields.rcNumber,

      // Is the RC number format valid (RC + 5-7 digits)?
      rcNumberFormatValid: fields.rcNumber
        ? /^RC\d{5,7}$/.test(fields.rcNumber)
        : false,

      // Does the document mention Corporate Affairs Commission?
      hasCacHeader:
        normalized.includes('CORPORATE AFFAIRS COMMISSION') ||
        normalized.includes('COMPANIES AND ALLIED MATTERS'),

      // Is there a registration date?
      hasRegistrationDate: !!fields.registrationDate,

      // Does it mention a stamp/seal/certificate?
      hasStamp:
        normalized.includes('CERTIFICATE') ||
        normalized.includes('CERTIFIED') ||
        normalized.includes('REGISTRAR'),

      // Was a business name extracted?
      hasBusinessName: !!fields.businessName,
    };
  }

  // ─── Score document 0-100 ─────────────────────────────────────
  private scoreDocument(
    checks: ReturnType<typeof this.runDocumentChecks>,
  ): number {
    const weights = {
      hasCacHeader: 30, // most important — proves it's a CAC doc
      hasRcNumber: 20, // RC number must be present
      rcNumberFormatValid: 15, // must follow RC + digits format
      hasBusinessName: 15, // business name extracted
      hasRegistrationDate: 10, // date of incorporation present
      hasStamp: 10, // certificate/registrar mention
    };

    let score = 0;
    for (const [check, weight] of Object.entries(weights)) {
      if (checks[check as keyof typeof checks]) score += weight;
    }

    return score;
  }

  // ─── Fuzzy name match (business name vs bank account name) ─────
  fuzzyNameMatch(name1: string, name2: string): number {
    const normalize = (s: string) =>
      s
        .toUpperCase()
        .replace(/\b(LTD|LIMITED|NIG|NIGERIA|AND|&|THE)\b/g, '')
        .replace(/[^A-Z0-9]/g, '')
        .trim();

    const n1 = normalize(name1);
    const n2 = normalize(name2);

    if (n1 === n2) return 100;

    // Check if one contains the other
    if (n1.includes(n2) || n2.includes(n1)) return 85;

    // Count matching characters
    const shorter = n1.length < n2.length ? n1 : n2;
    const longer = n1.length < n2.length ? n2 : n1;
    let matches = 0;

    for (const char of shorter) {
      if (longer.includes(char)) matches++;
    }

    return Math.round((matches / longer.length) * 100);
  }
}
