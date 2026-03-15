// In-memory invoice store (resets on deploy — acceptable for serverless)
// For production scale, use Redis or a database

type Invoice = {
  userWallet: string;
  amount: number;
  memo: number;
  startTime: number;
  endTime: number;
  consumed: boolean;
};

const store = new Map<string, Invoice>();

// Auto-cleanup expired invoices every 10 minutes
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  store.forEach((invoice, id) => {
    if (invoice.endTime < now) {
      store.delete(id);
    }
  });
}, 600000);

export const invoiceStore = store;
