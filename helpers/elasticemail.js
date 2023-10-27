import ElasticEmail from '@elasticemail/elasticemail-client';
import 'dotenv/config';

const { ELASTICEMAIL_KEY, ELASTICEMAIL_FROM } = process.env;
const elasticemail = () => {
  const defaultClient = ElasticEmail.ApiClient.instance;

  const { apikey } = defaultClient.authentications;
  apikey.apiKey = ELASTICEMAIL_KEY;

  const api = new ElasticEmail.EmailsApi();

  const email = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [new ElasticEmail.EmailRecipient('kakisik176@wanbeiz.com ')],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: 'HTML',
          Content: '<p>Hello, this verification</p>',
        }),
      ],
      Subject: 'TEST',
      From: ELASTICEMAIL_FROM,
    },
  });

  const callback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log('API called successfully.');
    }
  };
  api.emailsPost(email, callback);
};
export default elasticemail;
