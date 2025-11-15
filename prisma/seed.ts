import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting seed...");

	// Create admin user
	const adminEmail = process.env.ADMIN_EMAIL || "admin@dinkys.com";
	const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

	const existingAdmin = await prisma.user.findFirst({ where: { email: adminEmail } });
	if (!existingAdmin) {
		const passwordHash = await bcrypt.hash(adminPassword, 10);
		await prisma.user.create({
			data: {
				email: adminEmail,
				name: "Admin User",
				role: "ADMIN",
				passwordHash,
			},
		});
		console.log("✅ Admin user created:", adminEmail);
	} else {
		console.log("ℹ️  Admin user already exists");
	}

	// Create categories
	const categories = [
		{ name: "Men", slug: "men", description: "Premium men's fashion collection" },
		{ name: "Women", slug: "women", description: "Elegant women's fashion collection" },
		{ name: "Kids", slug: "kids", description: "Comfortable kids' fashion collection" },
		{ name: "Accessories", slug: "accessories", description: "Stylish accessories for everyone" },
	];

	const createdCategories: { [key: string]: any } = {};

	for (const cat of categories) {
		const existing = await prisma.category.findFirst({ where: { slug: cat.slug } });
		if (!existing) {
			const created = await prisma.category.create({ data: cat });
			createdCategories[cat.slug] = created;
			console.log(`✅ Category created: ${cat.name}`);
		} else {
			createdCategories[cat.slug] = existing;
			console.log(`ℹ️  Category already exists: ${cat.name}`);
		}
	}

	// Sample products with placeholder images (using placeholder.com for now)
	// Prices are in Sri Lankan Rupees (LKR) - stored as cents
	const products = [
		{
			name: "Classic White T-Shirt",
			slug: "classic-white-tshirt",
			description: "Premium cotton t-shirt with perfect fit. Made from 100% organic cotton for ultimate comfort. Perfect for everyday wear.",
			priceCents: 299900, // Rs. 2,999.00
			sizes: ["S", "M", "L", "XL"],
			categorySlug: "men",
			images: [
				{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800", index: 0 },
				{ url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", index: 1 },
			],
		},
		{
			name: "Slim Fit Denim Jeans",
			slug: "slim-fit-denim-jeans",
			description: "Modern slim-fit jeans with stretch comfort. Perfect blend of style and comfort. Durable denim that lasts.",
			priceCents: 799900, // Rs. 7,999.00
			sizes: ["28", "30", "32", "34", "36"],
			categorySlug: "men",
			images: [
				{ url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800", index: 0 },
			],
		},
		{
			name: "Elegant Summer Dress",
			slug: "elegant-summer-dress",
			description: "Flowing summer dress in beautiful floral print. Lightweight and breathable fabric perfect for warm weather. Timeless elegance.",
			priceCents: 899900, // Rs. 8,999.00
			sizes: ["XS", "S", "M", "L"],
			categorySlug: "women",
			images: [
				{ url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", index: 0 },
				{ url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800", index: 1 },
			],
		},
		{
			name: "Premium Leather Jacket",
			slug: "premium-leather-jacket",
			description: "Genuine leather jacket with classic design. Handcrafted with attention to detail. A timeless piece for your wardrobe.",
			priceCents: 2499900, // Rs. 24,999.00
			sizes: ["S", "M", "L", "XL"],
			categorySlug: "men",
			images: [
				{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", index: 0 },
			],
		},
		{
			name: "Casual Blazer",
			slug: "casual-blazer",
			description: "Versatile blazer perfect for office or casual occasions. Tailored fit with modern styling. Essential wardrobe piece.",
			priceCents: 1299900, // Rs. 12,999.00
			sizes: ["S", "M", "L", "XL"],
			categorySlug: "men",
			images: [
				{ url: "https://images.unsplash.com/photo-1594938291221-94f18cbb566b?w=800", index: 0 },
			],
		},
		{
			name: "Silk Scarf",
			slug: "silk-scarf",
			description: "Luxurious silk scarf with elegant pattern. Versatile accessory that adds sophistication to any outfit.",
			priceCents: 499900, // Rs. 4,999.00
			sizes: ["One Size"],
			categorySlug: "accessories",
			images: [
				{ url: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=800", index: 0 },
			],
		},
		{
			name: "Kids Playful T-Shirt",
			slug: "kids-playful-tshirt",
			description: "Comfortable and fun t-shirt for kids. Made from soft, breathable fabric. Colorful designs kids love.",
			priceCents: 199900, // Rs. 1,999.00
			sizes: ["XS", "S", "M", "L"],
			categorySlug: "kids",
			images: [
				{ url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800", index: 0 },
			],
		},
		{
			name: "Designer Handbag",
			slug: "designer-handbag",
			description: "Stylish handbag with premium materials. Spacious interior with multiple compartments. Perfect for everyday use.",
			priceCents: 1499900, // Rs. 14,999.00
			sizes: ["One Size"],
			categorySlug: "accessories",
			images: [
				{ url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800", index: 0 },
			],
		},
		{
			name: "Athletic Sneakers",
			slug: "athletic-sneakers",
			description: "Comfortable athletic sneakers with modern design. Perfect for sports and casual wear. Superior cushioning and support.",
			priceCents: 1199900, // Rs. 11,999.00
			sizes: ["7", "8", "9", "10", "11", "12"],
			categorySlug: "men",
			images: [
				{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", index: 0 },
			],
		},
		{
			name: "Wool Winter Coat",
			slug: "wool-winter-coat",
			description: "Warm and stylish winter coat. Premium wool blend keeps you cozy in cold weather. Classic design that never goes out of style.",
			priceCents: 1799900, // Rs. 17,999.00
			sizes: ["S", "M", "L", "XL"],
			categorySlug: "women",
			images: [
				{ url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800", index: 0 },
			],
		},
	];

	for (const product of products) {
		const existing = await prisma.product.findFirst({ where: { slug: product.slug } });
		if (!existing) {
			const category = createdCategories[product.categorySlug];
			if (category) {
				await prisma.product.create({
					data: {
						name: product.name,
						slug: product.slug,
						description: product.description,
						priceCents: product.priceCents,
						sizes: product.sizes,
						categoryId: category.id,
						inStock: true,
						images: {
							create: product.images.map((img) => ({
								url: img.url,
								index: img.index,
							})),
						},
					},
				});
				console.log(`✅ Product created: ${product.name}`);
			}
		} else {
			console.log(`ℹ️  Product already exists: ${product.name}`);
		}
	}

	console.log("\n🎉 Seed completed successfully!");
	console.log("\n📋 Admin Credentials:");
	console.log(`   Email: ${adminEmail}`);
	console.log(`   Password: ${adminPassword}`);
}

main()
	.catch((e) => {
		console.error("❌ Seed error:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
