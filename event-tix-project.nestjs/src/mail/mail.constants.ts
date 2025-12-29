// src/mail/mail.constants.ts
import * as path from 'path';

export const TEMPLATES_DIR = path.join(
  process.cwd(),
  process.env.NODE_ENV === 'production' ? 'dist' : '',
  'src/mail/templates/',
);