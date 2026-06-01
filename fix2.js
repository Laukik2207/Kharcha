import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('client/src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;
    
    // Replace unused vars
    content = content.replace(/catch \(err\)/g, 'catch');
    content = content.replace(/catch \(error\)/g, 'catch');
    content = content.replace(/import \{ ChevronUp.*\} from 'lucide-react';/g, "import { Brain, Sparkles, AlertTriangle, Lightbulb, TrendingUp, TrendingDown, ArrowRight, Wallet, Receipt, Filter, DollarSign, Calendar, RefreshCw } from 'lucide-react';"); // Simplified hack for Insights.jsx
    
    // Remove unused icon in UnknownMerchants
    content = content.replace(/import \{ Search, AlertTriangle,.*\} from 'lucide-react';/g, "import { Search, Filter, CheckCircle, ArrowRight, MapPin, Calendar, CreditCard, ChevronRight } from 'lucide-react';");
    
    if (content !== orig) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed unused vars in ' + filePath);
    }
  }
});
