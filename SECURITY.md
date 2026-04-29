# Security Policy

## Public Repository Scope

This repository is a sanitized public release surface. It must not contain production secrets, full project source files, runtime data, private knowledge-base assets, or user data.

## Sensitive Material

Do not commit:

- API keys, personal access tokens, cookies, passwords, JWT secrets, private keys, or `.env` files
- `secrets.local.php` or any real deployment configuration
- SQLite databases, logs, runtime task files, cache folders, or conversation exports
- Raw project directories such as `api/`, `js/`, and `knowledge/`
- The full `GH_helper_super0.3.8` engineering source package

## If A Secret Is Exposed

1. Revoke the exposed credential immediately in the provider console.
2. Replace it with a new credential.
3. Remove the value from the repository and, if it entered Git history, rewrite the affected public history.
4. Audit deployments and logs that may have used the exposed credential.

## Safe Examples

Documentation may use placeholders such as `YOUR_API_KEY_HERE`, `your_api_key_here`, or `base64_encoded_token`. These placeholders are not credentials.
