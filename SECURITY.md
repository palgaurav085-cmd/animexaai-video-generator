# Security Policy

## Supported Versions
The following versions of this project currently receive security updates:

| Version | Supported |
|--------|-----------|
| 1.x.x  | ✔️ Active |
| 0.x.x  | ❌ No Support |

If you're running an older version, update immediately. No patches will be provided for deprecated releases.

---

## Reporting a Vulnerability

If you discover a security issue, **DO NOT create a public GitHub issue**.

Instead, contact directly:

**Email:** security@animexaai.com  
(Use any secure channel you prefer: ProtonMail, Tutanota, or encrypted ZIP.)

Your report **must** include:

1. Clear description of the vulnerability  
2. Steps to reproduce  
3. Expected vs. actual behavior  
4. Screenshots or PoC (if possible)  
5. Impact (e.g., data leak, RCE, auth bypass, etc.)

You’ll receive a response within **48 hours**.

---

## Disclosure Policy

- You must allow at least **14 days** for us to patch the issue before public disclosure.
- If the vulnerability is severe (e.g., critical RCE), disclosure may be extended to **30–45 days**.
- Coordinated disclosure will be credited.

---

## Security Best Practices (For Contributors)

If you work on this codebase:

- Never push API keys, tokens, or secrets  
- Use `.env.local` for all sensitive configs  
- Use HTTPS for external API calls  
- Do not modify authentication logic without review  
- Do not install unknown npm packages  
- Run `npm audit` before every pull request  
- Avoid client-side storage for sensitive data (tokens, user info)

---

## Dependencies

This project relies on:

- **Next.js** (latest stable)  
- **Node.js** LTS  
- **Vercel Serverless Functions**  
- Additional npm packages listed in `package.json`

Run regularly:

```bash
npm audit fix
