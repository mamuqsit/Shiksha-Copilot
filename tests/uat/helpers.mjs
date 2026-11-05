import { z } from 'zod';

export async function check(expected) {
    const actual = await browser.extract(
        `Read the current visible UI. Check every part of this requirement: ${expected} Return matches=false if any part is false or cannot be confirmed. Explain the observed state in evidence.`,
        z.object({ matches: z.boolean(), evidence: z.string() }),
    );
    expect(actual).toEqual({ matches: true, evidence: expect.any(String) });
}

export async function dismissSurvey() {
    await browser.act(
        'Wait for page loading and survey checks to finish. If a survey is open, select Remind me later or its dismiss option when available. Complete it with valid test responses only if it is mandatory. Stop when no survey blocks the workspace.',
        { id: 'dismiss-survey', timeout: 120000 },
    );
}

export async function signIn(phone) {
    await browser.setWindowSize(1440, 1000);
    await browser.url('#/auth/signin');
    await browser.act('Enter phone {{phone}} and select Continue. Stop when the PIN dialog opens. Do not use Forgot PIN or request an SMS.', {
        id: 'open-pin', values: { phone },
    });
    await browser.act('Enter PIN {{pin}} and select Verify. Wait for sign-in to finish. Leave any survey for the next step.', {
        id: 'submit-pin', values: { pin: process.env.TEST_PIN },
    });
    await dismissSurvey();
    await expect(browser).not.toHaveUrl(expect.stringContaining('/auth/signin'));
}