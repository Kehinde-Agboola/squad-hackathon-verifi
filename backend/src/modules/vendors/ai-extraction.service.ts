/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

@Injectable()
export class AiExtractionService {
  private readonly logger = new Logger(AiExtractionService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY'),
    );
  }

  async extractCacFields(
    ocrText: string,
    submittedBusinessName: string,
  ): Promise<{
    extractedBusinessName: string | null;
    rcNumber: string | null;
    registrationDate: string | null;
    address: string | null;
    directors: string[];
    isCacDocument: boolean;
    authenticityReason: string;
    confidenceScore: number;
    flags: string[];
  }> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const prompt = `You are a document verification expert specializing in Nigerian Corporate Affairs Commission (CAC) certificates.

Analyze the following OCR-extracted text from a document submitted as a CAC certificate.
The submitting business claims their name is: "${submittedBusinessName}"

OCR TEXT:
---
${ocrText}
---

Return ONLY a valid JSON object with these exact fields, no markdown, no explanation:
{
  "extractedBusinessName": "exact business name from document or null",
  "rcNumber": "RC number in format RC123456 or null",
  "registrationDate": "registration date as written in document or null",
  "address": "registered address or null",
  "directors": ["array of director names found, empty array if none"],
  "isCacDocument": true or false,
  "authenticityReason": "one sentence explaining why this is or is not a genuine CAC certificate",
  "confidenceScore": number between 0 and 100,
  "flags": ["suspicious observations, empty array if none"]
}

Guidelines:
- isCacDocument is true only if document has Corporate Affairs Commission branding, RC number, and official certificate language
- confidenceScore reflects how confident you are this is a genuine CAC document
- flags should note things like mismatched names, unusual formatting, missing official elements
- Return ONLY the JSON object, nothing else`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (err) {
      this.logger.error(`Gemini extraction failed: ${(err as Error).message}`);
      return {
        extractedBusinessName: null,
        rcNumber: null,
        registrationDate: null,
        address: null,
        directors: [],
        isCacDocument: false,
        authenticityReason: 'AI analysis unavailable',
        confidenceScore: 0,
        flags: ['AI analysis failed — manual review recommended'],
      };
    }
  }

  // ─── Direct image analysis (skips OCR — Gemini reads image natively) ──
  async extractCacFieldsFromImage(
    imageBuffer: Buffer,
    mimeType: string,
    submittedBusinessName: string,
  ): Promise<ReturnType<typeof this.extractCacFields>> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });

    const prompt = `You are a document verification expert specializing in Nigerian Corporate Affairs Commission (CAC) certificates.

This image has been submitted as a CAC certificate. The submitting business claims their name is: "${submittedBusinessName}"

Analyze the document image and return ONLY a valid JSON object with these exact fields, no markdown, no explanation:
{
  "extractedBusinessName": "exact business name from document or null",
  "rcNumber": "RC number in format RC123456 or null",
  "registrationDate": "registration date as written in document or null",
  "address": "registered address or null",
  "directors": ["array of director names found, empty array if none"],
  "isCacDocument": true or false,
  "authenticityReason": "one sentence explaining why this is or is not a genuine CAC certificate",
  "confidenceScore": number between 0 and 100,
  "flags": ["suspicious observations, empty array if none"]
}

Guidelines:
- isCacDocument is true only if the document has Corporate Affairs Commission branding, RC number, and official certificate language
- confidenceScore reflects how confident you are this is a genuine CAC document
- flags should note mismatched names, unusual formatting, missing official elements, signs of tampering
- Return ONLY the JSON object, nothing else`;

    try {
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBuffer.toString('base64'),
          },
        },
        prompt,
      ]);

      const text = result.response.text();
      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleaned);
    } catch (err) {
      this.logger.error(
        `Gemini image analysis failed: ${(err as Error).message}`,
      );
      return {
        extractedBusinessName: null,
        rcNumber: null,
        registrationDate: null,
        address: null,
        directors: [],
        isCacDocument: false,
        authenticityReason: 'AI analysis unavailable',
        confidenceScore: 0,
        flags: ['AI analysis failed — manual review recommended'],
      };
    }
  }
}
