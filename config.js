var config = {};

config.twilio = {};

config.twilio.accountSid = process.env.TWILIO_ACCOUTSID || 'youraccountsid'
config.twilio.authToken = process.env.TWILIO_ACCOUTSID || 'yourauthtoken'

module.exports = config;
