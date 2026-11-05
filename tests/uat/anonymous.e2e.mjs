import { check } from './helpers.mjs';

describe('Anonymous session', () => {
    it('ANON-HOME: blocks Home without authentication', async () => {
        await browser.url('#/home');
        await expect(browser).toHaveUrl(expect.stringContaining('/auth/signin'));
        await check('The sign-in form is visible. No protected data or signed-in navigation is visible.');
    });
});
