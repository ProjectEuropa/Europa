#!/usr/bin/env tsx
/**
 * Neon Branch Manager for E2E Tests
 *
 * Usage:
 *   npx tsx scripts/neon-branch.ts create <branch-name>
 *   npx tsx scripts/neon-branch.ts delete <branch-name>
 *   npx tsx scripts/neon-branch.ts seed <database-url>
 *
 * Environment variables:
 *   NEON_API_KEY - Neon API key
 *   NEON_PROJECT_ID - Neon project ID
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';

const NEON_API_BASE = 'https://console.neon.tech/api/v2';

interface NeonBranch {
  id: string;
  name: string;
  project_id: string;
  parent_id: string;
  created_at: string;
}

interface NeonEndpoint {
  id: string;
  host: string;
  branch_id: string;
}

interface NeonRole {
  name: string;
  password?: string;
}

async function neonApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    throw new Error('NEON_API_KEY environment variable is required');
  }

  const response = await fetch(`${NEON_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Neon API error: ${response.status} ${error}`);
  }

  return response.json();
}

async function getDefaultBranchId(projectId: string): Promise<string> {
  const data = await neonApi<{ branches: NeonBranch[] }>(
    `/projects/${projectId}/branches`
  );
  const defaultBranch = data.branches.find(
    (b) => b.name === 'main' || b.name === 'master'
  );
  if (!defaultBranch) {
    throw new Error('Default branch (main/master) not found');
  }
  return defaultBranch.id;
}

async function createBranch(branchName: string): Promise<string> {
  const projectId = process.env.NEON_PROJECT_ID;
  if (!projectId) {
    throw new Error('NEON_PROJECT_ID environment variable is required');
  }

  // Safety check: prevent creating branches with production-like names
  const forbiddenNames = ['main', 'master', 'production', 'prod', 'prd'];
  if (forbiddenNames.includes(branchName.toLowerCase())) {
    throw new Error(`Cannot create branch with reserved name: ${branchName}`);
  }

  // Safety check: ensure branch name follows expected pattern
  if (!branchName.startsWith('pr-') && !branchName.startsWith('e2e-')) {
    console.warn(`Warning: Branch name "${branchName}" does not follow pr-* or e2e-* pattern`);
  }

  console.log(`Creating branch: ${branchName}`);

  // Get parent branch ID
  const parentId = await getDefaultBranchId(projectId);

  // Create branch with endpoint
  const createResponse = await neonApi<{
    branch: NeonBranch;
    endpoints: NeonEndpoint[];
    roles: NeonRole[];
  }>(`/projects/${projectId}/branches`, {
    method: 'POST',
    body: JSON.stringify({
      branch: {
        name: branchName,
        parent_id: parentId,
      },
      endpoints: [
        {
          type: 'read_write',
        },
      ],
    }),
  });

  const endpoint = createResponse.endpoints[0];
  const role = createResponse.roles.find((r) => r.name !== 'neondb_owner');
  const roleName = role?.name || 'neondb_owner';

  // Get password for the role
  const passwordResponse = await neonApi<{ password: string }>(
    `/projects/${projectId}/branches/${createResponse.branch.id}/roles/${roleName}/reveal_password`,
    { method: 'GET' }
  );

  // Construct connection URL
  const connectionUrl = `postgresql://${roleName}:${passwordResponse.password}@${endpoint.host}/neondb?sslmode=require`;

  console.log(`Branch created: ${branchName}`);
  console.log(`Connection URL: ${connectionUrl.replace(passwordResponse.password, '***')}`);

  return connectionUrl;
}

async function deleteBranch(branchName: string): Promise<void> {
  const projectId = process.env.NEON_PROJECT_ID;
  if (!projectId) {
    throw new Error('NEON_PROJECT_ID environment variable is required');
  }

  console.log(`Deleting branch: ${branchName}`);

  // Find branch by name
  const data = await neonApi<{ branches: NeonBranch[] }>(
    `/projects/${projectId}/branches`
  );
  const branch = data.branches.find((b) => b.name === branchName);

  if (!branch) {
    console.log(`Branch not found: ${branchName} (already deleted?)`);
    return;
  }

  // Delete the branch
  await neonApi(`/projects/${projectId}/branches/${branch.id}`, {
    method: 'DELETE',
  });

  console.log(`Branch deleted: ${branchName}`);
}

async function seedDatabase(databaseUrl: string): Promise<void> {
  console.log('Seeding database...');

  // Use pg Client for executing raw SQL
  // Neon uses valid SSL certificates, so we don't need to disable verification
  const client = new Client({
    connectionString: databaseUrl,
    ssl: true,
  });

  try {
    await client.connect();

    // Read seed file (relative to this script's location)
    const scriptDir = new URL('.', import.meta.url).pathname;
    const seedPath = join(scriptDir, 'seed-e2e.sql');
    const seedSql = readFileSync(seedPath, 'utf-8');

    // Execute entire seed file as a single transaction
    await client.query('BEGIN');
    await client.query(seedSql);
    await client.query('COMMIT');

    console.log('Database seeded successfully');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function main(): Promise<void> {
  const [command, arg] = process.argv.slice(2);

  try {
    switch (command) {
      case 'create': {
        if (!arg) {
          console.error('Usage: neon-branch.ts create <branch-name>');
          process.exit(1);
        }
        const connectionUrl = await createBranch(arg);
        // Output connection URL for CI to capture (GitHub Actions format)
        // Use special marker so CI can extract the URL reliably
        console.log(`NEON_CONNECTION_URL=${connectionUrl}`);
        break;
      }

      case 'delete': {
        if (!arg) {
          console.error('Usage: neon-branch.ts delete <branch-name>');
          process.exit(1);
        }
        await deleteBranch(arg);
        break;
      }

      case 'seed': {
        if (!arg) {
          console.error('Usage: neon-branch.ts seed <database-url>');
          process.exit(1);
        }
        await seedDatabase(arg);
        break;
      }

      default:
        console.error('Unknown command. Use: create, delete, or seed');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
