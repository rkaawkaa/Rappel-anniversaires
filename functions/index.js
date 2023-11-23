const functions = require('firebase-functions');
const twilio = require('twilio');
const admin = require('firebase-admin');
admin.initializeApp();

const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const twilioPhoneNumber = functions.config().twilio.phone_number;
const yourPhoneNumber = functions.config().my.phone_number;

const client = new twilio(accountSid, authToken);

function formatDate(date) {
  return (
    ('0' + date.getDate()).slice(-2) +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2)
  );
}

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

exports.sendSMSForBirthdays = functions.pubsub
  .schedule('45 8 * * *')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    const today = formatDate(new Date());
    const contactsSnapshot = await admin
      .database()
      .ref('contacts')
      .once('value');
    const contacts = contactsSnapshot.val();

    const birthdays = [];

    for (const id in contacts) {
      const contact = contacts[id];
      if (formatDate(new Date(contact.dateOfBirth)) === today) {
        birthdays.push({
          ...contact,
          age: calculateAge(contact.dateOfBirth),
        });
      }
    }

    let message;

    if (birthdays.length === 1) {
      const contact = birthdays[0];
      message = `${contact.lastName} ${contact.firstName} a ${contact.age} ans aujourd'hui. Souhaitez-lui son anniversaire. :)`;
    } else if (birthdays.length > 1) {
      message = "\nPlusieurs de vos amis ont leur anniversaire aujourd'hui. :)";
      message += birthdays
        .map(
          (contact) =>
            `${contact.lastName} ${contact.firstName} a ${contact.age} ans aujourd'hui.`,
        )
        .join(' ');
    }

    if (message) {
      await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: yourPhoneNumber,
      });
    }
  });
