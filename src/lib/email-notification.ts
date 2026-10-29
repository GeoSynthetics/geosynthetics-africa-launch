/** The enquiry is already saved. Email failure must not invite a duplicate submission. */
export const SAVED_ENQUIRY_MESSAGE =
  "Your enquiry has been saved, but we could not send the email notification. For urgent assistance, please contact our sales team directly. You do not need to submit it again.";

export async function checkEmailNotification(
  notification: Promise<{ success: boolean }>,
): Promise<boolean> {
  try {
    return (await notification).success;
  } catch {
    console.warn("[Email] Enquiry saved; notification request failed.");
    return false;
  }
}
