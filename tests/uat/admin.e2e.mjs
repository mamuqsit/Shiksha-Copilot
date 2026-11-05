import { check, signIn } from './helpers.mjs';

describe('Admin session', () => {
    it('ADM-001: opens the admin workspace', async () => {
        await signIn(process.env.ADMIN_PHONE);
        await check('The admin workspace is open. Navigation includes Dashboard, School Management, Teacher Management, Staff Management, Role Management, Teacher Training, Content Activity, Audit Log, Profile, Help, and FAQ. Chatbot navigation is absent.');
    });

    it('ADM-003: loads school records and permitted actions', async () => {
        await browser.url('#/schools');
        await check('School Management shows school records with names and an available actions menu. There is no loading or error state.');
    });

    it('ADM-010: displays an existing role and its permissions', async () => {
        await browser.url('#/roles');
        await browser.act('Open Edit for an existing role to inspect its permissions. Do not change, save, or delete the role.', { id: 'inspect-role' });
        await check('An existing role name and its selected permissions are displayed.');
    });

    it('ADM-017: blocks the teacher chat route', async () => {
        await browser.url('#/profile');
        await check('The admin Profile page is visible.');
        await browser.url('#/chat');
        await check('The teacher-only Chatbot workspace and message input are blocked or absent. The admin remains signed in.');
    });
});
