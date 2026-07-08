import fs from 'fs';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

export const parseCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(new Error('Failed to parse CSV file')));
  });
};

export const parseCSVFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    Readable.from(buffer)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(new Error('Failed to parse CSV buffer')));
  });
};

export function detectFileType(rawContent) {
  // Check if this is a real bank statement with blank header rows
  if (
    rawContent.includes('Statement From') ||
    (rawContent.includes('Date') && rawContent.includes('Details') &&
     rawContent.includes('Debit') && rawContent.includes('Credit') &&
     rawContent.includes('Balance') && rawContent.includes('UPI'))
  ) {
    return 'real_bank_statement';
  }
  return 'standard_csv';
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i+1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(s => s.trim());
}

function parseTransactionRow(rawRow) {
  const columns = parseCSVLine(rawRow);
  if (columns.length < 5) return null;

  const rawDate = columns[0];
  const dateMatch = rawDate.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (!dateMatch) return null;

  const [, day, month, year] = dateMatch;
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) return null;

  const details = columns[1].replace(/\s+/g, ' ');

  // Skip credits
  if (details.includes('DEP TFR') || details.includes('CSH DEP') || details.includes('UPI/CR')) return null; 

  const debitStr = columns[3].replace(/,/g, '');
  if (!debitStr) return null;

  const amount = parseFloat(debitStr);
  if (isNaN(amount) || amount <= 0) return null;

  let merchant;
  let paymentMethod = 'UPI';
  let refNo = columns[2] || '';

  const upiMatch = details.match(/UPI\/DR\/(\d+)\/([^/]+)\//) || details.match(/UPI\/DR\/(\d+)\/([^/]+)/);
  if (upiMatch) {
    refNo = refNo || upiMatch[1];
    merchant = upiMatch[2].trim();
    paymentMethod = 'UPI';
  } else if (details.includes('NEFT')) {
    const neftMatch = details.match(/NEFT\*[^*]+\*[^*]+\*(.+?)(?:\s{2,}|$)/);
    merchant = neftMatch ? neftMatch[1].trim() : 'NEFT Transfer';
    paymentMethod = 'Net Banking';
  } else if (details.includes('CDM CHARGE')) {
    merchant = 'Bank Charge';
    paymentMethod = 'Other';
  } else if (details.includes('ATM')) {
    merchant = 'ATM Withdrawal';
    paymentMethod = 'Cash';
  } else {
    const words = details.replace(/[^a-zA-Z\s]/g, ' ').trim().split(/\s+/);
    merchant = words.slice(0, 3).join(' ');
  }

  const note = details.substring(0, 100).trim();

  return {
    date,
    amount,
    merchant,
    note,
    paymentMethod,
    refNo,
    rawDetails: details,
  };
}

export async function parseRealBankStatement(filePathOrBuffer) {
  const content = Buffer.isBuffer(filePathOrBuffer) ? filePathOrBuffer.toString('utf8') : fs.readFileSync(filePathOrBuffer, 'utf8');
  const lines = content.split('\n');

  let headerRowIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Date') && lines[i].includes('Details') && lines[i].includes('Debit')) {
      headerRowIndex = i;
      break;
    }
  }
  if (headerRowIndex === -1) throw new Error('Could not find header row in bank statement');

  let footerRowIndex = lines.length;
  for (let i = headerRowIndex + 1; i < lines.length; i++) {
    if (lines[i].includes('Statement Summary') || lines[i].includes('Brought Forward')) {
      footerRowIndex = i;
      break;
    }
  }

  const transactionLines = lines.slice(headerRowIndex + 1, footerRowIndex);
  const mergedRows = [];
  const datePattern = /^\d{2}\/\d{2}\/\d{4}/;

  for (let i = 0; i < transactionLines.length; i++) {
    const line = transactionLines[i].trim();
    if (!line || line.replace(/,/g, '').trim() === '') continue;

    if (datePattern.test(line)) {
      let fullRow = line;
      if (i + 1 < transactionLines.length) {
        const nextLine = transactionLines[i + 1].trim();
        if (nextLine && !datePattern.test(nextLine) && nextLine.replace(/,/g, '').trim() !== '') {
          fullRow = line + ' ' + nextLine;
          i++; 
        }
      }
      mergedRows.push(fullRow);
    }
  }

  return mergedRows.map(row => parseTransactionRow(row)).filter(Boolean);
}

