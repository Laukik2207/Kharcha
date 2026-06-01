import fs from 'fs';
import path from 'path';

let historyPath = 'client/src/components/upload/UploadHistory.jsx';
let historyStr = fs.readFileSync(historyPath, 'utf8');

historyStr = historyStr.replace(
  "upi:     'badge-teal',", 
  "upi:     'badge-teal',\n  real_bank: 'badge-green',"
);

historyStr = historyStr.replace(
  "upi:       'UPI',", 
  "upi:       'UPI',\n  real_bank: 'Bank Statement',"
);

fs.writeFileSync(historyPath, historyStr, 'utf8');

let guidePath = 'client/src/components/upload/FormatGuide.jsx';
let guideStr = fs.readFileSync(guidePath, 'utf8');

guideStr = guideStr.replace(
  '<td className="py-4 px-4 border-b border-white/5 text-gray-400">SBI, HDFC, ICICI, etc.</td>\n                </tr>',
  '<td className="py-4 px-4 border-b border-white/5 text-gray-400">SBI, HDFC, ICICI, etc.</td>\n                </tr>\n                <tr>\n                  <td className="py-4 px-4 border-b border-white/5">Bank Statement</td>\n                  <td className="py-4 px-4 border-b border-white/5"><span className="badge badge-success">Auto-detected</span></td>\n                  <td className="py-4 px-4 border-b border-white/5 text-gray-400">Any Indian UPI Bank. Blank header rows + Date/Details/Debit/Credit/Balance columns. Handles 2-row transaction format, skips credits, extracts UPI merchant names.</td>\n                </tr>'
);

guideStr = guideStr.replace(
  'Download our standard template below, or upload bank exports directly.',
  'Supports real Indian bank statement CSV exports — just download your statement from your bank\'s net banking portal and upload it directly. No formatting required. You can also download our template below to format your data manually.'
);

fs.writeFileSync(guidePath, guideStr, 'utf8');
console.log('UI files updated.');
