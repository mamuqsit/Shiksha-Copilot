import { check, dismissSurvey, signIn } from './helpers.mjs';

describe('Teacher session', () => {
    it('AUTH-PHONE-REQUIRED: requires a phone number', async () => {
        await browser.url('#/auth/signin');
        await browser.act('Leave Phone Number empty and select Continue.', { id: 'empty-phone' });
        await check('Phone Number is required is shown. The PIN dialog is closed and no protected workspace is visible.');
    });

    it('AUTH-PHONE-INVALID: rejects a short phone number', async () => {
        await browser.act('Replace Phone Number with 12345 and select Continue.', { id: 'short-phone' });
        await check('Invalid phone number is shown. The PIN dialog is closed and the user remains signed out.');
    });

    it('AUTH-PIN-INCOMPLETE: requires four PIN digits', async () => {
        await browser.act('Replace Phone Number with {{phone}} and select Continue. Leave all PIN digits empty.', {
            id: 'empty-pin', values: { phone: process.env.TEACHER_PHONE },
        });
        await check('The PIN dialog is open and Verify is disabled with no digits entered.');
        await browser.act('Enter exactly three PIN digits: 111. Do not submit.', { id: 'short-pin' });
        await check('Exactly three PIN digits are entered and Verify is disabled.');
        await browser.act('Press Escape to close the PIN dialog.', { id: 'close-pin' });
        await check('The PIN dialog is closed and the user remains signed out.');
    });

    it('AUTH-PIN-INVALID: rejects an incorrect PIN once', async () => {
        await browser.act('Select Continue to reopen the PIN dialog. Enter 0000 and select Verify exactly once. Do not retry or use Forgot PIN.', { id: 'wrong-pin' });
        await check('Invalid PIN is shown and the user remains signed out. No protected workspace is visible.');
        await browser.act('Close the PIN dialog without signing in.', { id: 'close-invalid-pin' });
    });

    it('TCH-001: opens the teacher workspace', async () => {
        await signIn(process.env.TEACHER_PHONE);
        await check('The teacher workspace is open. Home and Content Generation navigation are available. School Management and Role Management navigation are absent.');
    });

    it('AUTH-SESSION-RELOAD: keeps the teacher signed in', async () => {
        await browser.url('#/home');
        await browser.refresh();
        await dismissSurvey();
        await expect(browser).toHaveUrl(expect.stringContaining('/#/home'));
        await check('The teacher Home page and teacher navigation are visible. The user remains signed in without a PIN prompt or profile-completion redirect.');
    });

    it('TCH-003: shows read-only identity fields and the saved class', async () => {
        await browser.url('#/profile');
        await check('The profile shows Veracity Teacher, read-only name and phone fields, and a saved CBSE English class 6 assignment.');
    });

    it('TCH-005-VALIDATION: blocks incomplete lesson plan generation', async () => {
        await browser.url('#/content-generation/lesson-plan');
        await browser.act('Leave required selections incomplete. Try Generate only if it is enabled. Do not fill the missing fields or start generation. Leave the validation state visible.', { id: 'incomplete-lesson-plan' });
        await check('The lesson plan form is visible. Generation is disabled or validation identifies missing required fields. No generation has started.');
    });

    it('TCH-011: loads both schedule calendars', async () => {
        await browser.url('#/schedule');
        await browser.act('Select My Schedules and wait for its calendar to load. Do not create or edit events.', { id: 'my-schedules' });
        await check('My Schedules is selected and its calendar is visible without an error. An empty calendar is valid.');
        await browser.act("Select Others' Schedules and wait for its calendar to load. Do not create or edit events.", { id: 'others-schedules' });
        await check("Others' Schedules is selected and its calendar is visible without an error. An empty calendar is valid.");
    });

    it('TCH-015: logs out and blocks Home after reload', async () => {
        await browser.act('Open the profile menu, select Log out, and confirm logout.', { id: 'log-out' });
        await expect(browser).toHaveUrl(expect.stringContaining('/auth/signin'));
        await browser.url('#/home');
        await browser.refresh();
        await expect(browser).toHaveUrl(expect.stringContaining('/auth/signin'));
        await check('The sign-in form is visible. No protected data or teacher navigation is visible.');
    });
});
