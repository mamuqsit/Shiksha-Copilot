import { check, dismissSurvey, signIn } from './helpers.mjs';

describe('Power teacher session', () => {
    it('PWR-001: opens the power teacher workspace', async () => {
        await signIn(process.env.POWER_TEACHER_PHONE);
        await check('The teacher workspace is open. Home, Chatbot, and the Generation Status control are available.');
    });

    it('PWR-002: shows the empty generation list for a new account', async () => {
        await browser.url('#/generation-status');
        await check('Generation Status is open and shows No items found. There are no generation cards for this new account.');
    });

    it('PWR-003-SAMPLES: opens sample instructions without sending a message', async () => {
        await browser.url('#/chat');
        await dismissSurvey();
        await browser.act('Open Sample Instructions. Do not send a message.', { id: 'sample-instructions' });
        await check('Sample Instructions and their content are visible. No user message has been sent.');
    });
});
