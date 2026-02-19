
export default function TermsPage() {
    return (
        <div className="container max-w-4xl py-12 px-4 mx-auto min-h-screen">
            <div className="max-w-none">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Terms of Service</h1>
                <p className="text-muted-foreground mb-8 text-lg">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <section className="mb-8 p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">1</span>
                        Acceptance of Terms
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        By accessing and using the Solapur Smart Traffic Management System, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>
                </section>

                <section className="mb-8 p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">2</span>
                        Use of Services
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        You agree to use the service only for lawful purposes. You are prohibited from violating or attempting to violate the security of the System, including accessing data not intended for you or attempting to probe, scan, or test the vulnerability of the system.
                    </p>
                </section>

                <section className="mb-8 p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">3</span>
                        User Responsibilities
                    </h2>
                    <ul className="space-y-3 text-muted-foreground list-disc pl-5">
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li>You agree to provide accurate and current information when registering or using our services.</li>
                        <li>You must comply with all local traffic laws and regulations. The App is a tool to assist, not to replace legal obligations.</li>
                    </ul>
                </section>

                <section className="mb-8 p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">4</span>
                        Limitation of Liability
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        In no event shall the Solapur City Traffic Police or its contractors be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the System.
                    </p>
                </section>

            </div>
        </div>
    )
}
