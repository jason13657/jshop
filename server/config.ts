import "dotenv/config";

function validate(key: string, defaultValue?: any) {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  jwt: {
    secretKey: validate("JWT_SECRET"),
    expiresInSec: parseInt(validate("JWT_EXPIRES_SEC", 86400)),
  },
  db: {
    connect: validate("DB_CONNECTION_STRING"),
  },
  host: {
    port: parseInt(validate("HOST_PORT", 8080)),
  },
};
