export function isRegistrationOpen(): boolean {
  const value = process.env.NEXT_PUBLIC_REGISTRATION_OPEN
  return String(value || 'true').toLowerCase() !== 'false'
}
