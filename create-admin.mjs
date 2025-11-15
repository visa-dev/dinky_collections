import { PrismaClient } from './src/generated/prisma/index.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
	const adminEmail = process.env.ADMIN_EMAIL || 'admin@dinkys.com';
	const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

	const existing = await prisma.user.findFirst({ where: { email: adminEmail } });
	if (existing) {
		console.log('✅ Admin user already exists!');
		console.log('📧 Email:', adminEmail);
		console.log('🔑 Password:', adminPassword);
		await prisma.$disconnect();
		return;
	}

	const passwordHash = await bcrypt.hash(adminPassword, 10);
	await prisma.user.create({
		data: {
			email: adminEmail,
			name: 'Admin',
			role: 'ADMIN',
			passwordHash,
		},
	});

	console.log('✅ Admin user created successfully!');
	console.log('📧 Email:', adminEmail);
	console.log('🔑 Password:', adminPassword);
	console.log('\n⚠️  Please change the password after first login!');
}

main()
	.catch((e) => {
		console.error('❌ Error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
