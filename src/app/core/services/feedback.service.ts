import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_i2i8bum';
const TEMPLATE_ID = 'template_d3kytk7';
const PUBLIC_KEY = 'MRQQEYhZgxhcBkrvc';

export interface FeedbackPayload {
  from_name: string;
  from_email: string;
  topic: string;
  feedback_type: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  sendFeedback(payload: FeedbackPayload): Promise<unknown> {
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, { ...payload }, { publicKey: PUBLIC_KEY });
  }
}