export const detectCSVFormat = (headers) => {
  if (!headers || headers.length === 0) return 'unknown';

  const headerStr = headers.map(h => h.toLowerCase().trim()).join(',');

  if (headerStr.includes('date') && headerStr.includes('amount') && headerStr.includes('merchant') && headerStr.includes('category')) {
    return 'kharcha';
  }
  
  if (headerStr.includes('date') && headerStr.includes('narration') && headerStr.includes('withdrawal amt.')) {
    return 'hdfc';
  }

  if (headerStr.includes('txn date') && headerStr.includes('description') && headerStr.includes('debit') && headerStr.includes('credit')) {
    return 'sbi';
  }

  if (headerStr.includes('transaction date') && headerStr.includes('transaction remarks') && headerStr.includes('withdrawal amount (inr )')) {
    return 'icici';
  }

  if (headerStr.includes('date') && headerStr.includes('description') && headerStr.includes('amount') && headerStr.includes('type')) {
    return 'upi';
  }

  if (headerStr.includes('date') && headerStr.includes('details') && headerStr.includes('debit') && headerStr.includes('credit') && headerStr.includes('balance')) {
    return 'sbi_upi';
  }

  return 'unknown';
};

const parseDateString = (dateStr) => {
  if (!dateStr) return null;
  
  // Try standard parse
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;

  // Try DD/MM/YYYY or DD-MM-YYYY
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    // If first part is > 12, it must be DD
    if (parseInt(parts[0]) > 12) {
      date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      if (!isNaN(date.getTime())) return date;
    }
  }

  return null;
};

const cleanAmount = (amtStr) => {
  if (!amtStr) return 0;
  // Remove commas and spaces
  const cleanStr = amtStr.replace(/,/g, '').trim();
  return parseFloat(cleanStr);
};

export const normalizeRows = (rows, format) => {
  const normalized = [];

  for (const row of rows) {
    let dateStr, amountStr, merchant, note, paymentMethod;
    let skip = false;

    switch (format) {
      case 'sbi_upi':
        return rows; // already normalized by parseRealBankStatement

      case 'kharcha':
        dateStr = row.date;
        amountStr = row.amount;
        merchant = row.merchant;
        note = row.note;
        paymentMethod = row.paymentMethod || 'Other';
        break;

      case 'hdfc':
        dateStr = row.Date;
        amountStr = row['Withdrawal Amt.'];
        if (!amountStr || cleanAmount(amountStr) <= 0) {
          skip = true;
          break;
        }
        merchant = row.Narration ? row.Narration.substring(0, 100).trim() : 'Unknown';
        note = row.Narration;
        paymentMethod = 'Net Banking';
        break;

      case 'sbi':
        dateStr = row['Txn Date'];
        amountStr = row.Debit;
        if (!amountStr || cleanAmount(amountStr) <= 0) {
          skip = true;
          break;
        }
        merchant = row.Description ? row.Description.substring(0, 50).trim() : 'Unknown';
        note = row.Description;
        paymentMethod = 'Net Banking';
        break;

      case 'icici':
        dateStr = row['Transaction Date'];
        amountStr = row['Withdrawal Amount (INR )'];
        if (!amountStr || cleanAmount(amountStr) <= 0) {
          skip = true;
          break;
        }
        merchant = row['Transaction Remarks'] ? row['Transaction Remarks'].substring(0, 50).trim() : 'Unknown';
        note = row['Transaction Remarks'];
        paymentMethod = 'Net Banking';
        break;

      case 'upi':
        dateStr = row.Date;
        amountStr = row.Amount;
        if (row.Type && row.Type.toLowerCase() === 'credit') {
          skip = true;
          break;
        }
        merchant = row.Description ? row.Description.trim() : 'Unknown';
        note = row.Description;
        paymentMethod = 'UPI';
        break;

      case 'unknown':
      default: {
        const keys = Object.keys(row);
        const lowerKeys = keys.map(k => k.toLowerCase());
        
        const dateKey = keys[lowerKeys.findIndex(k => k.includes('date'))];
        const amountKey = keys[lowerKeys.findIndex(k => k.includes('amount') || k.includes('debit') || k.includes('withdrawal'))];
        const descKey = keys[lowerKeys.findIndex(k => k.includes('description') || k.includes('narration') || k.includes('merchant') || k.includes('particulars'))];
        
        dateStr = dateKey ? row[dateKey] : null;
        amountStr = amountKey ? row[amountKey] : null;
        merchant = descKey ? row[descKey].substring(0, 50).trim() : 'Unknown';
        note = descKey ? row[descKey] : '';
        paymentMethod = 'Other';
        break;
      }
    }

    if (skip) continue;

    const amount = cleanAmount(amountStr);
    const date = parseDateString(dateStr);

    if (isNaN(amount) || amount <= 0 || !date) {
      continue;
    }

    normalized.push({
      date,
      amount,
      merchant: merchant || 'Unknown Merchant',
      note: note || '',
      paymentMethod
    });
  }

  return normalized;
};
