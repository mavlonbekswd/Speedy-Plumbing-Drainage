// Out-of-hours window: 22:00 to 08:00 UK time (Europe/London). A booking that
// lands inside this window gets the loud escalation treatment (Telegram header
// plus admin mentions) so the on-call engineer notices it immediately rather
// than at the next time they happen to check the app.
// The server may run in UTC, so the hour must be read in the London timezone.
// Intl handles the BST/GMT switch for us.
export function isOutOfHoursUK(date: Date = new Date()): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "numeric",
      hourCycle: "h23",
    }).format(date),
  );
  return hour >= 22 || hour < 8;
}
