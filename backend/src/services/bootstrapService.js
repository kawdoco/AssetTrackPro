import bcryptjs from 'bcryptjs';
import prisma from '../config/prisma.js';

const toBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const logSeedInfo = ({ created, email, password, role, orgName }) => {
  const status = created ? 'created' : 'already exists';

  console.log('---------------- Seed User ----------------');
  console.log(`Seed user ${status}.`);
  console.log(`Organization: ${orgName}`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Role: ${role}`);
  console.log('-------------------------------------------');
};

export const ensureSeedUser = async () => {
  const seedEnabled = toBool(
    process.env.SEED_ON_STARTUP,
    process.env.NODE_ENV !== 'production'
  );

  if (!seedEnabled) {
    return;
  }

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@assettrackpro.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
  const fullName = process.env.SEED_ADMIN_FULL_NAME || 'System Administrator';
  const role = process.env.SEED_ADMIN_ROLE || 'ADMIN';
  const orgName = process.env.SEED_ORG_NAME || 'Default Organization';

  const existingUserCount = await prisma.user.count({
    where: { email },
  });

  if (existingUserCount > 0) {
    logSeedInfo({ created: false, email, password, role, orgName });
    return;
  }

  let organization = await prisma.organization.findFirst({
    where: { name: orgName },
    select: { id: true, name: true },
  });

  if (!organization) {
    await prisma.organization.createMany({
      data: {
        name: orgName,
      },
      skipDuplicates: true,
    });

    organization = await prisma.organization.findFirst({
      where: { name: orgName },
      select: { id: true, name: true },
    });
  }

  if (!organization) {
    throw new Error(`Failed to ensure seed organization: ${orgName}`);
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  await prisma.user.createMany({
    data: {
      email,
      password: hashedPassword,
      full_name: fullName,
      role,
      organization_id: organization.id,
      is_active: true,
    },
    skipDuplicates: true,
  });

  const createdUserCount = await prisma.user.count({
    where: { email },
  });

  if (createdUserCount === 0) {
    throw new Error(`Failed to ensure seed user: ${email}`);
  }

  logSeedInfo({ created: true, email, password, role, orgName: organization.name });
};