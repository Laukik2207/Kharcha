import fs from 'fs';
import csvParser from 'csv-parser';

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
