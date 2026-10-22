function normalizeAccount(account, index = 0) {
  const cloudName = account.cloudName || account.cloud_name || account.name;
  const apiKey = account.apiKey || account.api_key;
  const apiSecret = account.apiSecret || account.api_secret;

  if (!cloudName || !apiKey || !apiSecret) return null;

  return {
    cloudName: String(cloudName).trim(),
    apiKey: String(apiKey).trim(),
    apiSecret: String(apiSecret).trim(),
    label: account.label || `cloudinary-${index + 1}`,
    folder: account.folder || process.env.CLOUDINARY_FOLDER || "finance-lite",
  };
}

function parseCloudinaryAccounts() {
  const accounts = [];

  // 1. Single main account from env
  const single = normalizeAccount({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER,
    label: "cloudinary-default",
  });

  if (single) accounts.push(single);

  // 2. Multi-accounts JSON support (if configured later)
  if (process.env.CLOUDINARY_ACCOUNTS) {
    try {
      const parsed = JSON.parse(process.env.CLOUDINARY_ACCOUNTS);
      if (Array.isArray(parsed)) {
        parsed.forEach((account, index) => {
          const normalized = normalizeAccount(account, index);
          if (normalized) accounts.push(normalized);
        });
      }
    } catch {
      // Ignore JSON parse error
    }
  }

  return accounts;
}

module.exports = {
  parseCloudinaryAccounts,
};
