import HeaderClient from "@/components/HeaderClient";
import { Heart, Award, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
	return (
		<div className="min-h-dvh">
			<HeaderClient />
			<div className="container py-12 md:py-16">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
						<Sparkles className="w-4 h-4 text-gold" />
						<p className="uppercase tracking-widest text-gold text-xs font-semibold">Our Story</p>
					</div>
					<h1 className="h1 text-5xl md:text-6xl mb-6">About Dinky's Collection</h1>
					<p className="text-xl text-charcoal/70 max-w-3xl mx-auto leading-relaxed">
						Where fashion meets confidence. We believe that what you wear should reflect who you are
						and empower you to express yourself authentically.
					</p>
				</div>

				{/* Mission & Values */}
				<div className="grid md:grid-cols-3 gap-8 mb-16">
					<div className="card text-center">
						<div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
							<Heart className="w-8 h-8 text-gold" />
						</div>
						<h3 className="h2 text-xl mb-3">Our Mission</h3>
						<p className="text-charcoal/70">
							To make premium fashion accessible to everyone. We're committed to offering
							high-quality pieces at fair prices, ensuring that style and sustainability go hand in hand.
						</p>
					</div>
					<div className="card text-center">
						<div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
							<Award className="w-8 h-8 text-gold" />
						</div>
						<h3 className="h2 text-xl mb-3">Quality Promise</h3>
						<p className="text-charcoal/70">
							Every piece in our collection is selected for its quality, craftsmanship, and style.
							We work closely with our partners to ensure that every item meets our high standards.
						</p>
					</div>
					<div className="card text-center">
						<div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
							<Users className="w-8 h-8 text-gold" />
						</div>
						<h3 className="h2 text-xl mb-3">Our Community</h3>
						<p className="text-charcoal/70">
							We're more than just a fashion brand. We're a community of style enthusiasts who
							believe in expressing individuality through what we wear.
						</p>
					</div>
				</div>

				{/* Story */}
				<div className="card max-w-4xl mx-auto mb-16">
					<h2 className="h2 text-3xl mb-6">Our Story</h2>
					<div className="prose prose-lg max-w-none space-y-4 text-charcoal/80">
						<p>
							Founded with a passion for quality and style, Dinky's Collection offers a curated
							selection of modern, premium fashion pieces. From timeless essentials to statement
							pieces, every item in our collection is carefully chosen to help you build a wardrobe
							that lasts.
						</p>
						<p>
							We understand that fashion is personal. That's why we offer a diverse range of styles
							that cater to different tastes, occasions, and lifestyles. Whether you're looking for
							everyday essentials or special occasion pieces, we have something for everyone.
						</p>
						<p>
							At Dinky's Collection, we're committed to sustainability and ethical practices. We
							believe that great fashion shouldn't come at the cost of our planet or the people who
							make our clothes. That's why we carefully select partners who share our values.
						</p>
					</div>
				</div>

				{/* Contact */}
				<div className="card max-w-2xl mx-auto text-center">
					<h2 className="h2 text-3xl mb-4">Get in Touch</h2>
					<p className="text-charcoal/70 mb-6">
						Have questions or feedback? We'd love to hear from you. Reach out to us through our
						customer service, and we'll be happy to assist you.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="mailto:hello@dinkys.com" className="btn-secondary">
							Contact Us
						</a>
						<a href="/products" className="btn-primary">
							Shop Now
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
