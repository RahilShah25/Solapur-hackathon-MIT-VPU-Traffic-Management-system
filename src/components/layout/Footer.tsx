
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Logo } from "@/components/layout/Logo"

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t pt-16 pb-8">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Logo size="lg" />
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Empowering Solapur with smart traffic management solutions.
                            Real-time monitoring, intelligent signaling, and seamless citizen services.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialLink href="#" icon={Twitter} />
                            <SocialLink href="#" icon={Facebook} />
                            <SocialLink href="#" icon={Instagram} />
                            <SocialLink href="#" icon={Linkedin} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><FooterLink href="/">Home</FooterLink></li>
                            <li><FooterLink href="/traffic-map">Live Traffic Map</FooterLink></li>
                            <li><FooterLink href="/parking">Find Parking</FooterLink></li>
                            <li><FooterLink href="/report">Report Violation</FooterLink></li>
                            <li><FooterLink href="/sos">Emergency SOS</FooterLink></li>
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h3 className="font-semibold mb-4">Support & Legal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><FooterLink href="/faq">FAQs</FooterLink></li>
                            <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
                            <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Solapur Smart Traffic. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Built with ❤️ for <span className="font-semibold text-foreground">Solapur City</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
    return (
        <Link
            href={href}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-background border shadow-sm hover:bg-primary hover:text-white transition-colors"
        >
            <Icon className="h-4 w-4" />
        </Link>
    )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-primary transition-colors hover:underline">
            {children}
        </Link>
    )
}
