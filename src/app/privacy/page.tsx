
export default function PrivacyPolicyPage() {
    return (
        <div className="container max-w-4xl py-12 px-4 mx-auto min-h-screen">
            <div className="max-w-none">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8 text-lg">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <section className="mb-8 p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">1</span>
                        Introduction
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        The Solapur Smart Traffic Management System ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and mobile applications.
                    </p>
                </section>

                <section className="mb-8 p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">2</span>
                        Information We Collect
                    </h2>
                    <ul className="space-y-3 text-muted-foreground list-disc pl-5">
                        <li><strong className="text-foreground">Personal Information:</strong> Name, phone number, vehicle registration number, and email address when you register or pay fines.</li>
                        <li><strong className="text-foreground">Location Data:</strong> Real-time location data when you use navigation or report violations (with your permission).</li>
                        <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our services, such as access logs and device information.</li>
                    </ul>
                </section>

                <section className="mb-8 p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">3</span>
                        How We Use Your Information
                    </h2>
                    <p className="text-muted-foreground mb-4">We use your information for the following purposes:</p>
                    <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                        <li>To provide and improve traffic management services.</li>
                        <li>To process payments for fines and parking.</li>
                        <li>To communicate with you regarding updates, alerts, or legal notices.</li>
                        <li>To enforce traffic laws and regulations.</li>
                    </ul>
                </section>

                <section className="mb-8 p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">4</span>
                        Data Security
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                    </p>
                </section>

                <section className="mb-8 p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">5</span>
                        Contact Us
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact the City Traffic Police Department.
                    </p>
                </section>
            </div>
        </div>
    )
}
