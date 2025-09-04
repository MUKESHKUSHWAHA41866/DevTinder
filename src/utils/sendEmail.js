const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");


 const createSendEmailCommand = (toAddress, fromAddress ,Subject, body) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "this the text format email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data:  Subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};


const run = async (Subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    // "recipient@example.com",
    // "sender@example.com",
   process.env.TO_EMAIL || "singhmukesh41866@gmail.com",
    process.env.FROM_EMAIL || "mukesh@devbuilder.shop",
    Subject,
     body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports =  { run };